# 📋 ПАСПОРТ САЙТУ
## Розділ 2: Архітектура проєкту (Частина 3 - Фінал)

---

## 9. 🔌 АРХІТЕКТУРА API

### 9.1 API Route: `/api/registries`

**Файл:** `app/api/registries/route.ts`  
**Метод:** `GET`  
**Розмір:** 24 рядки

**Повний код:**

```typescript
import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

interface Registry {
  slug: string
  title: string
  description: string
  links?: { label: string; url: string; image?: string }[]
}

export async function GET() {
  const file = path.join(process.cwd(), 'config', 'notebooks.json')
  try {
    const data = fs.readFileSync(file, 'utf-8')
    const registries: Registry[] = JSON.parse(data)
    
    // Return only slug and title for header menu
    const simplified = registries.map(r => ({ 
      slug: r.slug, 
      title: r.title 
    }))
    
    return NextResponse.json(simplified)
  } catch (e) {
    return NextResponse.json([], { status: 500 })
  }
}
```

**Архітектурні рішення:**

1. **File System Access**
   ```typescript
   const file = path.join(process.cwd(), 'config', 'notebooks.json')
   const data = fs.readFileSync(file, 'utf-8')
   ```
   - ✅ Прямий доступ до файлової системи (Node.js API)
   - ✅ Синхронне читання (оскільки файл малий)

2. **Data Transformation**
   ```typescript
   const simplified = registries.map(r => ({ slug: r.slug, title: r.title }))
   ```
   - ✅ Повертає тільки необхідні поля (slug, title)
   - ✅ Зменшує розмір відповіді (~70% економія)

3. **Error Handling**
   ```typescript
   try { ... } catch (e) {
     return NextResponse.json([], { status: 500 })
   }
   ```
   - ✅ Graceful degradation (порожній масив замість crash)
   - ✅ HTTP 500 статус код

### 9.2 Формат відповіді

**Success Response (200 OK):**

```json
[
  { "slug": "ekopfo", "title": "ЕКОПФО" },
  { "slug": "endoprosthesis", "title": "Ендопротезування" },
  { "slug": "internatura", "title": "Інтернатура" },
  { "slug": "vacancies", "title": "Вакансії" },
  { "slug": "bpr", "title": "Система Безперервного Розвитку" },
  { "slug": "ekrov", "title": "е-Кров" },
  { "slug": "sen-ikp", "title": "СЕН ІКП" }
]
```

**TypeScript тип:**

```typescript
type RegistryListItem = {
  slug: string    // Унікальний ідентифікатор
  title: string   // Назва реєстру (fallback)
}

type APIResponse = RegistryListItem[]
```

**Error Response (500 Internal Server Error):**

```json
[]
```

**Headers:**

```
Content-Type: application/json
Cache-Control: no-cache (default Next.js)
```

**Розмір відповіді:**
- Compressed: ~200 bytes
- Uncompressed: ~350 bytes

### 9.3 Використання API

#### 9.3.1 Client Component: Header Dropdown

**Файл:** `app/components/Header.tsx`

```typescript
"use client"
import { useState, useEffect } from 'react'

export default function Header() {
  const [registries, setRegistries] = useState<Registry[]>([])
  
  useEffect(() => {
    // Завантаження списку реєстрів для dropdown меню
    fetch('/api/registries')
      .then(res => res.json())
      .then(data => setRegistries(data))
      .catch(err => console.error('Failed to load registries:', err))
  }, [])
  
  return (
    <nav>
      <div className="dropdown">
        {registries.map(r => (
          <Link key={r.slug} href={`/registers/${r.slug}`}>
            {getRegistryTitle(r)}
          </Link>
        ))}
      </div>
    </nav>
  )
}
```

**Потік даних:**

```
1. Header mount
   ↓
2. useEffect() triggered
   ↓
3. fetch('/api/registries')
   ↓
4. GET /api/registries (Server)
   ↓
5. fs.readFileSync('config/notebooks.json')
   ↓
6. JSON.parse() + map()
   ↓
7. NextResponse.json([...])
   ↓
8. setRegistries(data)
   ↓
9. Re-render з dropdown меню
```

#### 9.3.2 Чому API а не прямий імпорт?

**Альтернатива (не використовується):**

```typescript
// ❌ Прямий імпорт в Client Component
"use client"
import notebooks from '../../../config/notebooks.json'  // Error!

export default function Header() {
  return <nav>{notebooks.map(...)}</nav>
}
```

**Проблема:**
- ❌ Client Component не може імпортувати JSON напряму
- ❌ Збільшує bundle size (увесь notebooks.json в JS)

**Рішення через API:**

```typescript
// ✅ Динамічне завантаження через fetch
fetch('/api/registries')
  .then(res => res.json())
  .then(data => setRegistries(data))
```

