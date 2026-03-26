# 📋 ПАСПОРТ САЙТУ
## Розділ 4: Опис сторінок сайту (Частина 2.A)

---

## 4.2. 📊 СТОРІНКА «РЕЄСТРИ» (Registers Page) — Частина 1

### 4.2.1 Призначення сторінки

#### 4.2.1.1 Роль у структурі сайту

**URL:** `/registers`  
**Файл:** `web/app/registers/page.tsx`  
**Тип:** Server Component (SSG - Static Site Generation)

**Основна роль:**

```yaml
Primary Purpose:
  - Моніторинг статусів медичних реєстрів
  - Централізована панель (dashboard) для перегляду uptime
  - Real-time відображення доступності систем

Secondary Purpose:
  - Швидкий доступ до статусу кожного реєстру
  - Візуальна індикація проблем (якщо є)
  - Технічна прозорість для користувачів
```

**Місце в ієрархії:**

```
Site Hierarchy:
┌─────────────────────────────────────────┐
│          / (Home Page)                  │
│                 │                        │
│    ┌────────────┼────────────┐          │
│    │            │            │          │
│    ▼            ▼            ▼          │
│  /registers  /documentation  /about     │  ← Ви тут
│  ==========                              │
│    │                                     │
│    ├─ Status Dashboard (current page)   │
│    │                                     │
│    └─ /registers/[slug]                 │
│       ├─ /registers/ekopfo               │
│       ├─ /registers/endoprosthesis       │
│       └─ ... (7 детальних сторінок)     │
└─────────────────────────────────────────┘
```

**Відмінності від Home Page:**

| Аспект | Home Page (`/`) | Registers Page (`/registers`) |
|--------|----------------|-------------------------------|
| **Мета** | Навігація до реєстрів | Моніторинг статусів |
| **Контент** | Картки з посиланнями | Status iframes |
| **Інтеракція** | Клік → перехід | Перегляд статусу |
| **Оновлення** | Статичний | Real-time (через iframe) |

#### 4.2.1.2 Задачі для користувачів

**User Story 1: Перевірка доступності системи**

```
As a: Медичний працівник
I want to: Перевірити чи працює ЕКОПФО
So that: Я можу планувати роботу з пацієнтами

User Journey:
1. Відкриває /registers
2. Бачить grid статусів
3. Знаходить "ЕКОПФО"
4. Перевіряє статус (🟢 All Systems Operational)
5. Впевнений, що може працювати
```

**User Story 2: Моніторинг проблем**

```
As a: IT адміністратор
I want to: Побачити які системи мають проблеми
So that: Я можу швидко реагувати на інциденти

User Journey:
1. Відкриває /registers
2. Сканує всі статуси
3. Бачить 🟠 Partial Outage на "е-Кров"
4. Відкриває детальний iframe
5. Читає деталі інциденту
```

**User Story 3: Історичний аналіз uptime**

```
As a: Менеджер проєкту
I want to: Побачити uptime statistics за останній місяць
So that: Я можу звітувати про надійність систем

User Journey:
1. Відкриває /registers
2. Переглядає iframe для "Інтернатура"
3. Бачить uptime graphs (через Instatus)
4. Копіює metrics для звіту
```

**Типові завдання:**

| Задача | Частота | Інструмент |
|--------|---------|-----------|
| **Швидка перевірка статусу** | Щодня | Grid view всіх систем |
| **Детальний аналіз проблеми** | При інцидентах | Iframe з Instatus |
| **Uptime моніторинг** | Щотижня | Графіки в iframe |
| **Планування maintenance** | Щомісяця | Scheduled maintenance info |

### 4.2.2 Структура файлу `app/registers/page.tsx`

#### 4.2.2.1 Тип компонента

**Server Component (React Server Component):**

```typescript
// app/registers/page.tsx
// NO "use client" directive → Server Component

export default async function RegistersPage() {
  // ✅ Server-side only execution
  // ✅ Can use Node.js APIs (fs, path, cookies)
  // ✅ Can use async/await at component level
  // ✅ Minimal JavaScript sent to browser
  
  const registries = await loadRegistries()  // File system read
  const t = await getTranslations(locale)    // File system read
  
  return (/* JSX with iframes */)
}
```

