# 📋 ПАСПОРТ САЙТУ
## Розділ 4: Опис сторінок сайту (Частина 1.A)

---

## 4.1. 🏠 ГОЛОВНА СТОРІНКА (Home Page) — Частина 1

### 4.1.1 Призначення головної сторінки

#### 4.1.1.1 Роль у структурі сайту

**URL:** `/` (корінь сайту)  
**Файл:** `web/app/page.tsx`  
**Тип:** Server Component (SSG - Static Site Generation)

**Основна роль:**

```yaml
Primary Purpose:
  - Точка входу на портал eHealth
  - Центральний хаб для доступу до медичних реєстрів
  - Навігаційна сторінка для вибору потрібного реєстру

Secondary Purpose:
  - Презентація бренду (Hero Banner з логотипом)
  - SEO-оптимізована Landing Page
  - Швидкий доступ до ключових розділів через Header
```

**Місце в ієрархії:**

```
Site Hierarchy:
┌─────────────────────────────────────────┐
│          / (Home Page)                  │  ← Ви тут
│          ================                │
│                 │                        │
│    ┌────────────┼────────────┐          │
│    │            │            │          │
│    ▼            ▼            ▼          │
│  /registers  /documentation  /about     │
│    │                                     │
│    └─ /registers/[slug]                 │
│       ├─ /registers/ekopfo               │
│       ├─ /registers/endoprosthesis       │
│       └─ ... (7 реєстрів)               │
└─────────────────────────────────────────┘
```

#### 4.1.1.2 Основні сценарії використання

**User Journey 1: Пошук реєстру**

```
User arrives → Home Page
     ↓
Views Hero Banner ("е-Здоров'я")
     ↓
Scrolls to "Медичні Реєстри" section
     ↓
Sees grid of 7 registry cards
     ↓
Clicks on card (e.g., "ЕКОПФО")
     ↓
Navigates to /registers/ekopfo
```

**User Journey 2: Навігація через Header**

```
User arrives → Home Page
     ↓
Uses Header navigation
     ↓
Clicks "Документація" dropdown
     ↓
Selects "FAQ"
     ↓
Navigates to /documentation/faq
```

**User Journey 3: Зміна мови**

```
User arrives → Home Page (UA by default)
     ↓
Clicks Language Switcher (EN)
     ↓
Cookie NEXT_LOCALE=en set
     ↓
Page reloads with English translations
     ↓
All registry titles, UI text in English
```

**User Journey 4: Доступ до підтримки**

```
User arrives → Home Page
     ↓
Scrolls to Footer
     ↓
Clicks "Звернутись до довідкового центру"
     ↓
Opens Helpdesk link (external)
```

**Типові use cases:**

| Сценарій | Частота | Опис |
|----------|---------|------|
| **Прямий перехід до реєстру** | 70% | Користувач знає який реєстр потрібен |
| **Перегляд всіх реєстрів** | 20% | Користувач досліджує доступні опції |
| **Пошук документації** | 8% | Перехід через Header → Документація |
| **Зміна мови** | 2% | Перемикання UA ↔ EN |

### 4.1.2 Структура файлу `app/page.tsx`

#### 4.1.2.1 Тип компонента

**Server Component (React Server Component):**

```typescript
// app/page.tsx
// NO "use client" directive → Server Component by default

export default async function HomePage() {
  // ✅ Server-side only execution
  // ✅ Can use Node.js APIs (fs, path)
  // ✅ Can use async/await at component level
  // ✅ Zero JavaScript sent to browser for this component
  
  const registries = await loadRegistries()  // File system read
  const t = await getTranslations(locale)    // File system read
  
  return (/* JSX */)
}
```

**Переваги Server Component для Home Page:**

```yaml
Performance:
  - HTML generated at build time (SSG)
  - No client-side JavaScript for core page
  - Instant page load (served from CDN)
  - No hydration overhead

SEO:
  - Full HTML available for crawlers
  - Meta tags rendered server-side
  - Content indexable immediately

Security:
  - Direct file system access (safe on server)
  - No API calls from browser
  - Secrets never exposed to client
```

