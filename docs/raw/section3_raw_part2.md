# 📋 ПАСПОРТ САЙТУ
## Розділ 3: Інфраструктура та середовище виконання (Частина 2)

---

## 3.2. 💻 ЛОКАЛЬНЕ СЕРЕДОВИЩЕ РОЗРОБКИ

### 3.2.1 Вимоги до локального середовища

#### 3.2.1.1 Системні вимоги

**Мінімальні вимоги:**

| Компонент | Мінімальна версія | Рекомендована | Перевірка |
|-----------|-------------------|---------------|-----------|
| **Node.js** | 16.14.0+ | 18.x LTS або 20.x LTS | `node --version` |
| **npm** | 8.0.0+ | 9.x або 10.x | `npm --version` |
| **RAM** | 4 GB | 8 GB+ | - |
| **Disk Space** | 500 MB | 2 GB+ (з node_modules) | - |
| **OS** | Windows 10+, macOS 10.15+, Linux | Будь-яка сучасна ОС | - |

**Встановлення Node.js:**

```bash
# Windows (через Node.js installer)
https://nodejs.org/en/download/

# macOS (через Homebrew)
brew install node@18

# Linux (через nvm - рекомендовано)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Перевірка версій
node --version   # v18.18.0
npm --version    # 9.8.1
```

#### 3.2.1.2 Додаткові інструменти (опціонально)

| Інструмент | Призначення | Необхідність |
|------------|-------------|--------------|
| **Git** | Version control | ✅ Обов'язково |
| **VS Code** | Code editor | 🟡 Рекомендовано |
| **Vercel CLI** | Production deploys | 🔵 Опціонально |
| **pnpm/yarn** | Alternative package managers | 🔵 Опціонально |

**Рекомендовані VS Code розширення:**

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",           // ESLint
    "esbenp.prettier-vscode",           // Prettier
    "bradlc.vscode-tailwindcss",        // Tailwind IntelliSense
    "ms-vscode.vscode-typescript-next", // TypeScript
    "unifiedjs.vscode-mdx",             // MDX support
    "formulahendry.auto-rename-tag"     // HTML/JSX auto rename
  ]
}
```

### 3.2.2 Структура локального запуску

#### 3.2.2.1 Початкове налаштування проєкту

**Крок 1: Клонування репозиторію**

```bash
# Clone repository
git clone https://github.com/nkfed/vscode-cerebras-chat.git
cd vscode-cerebras-chat

# Перехід у web директорію
cd web
```

**Крок 2: Встановлення залежностей**

```bash
# Встановлення всіх залежностей
npm install
# або
npm ci  # Чиста установка з package-lock.json (рекомендовано)

# Вивід:
# added 312 packages, and audited 313 packages in 45s
# 
# found 0 vulnerabilities
```

**Структура node_modules після установки:**

```
node_modules/
├── next/                    # ~45 MB (Next.js framework)
├── react/                   # ~2 MB (React library)
├── react-dom/               # ~3 MB (React DOM)
├── typescript/              # ~65 MB (TypeScript compiler)
├── tailwindcss/             # ~25 MB (TailwindCSS)
├── autoprefixer/            # ~5 MB
├── postcss/                 # ~3 MB
├── @types/                  # ~15 MB (Type definitions)
│   ├── node/
│   └── react/
└── ... (інші залежності)

Загальний розмір: ~180 MB
```

**Крок 3: Локальний запуск**

```bash
# Запуск development сервера
npm run dev

# Вивід:
#   ▲ Next.js 14.0.0
#   - Local:        http://localhost:3000
#   - Environments: .env.local
#
#  ✓ Ready in 2.3s
```

#### 3.2.2.2 Скрипти package.json

**Доступні команди:**

| Команда | Скрипт | Призначення | Час виконання |
|---------|--------|-------------|---------------|
| `npm run dev` | `next dev` | Development сервер з HMR | Безкінечний (daemon) |
| `npm run build` | `next build` | Production збірка | ~2-3 хв |
| `npm start` | `next start` | Production сервер (потребує build) | Безкінечний (daemon) |
| `npm run lint` | `next lint` | ESLint перевірка | ~10-30 сек |

**Детальна розбивка команд:**

```bash
# 1. Development Mode
npm run dev
# ├─ Запускає Next.js dev server
# ├─ Port: 3000 (default)
# ├─ Hot Module Replacement (HMR) enabled
# ├─ TypeScript компіляція on-the-fly
# ├─ Швидкий перезапуск при змінах
# └─ Source maps для debugging