**Переваги Server Component:**

```yaml
Performance:
  - HTML generated at build time
  - Iframes lazy-loaded by browser
  - No React hydration for iframes
  - Fast initial page load

SEO:
  - Full HTML for crawlers
  - Meta tags server-rendered
  - Iframe URLs indexable

Data Loading:
  - Direct file system access
  - No API calls needed
  - Build-time data fetching
```

#### 4.2.2.2 Анатомія файлу

**Повна структура файлу:**

```typescript
// ============================================
// IMPORTS
// ============================================
import fs from 'fs'                      // Node.js file system
import path from 'path'                  // Node.js path utilities
import { cookies } from 'next/headers'   // Next.js cookies API
import { getTranslations } from '../../lib/i18n'  // Custom i18n

// ============================================
// TYPE DEFINITIONS
// ============================================
interface Registry {
  id: string                             // Unique identifier
  name: string                           // Internal name
  slug: string                           // URL slug (e.g., "ekopfo")
  title: string                          // Display title
  description: string                    // Full description
  heroImage?: string                     // Optional banner image
  statusUrl?: string                     // Instatus iframe URL
}

// ============================================
// DATA LOADING FUNCTION
// ============================================
async function loadRegistries(): Promise<Registry[]> {
  const file = path.join(process.cwd(), 'config', 'notebooks.json')
  try {
    const data = fs.readFileSync(file, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []  // Fallback to empty array
  }
}

// ============================================
// PAGE COMPONENT (Server Component)
// ============================================
export default async function RegistersPage() {
  // 1. Load locale from cookie
  const c = cookies().get('NEXT_LOCALE')
  const locale = c?.value ?? 'uk'
  
  // 2. Load translations
  const t = await getTranslations(locale)
  
  // 3. Load registries data
  const registries = await loadRegistries()
  
  // 4. Filter registries with statusUrl
  const registriesWithStatus = registries
    .filter(r => r.statusUrl)
  //    ↑ Only include registries that have Instatus integration
  //    Result: Array of 7 registries (all have statusUrl)
  
  // 5. Render JSX
  return (
    <>
      {/* Hero Banner Section */}
      <div className="w-full h-32 bg-cover bg-top relative" {...}>
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white">
            {t.registers?.title || 'Реєстри - Статус'}
          </h1>
        </div>
      </div>
      
      {/* Status Grid Section */}
      <div className="container mx-auto px-4 py-6 space-y-8">
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {registriesWithStatus.map((registry) => {
              // Get translated registry name
              const registryName = 
                t.registryCards?.[registry.slug] || registry.title
              
              return (
                <div key={registry.slug} className="space-y-2">
                  {/* Registry Title */}
                  <h3 className="text-xl font-semibold text-center text-blue-600">
                    {registryName}
                  </h3>
                  
                  {/* Status Iframe */}
                  <div className="w-full h-[42vh] min-h-[280px] border rounded overflow-hidden shadow-lg">
                    <iframe 
                      src={registry.statusUrl} 
                      className="w-full h-full" 
                      title={`${registryName} Status`}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </>
  )
}
```

#### 4.2.2.3 Основні секції сторінки

**Логічне розділення:**

```
RegistersPage Component
├─ Hero Banner Section
│  ├─ Background image (Hero_ezdorovya.webp)
│  ├─ Dark overlay (bg-black/20)
│  └─ Page title (h1: "Реєстри - Статус")
│
└─ Status Grid Section
   ├─ Container (container mx-auto)
   ├─ Grid wrapper (grid grid-cols-1 md:grid-cols-2)
   └─ Status Cards (x7)
      └─ Individual card
         ├─ Registry title (h3)
         └─ Iframe container
            └─ <iframe> with Instatus URL
```