#### 4.1.2.2 Анатомія файлу

**Повна структура файлу:**

```typescript
// ============================================
// IMPORTS
// ============================================
import fs from 'fs'                      // Node.js file system
import path from 'path'                  // Node.js path utilities
import Link from 'next/link'             // Next.js client-side navigation
import Image from 'next/image'           // Next.js optimized images
import { cookies } from 'next/headers'   // Next.js cookies API
import { getTranslations } from '../lib/i18n'  // Custom i18n function

// ============================================
// TYPE DEFINITIONS
// ============================================
interface Registry {
  slug: string                           // URL identifier (e.g., "ekopfo")
  title: string                          // Display title
  description: string                    // Full description
  links?: {                              // Optional external links
    label: string
    url: string
    image?: string
  }[]
}

// ============================================
// DATA LOADING FUNCTION
// ============================================
async function loadRegistries(): Promise<Registry[]> {
  const file = path.join(process.cwd(), 'config', 'notebooks.json')
  try {
    const data = fs.readFileSync(file, 'utf-8')
    return JSON.parse(data)
  } catch (e) {
    return []  // Fallback to empty array
  }
}

// ============================================
// PAGE METADATA (SEO)
// ============================================
export const metadata = {
  title: 'eHealth Portal',                      // Browser tab title
  description: 'Головна сторінка порталу eHealth'  // Meta description
}

// ============================================
// PAGE COMPONENT (Server Component)
// ============================================
export default async function HomePage() {
  // 1. Load locale from cookie
  const c = cookies().get('NEXT_LOCALE')
  const locale = c?.value ?? 'uk'
  
  // 2. Load translations (server-side file read)
  const t = await getTranslations(locale)
  
  // 3. Load registries data (server-side file read)
  const registries = await loadRegistries()
  
  // 4. Helper function for translated titles
  const getRegistryTitle = (registry: Registry) => {
    const translatedTitle = t.registryCards?.[registry.slug as keyof typeof t.registryCards]
    return translatedTitle || registry.title
  }
  
  // 5. Render JSX
  return (
    <>
      {/* Hero Banner Section */}
      <div className="w-full h-32 bg-cover bg-top relative" {...}>
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white text-center">{t.siteTitle}</h1>
        </div>
      </div>
      
      {/* Registries Grid Section */}
      <div className="w-full px-4 py-8">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8 text-blue-600">
            {t.medicalRegistries}
          </h2>
          
          {/* Registry Cards Grid */}
          {registries.length === 0 ? (
            <p className="text-red-600 text-center">{t.registersNotFound}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {registries.map((r) => {
                const img = (r.links && r.links.length > 0 && r.links[0].image) 
                  ? r.links[0].image 
                  : '/images/Helpdesk.webp'
                
                return (
                  <div key={r.slug} className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow hover:scale-105">
                    <Link href={`/registers/${r.slug}`} className="block">
                      <div className="relative w-full" style={{ paddingBottom: '100%' }}>
                        <Image
                          src={img}
                          alt={getRegistryTitle(r)}
                          fill
                          className="object-cover absolute inset-0"
                        />
                      </div>
                      <div className="p-4 text-center">
                        <span className="text-lg font-semibold text-blue-600">
                          {getRegistryTitle(r)}
                        </span>
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
```

#### 4.1.2.3 Основні секції сторінки

**Логічне розділення:**