**Переваги:**
- ✅ Менший bundle (тільки необхідні поля)
- ✅ Lazy loading (не блокує SSR)
- ✅ Можливість кешування

#### 9.3.3 Статистика використання

| Де використовується | Як часто викликається |
|---------------------|----------------------|
| `app/components/Header.tsx` | 1 раз при mount |
| Інші компоненти | Не використовується |

**Кешування:**
- ❌ Немає явного кешування (Next.js default)
- ✅ Браузер може кешувати (якщо не змінюється)

**Можливі покращення (не реалізовані):**

```typescript
// Можна додати ISR (Incremental Static Regeneration)
export const revalidate = 3600  // Кешувати на 1 годину

// Або SWR для клієнта
import useSWR from 'swr'
const { data } = useSWR('/api/registries', fetcher)
```

---

## 10. 🔗 АРХІТЕКТУРА ІНТЕГРАЦІЙ

### 10.1 Instatus (Моніторинг статусу систем)

**Сервіс:** https://instatus.com  
**Призначення:** Real-time status pages для моніторингу доступності систем

#### 10.1.1 Принцип інтеграції

**Метод:** iframe embedding

**Схема:**

```
┌──────────────────────────────────────────┐
│   Next.js App                            │
│   ┌────────────────────────────────┐     │
│   │  <iframe>                      │     │
│   │    src="https://ekoppho.       │     │
│   │         instatus.com"          │     │
│   │  </iframe>                     │     │
│   └────────────────────────────────┘     │
│            │                             │
└────────────┼─────────────────────────────┘
             │
             ▼
    ┌─────────────────────┐
    │  Instatus Server    │
    │  (екопфо.instatus)  │
    │                     │
    │  - System Status    │
    │  - Uptime %         │
    │  - Incidents        │
    └─────────────────────┘
```

#### 10.1.2 Код інтеграції

**Сторінка статусу реєстрів (Grid):**

```typescript
// app/registers/page.tsx
export default async function RegistersPage() {
  const registries = notebooks
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {registries.map(registry => (
        <div key={registry.slug} className="border rounded-lg overflow-hidden">
          <h3>{registry.title}</h3>
          
          {/* Instatus iframe */}
          {registry.statusUrl && (
            <iframe
              src={registry.statusUrl}
              className="w-full h-[42vh] border-0"
              title={`${registry.title} status`}
              loading="lazy"
            />
          )}
        </div>
      ))}
    </div>
  )
}
```

**Сторінка деталей реєстру (Full-screen):**

```typescript
// app/registers/[slug]/page.tsx
export default async function RegisterDetail({ params }) {
  const item = notebooks.find(n => n.slug === params.slug)
  
  return (
    <section>
      <h1>{item.title}</h1>
      
      {/* Повноекранний Instatus iframe */}
      {item.statusUrl && (
        <iframe
          src={item.statusUrl}
          className="w-full h-[80vh] border rounded"
          title="System Status"
          loading="lazy"
        />
      )}
    </section>
  )
}
```

#### 10.1.3 Конфігурація в `notebooks.json`

```json
{
  "slug": "ekopfo",
  "title": "ЕКОПФО",
  "statusUrl": "https://ekoppho.instatus.com"  // ← URL для iframe
}
```

**Всі URL Instatus:**

| Реєстр | Status URL | Hostname |
|--------|-----------|----------|
| ЕКОПФО | `https://ekoppho.instatus.com` | `ekoppho` |
| Ендопротезування | `https://endo.instatus.com/` | `endo` |
| Інтернатура | `https://intern.instatus.com/` | `intern` |
| Вакансії | `https://vacancy.instatus.com/` | `vacancy` |
| БПР | `https://bpr-moh.instatus.com/` | `bpr-moh` |
| е-Кров | `https://eblood.instatus.com/` | `eblood` |
| СЕН ІКП | `https://ensicp.instatus.com/` | `ensicp` |

#### 10.1.4 Особливості

**iframe атрибути:**

```typescript
<iframe
  src={statusUrl}                    // URL Instatus
  className="w-full h-[42vh]"        // Tailwind: 100% ширина, 42% viewport висоти
  title="System Status"              // Accessibility
  loading="lazy"                     // Lazy loading (не завантажується одразу)
/>
```

**Переваги:**
- ✅ Real-time updates (без reload сторінки)
- ✅ Автономний (працює навіть якщо Next.js недоступний)
- ✅ Професійний UI від Instatus

**Недоліки:**
- ❌ Залежність від зовнішнього сервісу
- ❌ Немає контролю над UI
- ❌ CORS обмеження (якщо Instatus змінить політику)

### 10.2 Jira ServiceDesk (Підтримка користувачів)