# 2. Production Build
npm run build
# ├─ Компіляція TypeScript
# ├─ Генерація статичних сторінок (SSG)
# ├─ Оптимізація bundle (minify, tree shake)
# ├─ Створення .next/ директорії
# └─ Build summary (sizes, routes)

# 3. Production Server (локально)
npm start
# ├─ Запускає Next.js production server
# ├─ Використовує .next/ з попередньої збірки
# ├─ Port: 3000 (default)
# └─ Оптимізований для performance

# 4. Lint Check
npm run lint
# ├─ ESLint перевірка всіх .ts/.tsx файлів
# ├─ Виявлення code style issues
# ├─ Автоматичне виправлення (деякі правила)
# └─ Exit code 0 (success) або 1 (errors)
```

### 3.2.3 Локальний сервер Next.js (Development)

#### 3.2.3.1 Архітектура dev сервера

**ASCII схема локального середовища:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                   LOCAL DEVELOPMENT ENVIRONMENT                     │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                     TERMINAL                                 │  │
│  │                                                              │  │
│  │  $ cd web/                                                   │  │
│  │  $ npm run dev                                               │  │
│  │                                                              │  │
│  │  ▲ Next.js 14.0.0                                            │  │
│  │  - Local:    http://localhost:3000                           │  │
│  │  ✓ Ready in 2.3s                                             │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                           ↓                                         │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              NEXT.JS DEV SERVER (Port 3000)                  │  │
│  │                                                              │  │
│  │  ┌─────────────────────────────────────────────────────┐    │  │
│  │  │         FILE WATCHER (Fast Refresh)                 │    │  │
│  │  │                                                     │    │  │
│  │  │  Watches:                                           │    │  │
│  │  │  ├─ app/**/*.tsx                                    │    │  │
│  │  │  ├─ lib/**/*.ts                                     │    │  │
│  │  │  ├─ config/*.json                                   │    │  │
│  │  │  ├─ locales/*.json                                  │    │  │
│  │  │  └─ *.css files                                     │    │  │
│  │  │                                                     │    │  │
│  │  │  On Change → Hot Module Replacement (HMR)          │    │  │
│  │  └─────────────────────────────────────────────────────┘    │  │
│  │                           ↓                                  │  │
│  │  ┌─────────────────────────────────────────────────────┐    │  │
│  │  │         COMPILATION PIPELINE                        │    │  │
│  │  │                                                     │    │  │
│  │  │  1. TypeScript Compiler (tsc)                       │    │  │
│  │  │     ├─ Type checking (on-the-fly)                   │    │  │
│  │  │     ├─ .tsx → .jsx transformation                   │    │  │
│  │  │     └─ Source maps generation                       │    │  │
│  │  │                                                     │    │  │
│  │  │  2. CSS Processing (PostCSS + Tailwind)             │    │  │
│  │  │     ├─ @tailwind directives expansion               │    │  │
│  │  │     ├─ Autoprefixer                                 │    │  │
│  │  │     └─ No minification (dev mode)                   │    │  │
│  │  │                                                     │    │  │
│  │  │  3. Module Bundling (Webpack/Turbopack)             │    │  │
│  │  │     ├─ Bundle splitting per route                   │    │  │
│  │  │     ├─ Code splitting (dynamic imports)             │    │  │
│  │  │     └─ Fast Refresh integration                     │    │  │
│  │  └─────────────────────────────────────────────────────┘    │  │
│  │                           ↓                                  │  │
│  │  ┌─────────────────────────────────────────────────────┐    │  │
│  │  │         RUNTIME ENVIRONMENT                         │    │  │
│  │  │                                                     │    │  │
│  │  │  Server Components:                                 │    │  │
│  │  │  ├─ Rendered on server (Node.js)                    │    │  │
│  │  │  ├─ Access to fs, path modules                      │    │  │
│  │  │  └─ getTranslations(), notebooks.json               │    │  │
│  │  │                                                     │    │  │
│  │  │  Client Components:                                 │    │  │
│  │  │  ├─ Hydrated in browser                             │    │  │
│  │  │  ├─ React hooks (useState, useEffect)               │    │  │
│  │  │  └─ Browser APIs (document, window)                 │    │  │
│  │  │                                                     │    │  │
│  │  │  API Routes:                                        │    │  │
│  │  │  └─ /api/registries → Serverless function (local)   │    │  │
│  │  └─────────────────────────────────────────────────────┘    │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                           ↓                                         │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                  BROWSER (Chrome/Firefox)                    │  │
│  │                                                              │  │
│  │  http://localhost:3000                                       │  │
│  │  ┌────────────────────────────────────────────────────┐     │  │
│  │  │  HTML + CSS + JavaScript                           │     │  │
│  │  │  ├─ Server-rendered HTML (initial)                  │     │  │
│  │  │  ├─ Hydration (React)                               │     │  │
│  │  │  ├─ HMR WebSocket connection                        │     │  │
│  │  │  └─ React DevTools integration                      │     │  │
│  │  └────────────────────────────────────────────────────┘     │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                           ↑                                         │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │           HOT MODULE REPLACEMENT (HMR)                       │  │
│  │                                                              │  │
│  │  File Change Detected                                        │  │
│  │       ↓                                                      │  │
│  │  Incremental Compilation (~50-200ms)                         │  │
│  │       ↓                                                      │  │
│  │  WebSocket Push to Browser                                  │  │
│  │       ↓                                                      │  │
│  │  Browser Updates Module (no full reload)                    │  │
│  │       ↓                                                      │  │
│  │  React Component Re-renders                                 │  │
│  │       ↓                                                      │  │
│  │  State Preserved ✅                                          │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

#### 3.2.3.2 Характеристики dev сервера

**Performance метрики:**

| Метрика | Значення | Опис |
|---------|----------|------|
| **Cold Start** | 2-5 сек | Перший запуск `npm run dev` |
| **Hot Reload** | 50-200 мс | Після зміни файлу |
| **TypeScript Check** | Real-time | Під час набору коду |
| **Memory Usage** | ~300-500 MB | Node.js process |
| **CPU Usage** | 10-30% | При активній розробці |
| **Port** | 3000 (default) | Можна змінити через `-p 4000` |

**Особливості Fast Refresh:**

```typescript
// Fast Refresh зберігає стан компонента
// app/test/page.tsx
"use client"
import { useState } from 'react'

