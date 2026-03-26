# 📋 ПАСПОРТ САЙТУ
## Розділ 4: Опис сторінок сайту (Частина 3.A)

---

## 4.3. 📄 СТОРІНКИ ОКРЕМИХ РЕЄСТРІВ (Registry Detail Pages) — Частина 1

### 4.3.1 Призначення сторінок `/registers/[slug]`

#### 4.3.1.1 Роль у структурі сайту

**URL Pattern:** `/registers/[slug]`  
**Файл:** `web/app/registers/[slug]/page.tsx`  
**Тип:** Server Component (SSG - Static Site Generation)

**Динамічні маршрути:**

```yaml
Generated Pages (7 total):
  - /registers/ekopfo
  - /registers/endoprosthesis
  - /registers/internatura
  - /registers/vacancies
  - /registers/bpr
  - /registers/ekrov
  - /registers/sen-ikp

Each page is unique but uses the same template
```

**Основна роль:**

```yaml
Primary Purpose:
  - Детальна інформація про конкретний реєстр
  - Доступ до аналітичних модулів (NotebookLM)
  - Посилання на підтримку користувачів
  - Статус моніторинг системи (Instatus iframe)

Secondary Purpose:
  - SEO-оптимізовані сторінки для кожного реєстру
  - Централізований доступ до документації
  - FAQ та інструкції користувачів
```

**Місце в ієрархії:**

```
Site Hierarchy:
┌─────────────────────────────────────────────┐
│          / (Home Page)                      │
│                 │                            │
│    ┌────────────┼────────────┐              │
│    │            │            │              │
│    ▼            ▼            ▼              │
│  /registers  /documentation  /about         │
│    │                                         │
│    ├─ /registers (Status Dashboard)         │
│    │                                         │
│    └─ /registers/[slug] ← Ви тут            │
│       ==================                     │
│       ├─ /registers/ekopfo                  │
│       │  - ЕКОПФО деталі                    │
│       │  - NotebookLM аналітика             │
│       │  - Helpdesk посилання               │
│       │  - Instatus iframe                  │
│       │                                      │
│       ├─ /registers/endoprosthesis          │
│       │  - Ендопротезування деталі          │
│       │  - NotebookLM аналітика             │
│       │  - Helpdesk посилання               │
│       │  - Instatus iframe                  │
│       │                                      │
│       └─ ... (5 more registries)            │
└─────────────────────────────────────────────┘
```

#### 4.3.1.2 Задачі для користувачів

**User Story 1: Дослідження реєстру через AI-аналітику**

```
As a: Новий користувач системи
I want to: Вивчити як працює ЕКОПФО
So that: Я можу ефективно користуватися системою

User Journey:
1. Переходить з Home Page → /registers/ekopfo
2. Бачить опис реєстру
3. Клікає на "Аналітичний ШІ по модулю ЕКОПФО"
4. Відкривається NotebookLM (Google)
5. Ставить питання AI про функціонал системи
6. Отримує інтелектуальні відповіді з документації
```

**User Story 2: Звернення до підтримки**

```
As a: Користувач з проблемою
I want to: Створити тікет у Helpdesk
So that: Я можу отримати технічну підтримку

User Journey:
1. Відкриває /registers/ekopfo
2. Прокручує до секції "Підтримка користувачів"
3. Читає FAQ (якщо є)
4. Клікає на посилання Helpdesk
5. Переходить на Atlassian Service Desk
6. Створює заявку на підтримку
```

**User Story 3: Перевірка статусу системи**

```
As a: IT адміністратор
I want to: Перевірити поточний статус ЕКОПФО
So that: Я можу діагностувати проблеми

User Journey:
1. Відкриває /registers/ekopfo
2. Прокручує до секції "Статус системи"
3. Переглядає Instatus iframe
4. Бачить реальний статус (🟢 Operational / 🟠 Degraded / 🔴 Outage)
5. Перевіряє історію інцидентів
6. Читає деталі поточних проблем (якщо є)
```

**Типові завдання:**