**Сервіс:** Atlassian Jira Service Management  
**Призначення:** Ticketing system для техпідтримки

#### 10.2.1 Принцип інтеграції

**Метод:** External links (посилання з target="_blank")

**Схема:**

```
┌────────────────────────────────────────┐
│   Next.js App                          │
│   ┌──────────────────────────────┐     │
│   │  <a href="..." target="_blank">  │
│   │    Підтримка користувачів     │   │
│   │  </a>                         │   │
│   └──────────────────────────────┘     │
│            │                           │
└────────────┼───────────────────────────┘
             │ Click
             ▼
    ┌─────────────────────────────────┐
    │  Atlassian Jira ServiceDesk     │
    │  e-health-ua.atlassian.net      │
    │                                 │
    │  /servicedesk/customer/         │
    │  portal/32/group/88/create/296  │
    │                                 │
    │  → Форма створення тікету       │
    └─────────────────────────────────┘
```

#### 10.2.2 Код інтеграції

**Компонент HelpdeskLink:**

```typescript
// app/components/HelpdeskLink.tsx
export default function HelpdeskLink({
  url = 'https://e-health-ua.atlassian.net/servicedesk/customer/portals',
  children,
  showIcon = true
}: HelpdeskLinkProps) {
  return (
    <a
      href={url}
      target="_blank"              // ← Відкриття в новій вкладці
      rel="noopener noreferrer"   // ← Безпека
      className="inline-flex items-center gap-2 px-4 py-3 rounded border border-sky-600 bg-sky-50 text-sky-700 hover:bg-sky-100"
    >
      {showIcon && (
        <Image src="/images/Helpdesk team.webp" alt="Helpdesk" width={64} height={64} />
      )}
      {children}
    </a>
  )
}
```

**Використання на сторінках реєстрів:**

```typescript
// app/registers/[slug]/page.tsx
{(item.links || []).map(link => (
  <a 
    key={link.url}
    href={link.url}
    target="_blank"
    rel="noopener noreferrer"
    className="block border rounded overflow-hidden hover:shadow-lg"
  >
    <Image src={link.image} alt={link.label} width={200} height={200} />
    <h4>{link.label}</h4>
  </a>
))}
```

#### 10.2.3 Конфігурація в `notebooks.json`

```json
{
  "slug": "ekopfo",
  "links": [
    {
      "label": "Підтримка користувачів",
      "url": "https://e-health-ua.atlassian.net/servicedesk/customer/portal/32/group/88/create/296",
      "image": "/images/Helpdesk.webp"
    }
  ]
}
```

**Структура URL:**

```
https://e-health-ua.atlassian.net/servicedesk/customer/portal/{portalId}/group/{groupId}/create/{requestType}
                                                                    │           │            │
                                                                    │           │            └─ ID типу запиту
                                                                    │           └─ ID групи підтримки
                                                                    └─ ID порталу реєстру
```

**Параметри для кожного реєстру:**

| Реєстр | Portal | Group | Request Type |
|--------|--------|-------|--------------|
| ЕКОПФО | 32 | 88 | 296 |
| Ендопротезування | 33 | 89 | 299 |
| Інтернатура | 34 | - | - |
| Вакансії | 27 | - | - |
| БПР | 26 | - | - |
| е-Кров | 30 | 86 | 287 |
| СЕН ІКП | 31 | - | - |

**Примітка:** Якщо `group` та `create` відсутні, URL скорочується:
```
https://e-health-ua.atlassian.net/servicedesk/customer/portal/34
```

#### 10.2.4 Особливості

**Security атрибути:**

```typescript
rel="noopener noreferrer"
```

- `noopener` - запобігає доступу нового вікна до `window.opener`
- `noreferrer` - не передає Referer header (приватність)

**Переваги:**
- ✅ Простота інтеграції (просто посилання)
- ✅ Централізована система тікетів
- ✅ Професійний SLA tracking

**Недоліки:**
- ❌ Редирект на зовнішній сайт (може бути незручно для користувачів)
- ❌ Потрібна окрема авторизація в Jira

### 10.3 NotebookLM (AI аналітика)

**Сервіс:** Google NotebookLM  
**Призначення:** AI-асистент для аналізу документації

#### 10.3.1 Принцип інтеграції

**Метод:** External links (аналогічно Jira)

**Схема:**

```
┌────────────────────────────────────────┐
│   Next.js App                          │
│   ┌──────────────────────────────┐     │
│   │  <a href="..." target="_blank">  │
│   │    Аналітичний ШІ            │   │
│   │  </a>                         │   │
│   └──────────────────────────────┘     │
│            │                           │
└────────────┼───────────────────────────┘
             │ Click
             ▼
    ┌─────────────────────────────────┐
    │  Google NotebookLM              │
    │  notebooklm.google.com          │
    │                                 │
    │  /notebook/{notebookId}         │
    │                                 │
    │  → AI Chat Interface            │
    │  → PDF документи завантажені    │
    └─────────────────────────────────┘
```