export default function TestPage() {
  const [count, setCount] = useState(0)  // ← Стан зберігається при HMR
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <p>Оновіть цей текст → Fast Refresh → Count залишиться без змін</p>
    </div>
  )
}
```

**Logging у dev mode:**

```bash
# Console output приклад
$ npm run dev

▲ Next.js 14.0.0
- Local:        http://localhost:3000
- Network:      http://192.168.1.100:3000

✓ Ready in 2.3s
○ Compiling / ...
✓ Compiled / in 1.2s
○ Compiling /documentation ...
✓ Compiled /documentation in 0.8s

# При зміні файлу:
⚠ Fast Refresh rebuilding
✓ Compiled successfully in 156ms

# При TypeScript помилці:
✖ Type error in app/page.tsx
  Property 'text' does not exist on type 'Props'
  5 |   return <div>{text}</div>
    |                 ^^^^
```

### 3.2.4 Локальна збірка (npm run build)

#### 3.2.4.1 Build процес

**Етапи локальної збірки:**

```
┌────────────────────────────────────────────────────────┐
│           LOCAL BUILD PROCESS                          │
│           (npm run build)                              │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Phase 1: PREPARATION                                  │
│  ├─ Read package.json                                  │
│  ├─ Read next.config.js                                │
│  ├─ Read tsconfig.json                                 │
│  └─ Initialize build environment                       │
│     Duration: ~0.5s                                    │
│                                                        │
│  Phase 2: DEPENDENCY ANALYSIS                          │
│  ├─ Scan all imports in app/**/*.tsx                   │
│  ├─ Build dependency graph                             │
│  ├─ Detect Server vs Client Components                 │
│  └─ Calculate code splitting strategy                  │
│     Duration: ~5s                                      │
│                                                        │
│  Phase 3: TYPESCRIPT COMPILATION                       │
│  ├─ Type checking (strict mode)                        │
│  ├─ .ts → .js transformation                           │
│  ├─ .tsx → .jsx transformation                         │
│  ├─ Generate .d.ts files (if needed)                   │
│  └─ Create source maps                                 │
│     Duration: ~15s                                     │
│     Files: 40+ TypeScript files                        │
│                                                        │
│  Phase 4: STATIC GENERATION (SSG)                      │
│  ├─ Render Server Components                           │
│  ├─ Execute generateStaticParams()                     │
│  │   └─ Generate /registers/[slug] variants            │
│  ├─ Generate HTML for each page:                       │
│  │   ├─ / (home)                        [████████] ✓   │
│  │   ├─ /documentation                  [████████] ✓   │
│  │   ├─ /documentation/faq              [████████] ✓   │
│  │   ├─ /documentation/guidelines       [████████] ✓   │
│  │   ├─ /documentation/regulatory       [████████] ✓   │
│  │   ├─ /registers                      [████████] ✓   │
│  │   ├─ /registers/ekopfo               [████████] ✓   │
│  │   ├─ /registers/endoprosthesis       [████████] ✓   │
│  │   ├─ /registers/internatura          [████████] ✓   │
│  │   ├─ /registers/vacancies            [████████] ✓   │
│  │   ├─ /registers/bpr                  [████████] ✓   │
│  │   ├─ /registers/ekrov                [████████] ✓   │
│  │   ├─ /registers/sen-ikp              [████████] ✓   │
│  │   ├─ /about/ehealth                  [████████] ✓   │
│  │   ├─ /about/helpdesk                 [████████] ✓   │
│  │   └─ /test                           [████████] ✓   │
│  └─ Write to .next/server/pages/                       │
│     Duration: ~30s                                     │
│     Pages: 18 total                                    │
│                                                        │
│  Phase 5: CSS PROCESSING                               │
│  ├─ Process globals.css                                │
│  ├─ Expand @tailwind directives                        │
│  │   ├─ @tailwind base    → ~50 KB                     │
│  │   ├─ @tailwind components → ~5 KB                   │
│  │   └─ @tailwind utilities → ~800 KB (before purge)   │
│  ├─ Scan all .tsx files for Tailwind classes           │
│  ├─ PurgeCSS (remove unused classes)                   │
│  │   └─ ~800 KB → ~15 KB (98% reduction)               │
│  ├─ Autoprefixer (vendor prefixes)                     │
│  ├─ Minification (cssnano)                             │
│  └─ Output: .next/static/css/[hash].css                │
│     Duration: ~10s                                     │
│     Final size: ~12 KB (compressed)                    │
│                                                        │
│  Phase 6: JAVASCRIPT BUNDLING                          │
│  ├─ Create chunks per route                            │
│  ├─ Extract shared code (framework, main-app)          │
│  ├─ Tree shaking (remove unused exports)               │
│  ├─ Minification (Terser)                              │
│  │   ├─ Remove whitespace                              │
│  │   ├─ Shorten variable names                         │
│  │   └─ Dead code elimination                          │
│  ├─ Code splitting strategy:                           │
│  │   ├─ framework-[hash].js   (~42 KB) - React core    │
│  │   ├─ main-app-[hash].js    (~32 KB) - App runtime   │
│  │   ├─ [page]-[hash].js      (~3-8 KB each)           │
│  │   └─ shared chunks         (~8 KB total)            │
│  └─ Output: .next/static/chunks/                       │
│     Duration: ~25s                                     │
│     Total JS: ~85 KB (First Load)                      │
│                                                        │
│  Phase 7: ASSET OPTIMIZATION                           │
│  ├─ Images (public/images/)                            │
│  │   ├─ Generate image manifests                       │
│  │   ├─ Create responsive variants metadata            │
│  │   └─ No actual conversion (done on-demand)          │
│  ├─ Fonts (system fonts - no processing)               │
│  └─ Static files (public/documents/)                   │
│     ├─ Copy to .next/static/                           │
│     └─ Generate file hashes                            │
│     Duration: ~5s                                      │
│                                                        │
│  Phase 8: OUTPUT GENERATION                            │
│  ├─ Create build manifest                              │
│  ├─ Generate routes manifest                           │
│  ├─ Create prerender manifest                          │
│  ├─ Write middleware manifest                          │
│  └─ Generate export metadata                           │
│     Duration: ~2s                                      │
│                                                        │
│  Phase 9: SUMMARY                                      │
│  └─ Print build statistics ↓                           │
└────────────────────────────────────────────────────────┘