| Задача | Частота | Інструмент на сторінці |
|--------|---------|------------------------|
| **Навчання роботі з системою** | Щотижня | NotebookLM AI модуль |
| **Звернення до підтримки** | При проблемах | Helpdesk посилання + FAQ |
| **Перевірка статусу** | Щодня | Instatus iframe |
| **Пошук документації** | Рідко | Посилання на інструкції (якщо є) |

### 4.3.2 Структура файлу `app/registers/[slug]/page.tsx`

#### 4.3.2.1 Тип компонента

**Server Component (React Server Component):**

```typescript
// app/registers/[slug]/page.tsx
// NO "use client" directive → Server Component

export default async function RegisterDetail({ 
  params 
}: { 
  params: { slug: string } 
}) {
  // ✅ Server-side only execution
  // ✅ Access to params.slug from URL
  // ✅ Can use async/await at component level
  // ✅ Direct access to notebooks.json
  
  const item = notebooks.find(n => n.slug === params.slug)
  const t = await getTranslations(locale)
  
  return (/* JSX */)
}
```

**Переваги Server Component для dynamic routes:**

```yaml
Performance:
  - HTML generated at build time for all slugs
  - No runtime data fetching
  - Instant page load from CDN
  - SEO-friendly (fully rendered HTML)

Flexibility:
  - Access to file system (import notebooks.json)
  - Direct data filtering (find by slug)
  - No API routes needed
  - Type-safe params

Security:
  - No secrets exposed to client
  - Server-side validation of slug
  - Safe data filtering
```

#### 4.3.2.2 Анатомія файлу

**Повна структура файлу:**

```typescript
// ============================================
// IMPORTS
// ============================================
import notebooks from "../../../config/notebooks.json"  // Direct JSON import
import Image from 'next/image'                          // Next.js Image
import { cookies } from 'next/headers'                  // Server API
import { getTranslations } from '../../../lib/i18n'     // Custom i18n
import { UserSupportContent } from '../../components/UserSupportContent'  // Client Component

// ============================================
// TYPE DEFINITIONS
// ============================================
type NotebookItem = {
  slug: string              // URL identifier (e.g., "ekopfo")
  title: string             // Display title
  description?: string      // Optional full description
  statusUrl?: string        // Optional Instatus iframe URL
  links?: {                 // Optional external links
    label: string
    url: string
    image?: string
  }[]
  instructions?: string[]   // Optional instruction URLs
}

// ============================================
// STATIC PARAMS GENERATION (SSG)
// ============================================
export function generateStaticParams() {
  // Convert notebooks.json to array of params
  const items = Array.isArray(notebooks) ? (notebooks as NotebookItem[]) : []
  
  // Map to { slug: "..." } objects
  return items.map((n) => ({ slug: n.slug }))
  //    ↑ Next.js will generate static pages for each slug
  
  // Result: [
  //   { slug: "ekopfo" },
  //   { slug: "endoprosthesis" },
  //   { slug: "internatura" },
  //   { slug: "vacancies" },
  //   { slug: "bpr" },
  //   { slug: "ekrov" },
  //   { slug: "sen-ikp" }
  // ]
}

// ============================================
// PAGE COMPONENT (Server Component)
// ============================================
export default async function RegisterDetail({ 
  params 
}: { 
  params: { slug: string } 
}) {
  // 1. Load locale from cookie
  const c = cookies().get('NEXT_LOCALE')
  const locale = c?.value ?? 'uk'
  
  // 2. Load translations
  const t = await getTranslations(locale)
  
  // 3. Load notebooks data
  const items = Array.isArray(notebooks) ? (notebooks as NotebookItem[]) : []
  
  // 4. Find item by slug
  const item = items.find((n) => n.slug === params.slug)
  //           ↑ Find registry matching URL slug
  
  // 5. Handle not found case
  if (!item) {
    return (
      <main style={{ padding: "24px" }}>
        <h1>{t.registryPage?.notFound || 'Реєстр не знайдено'}</h1>
        <p>{t.registryPage?.checkSlug || 'Перевірте, що slug існує...'}</p>
      </main>
    )
  }
  
  // 6. Get translated content
  const translatedTitle = t.registryCards?.[item.slug] || item.title
  const registryDetails = t.registryDetails?.[item.slug]
  const translatedDescription = registryDetails?.description || item.description
  const translatedCommentary = registryDetails?.commentary || ''
  const translatedAnalyticsTitle = registryDetails?.analyticsTitle || ''
  const userSupportText = registryDetails?.userSupportText
  
  // 7. Render JSX
  return (
    <>
      {/* Hero Banner */}
      <div className="w-full h-32 bg-cover bg-top relative" {...}>
        <h1>{translatedTitle}</h1>
      </div>
      
      {/* Main Content */}
      <main style={{ padding: "24px" }}>
        {/* Description */}
        {translatedDescription && <p>{translatedDescription}</p>}
        
        {/* Links Grid */}
        <section style={{ display: "grid", ... }}>
          {(item.links || []).map((link, index) => (
            <div key={link.url}>
              {/* Link Card with Image */}
              <a href={link.url}>{translatedLabel}</a>
              {link.image && <Image src={link.image} {...} />}
              
              {/* Conditional Content */}
              {isAnalytics && translatedCommentary && <p>{translatedCommentary}</p>}
              {isSupport && userSupportText && <UserSupportContent {...} />}
            </div>
          ))}
        </section>
        
        {/* Status Iframe */}
        {item.statusUrl && (
          <section>
            <h2>{t.registers?.statusIframe || 'Статус системи'}</h2>
            <iframe src={item.statusUrl} />
          </section>
        )}
        
        {/* Instructions */}
        {item.instructions && (
          <section>
            <h2>{t.registryPage?.instructions || 'Інструкції'}</h2>
            <ul>
              {item.instructions.map(href => <li><a href={href}>{href}</a></li>)}
            </ul>
          </section>
        )}
      </main>
    </>
  )
}
```

