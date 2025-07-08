# ShipNow Basic - Next.js 网站模板

简洁现代的 Next.js 网站模板，内置国际化支持。适合着陆页、营销网站和简单的 Web 应用程序。

## 🌍 多语言支持

**从第一天就实现全球化！** ShipNow Basic 包含完整的国际化支持，支持7种语言：
- 英语、中文、西班牙语、法语、德语、日语、韩语
- 自动语言检测和基于URL的路由
- 页眉中的语言切换器
- 所有UI组件和内容完全翻译

## 🎯 快速模板设置

**初次使用此模板？** 使用我们的交互式设置向导：

```bash
npm run init-template
```

这将指导您自定义：
- 品牌名称、标语和描述
- 英雄区域内容  
- 功能描述
- 网站配置
- 基础环境变量

所有更改都应用到 `config/template.config.ts` 以便于自定义。

## 🚀 功能特性

- **🌍 国际化**: 完整的i18n支持，支持7种语言 (next-intl)
- **UI 组件**: shadcn/ui 支持暗黑模式
- **类型安全**: 完整的 TypeScript 支持
- **响应式**: 移动优先设计
- **SEO 就绪**: 优化的元数据和站点地图
- **现代技术栈**: Next.js 15, React 19, Tailwind CSS v4
- **快速开发**: 热重载和 TypeScript 支持
- **清晰架构**: 组织良好的项目结构

## 🛠️ 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS v4
- **UI 组件**: shadcn/ui
- **国际化**: next-intl
- **部署**: Vercel

## 📦 快速开始

### 前置条件

- Node.js 18+

### 安装

1. 克隆仓库：
```bash
git clone https://github.com/devxiyang/shipnow.basic.git
cd shipnow.basic
```

2. 安装依赖：
```bash
npm install
```

3. 设置环境变量（可选）：
```bash
cp .env.example .env.local
```

4. 在 `.env.local` 中配置环境变量（可选）：
```bash
# 站点 URL
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# 分析（可选）
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
```

5. 启动开发服务器：
```bash
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看您的应用。

## ⚙️ 开发命令

### 基础命令
```bash
npm run dev          # 启动开发服务器 (http://localhost:3000)
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 运行 ESLint
npm run type-check   # 检查 TypeScript 类型
```

### 模板自定义

模板在 `config/template.config.ts` 中使用集中配置系统：

**品牌配置：**
```typescript
export const BRANDING = {
  name: "您的网站",
  tagline: "您的自定义标语", 
  description: "您的网站描述",
  email: "contact@yoursite.com",
  twitter: "devxiyang",
  website: "https://yoursite.com"
};
```

**内容自定义：**
```typescript
export const CONTENT = {
  hero: {
    headline: "构建您的网站",
    highlightedText: " 美观地",
    subtitle: "您的自定义副标题..."
  },
  features: { /* ... */ }
};
```

## 📝 项目结构

```
shipnow.basic/
├── app/                  # Next.js App Router 页面
│   ├── [locale]/        # 国际化路由
│   ├── api/             # API 路由（最小化）
│   └── globals.css      # 全局样式
├── components/          # React 组件
│   ├── ui/             # shadcn/ui 组件
│   └── layout/         # 布局组件
├── config/             # 配置文件
│   ├── site.config.ts  # 站点元数据
│   └── template.config.ts # 模板配置
├── i18n/               # 国际化
│   ├── config.ts       # i18n 配置
│   └── messages/       # 翻译文件
│       ├── en.json     # 英语
│       ├── zh.json     # 中文
│       ├── es.json     # 西班牙语
│       ├── fr.json     # 法语
│       ├── de.json     # 德语
│       ├── ja.json     # 日语
│       └── ko.json     # 韩语
├── lib/                # 工具和辅助函数
│   ├── hooks/          # 自定义 React hooks
│   ├── utils/          # 工具函数
│   └── types/          # TypeScript 类型
└── middleware.ts       # Next.js 中间件
```

## 🔧 配置

### 网站配置

在 `config/site.config.ts` 中更新您的网站元数据：

```typescript
export const siteConfig = {
  name: "您的网站",
  title: "您的网站标题",
  description: "您的网站描述",
  url: "https://yoursite.com",
  email: "contact@yoursite.com",
  twitter: "devxiyang"
}
```

### 内容自定义

在 `config/template.config.ts` 中自定义您的内容：

```typescript
export const CONTENT = {
  hero: {
    headline: "构建您的网站",
    highlightedText: " 美观地",
    subtitle: "您的自定义副标题..."
  },
  features: [
    {
      title: "功能 1",
      description: "您的功能描述"
    }
  ]
};
```

### 国际化

模板开箱即用支持7种语言：

**支持的语言：**
- 🇺🇸 英语 (en) - 默认
- 🇨🇳 中文 (zh)
- 🇪🇸 西班牙语 (es)
- 🇫🇷 法语 (fr)
- 🇩🇪 德语 (de)
- 🇯🇵 日语 (ja)
- 🇰🇷 韩语 (ko)

**添加新语言：**
1. 在 `/i18n/messages/[locale].json` 中创建翻译文件
2. 将区域设置添加到 `/i18n/config.ts`：
```typescript
export const locales = ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'your-locale'] as const;
```
3. 更新 `middleware.ts` 中的中间件模式
4. 将区域设置名称添加到语言切换器

**翻译键：**
所有翻译按部分组织：
```json
{
  "common": { "loading": "加载中..." },
  "hero": { "headline": "构建您的网站" },
  "features": { "title": "功能" },
  "navigation": { "home": "首页" }
}
```

**使用翻译：**
```typescript
import { useTranslations } from 'next-intl'