BUILD OUTPUT:
────────────────────────────────────────────────────────
Route (app)                              Size     First Load JS
┌ ○ /                                    5.2 kB          87 kB
├ ○ /about/ehealth                       3.1 kB          85 kB
├ ○ /about/helpdesk                      2.8 kB          84 kB
├ ○ /documentation                       8.5 kB          90 kB
├ ○ /documentation/faq                   6.2 kB          88 kB
├ ○ /documentation/guidelines            4.1 kB          86 kB
├ ○ /documentation/regulatory            5.3 kB          87 kB
├ ƒ /api/registries                      0 kB            0 kB
├ ○ /registers                           12 kB           94 kB
├ ● /registers/[slug]                    7.8 kB          89 kB
│   ├ /registers/ekopfo
│   ├ /registers/endoprosthesis
│   ├ /registers/internatura
│   ├ /registers/vacancies
│   ├ /registers/bpr
│   ├ /registers/ekrov
│   └ /registers/sen-ikp
└ ○ /test                                2.5 kB          84 kB

○  (Static)  prerendered as static content
●  (SSG)     prerendered as static HTML (uses getStaticProps)
ƒ  (Dynamic) server-rendered on demand

First Load JS shared by all: 81.8 kB
  ├ chunks/framework-*.js                42.0 kB
  ├ chunks/main-app-*.js                 31.5 kB
  └ other shared chunks (total)          8.3 kB

✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages (18/18)
✓ Finalizing page optimization

Build completed in 1m 32s
────────────────────────────────────────────────────────
```

**Загальний час збірки:**

| Етап | Час | % від загального |
|------|-----|------------------|
| Preparation | 0.5s | 0.5% |
| Dependency Analysis | 5s | 5% |
| TypeScript Compilation | 15s | 16% |
| Static Generation (SSG) | 30s | 33% |
| CSS Processing | 10s | 11% |
| JavaScript Bundling | 25s | 27% |
| Asset Optimization | 5s | 5% |
| Output Generation | 2s | 2% |
| **Загалом** | **~92s** | **100%** |

### 3.2.5 Згенеровані файли та директорії

#### 3.2.5.1 Структура `.next/` директорії

**Повна структура після `npm run build`:**

```
.next/
├── app-build-manifest.json              # 2 KB - App Router manifest
├── build-manifest.json                  # 15 KB - Pages manifest
├── package.json                         # 1 KB - Build metadata
├── react-loadable-manifest.json         # 3 KB - Code splitting info
├── trace                                # ~500 KB - Build trace для аналізу
│
├── cache/                               # ~50 MB - Build cache
│   ├── webpack/                         # Webpack cache
│   │   ├── client-development/
│   │   └── client-production/
│   └── swc/                             # SWC (Rust compiler) cache
│
├── server/                              # ~5 MB - Server-side code
│   ├── app/                             # App Router server components
│   │   ├── page.js                      # Server-rendered home page
│   │   ├── layout.js                    # Root layout
│   │   ├── documentation/
│   │   │   └── page.js
│   │   ├── registers/
│   │   │   ├── page.js
│   │   │   └── [slug]/
│   │   │       └── page.js
│   │   └── ... (всі server components)
│   │
│   ├── app-paths-manifest.json          # Routing info
│   ├── middleware-manifest.json         # Middleware config (порожній)
│   └── server-reference-manifest.json   # Server references
│
├── static/                              # ~10 MB - Static assets
│   ├── chunks/                          # JavaScript chunks
│   │   ├── framework-[hash].js          # 42 KB - React framework
│   │   ├── main-app-[hash].js           # 32 KB - App runtime
│   │   ├── webpack-[hash].js            # 2 KB - Webpack runtime
│   │   └── pages/                       # Per-page chunks
│   │       ├── _app-[hash].js
│   │       ├── index-[hash].js
│   │       └── ... (chunk per route)
│   │
│   ├── css/                             # CSS files
│   │   └── app/
│   │       └── layout-[hash].css        # 12 KB - Global styles
│   │
│   ├── media/                           # Optimized images metadata
│   │   └── [hash].[ext].json
│   │
│   └── [buildId]/                       # Build-specific assets
│       └── _buildManifest.js
│
└── types/                               # ~2 MB - Auto-generated TypeScript types
    ├── app/
    │   ├── layout.ts
    │   ├── page.ts
    │   └── ... (type definitions per route)
    └── link.d.ts

TOTAL SIZE: ~70 MB (з кешами)
PRODUCTION SIZE: ~15 MB (без cache/)
```

#### 3.2.5.2 Кеш-файли

**Build Cache (`cache/`):**

```yaml
Purpose: Прискорення наступних збірок
Location: .next/cache/

Contents:
  webpack/:
    - Compiled modules cache
    - Dependency graphs
    - Incremental build data
    
  swc/:
    - TypeScript compilation cache
    - AST (Abstract Syntax Tree) cache
    - Transformation results