#### 4.3.2.3 Основні секції сторінки

**Логічне розділення:**

```
RegisterDetail Component
├─ Hero Banner Section
│  ├─ Background image (Hero_ezdorovya.webp)
│  ├─ Dark overlay (bg-black/20)
│  └─ Registry title (h1: translated title)
│
└─ Main Content (<main>)
   ├─ Description Section
   │  └─ Paragraph with registry description
   │
   ├─ Links Grid Section
   │  ├─ Grid container (auto-fit, minmax(320px, 1fr))
   │  └─ Link Cards (2-3 cards typically)
   │     ├─ Card 1: Analytics Module (NotebookLM)
   │     │  ├─ Link to NotebookLM
   │     │  ├─ Image (384x384)
   │     │  └─ Commentary text
   │     │
   │     └─ Card 2: User Support (Helpdesk)
   │        ├─ Link to Helpdesk
   │        ├─ Image (320x320)
   │        └─ UserSupportContent component
   │           ├─ FAQ section
   │           ├─ Chat links
   │           └─ Form links
   │
   ├─ Status Iframe Section (if statusUrl exists)
   │  ├─ Section title (h2: "Статус системи")
   │  └─ Iframe (70vh height)
   │
   └─ Instructions Section (if instructions exist)
      ├─ Section title (h2: "Інструкції")
      └─ List of links
```

