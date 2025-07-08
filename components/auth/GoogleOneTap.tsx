'use client'

import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import Script from 'next/script'
import { useEffect } from 'react'

interface CredentialResponse {
  credential: string
}

// Google One-Tap 登录组件（仅在未登录状态下初始化）
export default function GoogleOneTap() {
  const { user, refreshSession } = useAuth()

  // 生成 nonce 及其哈希
  const generateNonce = async (): Promise<[string, string]> => {
    const randomBytes = crypto.getRandomValues(new Uint8Array(32))
    const nonce = btoa(String.fromCharCode(...randomBytes))

    const encoder = new TextEncoder()
    const encoded = encoder.encode(nonce)
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoded)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashedNonce = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
    return [nonce, hashedNonce]
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (user) return // 已登录，跳过 One-Tap

    let canceled = false;
    (async () => {
      // 检查当前会话，防止闪烁
      const { data } = await supabase.auth.getSession()
      if (data.session || canceled) return

      const [nonce, hashedNonce] = await generateNonce()

      /* global google */
      // @ts-expect-error google is not defined
      if (typeof google === 'undefined' || !google.accounts?.id) return

      // 初始化一次即可
      const enableFedCM = process.env.NODE_ENV === 'production'
      console.debug('🔥 enableFedCM:', enableFedCM)
      // @ts-expect-error google.accounts.id.initialize is not defined
      google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        nonce: hashedNonce,
        callback: async (resp: CredentialResponse) => {
          try {
            const { error } = await supabase.auth.signInWithIdToken({
              provider: 'google',
              token: resp.credential,
              nonce,
            })
            if (error) {
              console.error('signInWithIdToken error', error)
              return
            }
            // 刷新 AuthContext，不刷新整页
            await refreshSession()
            // 登陆成功后可取消弹层，避免再次出现
            // @ts-expect-error google.accounts.id.cancel is not defined
            google.accounts.id.cancel()
          } catch (err) {
            console.error('One-Tap login failed', err)
          }
        },
        use_fedcm_for_prompt: enableFedCM,
      })
      // @ts-expect-error google.accounts.id.prompt is not defined
      google.accounts.id.prompt()
    })()

    return () => {
      canceled = true
      // @ts-expect-error google is not defined
      if (typeof google !== 'undefined' && google.accounts?.id) {
        // @ts-expect-error google.accounts.id.cancel is not defined
        google.accounts.id.cancel()
      }
    }
  }, [user, refreshSession])

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
    </>
  )
} 