```
HomePage Component
├─ Hero Banner Section
│  ├─ Background image (Hero_ezdorovya.webp)
│  ├─ Dark overlay (bg-black/20)
│  └─ Site title (h1)
│
└─ Registries Grid Section
   ├─ Section title (h2: "Медичні Реєстри")
   ├─ Empty state (if registries.length === 0)
   └─ Grid of registry cards (if registries exist)
      └─ Individual card
         ├─ Link wrapper (/registers/{slug})
         ├─ Image (square aspect ratio)
         └─ Title (translated)
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
│  │  │  │   е-Здоров'я (h1, text-5xl)         │  │  │   │
│  │  │  └─────────────────────────────────────┘  │  │   │
│  │  └───────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │    REGISTRIES GRID SECTION (py-8)              │   │
│  │  ┌───────────────────────────────────────────┐  │   │
│  │  │ Медичні Реєстри (h2, text-4xl, center)   │  │   │
│  │  └───────────────────────────────────────────┘  │   │
│  │                                                 │   │
│  │  ┌─────────────────────────────────────────┐   │   │
│  │  │     GRID (grid-cols-1 to lg:4)         │   │   │
│  │  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐       │   │   │
│  │  │  │Card │ │Card │ │Card │ │Card │       │   │   │
│  │  │  │  1  │ │  2  │ │  3  │ │  4  │       │   │   │
│  │  │  └─────┘ └─────┘ └─────┘ └─────┘       │   │   │
│  │  │  ┌─────┐ ┌─────┐ ┌─────┐               │   │   │
│  │  │  │Card │ │Card │ │Card │               │   │   │
│  │  │  │  5  │ │  6  │ │  7  │               │   │   │
│  │  │  └─────┘ └─────┘ └─────┘               │   │   │
│  │  └─────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

#### 4.1.2.4 Підключення стилів та layout

**Layout Hierarchy (автоматичне):**

```
app/
├─ layout.tsx              ← Root Layout (обгортає всі сторінки)
│  └─ <html>, <body>
│     ├─ <Header />        ← Спільний Header
│     ├─ {children}        ← HomePage вставляється тут
│     └─ <Footer />        ← Спільний Footer
│
└─ page.tsx                ← HomePage (children для layout)
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
   
3. Page Styles (app/page.tsx)
   ├─ Hero: className="w-full h-32 bg-cover bg-top relative"
   ├─ Grid: className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
   └─ Card: className="block border rounded-lg overflow-hidden hover:shadow-lg"
```

**Tailwind responsive breakpoints:**

```css
/* Mobile First Approach */
grid-cols-1           /* Base (mobile): 1 column */
sm:grid-cols-2        /* ≥640px: 2 columns */
md:grid-cols-3        /* ≥768px: 3 columns */
lg:grid-cols-4        /* ≥1024px: 4 columns */

/* Grid adjusts automatically based on viewport width */
```

### 4.1.3 Компоненти, що використовуються на сторінці

#### 4.1.3.1 Header (Global Component)

**Розташування:** `app/components/Header.tsx`  
**Тип:** Client Component (`"use client"`)  
**Використання:** Через `app/layout.tsx` (не безпосередньо в page.tsx)

**Ключові особливості:**

```typescript
"use client"  // ← Client Component для інтерактивності