#### 10.3.2 Код інтеграції

**Картка на сторінці реєстру:**

```typescript
// app/registers/[slug]/page.tsx
{(item.links || []).map(link => (
  <a
    key={link.url}
    href={link.url}
    target="_blank"
    rel="noopener noreferrer"
    className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
  >
    <div className="relative w-full h-48">
      <Image
        src={link.image}           // /images/ai-ekopfo.webp
        alt={link.label}
        fill
        className="object-cover"
      />
    </div>
    <div className="p-4">
      <h4 className="font-semibold">{link.label}</h4>
    </div>
  </a>
))}
```

#### 10.3.3 Конфігурація в `notebooks.json`

```json
{
  "slug": "ekopfo",
  "links": [
    {
      "label": "Аналітичний ШІ по модулю ЕКОПФО",
      "url": "https://notebooklm.google.com/notebook/5ed43304-90a2-4193-a706-daec18cc8e33",
      "image": "/images/ai-ekopfo.webp"
    }
  ]
}
```

**Структура URL:**

```
https://notebooklm.google.com/notebook/{notebookId}
                                         │
                                         └─ Унікальний ID notebook (UUID v4)
```

**Всі Notebook ID:**

| Реєстр | Notebook ID | Image |
|--------|-------------|-------|
| ЕКОПФО | `5ed43304-90a2-4193-a706-daec18cc8e33` | `ai-ekopfo.webp` |
| Ендопротезування | `2ba648ae-a69d-4912-959f-cb04d3d7e383` | `ai-endoprosthesis.webp` |
| Інтернатура | `fc75d28d-509b-47e4-a3c0-8cff2a589ce7` | `ai-internatura.webp` |
| Вакансії | `e4ec4760-68d9-4ca2-a564-df02e0484ccf` | `ai-vacancies.webp` |
| БПР | `7e2d73f0-ec55-4e20-926d-0e532db34a07` | `ai-bpr.webp` |
| е-Кров | `76d8e964-6d04-4a87-8515-187b66e3e3c2` | `ai-ekrov.webp` |
| СЕН ІКП | `70c4d740-9fc0-4dfe-af5e-4a65a721b26b` | `ai-senikp.webp` |

#### 10.3.4 Особливості

**Переваги:**
- ✅ AI-powered пошук по документації
- ✅ Генерація відповідей на основі завантажених PDF
- ✅ Безкоштовний сервіс Google

**Недоліки:**
- ❌ Потрібен Google акаунт
- ❌ Залежність від Google infrastructure
- ❌ Обмеження API (якщо буде потреба в embedding)

### 10.4 Зберігання інтеграцій у конфігураціях

**Централізоване сховище:** `config/notebooks.json`

**Структура даних:**

```json
[
  {
    "slug": "ekopfo",
    "title": "ЕКОПФО",
    
    // 1. Instatus інтеграція
    "statusUrl": "https://ekoppho.instatus.com",
    
    // 2. Jira + NotebookLM інтеграції
    "links": [
      {
        "label": "Аналітичний ШІ по модулю ЕКОПФО",
        "url": "https://notebooklm.google.com/notebook/...",  // NotebookLM
        "image": "/images/ai-ekopfo.webp"
      },
      {
        "label": "Підтримка користувачів",
        "url": "https://e-health-ua.atlassian.net/...",      // Jira
        "image": "/images/Helpdesk.webp"
      }
    ]
  }
]
```

**Таблиця зберігання:**

| Інтеграція | Поле в JSON | Тип | Приклад |
|------------|-------------|-----|---------|
| **Instatus** | `statusUrl` | `string?` | `https://ekoppho.instatus.com` |
| **Jira** | `links[].url` | `string` | `https://e-health-ua.atlassian.net/...` |
| **NotebookLM** | `links[].url` | `string` | `https://notebooklm.google.com/notebook/...` |
| **Іконки** | `links[].image` | `string?` | `/images/ai-ekopfo.webp` |

**Переваги підходу:**
- ✅ Single Source of Truth
- ✅ Легко оновлювати URL
- ✅ Типізація через TypeScript
- ✅ Можливість додавати нові інтеграції

**Можливе масштабування:**

```json
{
  "links": [
    {
      "type": "ai-analytics",          // Категорія
      "label": "...",
      "url": "...",
      "image": "..."
    },
    {
      "type": "support",
      "label": "...",
      "url": "...",
      "image": "..."
    },
    {
      "type": "documentation",         // Нова категорія
      "label": "Confluence Wiki",
      "url": "https://confluence.e-health.gov.ua",
      "image": "/images/confluence.webp"
    }
  ]
}
```