Behavior:
  - First build: ~90s (cold cache)
  - Subsequent builds: ~30-45s (warm cache)
  - Invalidation: On dependency changes
  - Size: ~50 MB
  - Safe to delete: Yes (regenerates on next build)
```

**TypeScript Incremental Cache:**

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "incremental": true,  // ← Enables incremental compilation
    // ...
  }
}

// Generates:
// web/tsconfig.tsbuildinfo (~200 KB)
// Stores:
// - Previously compiled file signatures
// - Type checking results
// - Dependency information
// 
// Benefit:
// - Faster rebuilds (only recompile changed files)
// - 3-5x speedup on incremental builds
```

#### 3.2.5.3 Інші згенеровані файли

**Root-level files:**

```
web/
├── .next/                    # Build output (primary)
├── node_modules/             # Dependencies (~180 MB)
├── tsconfig.tsbuildinfo      # TypeScript incremental info (~200 KB)
│
└── .gitignore                # Excludes:
    ├─ .next/
    ├─ node_modules/
    └─ tsconfig.tsbuildinfo
```

**Що НЕ коммітиться в Git:**

```gitignore
# .gitignore
.next/
node_modules/
tsconfig.tsbuildinfo
.vercel/
*.log
.DS_Store
```

### 3.2.6 Локальна робота з TailwindCSS

#### 3.2.6.1 JIT (Just-In-Time) режим

**Як працює Tailwind JIT у dev mode:**

```
┌───────────────────────────────────────────────────────┐
│        TAILWINDCSS JIT COMPILATION                    │
├───────────────────────────────────────────────────────┤
│                                                       │
│  1. File Watcher                                      │
│     └─ Monitors: app/**/*.{js,ts,jsx,tsx}            │
│                                                       │
│  2. Class Detection                                   │
│     └─ Scans for: className="..."                    │
│         Example: className="bg-blue-500 text-white"  │
│                                                       │
│  3. CSS Generation (On-Demand)                        │
│     ├─ bg-blue-500 → .bg-blue-500 { ... }            │
│     └─ text-white  → .text-white { ... }             │
│                                                       │
│  4. Output                                            │
│     └─ Injects into globals.css (hot reload)         │
│                                                       │
│  Performance:                                         │
│  ├─ Initial compilation: ~1-2s                       │
│  ├─ Class added: ~50ms                               │
│  └─ Class removed: Instant (no rebuild)              │
└───────────────────────────────────────────────────────┘
```

**Приклад роботи:**

```typescript
// app/page.tsx
"use client"

export default function HomePage() {
  return (
    <div className="bg-blue-500 text-white p-4">
      {/* ↑ TailwindCSS виявляє ці класи */}
      Hello World
    </div>
  )
}

// TailwindCSS генерує (автоматично):
// .bg-blue-500 { background-color: #3b82f6; }
// .text-white { color: #ffffff; }
// .p-4 { padding: 1rem; }
```

**Переваги JIT у dev mode:**

```yaml
Speed:
  - No full CSS build на старті
  - Генерує тільки використані класи
  - Incremental updates (~50ms)

Size:
  - Dev CSS: ~50 KB (тільки використані класи)
  - Production CSS: ~12 KB (after PurgeCSS)

Developer Experience:
  - Arbitrary values: className="top-[117px]"
  - Dynamic classes: className={`text-${color}-500`}
  - Instant feedback при додаванні класів
```

#### 3.2.6.2 Конфігурація файлів

**Обробка CSS файлів:**

```
app/globals.css
      ↓ (import in layout.tsx)
PostCSS Processing
      ↓
TailwindCSS Plugin
      ↓ (expand @tailwind directives)
┌─────────────────────────────┐
│  @tailwind base;            │ → Normalize, reset styles
│  @tailwind components;      │ → Component classes (порожньо)
│  @tailwind utilities;       │ → Utility classes (JIT)
└─────────────────────────────┘
      ↓
Autoprefixer
      ↓ (vendor prefixes)
Output CSS
      ↓
<style> tag in HTML (dev mode)
or
.next/static/css/[hash].css (production)
```

**tailwind.config.cjs:**

```javascript
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}"
  ],
  // ↑ TailwindCSS сканує ці файли для класів
  
  theme: {
    extend: {}  // Кастомізація (не використовується)
  },
  plugins: []
}
```

**Hot Reload для CSS змін:**

```bash
# Зміна в app/globals.css
.container {
  max-width: 1024px;  # Було
  max-width: 1280px;  # Змінено
}

# ↓ Fast Refresh
# Browser updates CSS (~100ms)
# No page reload
# Layout adjusts automatically ✅
```