**Візуальна структура:**

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │         HERO BANNER (h-32)                      │   │
│  │  ┌───────────────────────────────────────────┐  │   │
│  │  │  Background: Hero_ezdorovya.webp          │  │   │
│  │  │  Overlay: bg-black/20                     │  │   │
│  │  │  ┌─────────────────────────────────────┐  │  │   │
│  │  │  │  Реєстри - Статус (h1, text-5xl)   │  │  │   │
│  │  │  └─────────────────────────────────────┘  │  │   │
│  │  └───────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │    STATUS GRID SECTION (py-6)                  │   │
│  │  ┌───────────────────────────────────────────┐  │   │
│  │  │     GRID (grid-cols-1 md:2)              │  │   │
│  │  │  ┌─────────────────┐ ┌─────────────────┐ │  │   │
│  │  │  │ ЕКОПФО (h3)     │ │ Ендопротезування│ │  │   │
│  │  │  │ ┌─────────────┐ │ │ ┌─────────────┐ │ │  │   │
│  │  │  │ │   iframe    │ │ │ │   iframe    │ │ │  │   │
│  │  │  │ │  (Instatus) │ │ │ │  (Instatus) │ │ │  │   │
│  │  │  │ │   h-[42vh]  │ │ │ │   h-[42vh]  │ │ │  │   │
│  │  │  │ └─────────────┘ │ │ └─────────────┘ │ │  │   │
│  │  │  └─────────────────┘ └─────────────────┘ │  │   │
│  │  │  ┌─────────────────┐ ┌─────────────────┐ │  │   │
│  │  │  │ Інтернатура     │ │ Вакансії        │ │  │   │
│  │  │  │ ┌─────────────┐ │ │ ┌─────────────┐ │ │  │   │
│  │  │  │ │   iframe    │ │ │ │   iframe    │ │ │  │   │
│  │  │  │ └─────────────┘ │ │ └─────────────┘ │ │  │   │
│  │  │  └─────────────────┘ └─────────────────┘ │  │   │
│  │  │  ┌─────────────────┐ ┌─────────────────┐ │  │   │
│  │  │  │ БПР             │ │ е-Кров          │ │  │   │
│  │  │  │ ┌─────────────┐ │ │ ┌─────────────┐ │ │  │   │
│  │  │  │ │   iframe    │ │ │ │   iframe    │ │ │  │   │
│  │  │  │ └─────────────┘ │ │ └─────────────┘ │ │  │   │
│  │  │  └─────────────────┘ └─────────────────┘ │  │   │
│  │  │  ┌─────────────────┐                     │  │   │
│  │  │  │ СЕН ІКП         │                     │  │   │
│  │  │  │ ┌─────────────┐ │                     │  │   │
│  │  │  │ │   iframe    │ │                     │  │   │
│  │  │  │ └─────────────┘ │                     │  │   │
│  │  │  └─────────────────┘                     │  │   │
│  │  └───────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

#### 4.2.2.4 Підключення стилів та layout

**Layout Hierarchy:**

```
app/
├─ layout.tsx              ← Root Layout (спільний для всіх)
│  └─ <html>, <body>
│     ├─ <Header />        ← Спільний Header
│     ├─ {children}        ← RegistersPage вставляється тут
│     └─ <Footer />        ← Спільний Footer
│
└─ registers/
   └─ page.tsx             ← RegistersPage (children для layout)
```

**Cascade стилів:**

```
1. Global Styles (app/globals.css)
   ├─ @tailwind base
   ├─ @tailwind components
   └─ @tailwind utilities
   
2. Layout Styles (app/layout.tsx)
   ├─ <html lang="uk">
   └─ <body className="min-h-screen flex flex-col">
   
3. Page Styles (app/registers/page.tsx)
   ├─ Hero: className="w-full h-32 bg-cover bg-top relative"
   ├─ Grid: className="grid grid-cols-1 md:grid-cols-2 gap-6"
   ├─ Card: className="space-y-2"
   └─ Iframe: className="w-full h-[42vh] min-h-[280px]"
```

**Responsive Grid:**

```css
/* Mobile First Approach */
grid-cols-1           /* Base (mobile): 1 column (stacked) */
md:grid-cols-2        /* ≥768px: 2 columns (side-by-side) */

/* Iframe height */
h-[42vh]              /* 42% of viewport height */
min-h-[280px]         /* Minimum 280px (prevent too small) */
```

