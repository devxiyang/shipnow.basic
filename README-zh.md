# ShipNow Basic - Next.js 网站模板

简洁现代的 Next.js 网站模板，内置国际化支持。适合着陆页、营销网站和简单的 Web 应用程序。

## 🌍 多语言支持

**从第一天就实现全球化！** ShipNow Basic 包含完整的国际化支持，支持7种语言：
- 英语、中文、西班牙语、法语、德语、日语、韩语
- 自动语言检测和基于URL的路由
- 页眉中的语言切换器
- 所有UI组件和内容完全翻译

## 🎯 快速模板设置

**初次使用此模板？** 简单自定义配置文件：

1. **品牌配置**: 更新 `config/template.config.ts` 中的品牌信息
2. **网站设置**: 修改 `config/site.config.ts` 中的元数据
3. **内容自定义**: 自定义英雄区域、功能和 CTA 部分
4. **翻译文件**: 更新 `i18n/messages/` 中的翻译文件

所有模板内容都集中在配置文件中，便于自定义。

## 🚀 功能特性

- **🌍 国际化**: 完整的i18n支持，支持7种语言 (next-intl)
- **🎨 UI 组件**: shadcn/ui 支持暗黑模式
- **📱 响应式**: 移动优先设计，使用 Tailwind CSS v4
- **⚡ 性能优化**: 服务器组件和 App Router 实现最优速度
- **🔒 类型安全**: 完整的 TypeScript 支持
- **🎯 SEO 就绪**: 优化的元数据和站点地图
- **🛠️ 开发体验**: 使用 Turbopack 的热重载
- **🏗️ 清晰架构**: 组织良好的项目结构

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
# 生产环境的站点 URL
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"

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
npm run dev          # 使用 Turbopack 启动开发服务器
npm run dev:https    # 使用 HTTPS 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 运行 ESLint
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
│   │   ├── page.tsx     # 主页
│   │   ├── layout.tsx   # 特定语言布局
│   │   ├── privacy-policy/
│   │   └── terms-of-service/
│   ├── globals.css      # 全局样式
│   ├── layout.tsx       # 根布局
│   └── page.tsx         # 根页面重定向
├── components/          # React 组件
│   ├── ui/             # shadcn/ui 组件
│   ├── Footer.tsx      # 页脚组件
│   ├── Header.tsx      # 页头组件
│   └── theme-provider.tsx # 主题提供者
├── config/             # 配置文件
│   ├── site.config.ts  # 站点元数据
│   └── template.config.ts # 模板配置
├── i18n/               # 国际化
│   ├── routing.ts      # i18n 路由配置
│   ├── request.ts      # 请求配置
│   └── messages/       # 翻译文件
│       ├── en.json     # 英语
│       ├── zh.json     # 中文
│       ├── es.json     # 西班牙语
│       ├── fr.json     # 法语
│       ├── de.json     # 德语
│       ├── ja.json     # 日语
│       └── ko.json     # 韩语
├── lib/                # 工具和辅助函数
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
2. 将区域设置添加到 `/i18n/routing.ts`：
```typescript
export const routing = defineRouting({
  locales: ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'your-locale'],
  defaultLocale: 'en',
  localePrefix: 'always'
});
```
3. 中间件将自动处理新的区域设置
4. 将区域设置名称添加到语言切换器组件

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


## 📖 使用指南

### 自定义您的网站

#### 1. 更新站点配置
```typescript
// config/site.config.ts
export const siteConfig = {
  name: "您的网站",
  title: "您的网站标题",
  description: "您的网站描述",
  url: "https://yoursite.com",
  twitter: "devxiyang"
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
npm run dev              # 使用 Turbopack 启动开发服务器
npm run dev:https        # 使用 HTTPS 启动开发服务器
npm run build            # 构建生产版本
npm run start            # 启动生产服务器
npm run lint             # 运行 ESLint
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
# 生产环境必需
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"

# 可选分析
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
```

## 🔧 故障排除

### 常见问题

#### 构建错误
1. 运行 `npm run lint` 检查代码问题
2. 确保所有环境变量已设置
3. 使用 `npm run type-check` 检查 TypeScript 错误