---

## 11. ⚙️ АРХІТЕКТУРА ЗБІРКИ ТА КОНФІГУРАЦІЙ

### 11.1 `next.config.js`

**Файл:** `web/next.config.js`  
**Розмір:** 6 рядків

**Повний код:**

```javascript
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
```

**Пояснення:**

#### 11.1.1 `reactStrictMode: true`

**Призначення:** Увімкнення строгого режиму React

**Що робить:**
- ✅ Виявляє небезпечні lifecycle методи
- ✅ Попереджає про застарілі API
- ✅ Виявляє несподівані side effects
- ✅ Подвійний рендер у dev mode (для виявлення багів)

**Приклад:**

```typescript
// ❌ Deprecated - React Strict Mode покаже warning
componentWillMount() { ... }

// ✅ Рекомендовано
useEffect(() => { ... }, [])
```

#### 11.1.2 Відсутні конфігурації

**Що НЕ налаштовано (використовуються defaults):**

```javascript
// ❌ Немає в проєкті:

{
  // Image optimization
  images: {
    domains: ['example.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Redirects
  async redirects() {
    return [
      { source: '/old', destination: '/new', permanent: true }
    ]
  },
  
  // Rewrites (proxy)
  async rewrites() {
    return [
      { source: '/api/:path*', destination: 'https://api.example.com/:path*' }
    ]
  },
  
  // Headers
  async headers() {
    return [
      { source: '/:path*', headers: [...] }
    ]
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: 'value',
  },
  
  // Webpack config
  webpack: (config) => {
    config.module.rules.push(...)
    return config
  },
  
  // Output (static export)
  output: 'export',
  
  // Base path
  basePath: '/docs',
  
  // i18n routing
  i18n: {
    locales: ['en', 'uk'],
    defaultLocale: 'uk',
  },
}
```

**Чому мінімальна конфігурація?**

- ✅ Next.js defaults достатньо для проєкту
- ✅ Простіше підтримувати
- ✅ Менше можливостей для помилок

### 11.2 `tsconfig.json`

**Файл:** `web/tsconfig.json`  
**Розмір:** 40 рядків

**Повний код:**

```jsonc
{
  "compilerOptions": {
    "target": "ES2022",                      // Сучасний JavaScript
    "lib": ["DOM", "ES2022"],                // Browser + ES2022 APIs
    "allowJs": false,                        // Тільки TypeScript
    "skipLibCheck": true,                    // Пропуск перевірки .d.ts
    "strict": true,                          // Сувора типізація
    "forceConsistentCasingInFileNames": true, // Case-sensitive imports
    "module": "ESNext",                      // ESM модулі
    "moduleResolution": "Bundler",           // Next.js bundler
    "resolveJsonModule": true,               // Імпорт JSON
    "esModuleInterop": true,                 // CommonJS сумісність
    "jsx": "preserve",                       // JSX для Next.js
    "incremental": true,                     // Інкрементальна компіляція
    "types": ["node"],                       // Node.js types
    "noEmit": true,                          // Не генерувати JS
    "isolatedModules": true,                 // Кожен файл - окремий модуль
    "plugins": [
      {
        "name": "next"                       // Next.js TypeScript plugin
      }
    ]
  },
  "include": [
    "next-env.d.ts",                         // Next.js types
    "**/*.ts",                               // Всі TS файли
    "**/*.tsx",                              // Всі TSX файли
    ".next/types/**/*.ts"                    // Автогенеровані types
  ],
  "exclude": [
    "node_modules"                           // Виключити залежності
  ]
}
```

**Ключові налаштування:**

#### 11.2.1 Компіляція

```jsonc
{
  "target": "ES2022",        // Генерувати ES2022 код
  "module": "ESNext",        // Використовувати ESM
  "moduleResolution": "Bundler"  // Розв'язання модулів для бандлера
}
```

**Що означає:**
- Код компілюється в сучасний JavaScript (ES2022)
- Використовується import/export замість require()
- Next.js бандлер (webpack) розв'язує імпорти

#### 11.2.2 Сувора типізація

```jsonc
{
  "strict": true,            // Увімкнути всі строгі перевірки
  "noEmit": true,            // Не генерувати .js файли
  "isolatedModules": true    // Кожен файл компілюється окремо
}
```

**strict: true включає:**

```typescript
// ❌ Помилка: Implicit any
function add(a, b) { return a + b }

// ✅ Правильно
function add(a: number, b: number): number { return a + b }

// ❌ Помилка: Null check
const user = users.find(u => u.id === 1)
user.name  // Error: Object is possibly 'undefined'

// ✅ Правильно
if (user) {
  user.name
}
```

#### 11.2.3 Next.js інтеграція