### 3.2.7 Локальна робота з локалізаціями

#### 3.2.7.1 Механізм локалізацій у dev mode

**Схема роботи локалізацій:**

```
┌────────────────────────────────────────────────────────┐
│         LOCALIZATION WORKFLOW (Development)            │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Browser Cookie: NEXT_LOCALE=uk                        │
│       ↓                                                │
│  ┌──────────────────────────────────────────────┐     │
│  │         SERVER COMPONENTS                    │     │
│  │                                              │     │
│  │  import { cookies } from 'next/headers'      │     │
│  │  import { getTranslations } from '@/lib/i18n'│     │
│  │                                              │     │
│  │  const locale = cookies().get('NEXT_LOCALE') │     │
│  │  const t = await getTranslations(locale)     │     │
│  │       ↓                                      │     │
│  │  fs.readFileSync('locales/ua.json')          │     │
│  │       ↓                                      │     │
│  │  return <h1>{t.title}</h1>                   │     │
│  └──────────────────────────────────────────────┘     │
│                                                        │
│  ┌──────────────────────────────────────────────┐     │
│  │         CLIENT COMPONENTS                    │     │
│  │                                              │     │
│  │  "use client"                                │     │
│  │  import { useTranslations } from '@/lib/..'  │     │
│  │                                              │     │
│  │  const { t, locale, setLocale } = use...()   │     │
│  │       ↓                                      │     │
│  │  useState + useEffect                        │     │
│  │       ↓                                      │     │
│  │  Статичний імпорт:                           │     │
│  │  import uaTranslations from '../ua.json'     │     │
│  │       ↓                                      │     │
│  │  return <p>{t.header.home}</p>               │     │
│  └──────────────────────────────────────────────┘     │
│                                                        │
│  ┌──────────────────────────────────────────────┐     │
│  │      LANGUAGE SWITCHER                       │     │
│  │                                              │     │
│  │  onClick UA/EN button                        │     │
│  │       ↓                                      │     │
│  │  setLocaleCookie('uk' or 'en')               │     │
│  │       ↓                                      │     │
│  │  document.cookie = "NEXT_LOCALE=uk"          │     │
│  │       ↓                                      │     │
│  │  window.location.reload()                    │     │
│  │       ↓                                      │     │
│  │  Server re-reads cookie                      │     │
│  │       ↓                                      │     │
│  │  New language rendered ✅                    │     │
│  └──────────────────────────────────────────────┘     │
└────────────────────────────────────────────────────────┘
```

#### 3.2.7.2 Hot Reload для локалізацій

**Зміна в локалізаційних файлах:**

```json
// locales/ua.json
{
  "header": {
    "home": "Головна"        // Було
    "home": "Головна сторінка"  // Змінено
  }
}
```

**Поведінка при зміні:**

```yaml
Server Components:
  - File watcher detects change in locales/ua.json
  - Next.js triggers page revalidation
  - getTranslations() reads updated file
  - Page re-renders with new translation
  - Duration: ~200-500ms
  - Browser: Full page reload (SSR)

Client Components:
  - File change NOT detected automatically
  - Потрібно:
    1. Manual browser reload (F5)
    2. Або рестарт dev server
  - Причина: Статичний імпорт JSON
  - Workaround: Dynamic import (не використовується)
```

**Рекомендації при розробці:**

```bash
# При зміні локалізацій:
1. Відредагувати locales/ua.json або locales/en.json
2. Зберегти файл
3. Почекати Fast Refresh (~200ms)
4. Якщо не оновилося → F5 (hard reload)

# При додаванні нового ключа:
1. Додати в обидва файли (ua.json + en.json)
2. Використати в компоненті: t.newKey
3. TypeScript може показати помилку (optional chaining: t.newKey?)
4. Рестарт dev server якщо TypeScript не бачить нових ключів
```

#### 3.2.7.3 TypeScript підтримка локалізацій

**Type safety для translations:**

```typescript
// lib/useTranslations.ts
import uaTranslations from '../locales/ua.json'

type Translations = typeof uaTranslations

export function useTranslations() {
  const [t, setTranslations] = useState<Translations>(uaTranslations)
  
  // TypeScript автодоповнення:
  // t.header.home ✅
  // t.header.invalid ❌ (compile error)
  
  return { t, locale, setLocale }
}
```

**Autocomplete у VS Code:**