#### 翻译问题
1. 验证翻译文件存在于 `/i18n/messages/`
2. 检查 `/i18n/routing.ts` 中的区域设置配置
3. 确保翻译键在文件之间匹配
4. 验证 `middleware.ts` 中的中间件配置

#### 路由问题
1. 检查 `middleware.ts` 中的中间件配置
2. 验证页面中的区域设置参数处理
3. 确保国际化路由的正确 URL 结构

### 性能提示

1. **图片优化**: 使用 Next.js Image 组件
2. **包分析**: 运行 `npm run build` 并检查包大小
3. **缓存**: 配置适当的缓存头
4. **代码分割**: 为大型组件使用动态导入

### 安全最佳实践

1. **环境变量**: 永远不要将 `.env.local` 提交到版本控制
2. **CORS**: 必要时配置适当的 CORS 策略
3. **内容安全策略**: 实施 CSP 头
4. **输入验证**: 验证所有用户输入

## ❓ 常见问题

### 一般问题

**问：我可以将此模板用于商业项目吗？**
答：可以！此模板使用 MIT 许可证，您可以将其用于任何商业项目。

**问：如何自定义品牌？**
答：更新 `config/site.config.ts` 和 `config/template.config.ts` 中的配置。所有品牌元素都集中在那里。

**问：这个模板和其他 Next.js 模板有什么不同？**
答：这个模板专注于国际化和简洁架构。它是一个简化版本，没有身份验证或支付功能，非常适合营销网站和简单应用程序。

### 国际化

**问：如何更改默认语言？**
答：在 `i18n/routing.ts` 中将 `defaultLocale` 更新为您的首选语言。

**问：我可以删除不需要的语言吗？**
答：可以！从 `i18n/routing.ts` 中的 `locales` 数组中删除区域设置，并删除相应的翻译文件。

**问：如何处理 RTL 语言？**
答：您需要通过基于区域设置配置 CSS 方向来添加 RTL 支持。模板使用的 Tailwind CSS v4 内置了 RTL 支持。

### 技术问题

**问：我可以部署到 Vercel 以外的平台吗？**
答：可以！模板适用于任何支持 Next.js 的平台（Railway、Render、AWS 等）。

**问：如何添加数据库？**
答：您可以添加任何数据库解决方案。考虑使用 Prisma 和 PostgreSQL、SQLite 或您选择的任何其他数据库。模板与数据库无关。

**问：我可以添加身份验证吗？**
答：可以！您可以集成任何身份验证提供商，如 Auth.js、Supabase Auth、Clerk 或 Firebase Auth。模板与身份验证无关。


### 开发

**问：如何添加新页面？**
答：在 `app/[locale]/` 目录中创建新文件。它们将自动在所有语言中可用。

**问：我可以使用不同的 UI 库吗？**
答：可以！虽然模板使用 shadcn/ui，但您可以用任何 React 组件库替换它。

**问：如何添加 API 路由？**
答：在 `app/api/` 目录中创建文件。这些路由将无论区域设置如何都可用。

## 🚢 部署

### Vercel（推荐）

1. 将您的代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 添加环境变量（可选）
4. 部署

### 其他平台

模板适用于任何支持 Next.js 的平台：
- Railway
- Render
- Fly.io
- AWS Amplify
- Netlify

## 📚 文档

- [Next.js 文档](https://nextjs.org/docs)
- [shadcn/ui 文档](https://ui.shadcn.com)
- [next-intl 文档](https://next-intl.dev)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

## 🤝 贡献

欢迎贡献！请在提交 PR 前阅读我们的贡献指南。

## 📄 许可证

此项目使用 MIT 许可证 - 有关详细信息，请参阅 LICENSE 文件。

## 🙏 致谢

- [shadcn/ui](https://ui.shadcn.com) 提供美丽的组件
- [Vercel](https://vercel.com) 提供出色的部署平台
- [next-intl](https://next-intl.dev) 提供国际化支持
- [Tailwind CSS](https://tailwindcss.com) 提供样式系统

---

由 [devxiyang](https://twitter.com/devxiyang) 用 ❤️ 构建