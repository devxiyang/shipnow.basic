import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    try {
      const supabase = await createClient()
      await supabase.auth.exchangeCodeForSession(code)
    } catch (err) {
      console.error('exchangeCodeForSession failed:', err)
    }
  }

  const html = `<!DOCTYPE html><html><body><script>
    if (window.opener) {
      window.opener.postMessage('auth-ok', window.opener.location.origin);
      window.close();
    } else {
      window.location.href = '/';
    }
  </script></body></html>`

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  })
} 