**Візуальна структура:**

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │         HERO BANNER (h-32)                      │   │
│  │  ┌───────────────────────────────────────────┐  │   │
│  │  │  Background: Hero_ezdorovya.webp          │  │   │
│  │  │  ┌─────────────────────────────────────┐  │  │   │
│  │  │  │  ЕКОПФО (h1, text-5xl)             │  │  │   │
│  │  │  └─────────────────────────────────────┘  │  │   │
│  │  └───────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │    MAIN CONTENT (padding: 24px)                │   │
│  │  ┌───────────────────────────────────────────┐  │   │
│  │  │ Description (p)                           │  │   │
│  │  │ "Надані документи описують систему..."    │  │   │
│  │  └───────────────────────────────────────────┘  │   │
│  │                                                 │   │
│  │  ┌───────────────────────────────────────────┐  │   │
│  │  │     LINKS GRID (auto-fit)                 │  │   │
│  │  │  ┌─────────────────┐ ┌─────────────────┐ │  │   │
│  │  │  │ Analytics Card  │ │ Support Card    │ │  │   │
│  │  │  │ ┌─────────────┐ │ │ ┌─────────────┐ │ │  │   │
│  │  │  │ │ NotebookLM  │ │ │ │ Helpdesk    │ │ │  │   │
│  │  │  │ │ Link        │ │ │ │ Link        │ │ │  │   │
│  │  │  │ └─────────────┘ │ │ └─────────────┘ │ │  │   │
│  │  │  │ ┌─────────────┐ │ │ ┌─────────────┐ │ │  │   │
│  │  │  │ │ Image       │ │ │ │ Image       │ │ │  │   │
│  │  │  │ │ 384x384     │ │ │ │ 320x320     │ │ │  │   │
│  │  │  │ └─────────────┘ │ │ └─────────────┘ │ │  │   │
│  │  │  │ Commentary text │ │ FAQ + Links     │ │  │   │
│  │  │  └─────────────────┘ └─────────────────┘ │  │   │
│  │  └───────────────────────────────────────────┘  │   │
│  │                                                 │   │
│  │  ┌───────────────────────────────────────────┐  │   │
│  │  │     STATUS IFRAME SECTION                 │  │   │
│  │  │  ┌─────────────────────────────────────┐  │  │   │
│  │  │  │  Статус системи (h2)                │  │  │   │
│  │  │  └─────────────────────────────────────┘  │  │   │
│  │  │  ┌─────────────────────────────────────┐  │  │   │
│  │  │  │  ┌───────────────────────────────┐  │  │  │   │
│  │  │  │  │ <iframe> (70vh)               │  │  │  │   │
│  │  │  │  │ Instatus widget               │  │  │  │   │
│  │  │  │  └───────────────────────────────┘  │  │  │   │
│  │  │  └─────────────────────────────────────┘  │  │   │
│  │  └───────────────────────────────────────────┘  │   │
│  │                                                 │   │
│  │  ┌───────────────────────────────────────────┐  │   │
│  │  │     INSTRUCTIONS SECTION (optional)       │  │   │
│  │  │  ┌─────────────────────────────────────┐  │  │   │
│  │  │  │  Інструкції (h2)                    │  │  │   │
│  │  │  └─────────────────────────────────────┘  │  │   │
│  │  │  • Link 1                                │  │   │
│  │  │  • Link 2                                │  │   │
│  │  └───────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 4.3.3 Логіка маршрутизації

#### 4.3.3.1 Як працює динамічний маршрут `[slug]`

**Folder Structure:**

```
app/
└─ registers/
   ├─ page.tsx               ← /registers (status dashboard)
   └─ [slug]/                ← Dynamic route segment
      └─ page.tsx            ← /registers/[slug]
```

**Next.js Dynamic Routes:**

```yaml
Folder Name Pattern:
  [slug]          → Dynamic segment (matches any value)
  [id]            → Dynamic segment (matches any value)
  [...slug]       → Catch-all segment (matches multiple segments)
  [[...slug]]     → Optional catch-all segment

Our Case:
  [slug]/page.tsx → Matches single segment after /registers/
  
  Examples:
    /registers/ekopfo           ✅ Matches (slug = "ekopfo")
    /registers/endoprosthesis   ✅ Matches (slug = "endoprosthesis")
    /registers/abc123           ✅ Matches (slug = "abc123")
    /registers/ekopfo/extra     ❌ Does NOT match (too many segments)
```

**Params object:**

```typescript
// Next.js automatically provides params to the component
export default async function RegisterDetail({ 
  params 
}: { 
  params: { slug: string } 
}) {
  // params object structure:
  // { slug: "ekopfo" }        ← from URL /registers/ekopfo
  // { slug: "internatura" }   ← from URL /registers/internatura
  
  console.log(params.slug)
  // Output: "ekopfo" (for /registers/ekopfo)
}
```

**Slug validation:**