function MyComponent() {
  const t = useTranslations('hero')
  return <h1>{t('headline')}</h1>
}
```

### 数据库模式

模板包含这些核心模型：
- `Order` - 支付交易
- `Subscription` - 用户订阅
- `PaymentEvent` - Webhook 事件

### 订阅计划

在 `config/template.config.ts` 中自定义计划：
```typescript
export const SUBSCRIPTION_PLANS = {
  STANDARD: {
    name: "入门版", 
    price: 9.99,
    features: ["功能 1", "功能 2"]
  }
};
```

### 身份验证

默认配置 Google 一键登录。要添加更多提供商：
1. 在 Supabase 中配置提供商
2. 更新 `/components/auth/` 中的身份验证组件

## 📖 使用指南

### 自定义您的 SaaS

#### 1. 更新站点配置
```typescript
// config/site.config.ts
export const siteConfig = {
  name: "您的SaaS",
  title: "您的 SaaS 标题",
  description: "您的 SaaS 描述",
  url: "https://yoursaas.com",
  email: "support@yoursaas.com",
  twitter: "@yoursaas"
}
```

#### 2. 自定义内容
```typescript
// config/template.config.ts
export const CONTENT = {
  hero: {
    headline: "您的自定义标题",
    subtitle: "您的价值主张...",
    primaryCTA: "开始使用",
    secondaryCTA: "了解更多"
  },
  // ... 自定义功能、定价等
}
```

#### 3. 添加您自己的页面
在 `app/[locale]/` 目录中创建新页面：

```typescript
// app/[locale]/about/page.tsx
import { useTranslations } from 'next-intl'

export default function About() {
  const t = useTranslations('about')
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  )
}
```

### 语言管理

#### 切换语言
用户可以使用页眉中的语言选择器切换语言。应用自动：
- 更新 URL（例如，`/en/page` → `/es/page`）
- 更改所有 UI 文本
- 保持导航状态

#### 添加自定义翻译
```typescript
// 在您的组件中
import { useTranslations } from 'next-intl'