### 4.2.3 Компоненти, що використовуються

#### 4.2.3.1 Header (Global Component)

**Розташування:** `app/components/Header.tsx`  
**Тип:** Client Component (`"use client"`)  
**Використання:** Через `app/layout.tsx` (не безпосередньо в page.tsx)

**Функціональність на цій сторінці:**

```typescript
// Header navigation (dropdown: Реєстри)
<Link href="/registers">Реєстри</Link>
//      ↑ Active link (current page)

// Dropdown menu shows individual registries:
registries.map(r => (
  <Link href={`/registers/${r.slug}`}>
    {getRegistryTitle(r)}
  </Link>
))
// Examples:
// → /registers/ekopfo
// → /registers/endoprosthesis
// → ... (7 links)
```

#### 4.2.3.2 Footer (Global Component)

**Розташування:** `app/components/Footer.tsx`  
**Тип:** Client Component (`"use client"`)  
**Використання:** Через `app/layout.tsx`

**Функціональність:**

```typescript
Features:
├─ Support contact text
├─ HelpdeskLink button
└─ Copyright notice

Same as on all pages (consistent footer)
```

#### 4.2.3.3 Status Iframe Components (Inline)

**Структура однієї status card:**

```typescript
// Inline component (not extracted to separate file)
<div key={registry.slug} className="space-y-2">
  {/* Title */}
  <h3 className="text-xl font-semibold text-center text-blue-600">
    {registryName}
  </h3>
  
  {/* Iframe Container */}
  <div className="w-full h-[42vh] min-h-[280px] border rounded overflow-hidden shadow-lg">
    <iframe 
      src={registry.statusUrl}
      className="w-full h-full" 
      title={`${registryName} Status`}
      // No sandbox restrictions (full Instatus functionality)
      // No loading="lazy" (load all iframes immediately)
    />
  </div>
</div>
```

**Iframe Props:**

```typescript
interface IframeProps {
  src: string              // Instatus URL (e.g., "https://ekoppho.instatus.com")
  className: string        // "w-full h-full"
  title: string           // Accessibility label (e.g., "ЕКОПФО Status")
}

// Example:
<iframe 
  src="https://ekoppho.instatus.com"
  className="w-full h-full" 
  title="ЕКОПФО Status"
/>
```

**Instatus URLs для кожного реєстру:**

```yaml
ЕКОПФО:
  statusUrl: "https://ekoppho.instatus.com"

Ендопротезування:
  statusUrl: "https://endo.instatus.com/"

Інтернатура:
  statusUrl: "https://intern.instatus.com/"

Вакансії:
  statusUrl: "https://vacancy.instatus.com/"

БПР:
  statusUrl: "https://bpr-moh.instatus.com/"

е-Кров:
  statusUrl: "https://eblood.instatus.com/"

СЕН ІКП:
  statusUrl: "https://ensicp.instatus.com/"
```

#### 4.2.3.4 Next.js Built-in APIs

**Server-side APIs:**

```typescript
// 1. cookies (next/headers)
import { cookies } from 'next/headers'
const c = cookies().get('NEXT_LOCALE')
// Purpose: Read locale from cookie
// Server Component only API

// 2. fs (Node.js)
import fs from 'fs'
const data = fs.readFileSync(file, 'utf-8')
// Purpose: Read notebooks.json
// Server-side only (build time)

// 3. path (Node.js)
import path from 'path'
const file = path.join(process.cwd(), 'config', 'notebooks.json')
// Purpose: Construct file paths
// Server-side only
```

**Custom Utilities:**

```typescript
// getTranslations (lib/i18n.ts)
import { getTranslations } from '../../lib/i18n'
const t = await getTranslations(locale)
// Purpose: Load translations from locales/*.json
// Returns: Translation object with all keys
```

### 4.2.4 Логіка рендерингу

#### 4.2.4.1 Формування списку фреймів

**Процес фільтрації:**