```typescript
// Find registry by slug
const item = items.find((n) => n.slug === params.slug)

// Scenario 1: Valid slug
// URL: /registers/ekopfo
// params.slug = "ekopfo"
// item = { slug: "ekopfo", title: "ЕКОПФО", ... } ✅

// Scenario 2: Invalid slug (not in notebooks.json)
// URL: /registers/invalid-slug
// params.slug = "invalid-slug"
// item = undefined ❌
//   → Shows "Реєстр не знайдено" error page

// Scenario 3: Typo in slug
// URL: /registers/ekopfoo (typo: extra 'o')
// params.slug = "ekopfoo"
// item = undefined ❌
//   → Shows error (404-like behavior)
```

#### 4.3.3.2 Формування URL

**URL Construction:**

```typescript
// From Home Page cards:
<Link href={`/registers/${r.slug}`}>
  {/* r.slug = "ekopfo" */}
  {/* Generated href: "/registers/ekopfo" */}
</Link>

// From Header dropdown:
registries.map(r => (
  <Link href={`/registers/${r.slug}`}>
    {getRegistryTitle(r)}
  </Link>
))
// Examples:
// href="/registers/ekopfo"
// href="/registers/endoprosthesis"
// href="/registers/internatura"
```

**URL Examples:**

```yaml
ЕКОПФО:
  slug: "ekopfo"
  URL: /registers/ekopfo
  Full URL: https://ehealth-portal.vercel.app/registers/ekopfo

Ендопротезування:
  slug: "endoprosthesis"
  URL: /registers/endoprosthesis
  Full URL: https://ehealth-portal.vercel.app/registers/endoprosthesis

Інтернатура:
  slug: "internatura"
  URL: /registers/internatura
  Full URL: https://ehealth-portal.vercel.app/registers/internatura

Вакансії:
  slug: "vacancies"
  URL: /registers/vacancies
  Full URL: https://ehealth-portal.vercel.app/registers/vacancies

БПР:
  slug: "bpr"
  URL: /registers/bpr
  Full URL: https://ehealth-portal.vercel.app/registers/bpr

е-Кров:
  slug: "ekrov"
  URL: /registers/ekrov
  Full URL: https://ehealth-portal.vercel.app/registers/ekrov

СЕН ІКП:
  slug: "sen-ikp"
  URL: /registers/sen-ikp
  Full URL: https://ehealth-portal.vercel.app/registers/sen-ikp
```

**Slug Rules:**

```yaml
Valid Slug Format:
  - Lowercase letters: ✅ a-z
  - Numbers: ✅ 0-9
  - Hyphens: ✅ -
  - No spaces: ❌
  - No special chars: ❌ @, #, $, etc.

Examples:
  "ekopfo"           ✅ Valid
  "sen-ikp"          ✅ Valid (hyphen allowed)
  "bpr"              ✅ Valid
  "Ekopfo"           ⚠️ Works but not recommended (case-sensitive)
  "ekopfo_new"       ⚠️ Works but underscore unusual
  "ekopfo system"    ❌ Invalid (space breaks URL)
```

### 4.3.4 Робота `generateStaticParams()`

#### 4.3.4.1 Генерація статичних сторінок

**Функція generateStaticParams:**

```typescript
export function generateStaticParams() {
  // 1. Load notebooks.json
  const items = Array.isArray(notebooks) ? (notebooks as NotebookItem[]) : []
  //    notebooks is imported directly from JSON file
  //    Result: Array of 7 registries
  
  // 2. Map to params format
  return items.map((n) => ({ slug: n.slug }))
  //    ↑ Transform to array of { slug: "..." } objects
  
  // 3. Result (returned to Next.js):
  // [
  //   { slug: "ekopfo" },
  //   { slug: "endoprosthesis" },
  //   { slug: "internatura" },
  //   { slug: "vacancies" },
  //   { slug: "bpr" },
  //   { slug: "ekrov" },
  //   { slug: "sen-ikp" }
  // ]
}
```

**Next.js Build Process:**