```typescript
// app/components/Header.tsx
const { t } = useTranslations()

return (
  <nav>
    <Link href="/">{t.header.home}</Link>
    {/* ↑ VS Code показує:
          - header
            - home: "Головна"
            - registries: "Реєстри"
            - documentation: "Документація"
            - ...
    */}
  </nav>
)
```

### 3.2.8 Налагодження та відладка

#### 3.2.8.1 Browser DevTools

**React DevTools:**

```yaml
Installation:
  - Chrome Extension: React Developer Tools
  - Firefox Add-on: React Developer Tools
  
Features:
  - Component tree inspection
  - Props and state viewer
  - Profiler (performance)
  - Hooks inspection
  
Usage:
  - Open DevTools (F12)
  - Tab: ⚛️ Components
  - Tab: ⚛️ Profiler
```

**Console logging:**

```typescript
// Server Component (app/page.tsx)
export default async function HomePage() {
  console.log('Server: Rendering home page')  // ← Terminal output
  return <div>Home</div>
}

// Client Component (app/components/Header.tsx)
"use client"
export default function Header() {
  console.log('Client: Header mounted')  // ← Browser console
  return <header>...</header>
}
```

**Network inspection:**

```yaml
Chrome DevTools → Network:
  - localhost:3000/ → HTML (SSR)
  - _next/static/chunks/framework-*.js → React
  - _next/static/css/app/layout-*.css → Styles
  - Hot reload WebSocket: ws://localhost:3000/_next/webpack-hmr
```

#### 3.2.8.2 VS Code Debugging

**launch.json конфігурація:**

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

**Breakpoints:**

```typescript
// app/api/registries/route.ts
export async function GET() {
  debugger;  // ← VS Code зупиниться тут (якщо debugging enabled)
  const file = path.join(process.cwd(), 'config', 'notebooks.json')
  const data = fs.readFileSync(file, 'utf-8')
  return NextResponse.json(JSON.parse(data))
}
```

#### 3.2.8.3 Error Handling у dev mode

**TypeScript errors:**

```bash
# Terminal output
Type error: app/page.tsx

  Property 'tittle' does not exist on type 'Translations'.
  Did you mean 'title'?
  
  12 |   return <h1>{t.tittle}</h1>
     |                   ^^^^^^
```

**Runtime errors:**

```bash
# Browser console
Unhandled Runtime Error
Error: Cannot read property 'title' of undefined

app/page.tsx (12:23)
  10 | export default function HomePage() {
  11 |   const t = getTranslations()
> 12 |   return <h1>{t.header.title}</h1>
     |                       ^
```

**Error Overlay (Next.js):**

```
┌─────────────────────────────────────────────┐
│  🔴 Unhandled Runtime Error                 │
├─────────────────────────────────────────────┤
│                                             │
│  TypeError: Cannot read property 'title'    │
│  of undefined                               │
│                                             │
│  app/page.tsx (12:23)                       │
│                                             │
│  10 | export default function HomePage() {   │
│  11 |   const t = getTranslations()          │
│ >12 |   return <h1>{t.header.title}</h1>     │
│     |                       ^                │
│  13 | }                                      │
│                                             │
│  [Dismiss]                                  │
└─────────────────────────────────────────────┘
```

### 3.2.9 Оптимізація локальної розробки

**Tips для швидшої розробки:**

```yaml
1. Incremental TypeScript:
   - Enabled: tsconfig.json → "incremental": true
   - Benefit: 3-5x faster recompilation
   
2. SWC Compiler (default у Next.js 14):
   - Faster than Babel (20x)
   - Rust-based compilation
   - No config needed

3. Турбо Mode (experimental):
   - next dev --turbo
   - Uses Turbopack (Rust bundler)
   - 10x faster HMR
   - Currently not stable

4. Build Cache:
   - .next/cache/ → зберігайте між builds
   - npm run build → ~90s (cold)
   - npm run build → ~30s (warm cache)

5. Selective Compilation:
   - Next.js компілює тільки відкриті сторінки
   - Відкрили /documentation → компілюється тільки ця сторінка
   - Інші сторінки компілюються on-demand

6. Memory Management:
   - Закрийте непотрібні вкладки браузера
   - Рестартуйте dev server щодня (memory leaks)
   - NODE_OPTIONS=--max-old-space-size=4096 npm run dev
```

---

**Дата створення:** 12 грудня 2025  
**Версія проєкту:** 0.1.0  
**Node.js:** 18.x LTS (рекомендовано)  
**Development Server:** http://localhost:3000