```typescript
// Step 1: Load all registries
const registries = await loadRegistries()
// Result: Array of 7 registries

// Step 2: Filter registries with statusUrl
const registriesWithStatus = registries
  .filter(r => r.statusUrl)
//         ↑ Only include if statusUrl exists

// Current data: ALL 7 registries have statusUrl
// registriesWithStatus.length === 7

// If a registry doesn't have statusUrl (hypothetical):
// registries = [
//   { slug: "ekopfo", statusUrl: "https://..." },     ✅ Included
//   { slug: "test", statusUrl: undefined },           ❌ Excluded
// ]
```

**Map через фільтровані реєстри:**

```typescript
registriesWithStatus.map((registry) => {
  // For each registry with statusUrl:
  
  // 1. Get translated name
  const registryName = 
    t.registryCards?.[registry.slug] || registry.title
  
  // 2. Render status card
  return (
    <div key={registry.slug}>
      <h3>{registryName}</h3>
      <iframe src={registry.statusUrl} />
    </div>
  )
})

// Execution:
// Iteration 1: registry.slug = "ekopfo"
//   registryName = "ЕКОПФО"
//   iframe src = "https://ekoppho.instatus.com"
//
// Iteration 2: registry.slug = "endoprosthesis"
//   registryName = "Ендопротезування"
//   iframe src = "https://endo.instatus.com/"
//
// ... (7 iterations total)
```

#### 4.2.4.2 Завантаження конфігурацій

**Data Flow:**

```
Build Time (npm run build):
┌─────────────────────────────────────────────────┐
│  1. Execute RegistersPage component             │
│     ↓                                            │
│  2. Load registries                             │
│     ├─ fs.readFileSync('config/notebooks.json') │
│     ├─ Parse JSON                               │
│     └─ Returns: Array<Registry>                 │
│     ↓                                            │
│  3. Filter registries                           │
│     ├─ registries.filter(r => r.statusUrl)      │
│     └─ Returns: 7 registries                    │
│     ↓                                            │
│  4. Load translations                           │
│     ├─ fs.readFileSync('locales/ua.json')       │
│     ├─ Parse JSON                               │
│     └─ Returns: TranslationObject               │
│     ↓                                            │
│  5. Render JSX                                  │
│     ├─ Map registries to iframe cards           │
│     └─ Generate static HTML                     │
│     ↓                                            │
│  6. Save to .next/server/app/registers/page.html│
└─────────────────────────────────────────────────┘

Request Time (Production):
┌─────────────────────────────────────────────────┐
│  1. User visits /registers                      │
│     ↓                                            │
│  2. Vercel serves pre-rendered HTML             │
│     └─ No data loading needed ✅                │
│     ↓                                            │
│  3. Browser loads HTML                          │
│     ↓                                            │
│  4. Iframes load Instatus widgets               │
│     └─ Real-time status data fetched by Instatus│
└─────────────────────────────────────────────────┘
```

**Приклад notebooks.json (statusUrl):**

```json
[
  {
    "slug": "ekopfo",
    "title": "ЕКОПФО",
    "statusUrl": "https://ekoppho.instatus.com",
    // ↑ This URL is used for iframe src
    ...
  },
  {
    "slug": "endoprosthesis",
    "title": "Ендопротезування",
    "statusUrl": "https://endo.instatus.com/",
    ...
  }
]
```

#### 4.2.4.3 Локалізація на сторінці

**Локалізовані елементи:**

```typescript
// 1. Page Title (Hero Banner)
<h1>{t.registers?.title || 'Реєстри - Статус'}</h1>
// UA: "Реєстри - Статус"
// EN: "Registries - Status"

// 2. Registry Names (Card Titles)
{registriesWithStatus.map((registry) => {
  const registryName = 
    t.registryCards?.[registry.slug] || registry.title
  
  return <h3>{registryName}</h3>
  // UA: "ЕКОПФО", "Ендопротезування", ...
  // EN: "EKOPFO", "Endoprosthesis", ...
})}

// 3. Iframe Title (Accessibility)
<iframe 
  title={`${registryName} Status`}
  // UA: "ЕКОПФО Status"
  // EN: "EKOPFO Status"
/>
```