```
Build Time (npm run build):
┌─────────────────────────────────────────────────┐
│  1. Next.js finds dynamic route: [slug]         │
│     ↓                                            │
│  2. Calls generateStaticParams()                │
│     ├─ Imports notebooks.json                   │
│     ├─ Maps to { slug: "..." } array            │
│     └─ Returns 7 param objects                  │
│     ↓                                            │
│  3. Next.js generates 7 static pages            │
│     ├─ /registers/ekopfo                        │
│     │  └─ Calls RegisterDetail({ params: { slug: "ekopfo" } })
│     │  └─ Generates HTML → .next/server/app/registers/ekopfo.html
│     │                                            │
│     ├─ /registers/endoprosthesis                │
│     │  └─ Calls RegisterDetail({ params: { slug: "endoprosthesis" } })
│     │  └─ Generates HTML                        │
│     │                                            │
│     ├─ /registers/internatura                   │
│     │  └─ Generates HTML                        │
│     │                                            │
│     ├─ /registers/vacancies                     │
│     ├─ /registers/bpr                           │
│     ├─ /registers/ekrov                         │
│     └─ /registers/sen-ikp                       │
│     ↓                                            │
│  4. All 7 pages pre-rendered and ready          │
│     └─ Deployed to Vercel CDN                   │
└─────────────────────────────────────────────────┘

Production Request:
┌─────────────────────────────────────────────────┐
│  User visits: /registers/ekopfo                 │
│     ↓                                            │
│  Vercel serves pre-generated HTML               │
│     └─ No generateStaticParams() call ✅        │
│     └─ No RegisterDetail() execution ✅         │
│     └─ Instant response (~50ms) ✅              │
└─────────────────────────────────────────────────┘
```

#### 4.3.4.2 Використання даних з `notebooks.json`

**Direct JSON Import:**

```typescript
// Top of file
import notebooks from "../../../config/notebooks.json"

// notebooks is a JavaScript array (parsed automatically)
// Type: NotebookItem[]
// Length: 7

// Example data:
// [
//   {
//     "slug": "ekopfo",
//     "title": "ЕКОПФО",
//     "description": "...",
//     "statusUrl": "https://ekoppho.instatus.com",
//     "links": [...]
//   },
//   ...
// ]
```

**Type Safety:**

```typescript
type NotebookItem = {
  slug: string
  title: string
  description?: string      // Optional
  statusUrl?: string        // Optional
  links?: {                 // Optional
    label: string
    url: string
    image?: string          // Optional
  }[]
  instructions?: string[]   // Optional
}

// Type assertion
const items = Array.isArray(notebooks) 
  ? (notebooks as NotebookItem[]) 
  : []
//    ↑ Ensures TypeScript knows the type
```

**Data Flow:**

```
notebooks.json (file on disk)
      ↓ import (build time)
JavaScript array (notebooks)
      ↓ generateStaticParams()
Array of { slug: "..." } (7 items)
      ↓ Next.js build
7 static HTML pages
      ↓ Production
Served from CDN (instant)
```

**Advantages of generateStaticParams:**

```yaml
Performance:
  - All pages pre-rendered at build time
  - No runtime data fetching
  - Instant page loads (CDN)
  - SEO-friendly (full HTML)

Scalability:
  - Add new registry: just update notebooks.json
  - Next build automatically generates new page
  - No code changes needed

Type Safety:
  - TypeScript validates slugs at build time
  - Invalid data fails build (not production)
  - Compile-time checks
```

### 4.3.5 ASCII схема структури сторінки

**Компактна DOM-структура:**