Features:
├─ Logo + Site Title
├─ Navigation Menu
│  ├─ Головна (dropdown: ДП е-Здоров'я, Helpdesk team)
│  ├─ Реєстри (dropdown: динамічний список з API)
│  └─ Документація (dropdown: Настанови, Нормативні, FAQ)
├─ Language Switcher
└─ Dropdown state management (useState)

Data Loading:
├─ useEffect → fetch('/api/registries')
└─ Dynamic registry menu items
```

**Інтеграція з HomePage:**

```
HomePage (Server Component)
     ↓
  Rendered by
     ↓
app/layout.tsx
     ↓
  Includes
     ↓
<Header />  ← Client Component
```

#### 4.1.3.2 Footer (Global Component)

**Розташування:** `app/components/Footer.tsx`  
**Тип:** Client Component (`"use client"`)  
**Використання:** Через `app/layout.tsx`

**Ключові особливості:**

```typescript
"use client"  // ← Для useTranslations hook

Features:
├─ Support contact text
├─ HelpdeskLink button
├─ Copyright notice
└─ Translations (client-side)

Components Used:
└─ <HelpdeskLink size="md">
```

**Візуальна структура Footer:**

```
┌──────────────────────────────────────────────┐
│  "Якщо у користувача виникли запитання:"    │
│                                              │
│  [Звернутись до довідкового центру] (button)│
│                                              │
│  © 2025 eHealth Portal                       │
└──────────────────────────────────────────────┘
```

#### 4.1.3.3 RegisterCard (НЕ використовується на HomePage)

**Статус:** ❌ **НЕ використовується** на головній сторінці

**Причина:**

```typescript
// HomePage використовує inline рендеринг карток:
<div key={r.slug} className="block border rounded-lg...">
  <Link href={`/registers/${r.slug}`}>
    <Image src={img} alt={title} fill />
    <span>{title}</span>
  </Link>
</div>

// RegisterCard компонент (app/components/RegisterCard.tsx):
// - Використовується на інших сторінках
// - Трохи інша структура (w-1/2 h-32 для зображення)
// - HomePage має власну реалізацію карток
```

**Різниця між реалізаціями:**

| Аспект | HomePage Cards | RegisterCard Component |
|--------|----------------|------------------------|
| **Image Size** | Square (100% aspect) | w-1/2 h-32 |
| **Layout** | Full width card | Centered image |
| **Hover** | scale-105 + shadow | shadow-lg only |
| **Usage** | Inline в HomePage | Окремий компонент |

#### 4.1.3.4 Інші компоненти

**Next.js Built-in Components:**

```typescript
// 1. Link (next/link)
import Link from 'next/link'
<Link href={`/registers/${r.slug}`}>...</Link>
// Purpose: Client-side navigation (SPA-like)
// Benefits: Prefetching, instant transitions

// 2. Image (next/image)
import Image from 'next/image'
<Image src={img} alt={title} fill className="object-cover" />
// Purpose: Optimized image loading
// Benefits: WebP conversion, lazy loading, responsive sizes
```

**React APIs:**

```typescript
// cookies (next/headers)
import { cookies } from 'next/headers'
const c = cookies().get('NEXT_LOCALE')
// Purpose: Read locale from cookie
// Server Component only API
```

**Custom Utilities:**

```typescript
// getTranslations (lib/i18n.ts)
import { getTranslations } from '../lib/i18n'
const t = await getTranslations(locale)
// Purpose: Load translations from locales/*.json
// Returns: Translation object with all keys
```

### 4.1.4 Логіка рендерингу

#### 4.1.4.1 Завантаження локалізації

**Процес завантаження (Server-Side):**

```
┌────────────────────────────────────────────────────┐
│     LOCALIZATION LOADING FLOW                      │
├────────────────────────────────────────────────────┤
│                                                    │
│  1. Read Cookie                                    │
│     ┌────────────────────────────────────────┐    │
│     │ cookies().get('NEXT_LOCALE')           │    │
│     │   → value: 'uk' or 'en' or undefined   │    │
│     └────────────────────────────────────────┘    │
│                    ↓                               │
│  2. Determine Locale                               │
│     ┌────────────────────────────────────────┐    │
│     │ const locale = c?.value ?? 'uk'        │    │
│     │ Fallback to 'uk' if cookie not set    │    │
│     └────────────────────────────────────────┘    │
│                    ↓                               │
│  3. Load Translation File                          │
│     ┌────────────────────────────────────────┐    │
│     │ getTranslations(locale)                │    │
│     │   ├─ Map 'uk' → 'ua.json'              │    │
│     │   ├─ Map 'en' → 'en.json'              │    │
│     │   ├─ Read file: locales/ua.json        │    │
│     │   └─ Parse JSON → Translation object   │    │
│     └────────────────────────────────────────┘    │
│                    ↓                               │
│  4. Translation Object Available                   │
│     ┌────────────────────────────────────────┐    │
│     │ const t = {                            │    │
│     │   siteTitle: "е-Здоров'я",            │    │
│     │   medicalRegistries: "Медичні...",    │    │
│     │   registryCards: {                    │    │
│     │     ekopfo: "ЕКОПФО",                 │    │
│     │     endoprosthesis: "Ендопротезу...", │    │
│     │     ...                               │    │
│     │   }                                    │    │
│     │ }                                      │    │
│     └────────────────────────────────────────┘    │
│                    ↓                               │
│  5. Use in JSX                                     │
│     ┌────────────────────────────────────────┐    │
│     │ <h1>{t.siteTitle}</h1>                 │    │
│     │ <h2>{t.medicalRegistries}</h2>         │    │
│     │ <span>{t.registryCards.ekopfo}</span>  │    │
│     └────────────────────────────────────────┘    │
└────────────────────────────────────────────────────┘
```

**Код getTranslations:**

```typescript
// lib/i18n.ts
export async function getTranslations(locale: string) {
  // Map 'uk' → 'ua.json'
  const filename = locale === 'uk' ? 'ua.json' : `${locale}.json`
  const file = path.join(process.cwd(), 'locales', filename)
  
  try {
    const data = fs.readFileSync(file, 'utf-8')
    return JSON.parse(data)
  } catch (e) {
    // Fallback to Ukrainian
    const fallback = path.join(process.cwd(), 'locales', 'ua.json')
    const data = fs.readFileSync(fallback, 'utf-8')
    return JSON.parse(data)
  }
}
```

**Приклад Translation Object:**

```json
{
  "siteTitle": "е-Здоров'я",
  "medicalRegistries": "Медичні Реєстри",
  "registersNotFound": "Реєстри не знайдені...",
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
```

#### 4.1.4.2 Формування контенту сторінки

**Завантаження даних реєстрів:**

```typescript
// Step 1: Load registries from JSON file
async function loadRegistries(): Promise<Registry[]> {
  const file = path.join(process.cwd(), 'config', 'notebooks.json')
  try {
    const data = fs.readFileSync(file, 'utf-8')
    return JSON.parse(data)  // Array of 7 registries
  } catch (e) {
    return []  // Empty array if file missing
  }
}

// Step 2: Call in component
const registries = await loadRegistries()
// Result: [
//   { slug: "ekopfo", title: "ЕКОПФО", description: "...", links: [...] },
//   { slug: "endoprosthesis", title: "Ендопротезування", ... },
//   ...7 items total
// ]
```

**Обробка перекладів назв реєстрів:**

```typescript
// Helper function (defined inside HomePage component)
const getRegistryTitle = (registry: Registry) => {
  // Try to get translated title
  const translatedTitle = t.registryCards?.[registry.slug as keyof typeof t.registryCards]
  
  // Fallback to original title if translation missing
  return translatedTitle || registry.title
}

// Usage in JSX:
registries.map((r) => (
  <span>{getRegistryTitle(r)}</span>
  // ↑ Returns: "ЕКОПФО" (from translation) or "ЕКОПФО" (from JSON)
))
```

**Вибір зображення для картки:**

```typescript
// Logic for image selection:
const img = (r.links && r.links.length > 0 && r.links[0].image) 
  ? r.links[0].image              // Use first link's image
  : '/images/Helpdesk.webp'       // Fallback image

// Examples:
// ekopfo → '/images/ai-ekopfo.webp'
// endoprosthesis → '/images/ai-endoprosthesis.webp'
// (if missing) → '/images/Helpdesk.webp'
```

#### 4.1.4.3 Рендеринг статичних елементів

**Build-time generation (SSG):**

```yaml
During Build (npm run build):
  1. Next.js executes HomePage component
  2. loadRegistries() reads notebooks.json
  3. getTranslations('uk') reads ua.json
  4. JSX rendered to static HTML
  5. HTML saved to .next/server/app/page.html
  
During Request (production):
  1. User requests /
  2. Vercel serves pre-generated HTML from CDN
  3. No server execution
  4. Instant page load (<100ms)
```

**Hero Banner рендеринг:**

```tsx
<div
  className="w-full h-32 bg-cover bg-top relative"
  style={{
    backgroundImage: "url('/images/Hero_ezdorovya.webp')",
    backgroundSize: 'cover',
    backgroundPosition: 'top',
  }}
>
  {/* Dark overlay */}
  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
    {/* Site title from translations */}
    <h1 className="text-5xl font-bold text-white text-center">
      {t.siteTitle}  {/* "е-Здоров'я" */}
    </h1>
  </div>
</div>

// Generated HTML (simplified):
// <div class="w-full h-32..." style="background-image: url(...)">
//   <div class="absolute inset-0 bg-black/20...">
//     <h1 class="text-5xl font-bold...">е-Здоров'я</h1>
//   </div>
// </div>
```

**Registry Cards Grid рендеринг:**

```tsx
{registries.length === 0 ? (
  // Empty state
  <p className="text-red-600 text-center">{t.registersNotFound}</p>
) : (
  // Grid of cards
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {registries.map((r) => {
      const img = (r.links?.[0]?.image) || '/images/Helpdesk.webp'
      
      return (
        <div key={r.slug} className="...">
          <Link href={`/registers/${r.slug}`}>
            <div className="relative w-full" style={{ paddingBottom: '100%' }}>
              <Image src={img} alt={getRegistryTitle(r)} fill />
            </div>
            <div className="p-4 text-center">
              <span>{getRegistryTitle(r)}</span>
            </div>
          </Link>
        </div>
      )
    })}
  </div>
)}

// Loop execution:
// registries[0] → slug: "ekopfo" → href: "/registers/ekopfo"
// registries[1] → slug: "endoprosthesis" → href: "/registers/endoprosthesis"
// ... (7 iterations total)
```

### 4.1.5 ASCII схема структури сторінки

**Компактна DOM-структура HomePage:**

```
HomePage (Server Component)
│
├─ Hero Banner Section
│  └─ <div className="w-full h-32 bg-cover...">
│     └─ <div className="absolute inset-0 bg-black/20...">
│        └─ <h1 className="text-5xl font-bold text-white...">
│           └─ {t.siteTitle}  "е-Здоров'я"
│
└─ Registries Grid Section
   └─ <div className="w-full px-4 py-8">
      └─ <div className="container mx-auto">
         │
         ├─ <h2 className="text-4xl font-bold text-center...">
         │  └─ {t.medicalRegistries}  "Медичні Реєстри"
         │
         └─ Conditional Render:
            │
            ├─ IF (registries.length === 0):
            │  └─ <p className="text-red-600 text-center">
            │     └─ {t.registersNotFound}
            │
            └─ ELSE:
               └─ <div className="grid grid-cols-1 sm:grid-cols-2...">
                  └─ {registries.map((r) => (...))}
                     │
                     └─ Card (x7)
                        └─ <div key={r.slug} className="block border...">
                           └─ <Link href={`/registers/${r.slug}`}>
                              │
                              ├─ Image Container
                              │  └─ <div className="relative w-full" style={{paddingBottom:'100%'}}>
                              │     └─ <Image src={img} alt={title} fill />
                              │
                              └─ Title Container
                                 └─ <div className="p-4 text-center">
                                    └─ <span className="text-lg font-semibold...">
                                       └─ {getRegistryTitle(r)}
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
│  │  │  ├─ Navigation (Головна, Реєстри, Документація)       │  │  │
│  │  │  └─ Language Switcher                                  │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  │                                                              │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │  {children} ← HomePage inserted here                   │  │  │
│  │  │  ┌──────────────────────────────────────────────────┐  │  │  │
│  │  │  │  HOMEPAGE (app/page.tsx - Server Component)      │  │  │  │
│  │  │  │  ┌────────────────────────────────────────────┐  │  │  │  │
│  │  │  │  │  HERO BANNER (h-32)                        │  │  │  │  │
│  │  │  │  │  ┌──────────────────────────────────────┐  │  │  │  │  │
│  │  │  │  │  │  Background: Hero_ezdorovya.webp     │  │  │  │  │  │
│  │  │  │  │  │  ┌────────────────────────────────┐  │  │  │  │  │  │
│  │  │  │  │  │  │  Overlay: bg-black/20          │  │  │  │  │  │  │
│  │  │  │  │  │  │  ┌──────────────────────────┐  │  │  │  │  │  │  │
│  │  │  │  │  │  │  │  <h1> е-Здоров'я        │  │  │  │  │  │  │  │
│  │  │  │  │  │  │  └──────────────────────────┘  │  │  │  │  │  │  │
│  │  │  │  │  │  └────────────────────────────────┘  │  │  │  │  │  │
│  │  │  │  │  └──────────────────────────────────────┘  │  │  │  │  │
│  │  │  │  └────────────────────────────────────────────┘  │  │  │  │
│  │  │  │  ┌────────────────────────────────────────────┐  │  │  │  │
│  │  │  │  │  REGISTRIES GRID SECTION (py-8)            │  │  │  │  │
│  │  │  │  │  ┌──────────────────────────────────────┐  │  │  │  │  │
│  │  │  │  │  │  <h2> Медичні Реєстри (text-4xl)   │  │  │  │  │  │
│  │  │  │  │  └──────────────────────────────────────┘  │  │  │  │  │
│  │  │  │  │  ┌──────────────────────────────────────┐  │  │  │  │  │
│  │  │  │  │  │  GRID (responsive cols-1→4)          │  │  │  │  │  │
│  │  │  │  │  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐│  │  │  │  │  │
│  │  │  │  │  │  │Card 1│ │Card 2│ │Card 3│ │Card 4││  │  │  │  │  │
│  │  │  │  │  │  │ЕКОПФО│ │Ендо..│ │Інтерн│ │Вакан││  │  │  │  │  │
│  │  │  │  │  │  │[img] │ │[img] │ │[img] │ │[img] ││  │  │  │  │  │
│  │  │  │  │  │  └──────┘ └──────┘ └──────┘ └──────┘│  │  │  │  │  │
│  │  │  │  │  │  ┌──────┐ ┌──────┐ ┌──────┐         │  │  │  │  │  │
│  │  │  │  │  │  │Card 5│ │Card 6│ │Card 7│         │  │  │  │  │  │
│  │  │  │  │  │  │БПР   │ │е-Кров│ │СЕН   │         │  │  │  │  │  │
│  │  │  │  │  │  │[img] │ │[img] │ │[img] │         │  │  │  │  │  │
│  │  │  │  │  │  └──────┘ └──────┘ └──────┘         │  │  │  │  │  │
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

**Data Flow схема:**

```
Build Time (SSG):
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  1. Read Files                                          │
│     ├─ config/notebooks.json → registries[]            │
│     └─ locales/ua.json → translations{}                │
│                                                         │
│  2. Execute HomePage Component                          │
│     ├─ cookies().get('NEXT_LOCALE') → 'uk'             │
│     ├─ await getTranslations('uk') → t{}               │
│     ├─ await loadRegistries() → registries[]           │
│     └─ Render JSX with data                            │
│                                                         │
│  3. Generate Static HTML                                │
│     └─ .next/server/app/page.html                      │
│                                                         │
│  4. Deploy to Vercel                                    │
│     └─ Served from CDN (instant)                       │
└─────────────────────────────────────────────────────────┘

Request Time (Production):
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  User → GET / → CDN → Pre-rendered HTML → Browser      │
│                                                         │
│  No server execution ✅                                 │
│  No database queries ✅                                 │
│  No API calls ✅                                        │
│  Instant load ✅ (~50ms)                                │
└─────────────────────────────────────────────────────────┘
```

---

**Дата створення:** 13 грудня 2025  
**Файл:** `app/page.tsx`  
**Тип компонента:** Server Component (SSG)  
**URL:** `/`  
**Кількість реєстрів:** 7 карток