**Translation structure:**

```json
// locales/ua.json
{
  "registers": {
    "title": "Реєстри - Статус",
    "statusTitle": "Статус систем",
    "statusIframe": "Статус системи"
  },
  "registryCards": {
    "ekopfo": "ЕКОПФО",
    "endoprosthesis": "Ендопротезування",
    "internatura": "Інтернатура",
    "vacancies": "Вакансії",
    "bpr": "Система Безперервного Розвитку",
    "ekrov": "е-Кров",
    "sen-ikp": "СЕН ІКП"
  }
}

// locales/en.json
{
  "registers": {
    "title": "Registries - Status",
    "statusTitle": "System Status",
    "statusIframe": "System Status"
  },
  "registryCards": {
    "ekopfo": "EKOPFO",
    "endoprosthesis": "Endoprosthesis",
    "internatura": "Internship",
    "vacancies": "Vacancies",
    "bpr": "Continuing Professional Development",
    "ekrov": "e-Blood",
    "sen-ikp": "SEN IKP"
  }
}
```

**Fallback Logic:**

```typescript
// Primary: Try to get translation
const registryName = t.registryCards?.[registry.slug]

// Fallback: Use original title from JSON
|| registry.title

// Example:
// If t.registryCards.ekopfo exists:
//   returns "ЕКОПФО" (from translation)
// If missing:
//   returns "ЕКОПФО" (from notebooks.json)
```

### 4.2.5 ASCII схема структури сторінки

**Компактна DOM-структура:**