```
RegisterDetail (Server Component)
│
├─ Hero Banner Section
│  └─ <div className="w-full h-32 bg-cover...">
│     └─ <div className="absolute inset-0 bg-black/20...">
│        └─ <h1 className="text-5xl font-bold text-white...">
│           └─ {translatedTitle}  "ЕКОПФО"
│
└─ Main Content (<main style={{padding: "24px"}}>)
   │
   ├─ Description
   │  └─ <p style={{marginBottom: 24, fontSize: '1.1rem', ...}}>
   │     └─ {translatedDescription}
   │
   ├─ Links Grid Section
   │  └─ <section style={{display: "grid", ...}}>
   │     └─ {(item.links || []).map((link, index) => (...))}
   │        │
   │        └─ Link Card (x2-3)
   │           └─ <div key={link.url} style={{...}}>
   │              │
   │              ├─ Link
   │              │  └─ <a href={link.url} target="_blank">
   │              │     └─ <span>{translatedLabel}</span>
   │              │
   │              ├─ Image (if link.image)
   │              │  └─ <a href={link.url}>
   │              │     └─ <Image src={link.image} width={imgSize} height={imgSize} />
   │              │
   │              ├─ Analytics Commentary (if isAnalytics)
   │              │  └─ <p>{translatedCommentary}</p>
   │              │
   │              └─ User Support Content (if isSupport)
   │                 └─ <UserSupportContent userSupportText={userSupportText} />
   │                    ├─ FAQ items
   │                    ├─ Chat links
   │                    └─ Form links
   │
   ├─ Status Iframe Section (if item.statusUrl)
   │  └─ <section style={{marginTop: 32, ...}}>
   │     ├─ Title
   │     │  └─ <h2>{t.registers?.statusIframe || 'Статус системи'}</h2>
   │     │
   │     └─ Iframe Container
   │        └─ <div style={{height: '70vh', minHeight: '400px', ...}}>
   │           └─ <iframe 
   │                 src={item.statusUrl}
   │                 style={{width: '100%', height: '100%'}}
   │                 title={`${translatedTitle} - Статус системи`}
   │              />
   │
   └─ Instructions Section (if item.instructions)
      └─ <section style={{marginTop: 24}}>
         ├─ Title
         │  └─ <h2>{t.registryPage?.instructions || 'Інструкції'}</h2>
         │
         └─ List
            └─ <ul>
               └─ {item.instructions.map(href => (
                  <li key={href}>
                    <a href={href} target="_blank">{href}</a>
                  </li>
               ))}
```

**Візуальна схема з компонентами:**

