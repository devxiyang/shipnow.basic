import { createBrowserClient } from "@supabase/ssr";

/**
 * 统一的Supabase客户端创建文件
 * 整合了client.ts, server.ts和middleware.ts
 */

// ========== Browser Client ==========
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// ========== Server Client ==========
// 注意：服务器端函数在 server.ts 中单独导出，避免在客户端组件中引入 next/headers
// 服务器端请使用: import { createClient } from '@/lib/supabase/server'

// ========== Middleware Client ==========
// 注意：中间件函数被移动到 middleware.ts 以避免在客户端组件中引入 next/server
export { updateSession } from './middleware';