```
RegistersPage (Server Component)
│
├─ Hero Banner Section
│  └─ <div className="w-full h-32 bg-cover...">
│     └─ <div className="absolute inset-0 bg-black/20...">
│        └─ <h1 className="text-5xl font-bold text-white...">
│           └─ {t.registers?.title}  "Реєстри - Статус"
│
└─ Status Grid Section
   └─ <div className="container mx-auto px-4 py-6...">
      └─ <section>
         └─ <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            └─ {registriesWithStatus.map((registry) => (...))}
               │
               └─ Status Card (x7)
                  └─ <div key={registry.slug} className="space-y-2">
                     │
                     ├─ Registry Title
                     │  └─ <h3 className="text-xl font-semibold...">
                     │     └─ {registryName}
                     │
                     └─ Iframe Container
                        └─ <div className="w-full h-[42vh] min-h-[280px]...">
                           └─ <iframe 
                                 src={registry.statusUrl}
                                 className="w-full h-full"
                                 title={`${registryName} Status`}
                              />
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
│  │  │  │  └─ "Реєстри" (active) ← Current page              │  │  │
│  │  │  └─ Language Switcher                                  │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  │                                                              │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │  {children} ← RegistersPage inserted here              │  │  │
│  │  │  ┌──────────────────────────────────────────────────┐  │  │  │
│  │  │  │  REGISTERS PAGE (app/registers/page.tsx)         │  │  │  │
│  │  │  │  ┌────────────────────────────────────────────┐  │  │  │  │
│  │  │  │  │  HERO BANNER (h-32)                        │  │  │  │  │
│  │  │  │  │  ┌──────────────────────────────────────┐  │  │  │  │  │
│  │  │  │  │  │  Background: Hero_ezdorovya.webp     │  │  │  │  │  │
│  │  │  │  │  │  ┌────────────────────────────────┐  │  │  │  │  │  │
│  │  │  │  │  │  │  <h1> Реєстри - Статус        │  │  │  │  │  │  │
│  │  │  │  │  │  └────────────────────────────────┘  │  │  │  │  │  │
│  │  │  │  │  └──────────────────────────────────────┘  │  │  │  │  │
│  │  │  │  └────────────────────────────────────────────┘  │  │  │  │
│  │  │  │  ┌────────────────────────────────────────────┐  │  │  │  │
│  │  │  │  │  STATUS GRID SECTION (container)           │  │  │  │  │
│  │  │  │  │  ┌──────────────────────────────────────┐  │  │  │  │  │
│  │  │  │  │  │  GRID (grid-cols-1 md:2, gap-6)      │  │  │  │  │  │
│  │  │  │  │  │  ┌────────────┐ ┌────────────┐       │  │  │  │  │  │
│  │  │  │  │  │  │  Card 1    │ │  Card 2    │       │  │  │  │  │  │
│  │  │  │  │  │  │ ЕКОПФО     │ │ Ендопро... │       │  │  │  │  │  │
│  │  │  │  │  │  │ ┌────────┐ │ │ ┌────────┐ │       │  │  │  │  │  │
│  │  │  │  │  │  │ │iframe  │ │ │ │iframe  │ │       │  │  │  │  │  │
│  │  │  │  │  │  │ │h-[42vh]│ │ │ │h-[42vh]│ │       │  │  │  │  │  │
│  │  │  │  │  │  │ │Instatus│ │ │ │Instatus│ │       │  │  │  │  │  │
│  │  │  │  │  │  │ └────────┘ │ │ └────────┘ │       │  │  │  │  │  │
│  │  │  │  │  │  └────────────┘ └────────────┘       │  │  │  │  │  │
│  │  │  │  │  │  ┌────────────┐ ┌────────────┐       │  │  │  │  │  │
│  │  │  │  │  │  │  Card 3    │ │  Card 4    │       │  │  │  │  │  │
│  │  │  │  │  │  │ Інтернат.. │ │ Вакансії   │       │  │  │  │  │  │
│  │  │  │  │  │  │ ┌────────┐ │ │ ┌────────┐ │       │  │  │  │  │  │
│  │  │  │  │  │  │ │iframe  │ │ │ │iframe  │ │       │  │  │  │  │  │
│  │  │  │  │  │  │ └────────┘ │ │ └────────┘ │       │  │  │  │  │  │
│  │  │  │  │  │  └────────────┘ └────────────┘       │  │  │  │  │  │
│  │  │  │  │  │  ┌────────────┐ ┌────────────┐       │  │  │  │  │  │
│  │  │  │  │  │  │  Card 5    │ │  Card 6    │       │  │  │  │  │  │
│  │  │  │  │  │  │ БПР        │ │ е-Кров     │       │  │  │  │  │  │
│  │  │  │  │  │  │ ┌────────┐ │ │ ┌────────┐ │       │  │  │  │  │  │
│  │  │  │  │  │  │ │iframe  │ │ │ │iframe  │ │       │  │  │  │  │  │
│  │  │  │  │  │  │ └────────┘ │ │ └────────┘ │       │  │  │  │  │  │
│  │  │  │  │  │  └────────────┘ └────────────┘       │  │  │  │  │  │
│  │  │  │  │  │  ┌────────────┐                       │  │  │  │  │  │
│  │  │  │  │  │  │  Card 7    │                       │  │  │  │  │  │
│  │  │  │  │  │  │ СЕН ІКП    │                       │  │  │  │  │  │
│  │  │  │  │  │  │ ┌────────┐ │                       │  │  │  │  │  │
│  │  │  │  │  │  │ │iframe  │ │                       │  │  │  │  │  │
│  │  │  │  │  │  │ └────────┘ │                       │  │  │  │  │  │
│  │  │  │  │  │  └────────────┘                       │  │  │  │  │  │
│  │  │  │  │  └──────────────────────────────────────┘  │  │  │  │  │
│  │  │  │  └────────────────────────────────────────────┘  │  │  │  │
│  │  │  └──────────────────────────────────────────────────┘  │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  │                                                              │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │  <Footer /> (Client Component)                         │  │  │
│  │  │  ├─ Support contact text                               │  │  │
│  │  │  ├─ HelpdeskLink button                                │  │  │
│  │  │  └─ Copyright notice                                   │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  │  </body>                                                     │  │
│  │  </html>                                                     │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
```

---

**Дата створення:** 13 грудня 2025  
**Файл:** `app/registers/page.tsx`  
**Тип компонента:** Server Component (SSG)  
**URL:** `/registers`  
**Кількість iframe:** 7 (по одному на кожен реєстр)
**Instatus Integration:** ✅ Всі 7 реєстрів мають statusUrl