function MyComponent() {
  const t = useTranslations('mySection')
  return <h1>{t('title')}</h1>
}
```

```json
// i18n/messages/zh.json
{
  "mySection": {
    "title": "我的自定义标题"
  }
}
```

### 开发命令

```bash
# 开发
npm run dev              # 启动开发服务器
npm run build            # 构建生产版本
npm run start            # 启动生产服务器
npm run lint             # 运行 ESLint
npm run type-check       # 检查 TypeScript
```

### 部署检查清单

#### 部署前：
- [ ] 将 `NEXT_PUBLIC_SITE_URL` 更新为您的域名
- [ ] 测试所有页面和翻译
- [ ] 验证响应式设计
- [ ] 检查 SEO 元数据
- [ ] 测试性能

#### 生产环境变量：
```bash
# 为生产环境更新
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
```

## 🔧 故障排除

### 常见问题

#### 身份验证不工作
1. 检查 Google 客户端 ID 是否正确
2. 验证 Google Console 中的重定向 URL 是否匹配您的域名
3. 确保 Supabase 项目 URL 和密钥正确

#### 支付失败
1. 验证 Stripe 密钥（测试 vs 生产）
2. 检查 webhook 端点是否接收事件
3. 确认产品 ID 与您的 Stripe 仪表板匹配

#### 构建错误
1. 运行 `npm run lint` 检查代码问题
2. 确保所有环境变量已设置
3. 使用 `npm run type-check` 检查 TypeScript 错误

#### 数据库连接问题
1. 验证 DATABASE_URL 格式
2. 检查数据库服务器是否可访问
3. 运行 `make generate` 确保 Prisma 客户端是最新的

### 性能提示

1. **图片优化**: 使用 Next.js Image 组件
2. **包分析**: 运行 `npm run build` 并检查包大小
3. **数据库查询**: 使用 Prisma 查询优化
4. **缓存**: 配置适当的缓存头

### 安全最佳实践

1. **环境变量**: 永远不要将 `.env.local` 提交到版本控制
2. **API 密钥**: 为开发和生产使用不同的密钥
3. **CORS**: 配置适当的 CORS 策略
4. **速率限制**: 为 API 路由实施速率限制

## ❓ 常见问题

### 一般问题

**问：我可以将此模板用于商业项目吗？**
答：可以！此模板使用 MIT 许可证，您可以将其用于任何商业项目。

**问：如何自定义品牌？**
答：更新 `config/site.config.ts` 和 `config/template.config.ts` 中的配置。所有品牌元素都集中在那里。

**问：我可以添加更多付费计划吗？**
答：可以！在 Stripe 中创建额外的产品，然后更新 `config/template.config.ts` 中的定价配置。

### 国际化

**问：如何更改默认语言？**
答：在 `i18n/config.ts` 中将 `defaultLocale` 更新为您的首选语言。

**问：我可以删除不需要的语言吗？**
答：可以！从 `i18n/config.ts` 中的 `locales` 数组中删除区域设置，并删除相应的翻译文件。

**问：如何处理 RTL 语言？**
答：您需要通过基于区域设置配置 CSS 方向来添加 RTL 支持。考虑使用带有 RTL 检测的 `next-intl` 库。

### 技术问题

**问：我可以使用不同的数据库吗？**
答：可以！Prisma 支持多个数据库。在 `prisma/schema.prisma` 中更新 `provider` 和您的 `DATABASE_URL`。

**问：如何添加更多身份验证提供商？**
答：在 Supabase 中配置额外的提供商（GitHub、Discord 等）并更新身份验证组件。

**问：我可以部署到 Vercel 以外的平台吗？**
答：可以！模板适用于任何支持 Next.js 的平台（Railway、Render、AWS 等）。

**问：如何处理文件上传？**
答：与 Supabase Storage 或其他提供商（如 AWS S3、Cloudinary 或 UploadThing）集成。

### 订阅和支付

**问：如何处理免费试用？**
答：在您的 Stripe 产品中设置试用期。webhook 处理程序将自动管理试用状态。

**问：我可以使用一次性支付而不是订阅吗？**
答：可以！在 Stripe 中创建一次性支付产品并更新结账逻辑。

**问：如何处理订阅取消？**
答：取消通过 Stripe webhooks 自动处理。用户在期间结束前保留访问权限。

### 开发

**问：如何添加新页面？**
答：在 `app/[locale]/` 目录中创建新文件。它们将自动在所有语言中可用。

**问：我可以使用不同的 UI 库吗？**
答：可以！虽然模板使用 shadcn/ui，但您可以用任何 React 组件库替换它。

**问：如何处理 API 速率限制？**
答：使用 `@upstash/ratelimit` 或自定义中间件等库在您的 API 路由中实施速率限制。

## 🚢 部署

### Vercel（推荐）

1. 将您的代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 添加环境变量
4. 部署

### 其他平台

模板适用于任何支持 Next.js 的平台：
- Railway
- Render
- Fly.io
- AWS Amplify

## 📚 文档

- [Next.js 文档](https://nextjs.org/docs)
- [Supabase 文档](https://supabase.com/docs)
- [Stripe 文档](https://stripe.com/docs)
- [Prisma 文档](https://www.prisma.io/docs)
- [shadcn/ui 文档](https://ui.shadcn.com)
- [next-intl 文档](https://next-intl.dev)

## 🤝 贡献

欢迎贡献！请在提交 PR 前阅读我们的贡献指南。

## 📄 许可证

此项目使用 MIT 许可证 - 有关详细信息，请参阅 LICENSE 文件。

## 🙏 致谢

- [shadcn/ui](https://ui.shadcn.com) 提供美丽的组件
- [Vercel](https://vercel.com) 提供出色的部署平台
- [Supabase](https://supabase.com) 提供身份验证和数据库
- [Stripe](https://stripe.com) 提供支付处理

---

由 ShipNow 团队用 ❤️ 构建