```jsonc
{
  "jsx": "preserve",         // Не компілювати JSX (робить Next.js)
  "plugins": [
    { "name": "next" }       // TypeScript plugin для Next.js
  ]
}
```

**Що робить Next.js plugin:**
- ✅ Автодоповнення для Next.js API
- ✅ Type checking для Server/Client Components
- ✅ Validation для metadata, generateStaticParams

### 11.3 `tailwind.config.cjs`

**Файл:** `web/tailwind.config.cjs`  
**Розмір:** 9 рядків

**Повний код:**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {}
  },
  plugins: []
}
```

**Пояснення:**

#### 11.3.1 Content paths

```javascript
content: [
  "./app/**/*.{js,ts,jsx,tsx}",       // App Router
  "./components/**/*.{js,ts,jsx,tsx}", // Components (legacy)
  "./pages/**/*.{js,ts,jsx,tsx}"      // Pages Router (не використовується)
]
```

**Призначення:** Вказує Tailwind де шукати класи для PurgeCSS

**Процес:**
1. Tailwind сканує файли
2. Знаходить всі класи (наприклад `text-blue-600`)
3. Генерує тільки необхідний CSS
4. Видаляє невикористані класи (tree-shaking)

**Приклад:**

```typescript
// app/page.tsx
<div className="bg-blue-500 text-white">  // ← Ці класи будуть в CSS
  Hello
</div>