```
┌────────────────────────────────────────────────────────────────────┐
│  ROOT LAYOUT (app/layout.tsx)                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  <html lang="uk">                                            │  │
│  │  <body className="min-h-screen flex flex-col">               │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │  <Header /> (Client Component)                         │  │  │
│  │  │  ├─ Logo + Site Title                                  │  │  │
│  │  │  ├─ Navigation                                         │  │  │
│  │  │  │  └─ Реєстри → Dropdown                             │  │  │
│  │  │  │     └─ "ЕКОПФО" (active) ← Current page            │  │  │
│  │  │  └─ Language Switcher                                  │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  │                                                              │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │  {children} ← RegisterDetail inserted here             │  │  │
│  │  │  ┌──────────────────────────────────────────────────┐  │  │  │
│  │  │  │  REGISTER DETAIL (app/registers/[slug]/page.tsx) │  │  │  │
│  │  │  │  ┌────────────────────────────────────────────┐  │  │  │  │
│  │  │  │  │  HERO BANNER (h-32)                        │  │  │  │  │
│  │  │  │  │  ┌──────────────────────────────────────┐  │  │  │  │  │
│  │  │  │  │  │  Background: Hero_ezdorovya.webp     │  │  │  │  │  │
│  │  │  │  │  │  ┌────────────────────────────────┐  │  │  │  │  │  │
│  │  │  │  │  │  │  <h1> ЕКОПФО                   │  │  │  │  │  │  │
│  │  │  │  │  │  └────────────────────────────────┘  │  │  │  │  │  │
│  │  │  │  │  └──────────────────────────────────────┘  │  │  │  │  │
│  │  │  │  └────────────────────────────────────────────┘  │  │  │  │
│  │  │  │  ┌────────────────────────────────────────────┐  │  │  │  │
│  │  │  │  │  MAIN CONTENT (padding: 24px)              │  │  │  │  │
│  │  │  │  │  ┌──────────────────────────────────────┐  │  │  │  │  │
│  │  │  │  │  │  Description (p)                     │  │  │  │  │  │
│  │  │  │  │  └──────────────────────────────────────┘  │  │  │  │  │
│  │  │  │  │  ┌──────────────────────────────────────┐  │  │  │  │  │
│  │  │  │  │  │  LINKS GRID (auto-fit columns)       │  │  │  │  │  │
│  │  │  │  │  │  ┌────────────┐ ┌────────────┐       │  │  │  │  │  │
│  │  │  │  │  │  │ Analytics  │ │ Support    │       │  │  │  │  │  │
│  │  │  │  │  │  │ Card       │ │ Card       │       │  │  │  │  │  │
│  │  │  │  │  │  │ ┌────────┐ │ │ ┌────────┐ │       │  │  │  │  │  │
│  │  │  │  │  │  │ │NotebLM │ │ │ │Helpdesk│ │       │  │  │  │  │  │
│  │  │  │  │  │  │ │Link    │ │ │ │Link    │ │       │  │  │  │  │  │
│  │  │  │  │  │  │ └────────┘ │ │ └────────┘ │       │  │  │  │  │  │
│  │  │  │  │  │  │ ┌────────┐ │ │ ┌────────┐ │       │  │  │  │  │  │
│  │  │  │  │  │  │ │Image   │ │ │ │Image   │ │       │  │  │  │  │  │
│  │  │  │  │  │  │ │384x384 │ │ │ │320x320 │ │       │  │  │  │  │  │
│  │  │  │  │  │  │ └────────┘ │ │ └────────┘ │       │  │  │  │  │  │
│  │  │  │  │  │  │ Commentary │ │ FAQ        │       │  │  │  │  │  │
│  │  │  │  │  │  │ text       │ │ + Links    │       │  │  │  │  │  │
│  │  │  │  │  │  └────────────┘ └────────────┘       │  │  │  │  │  │
│  │  │  │  │  └──────────────────────────────────────┘  │  │  │  │  │
│  │  │  │  │  ┌──────────────────────────────────────┐  │  │  │  │  │
│  │  │  │  │  │  STATUS IFRAME SECTION               │  │  │  │  │  │
│  │  │  │  │  │  ┌────────────────────────────────┐  │  │  │  │  │  │
│  │  │  │  │  │  │ Статус системи (h2)            │  │  │  │  │  │  │
│  │  │  │  │  │  └────────────────────────────────┘  │  │  │  │  │  │
│  │  │  │  │  │  ┌────────────────────────────────┐  │  │  │  │  │  │
│  │  │  │  │  │  │ ┌────────────────────────────┐ │  │  │  │  │  │  │
│  │  │  │  │  │  │ │ <iframe> (70vh)            │ │  │  │  │  │  │  │
│  │  │  │  │  │  │ │ Instatus widget            │ │  │  │  │  │  │  │
│  │  │  │  │  │  │ │ 🟢 Operational             │ │  │  │  │  │  │  │
│  │  │  │  │  │  │ └────────────────────────────┘ │  │  │  │  │  │  │
│  │  │  │  │  │  └────────────────────────────────┘  │  │  │  │  │  │
│  │  │  │  │  └──────────────────────────────────────┘  │  │  │  │  │
│  │  │  │  │  ┌──────────────────────────────────────┐  │  │  │  │  │
│  │  │  │  │  │  INSTRUCTIONS (optional)             │  │  │  │  │  │
│  │  │  │  │  │  • Link 1                            │  │  │  │  │  │
│  │  │  │  │  │  • Link 2                            │  │  │  │  │  │
│  │  │  │  │  └──────────────────────────────────────┘  │  │  │  │  │
│  │  │  │  └────────────────────────────────────────────┘  │  │  │  │
│  │  │  └──────────────────────────────────────────────────┘  │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  │                                                              │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │  <Footer /> (Client Component)                         │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  │  </body>                                                     │  │
│  │  </html>                                                     │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
```

---

**Дата створення:** 13 грудня 2025  
**Файл:** `app/registers/[slug]/page.tsx`  
**Тип компонента:** Server Component (SSG)  
**URL Pattern:** `/registers/[slug]`  
**Кількість сторінок:** 7 (згенеровано через generateStaticParams)  
**Dynamic Routing:** ✅ Next.js App Router
**Static Generation:** ✅ Build-time pre-rendering