// Невикористаний клас
// .bg-red-500 { ... }  ← НЕ буде в production CSS
```

#### 11.3.2 Theme extend

```javascript
theme: {
  extend: {}  // Порожньо - використовуються defaults
}
```

**Можливі кастомізації (не використовуються):**

```javascript
theme: {
  extend: {
    colors: {
      primary: '#1E40AF',
      secondary: '#64748B',
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    spacing: {
      '128': '32rem',
    }
  }
}
```

#### 11.3.3 Plugins

```javascript
plugins: []  // Немає плагінів
```

**Популярні плагіни (не використовуються):**

```javascript
plugins: [
  require('@tailwindcss/forms'),        // Форми
  require('@tailwindcss/typography'),   // Типографіка
  require('@tailwindcss/aspect-ratio'), // Aspect ratio
]
```

### 11.4 `postcss.config.cjs`

**Файл:** `web/postcss.config.cjs`  
**Розмір:** 8 рядків

**Повний код:**

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}
```

**Пояснення:**

#### 11.4.1 TailwindCSS plugin

```javascript
tailwindcss: {}  // Обробка Tailwind директив (@tailwind base, etc.)
```

**Що робить:**
1. Читає `tailwind.config.cjs`
2. Генерує CSS класи
3. Обробляє `@tailwind` директиви в `globals.css`

#### 11.4.2 Autoprefixer

```javascript
autoprefixer: {}  // Додає vendor prefixes
```

**Приклад:**

```css
/* Input */
.flex {
  display: flex;
}

/* Output (після autoprefixer) */
.flex {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}
```

**Browserlist (використовується default):**

```
> 0.5%
last 2 versions
Firefox ESR
not dead
```

### 11.5 `package.json`

**Файл:** `web/package.json`  
**Розмір:** 25 рядків

**Повний код:**

```json
{
  "name": "ehealth-portal-web",
  "version": "0.1.0",
  "private": true,
  
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  
  "dependencies": {
    "next": "14.0.0",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  },
  
  "devDependencies": {
    "autoprefixer": "10.4.14",
    "postcss": "8.4.24",
    "tailwindcss": "3.4.7",
    "typescript": "5.1.6",
    "@types/react": "18.2.28",
    "@types/node": "20.4.2"
  }
}
```

#### 11.5.1 Scripts

**Таблиця команд:**

| Команда | Призначення | Використання |
|---------|-------------|--------------|
| `npm run dev` | Development server | Локальна розробка (port 3000) |
| `npm run build` | Production build | Збірка для production |
| `npm start` | Production server | Запуск production сервера |
| `npm run lint` | ESLint | Перевірка коду на помилки |

**Детальніше:**

```bash
# Development (з hot reload)
npm run dev
# Запускає: next dev
# → http://localhost:3000
# → Автоматичний перезавантаження при змінах

# Production build
npm run build
# 1. Компіляція TypeScript
# 2. Статична генерація сторінок (SSG)
# 3. Оптимізація коду (minification)
# 4. Створення .next/ директорії

# Production server
npm start
# Запускає: next start
# → Використовує .next/ з попередньої збірки
# → http://localhost:3000
```

#### 11.5.2 Dependencies

**Production залежності:**

```json
{
  "next": "14.0.0",         // Next.js framework
  "react": "18.2.0",        // React library
  "react-dom": "18.2.0"     // React DOM renderer
}
```

**Всього:** 3 пакети (~50 MB node_modules)

**Примітка:** Мінімальний стек - тільки Next.js + React, без додаткових бібліотек.

#### 11.5.3 DevDependencies

**Development залежності:**

```json
{
  "autoprefixer": "10.4.14",      // CSS prefixes
  "postcss": "8.4.24",            // CSS preprocessor
  "tailwindcss": "3.4.7",         // CSS framework
  "typescript": "5.1.6",          // TypeScript compiler
  "@types/react": "18.2.28",      // React types
  "@types/node": "20.4.2"         // Node.js types
}
```

**Всього:** 6 пакетів (~150 MB додатково)

**Призначення:**

| Пакет | Використання |
|-------|-------------|
| `typescript` | Компіляція .ts/.tsx файлів |
| `@types/*` | Типізація для VS Code autocomplete |
| `tailwindcss` | CSS framework (build-time) |
| `postcss` | CSS обробка |
| `autoprefixer` | Vendor prefixes |

---

## 12. 🔍 ДОДАТКОВІ ТЕХНІЧНІ ДЕТАЛІ

### 12.1 Server Actions

**Статус:** ❌ Відсутні

**Що таке Server Actions?**

Server Actions - це асинхронні функції на сервері для мутації даних (Next.js 13+).

**Приклад (не використовується в проєкті):**

```typescript
// ❌ Немає в проєкті
'use server'

export async function createUser(formData: FormData) {
  const name = formData.get('name')
  await db.users.create({ name })
  revalidatePath('/users')
}

// В компоненті
<form action={createUser}>
  <input name="name" />
  <button type="submit">Create</button>
</form>
```

**Чому немає?**

Проєкт не має:
- ❌ Форм для створення/оновлення даних
- ❌ Мутацій на сервері
- ❌ Бази даних

**Весь контент статичний** (JSON + локалізації).

### 12.2 Middleware

**Статус:** ❌ Відсутній

**Файл:** `middleware.ts` (не створений)

**Що таке Middleware?**

Middleware - це функція що виконується перед кожним request.

**Приклад (не використовується):**

```typescript
// ❌ Немає в проєкті
// middleware.ts
import { NextResponse } from 'next/server'

export function middleware(request) {
  // Перенаправлення на основі locale
  const locale = request.cookies.get('NEXT_LOCALE')?.value || 'uk'
  
  if (!request.url.includes(`/${locale}`)) {
    return NextResponse.redirect(new URL(`/${locale}${request.nextUrl.pathname}`, request.url))
  }
}

export const config = {
  matcher: '/:path*'
}
```

**Чому немає?**

Локалізація реалізована через:
- ✅ Cookie (`NEXT_LOCALE`)
- ✅ Client-side hook (`useTranslations`)
- ✅ Server-side function (`getTranslations`)

**Middleware не потрібен** для поточного підходу.

### 12.3 Edge Runtime

**Статус:** ❌ Не використовується

**Що таке Edge Runtime?**

Edge Runtime - це легкий JavaScript runtime для швидкого виконання на CDN nodes.

**Приклад (не використовується):**

```typescript
// ❌ Немає в проєкті
export const runtime = 'edge'  // Замість Node.js runtime

export async function GET() {
  return new Response('Hello from edge!')
}
```

**Чому немає?**

Проєкт використовує:
- ✅ Node.js APIs (`fs.readFileSync`)
- ✅ Static generation (не потрібен runtime на edge)

**Edge Runtime обмеження:**
- ❌ Немає Node.js APIs (fs, path)
- ❌ Немає npm модулів з native bindings

### 12.4 Оптимізація зображень

**Статус:** ⚠️ Часткова

#### 12.4.1 Next.js Image Component

**Використовується:** ✅ Так

**Приклад:**

```typescript
import Image from 'next/image'

// ✅ Використовується в проєкті
<Image
  src="/images/Logo for Header.webp"
  alt="Logo"
  width={40}
  height={40}
/>

// ✅ Для динамічних зображень (fill)
<Image
  src={filePath}
  alt={title}
  fill
  className="object-cover"
  sizes="(max-width: 768px) 100vw, 33vw"
/>
```

**Переваги:**
- ✅ Автоматична оптимізація розміру
- ✅ Lazy loading за замовчуванням
- ✅ WebP/AVIF конвертація (якщо браузер підтримує)
- ✅ Responsive images через `sizes`

#### 12.4.2 Конфігурація оптимізації

**Статус:** ❌ Не налаштована (використовуються defaults)

**Defaults Next.js:**

```javascript
// next.config.js (автоматично)
{
  images: {
    formats: ['image/webp'],           // WebP за замовчуванням
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  }
}
```

#### 12.4.3 Формати зображень

**Що використовується:**

| Формат | Використання | Переваги |
|--------|-------------|----------|
| **WebP** | Основний (13 файлів) | Стиснення ~30% кращe ніж JPG |
| **SVG** | Схеми (2 файли) | Векторна графіка, масштабується |
| **PNG** | Схема БД (1 файл) | Без втрат якості |

**Розміри:**

```
Hero_ezdorovya.webp    → ~200 KB  (1920x400)
Logo for Header.webp   → ~8 KB    (200x200)
ai-ekopfo.webp         → ~15 KB   (400x400)
Model_1_maintrack.svg  → ~50 KB   (векторний)
```

### 12.5 Redirects та Rewrites

**Статус:** ❌ Відсутні

#### 12.5.1 Redirects

**Що таке?** Перенаправлення URL (301/302)

**Приклад (не використовується):**

```javascript
// next.config.js
async redirects() {
  return [
    {
      source: '/registry',          // Застаріла сторінка
      destination: '/registers',    // Нова сторінка
      permanent: true               // 301 redirect
    }
  ]
}
```

**Чому немає?**

- ✅ Немає застарілих URL для редиректу
- ✅ Структура маршрутів стабільна

#### 12.5.2 Rewrites

**Що таке?** Проксі запитів (URL залишається незмінним)

**Приклад (не використовується):**

```javascript
// next.config.js
async rewrites() {
  return [
    {
      source: '/api/external/:path*',
      destination: 'https://api.example.com/:path*'  // Proxy
    }
  ]
}
```

**Чому немає?**

- ✅ Всі API на стороні клієнта (прямі посилання)
- ✅ Немає потреби в проксі

### 12.6 Інші технічні особливості

#### 12.6.1 ISR (Incremental Static Regeneration)

**Статус:** ❌ Не використовується

```typescript
// ❌ Немає в проєкті
export const revalidate = 60  // Регенерувати кожні 60 секунд
```

**Чому немає?**
- Дані не змінюються часто (статичний контент)

#### 12.6.2 Dynamic Routes з Catch-all

**Статус:** ❌ Не використовується

```typescript
// ❌ Немає в проєкті
// app/docs/[...slug]/page.tsx  → /docs/a/b/c
```

**Що є:**
```typescript
// ✅ Використовується
// app/registers/[slug]/page.tsx  → /registers/ekopfo
```

#### 12.6.3 Parallel Routes

**Статус:** ❌ Не використовується

```typescript
// ❌ Немає в проєкті
// app/@modal/page.tsx
```

#### 12.6.4 Route Groups

**Статус:** ❌ Не використовується

```typescript
// ❌ Немає в проєкті
// app/(marketing)/about/page.tsx
```

---

## 📊 ПІДСУМКОВА СТАТИСТИКА АРХІТЕКТУРИ

### Технічний стек

| Компонент | Версія | Призначення |
|-----------|--------|-------------|
| **Next.js** | 14.0.0 | React framework (App Router) |
| **React** | 18.2.0 | UI library |
| **TypeScript** | 5.1.6 | Type safety |
| **TailwindCSS** | 3.4.7 | CSS framework |

### Файлова структура

| Категорія | Кількість |
|-----------|-----------|
| **Сторінки (page.tsx)** | 11 статичних + 7 динамічних = 18 |
| **Компоненти** | 7 файлів (~450 рядків) |
| **API Routes** | 1 файл |
| **Конфігурації** | 6 файлів |
| **Локалізації** | 2 файли (357 рядків кожен) |
| **Зображення** | 15+ файлів |
| **Документи** | 29 файлів |

### Інтеграції

| Сервіс | Метод | Кількість |
|--------|-------|-----------|
| **Instatus** | iframe | 7 реєстрів |
| **Jira ServiceDesk** | External link | 7 порталів |
| **NotebookLM** | External link | 7 notebooks |

### Конфігурації

| Файл | Рядків | Складність |
|------|--------|------------|
| `next.config.js` | 6 | Мінімальна |
| `tsconfig.json` | 40 | Стандартна |
| `tailwind.config.cjs` | 9 | Мінімальна |
| `postcss.config.cjs` | 8 | Мінімальна |
| `package.json` | 25 | Мінімальна |

### Особливості архітектури

| Функція | Статус |
|---------|--------|
| Server Components | ✅ Використовуються |
| Client Components | ✅ Використовуються |
| API Routes | ✅ 1 route |
| Server Actions | ❌ Відсутні |
| Middleware | ❌ Відсутній |
| Edge Runtime | ❌ Не використовується |
| ISR | ❌ Не використовується |
| Image Optimization | ✅ Next/Image |
| Redirects | ❌ Відсутні |
| Rewrites | ❌ Відсутні |

---

**Дата створення:** 12 грудня 2025  
**Версія проєкту:** 0.1.0  
**Архітектура:** Next.js 14 App Router + Static Generation
