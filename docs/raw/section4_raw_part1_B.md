# 📋 ПАСПОРТ САЙТУ
## Розділ 4: Опис сторінок сайту (Частина 1.B)

---

## 4.1. 🏠 ГОЛОВНА СТОРІНКА (Home Page) — Частина 2

### 4.1.6 Робота з даними

#### 4.1.6.1 Завантаження даних з `config/notebooks.json`

**Структура файлу notebooks.json:**

```json
[
  {
    "slug": "ekopfo",
    "title": "ЕКОПФО",
    "description": "Надані документи описують систему управління медичними справами пацієнтів...",
    "statusUrl": "https://ekoppho.instatus.com",
    "links": [
      {
        "label": "Аналітичний ШІ по модулю ЕКОПФО",
        "url": "https://notebooklm.google.com/notebook/...",
        "image": "/images/ai-ekopfo.webp"
      },
      {
        "label": "Підтримка користувачів",
        "url": "https://e-health-ua.atlassian.net/servicedesk/...",
        "image": "/images/Helpdesk.webp"
      }
    ]
  },
  // ... 6 more registries
]
```

**Функція завантаження даних:**

```typescript
// app/page.tsx
async function loadRegistries(): Promise<Registry[]> {
  // 1. Construct file path
  const file = path.join(process.cwd(), 'config', 'notebooks.json')
  //    process.cwd() → /path/to/web/
  //    Result: /path/to/web/config/notebooks.json
  
  try {
    // 2. Read file synchronously (Server Component)
    const data = fs.readFileSync(file, 'utf-8')
    //    Returns: JSON string
    
    // 3. Parse JSON
    return JSON.parse(data)
    //    Returns: Array<Registry>
    
  } catch (e) {
    // 4. Error handling (file missing/invalid)
    console.error('Failed to load registries:', e)
    return []  // Empty array fallback
  }
}
```

**Виконання під час збірки:**

```
Build Time (npm run build):
┌─────────────────────────────────────────────────┐
│  1. Next.js executes HomePage component         │
│     ↓                                            │
│  2. Calls loadRegistries()                      │
│     ├─ Reads: config/notebooks.json             │
│     ├─ Parses: JSON → Array (7 items)           │
│     └─ Returns: Registry[]                      │
│     ↓                                            │
│  3. Data available for rendering                │
│     ├─ registries[0] = { slug: "ekopfo", ... }  │
│     ├─ registries[1] = { slug: "endopro...", ...}│
│     └─ ... 7 items total                        │
│     ↓                                            │
│  4. Static HTML generated with data             │
│     └─ Saved to .next/server/app/page.html      │
└─────────────────────────────────────────────────┘

Request Time (Production):
┌─────────────────────────────────────────────────┐
│  1. User visits /                               │
│     ↓                                            │
│  2. Vercel serves pre-rendered HTML             │
│     └─ No file read needed ✅                   │
│     └─ Instant response (~50ms) ✅              │
└─────────────────────────────────────────────────┘
```

#### 4.1.6.2 Передача даних у компоненти

**Data Flow на HomePage:**

```typescript
export default async function HomePage() {
  // STEP 1: Load data sources
  const locale = cookies().get('NEXT_LOCALE')?.value ?? 'uk'
  const t = await getTranslations(locale)
  const registries = await loadRegistries()
  
  // STEP 2: Create helper function (closure over `t`)
  const getRegistryTitle = (registry: Registry) => {
    const translatedTitle = t.registryCards?.[registry.slug]
    return translatedTitle || registry.title
  }
  
  // STEP 3: Pass data to JSX
  return (
    <>
      {/* Hero uses translations directly */}
      <h1>{t.siteTitle}</h1>
      
      {/* Section title uses translations */}
      <h2>{t.medicalRegistries}</h2>
      
      {/* Cards use both registries + translations */}
      {registries.map((r) => (
        <Card
          key={r.slug}
          slug={r.slug}
          image={r.links?.[0]?.image || '/images/Helpdesk.webp'}
          title={getRegistryTitle(r)}  // ← Combined data
        />
      ))}
    </>
  )
}
```

**Data Dependencies:**

```
loadRegistries() → registries[]
      ↓
   Registry Object
   ├─ slug: string
   ├─ title: string
   ├─ description: string
   ├─ statusUrl?: string
   └─ links?: Array
      ├─ label: string
      ├─ url: string
      └─ image?: string

getTranslations(locale) → t{}
      ↓
   Translation Object
   ├─ siteTitle: string
   ├─ medicalRegistries: string
   ├─ registersNotFound: string
   └─ registryCards: Object
      ├─ ekopfo: string
      ├─ endoprosthesis: string
      └─ ... (7 keys)

Combined in JSX:
   registries[0].slug + t.registryCards[slug] → Card title
   registries[0].links[0].image → Card image
```

**Приклад даних для однієї картки:**

```typescript
// Input data:
const registry = {
  slug: "ekopfo",
  title: "ЕКОПФО",
  links: [
    { image: "/images/ai-ekopfo.webp", ... }
  ]
}

const t = {
  registryCards: {
    ekopfo: "ЕКОПФО"  // Ukrainian translation
  }
}

// Processing:
const img = registry.links[0].image  // "/images/ai-ekopfo.webp"
const title = getRegistryTitle(registry)  // "ЕКОПФО" (from t.registryCards)

// Output to Card:
<Card
  slug="ekopfo"
  image="/images/ai-ekopfo.webp"
  title="ЕКОПФО"
  href="/registers/ekopfo"
/>
```

### 4.1.7 Рендеринг карток реєстрів

#### 4.1.7.1 Дані для карток

**Структура даних однієї картки:**

```typescript
interface CardData {
  // From notebooks.json:
  slug: string              // "ekopfo"
  originalTitle: string     // "ЕКОПФО" (from JSON)
  image: string            // "/images/ai-ekopfo.webp" or fallback
  
  // From translations:
  translatedTitle: string   // "ЕКОПФО" (from ua.json) or "EKOPFO" (from en.json)
  
  // Generated:
  href: string             // "/registers/ekopfo"
}
```

**Приклади даних для всіх карток:**

```javascript
// Card 1
{
  slug: "ekopfo",
  image: "/images/ai-ekopfo.webp",
  title: "ЕКОПФО",  // UA or "EKOPFO" in EN
  href: "/registers/ekopfo"
}

// Card 2
{
  slug: "endoprosthesis",
  image: "/images/ai-endoprosthesis.webp",
  title: "Ендопротезування",  // UA or "Endoprosthesis" in EN
  href: "/registers/endoprosthesis"
}

// Card 3
{
  slug: "internatura",
  image: "/images/ai-internatura.webp",
  title: "Інтернатура",  // UA or "Internship" in EN
  href: "/registers/internatura"
}

// Card 4
{
  slug: "vacancies",
  image: "/images/ai-vacancies.webp",
  title: "Вакансії",  // UA or "Vacancies" in EN
  href: "/registers/vacancies"
}

// Card 5
{
  slug: "bpr",
  image: "/images/ai-bpr.webp",
  title: "Система Безперервного Розвитку",  // UA
  href: "/registers/bpr"
}

// Card 6
{
  slug: "ekrov",
  image: "/images/ai-ekrov.webp",
  title: "е-Кров",  // UA or "e-Blood" in EN
  href: "/registers/ekrov"
}

// Card 7
{
  slug: "sen-ikp",
  image: "/images/ai-senikp.webp",
  title: "СЕН ІКП",  // UA
  href: "/registers/sen-ikp"
}
```

#### 4.1.7.2 Формування списку карток

**Логіка рендерингу:**

```typescript
// Inside HomePage component
return (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {registries.map((r) => {
      // 1. Extract image (with fallback)
      const img = (r.links && r.links.length > 0 && r.links[0].image) 
        ? r.links[0].image 
        : '/images/Helpdesk.webp'
      
      // 2. Get translated title
      const title = getRegistryTitle(r)
      
      // 3. Render card
      return (
        <div
          key={r.slug}  // ← React key for list
          className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow hover:scale-105"
        >
          <Link href={`/registers/${r.slug}`} className="block">
            {/* Image */}
            <div className="relative w-full" style={{ paddingBottom: '100%' }}>
              <Image
                src={img}
                alt={title}
                fill
                className="object-cover absolute inset-0"
              />
            </div>
            
            {/* Title */}
            <div className="p-4 text-center">
              <span className="text-lg font-semibold text-blue-600">
                {title}
              </span>
            </div>
          </Link>
        </div>
      )
    })}
  </div>
)
```

**Loop execution flow:**

```
Iteration 1:
  r = registries[0] = { slug: "ekopfo", ... }
  ↓
  img = "/images/ai-ekopfo.webp"
  title = "ЕКОПФО"
  ↓
  Render: <Card key="ekopfo" href="/registers/ekopfo" ... />

Iteration 2:
  r = registries[1] = { slug: "endoprosthesis", ... }
  ↓
  img = "/images/ai-endoprosthesis.webp"
  title = "Ендопротезування"
  ↓
  Render: <Card key="endoprosthesis" href="/registers/endoprosthesis" ... />

... (repeat for 7 items)

Result: 7 cards rendered
```

#### 4.1.7.3 Props передані у компонент (Inline)

**HomePage НЕ використовує RegisterCard компонент:**

```typescript
// ❌ NOT used:
// import RegisterCard from './components/RegisterCard'
// <RegisterCard title={...} image={...} url={...} />

// ✅ Instead: Inline card rendering
<div key={r.slug} className="...">
  <Link href={`/registers/${r.slug}`}>
    <Image src={img} alt={title} fill />
    <span>{title}</span>
  </Link>
</div>
```

**"Virtual Props" (якби використовувався компонент):**

```typescript
// If RegisterCard was used, props would be:
interface VirtualCardProps {
  key: string              // r.slug
  title: string           // getRegistryTitle(r)
  image: string           // r.links[0].image || fallback
  url: string             // `/registers/${r.slug}`
}

// Example:
<RegisterCard
  key="ekopfo"
  title="ЕКОПФО"
  image="/images/ai-ekopfo.webp"
  url="/registers/ekopfo"
/>
```

**Фактичні Props для вкладених компонентів:**

```typescript
// Link component props:
<Link
  href="/registers/ekopfo"  // ← Generated from slug
  className="block"
>

// Image component props:
<Image
  src="/images/ai-ekopfo.webp"  // ← From links[0].image
  alt="ЕКОПФО"                   // ← Translated title
  fill={true}                    // ← Fixed prop
  className="object-cover absolute inset-0"
/>

// Span content:
<span className="text-lg font-semibold text-blue-600">
  ЕКОПФО  {/* ← Translated title */}
</span>
```

### 4.1.8 Локалізація

#### 4.1.8.1 Підключення getTranslations()

**Імпорт та виклик:**

```typescript
// app/page.tsx
import { getTranslations } from '../lib/i18n'

export default async function HomePage() {
  // 1. Get locale from cookie
  const cookieStore = cookies()
  const localeCookie = cookieStore.get('NEXT_LOCALE')
  const locale = localeCookie?.value ?? 'uk'  // Default to 'uk'
  
  // 2. Load translations
  const t = await getTranslations(locale)
  //    ↑ async function call
  //    Returns: Promise<TranslationObject>
  
  // 3. Use translations in JSX
  return <h1>{t.siteTitle}</h1>
}
```

**Реалізація getTranslations:**

```typescript
// lib/i18n.ts
export async function getTranslations(locale: string) {
  // Map locale to filename
  const filename = locale === 'uk' ? 'ua.json' : `${locale}.json`
  //    'uk' → 'ua.json'
  //    'en' → 'en.json'
  
  const file = path.join(process.cwd(), 'locales', filename)
  
  try {
    // Read file
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

**Translation files structure:**

```
locales/
├─ ua.json  (Ukrainian)
│  {
│    "siteTitle": "е-Здоров'я",
│    "medicalRegistries": "Медичні Реєстри",
│    "registryCards": {
│      "ekopfo": "ЕКОПФО",
│      "endoprosthesis": "Ендопротезування",
│      ...
│    }
│  }
│
└─ en.json  (English)
   {
     "siteTitle": "e-Health",
     "medicalRegistries": "Medical Registries",
     "registryCards": {
       "ekopfo": "EKOPFO",
       "endoprosthesis": "Endoprosthesis",
       ...
     }
   }
```

#### 4.1.8.2 Вплив локалізації на контент

**Локалізовані елементи:**

```typescript
// 1. Hero Banner Title
<h1>{t.siteTitle}</h1>
// UA: "е-Здоров'я"
// EN: "e-Health"

// 2. Section Title
<h2>{t.medicalRegistries}</h2>
// UA: "Медичні Реєстри"
// EN: "Medical Registries"

// 3. Empty State Message
<p>{t.registersNotFound}</p>
// UA: "Реєстри не знайдені. Перевірте файл notebooks.json."
// EN: "Registries not found. Check notebooks.json file."

// 4. Registry Card Titles
{registries.map(r => (
  <span>{getRegistryTitle(r)}</span>
  // UA: "ЕКОПФО", "Ендопротезування", ...
  // EN: "EKOPFO", "Endoprosthesis", ...
))}
```

**Приклад перекладу однієї картки:**

```typescript
// Registry data (same in both locales):
const registry = {
  slug: "endoprosthesis",
  title: "Ендопротезування",  // ← Original title (not used if translation exists)
  ...
}

// Ukrainian (ua.json):
t.registryCards.endoprosthesis = "Ендопротезування"
getRegistryTitle(registry) → "Ендопротезування"

// English (en.json):
t.registryCards.endoprosthesis = "Endoprosthesis"
getRegistryTitle(registry) → "Endoprosthesis"
```

**Зміна мови (User Flow):**

```
User clicks Language Switcher (EN)
      ↓
Cookie set: NEXT_LOCALE=en
      ↓
Page reloads
      ↓
HomePage reads cookie: locale = "en"
      ↓
getTranslations("en") loads en.json
      ↓
UI rendered with English text:
  - Site Title: "e-Health"
  - Section: "Medical Registries"
  - Cards: "EKOPFO", "Endoprosthesis", etc.
```

**Fallback logic:**

```typescript
const getRegistryTitle = (registry: Registry) => {
  // Try to get translation
  const translatedTitle = t.registryCards?.[registry.slug]
  
  // Fallback chain:
  // 1. Use translation if exists
  // 2. Otherwise use original title from JSON
  return translatedTitle || registry.title
}

// Example:
// If t.registryCards.bpr is missing:
//   returns registry.title ("Система Безперервного Розвитку")
// If t.registryCards.bpr exists:
//   returns t.registryCards.bpr ("Continuing Professional Development")
```

### 4.1.9 Приклади коду (Key Logic)

#### 4.1.9.1 Завантаження та об'єднання даних

```typescript
export default async function HomePage() {
  // Load locale
  const locale = cookies().get('NEXT_LOCALE')?.value ?? 'uk'
  
  // Load translations + registries in parallel
  const [t, registries] = await Promise.all([
    getTranslations(locale),
    loadRegistries()
  ])
  
  // Helper: merge translation with registry data
  const getRegistryTitle = (r: Registry) => 
    t.registryCards?.[r.slug] || r.title
  
  return (/* JSX */)
}
```

#### 4.1.9.2 Conditional rendering

```typescript
{registries.length === 0 ? (
  // Empty state
  <p className="text-red-600 text-center">
    {t.registersNotFound}
  </p>
) : (
  // Grid with cards
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {registries.map((r) => (/* Card JSX */))}
  </div>
)}
```

#### 4.1.9.3 Image fallback logic

```typescript
// Extract image with fallback
const img = (r.links && r.links.length > 0 && r.links[0].image) 
  ? r.links[0].image 
  : '/images/Helpdesk.webp'

// Equivalent to:
let img;
if (r.links && r.links.length > 0 && r.links[0].image) {
  img = r.links[0].image;
} else {
  img = '/images/Helpdesk.webp';
}
```

#### 4.1.9.4 Dynamic Link generation

```typescript
{registries.map((r) => (
  <Link 
    key={r.slug}
    href={`/registers/${r.slug}`}
    // Examples:
    // slug: "ekopfo" → href: "/registers/ekopfo"
    // slug: "internatura" → href: "/registers/internatura"
  >
    {/* Card content */}
  </Link>
))}
```

#### 4.1.9.5 Responsive Image container

```typescript
// Square aspect ratio container
<div 
  className="relative w-full" 
  style={{ paddingBottom: '100%' }}
  // paddingBottom: '100%' → height = width (square)
>
  <Image
    src={img}
    alt={title}
    fill  // ← Fills parent container
    className="object-cover absolute inset-0"
    // object-cover → maintains aspect ratio, crops if needed
  />
</div>
```

### 4.1.10 ASCII схема потоку даних

**Повний Data Flow:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     HOMEPAGE DATA FLOW                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  BUILD TIME (npm run build)                                             │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                   │ │
│  │  1. DATA SOURCES                                                  │ │
│  │     ┌─────────────────────┐    ┌─────────────────────┐           │ │
│  │     │ config/             │    │ locales/            │           │ │
│  │     │ notebooks.json      │    │ ua.json / en.json   │           │ │
│  │     │                     │    │                     │           │ │
│  │     │ [                   │    │ {                   │           │ │
│  │     │   {                 │    │   "siteTitle": "…", │           │ │
│  │     │     "slug": "...",  │    │   "registryCards": {│           │ │
│  │     │     "title": "...", │    │     "ekopfo": "…",  │           │ │
│  │     │     "links": […]    │    │     ...             │           │ │
│  │     │   },                │    │   }                 │           │ │
│  │     │   ... (7 items)     │    │ }                   │           │ │
│  │     │ ]                   │    │                     │           │ │
│  │     └─────────────────────┘    └─────────────────────┘           │ │
│  │              ↓                           ↓                        │ │
│  │  ┌───────────────────────────────────────────────────────────┐   │ │
│  │  │  2. LOADING FUNCTIONS                                     │   │ │
│  │  │     ┌──────────────────────┐  ┌──────────────────────┐    │   │ │
│  │  │     │ loadRegistries()     │  │ getTranslations()    │    │   │ │
│  │  │     │ ├─ fs.readFileSync() │  │ ├─ cookies().get()   │    │   │ │
│  │  │     │ ├─ JSON.parse()      │  │ ├─ fs.readFileSync() │    │   │ │
│  │  │     │ └─ return Array      │  │ └─ JSON.parse()      │    │   │ │
│  │  │     └──────────────────────┘  └──────────────────────┘    │   │ │
│  │  │              ↓                           ↓                 │   │ │
│  │  │     registries: Registry[]       t: TranslationObject     │   │ │
│  │  └───────────────────────────────────────────────────────────┘   │ │
│  │              ↓                           ↓                        │ │
│  │  ┌───────────────────────────────────────────────────────────┐   │ │
│  │  │  3. DATA PROCESSING                                       │   │ │
│  │  │     ┌─────────────────────────────────────────────────┐   │   │ │
│  │  │     │  getRegistryTitle(registry)                     │   │   │ │
│  │  │     │  ├─ Look up: t.registryCards[registry.slug]     │   │   │ │
│  │  │     │  ├─ Fallback: registry.title                    │   │   │ │
│  │  │     │  └─ Return: localized title                     │   │   │ │
│  │  │     └─────────────────────────────────────────────────┘   │   │ │
│  │  │     ┌─────────────────────────────────────────────────┐   │   │ │
│  │  │     │  Image selection                                │   │   │ │
│  │  │     │  ├─ Try: registry.links[0].image                │   │   │ │
│  │  │     │  └─ Fallback: '/images/Helpdesk.webp'           │   │   │ │
│  │  │     └─────────────────────────────────────────────────┘   │   │ │
│  │  └───────────────────────────────────────────────────────────┘   │ │
│  │              ↓                                                    │ │
│  │  ┌───────────────────────────────────────────────────────────┐   │ │
│  │  │  4. COMPONENT RENDERING                                   │   │ │
│  │  │                                                           │   │ │
│  │  │     HomePage Component (Server)                           │   │ │
│  │  │     ├─ Hero Banner                                        │   │ │
│  │  │     │  └─ <h1>{t.siteTitle}</h1>                          │   │ │
│  │  │     │                                                      │   │ │
│  │  │     ├─ Section Title                                      │   │ │
│  │  │     │  └─ <h2>{t.medicalRegistries}</h2>                  │   │ │
│  │  │     │                                                      │   │ │
│  │  │     └─ Cards Grid                                         │   │ │
│  │  │        └─ registries.map((r) => (                         │   │ │
│  │  │           <Card                                           │   │ │
│  │  │             key={r.slug}                                  │   │ │
│  │  │             href={`/registers/${r.slug}`}                 │   │ │
│  │  │             image={img}                                   │   │ │
│  │  │             title={getRegistryTitle(r)}                   │   │ │
│  │  │           />                                              │   │ │
│  │  │        ))                                                 │   │ │
│  │  └───────────────────────────────────────────────────────────┘   │ │
│  │              ↓                                                    │ │
│  │  ┌───────────────────────────────────────────────────────────┐   │ │
│  │  │  5. STATIC HTML GENERATION                                │   │ │
│  │  │                                                           │   │ │
│  │  │     <html>                                                │   │ │
│  │  │       <body>                                              │   │ │
│  │  │         <Header />                                        │   │ │
│  │  │         <div class="hero">                                │   │ │
│  │  │           <h1>е-Здоров'я</h1>                            │   │ │
│  │  │         </div>                                            │   │ │
│  │  │         <div class="grid">                                │   │ │
│  │  │           <a href="/registers/ekopfo">                    │   │ │
│  │  │             <img src="/images/ai-ekopfo.webp" />          │   │ │
│  │  │             <span>ЕКОПФО</span>                           │   │ │
│  │  │           </a>                                            │   │ │
│  │  │           <!-- 6 more cards -->                           │   │ │
│  │  │         </div>                                            │   │ │
│  │  │         <Footer />                                        │   │ │
│  │  │       </body>                                             │   │ │
│  │  │     </html>                                               │   │ │
│  │  │                                                           │   │ │
│  │  │     Saved to: .next/server/app/page.html                 │   │ │
│  │  └───────────────────────────────────────────────────────────┘   │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  RUNTIME (User Request)                                                 │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                   │ │
│  │  User Request: GET /                                              │ │
│  │       ↓                                                           │ │
│  │  Vercel CDN                                                       │ │
│  │       ↓                                                           │ │
│  │  Serve: .next/server/app/page.html (pre-rendered)                │ │
│  │       ↓                                                           │ │
│  │  Browser receives HTML                                            │ │
│  │       ↓                                                           │ │
│  │  ┌────────────────────────────────────────────────────────────┐  │ │
│  │  │  Browser Rendering                                         │  │ │
│  │  │  ┌──────────────────────────────────────────────────────┐  │  │ │
│  │  │  │  Parse HTML                                          │  │  │ │
│  │  │  │  ├─ DOM construction                                 │  │  │ │
│  │  │  │  ├─ CSS parsing (Tailwind)                           │  │  │ │
│  │  │  │  └─ Layout calculation                               │  │  │ │
│  │  │  └──────────────────────────────────────────────────────┘  │  │ │
│  │  │  ┌──────────────────────────────────────────────────────┐  │  │ │
│  │  │  │  Hydration (Client Components)                       │  │  │ │
│  │  │  │  ├─ Header (interactive navigation)                  │  │  │ │
│  │  │  │  ├─ LanguageSwitcher (click handlers)                │  │  │ │
│  │  │  │  └─ Footer (HelpdeskLink)                            │  │  │ │
│  │  │  └──────────────────────────────────────────────────────┘  │  │ │
│  │  │  ┌──────────────────────────────────────────────────────┐  │  │ │
│  │  │  │  Image Loading                                       │  │  │ │
│  │  │  │  ├─ Next.js Image optimization                       │  │  │ │
│  │  │  │  ├─ Lazy load images (viewport detection)            │  │  │ │
│  │  │  │  └─ WebP conversion (automatic)                      │  │  │ │
│  │  │  └──────────────────────────────────────────────────────┘  │  │ │
│  │  └────────────────────────────────────────────────────────────┘  │ │
│  │       ↓                                                           │ │
│  │  ┌────────────────────────────────────────────────────────────┐  │ │
│  │  │  USER INTERFACE                                            │  │ │
│  │  │  ┌──────────────────────────────────────────────────────┐  │  │ │
│  │  │  │  [Header with Logo + Nav + Lang Switcher]           │  │  │ │
│  │  │  └──────────────────────────────────────────────────────┘  │  │ │
│  │  │  ┌──────────────────────────────────────────────────────┐  │  │ │
│  │  │  │  [Hero Banner: "е-Здоров'я"]                        │  │  │ │
│  │  │  └──────────────────────────────────────────────────────┘  │  │ │
│  │  │  ┌──────────────────────────────────────────────────────┐  │  │ │
│  │  │  │  [Section: "Медичні Реєстри"]                       │  │  │ │
│  │  │  └──────────────────────────────────────────────────────┘  │  │ │
│  │  │  ┌──────────────────────────────────────────────────────┐  │  │ │
│  │  │  │  [Grid: 7 cards displayed]                          │  │  │ │
│  │  │  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐                        │  │  │ │
│  │  │  │  │Card│ │Card│ │Card│ │Card│                        │  │  │ │
│  │  │  │  │ 1  │ │ 2  │ │ 3  │ │ 4  │                        │  │  │ │
│  │  │  │  └────┘ └────┘ └────┘ └────┘                        │  │  │ │
│  │  │  │  ┌────┐ ┌────┐ ┌────┐                               │  │  │ │
│  │  │  │  │Card│ │Card│ │Card│                               │  │  │ │
│  │  │  │  │ 5  │ │ 6  │ │ 7  │                               │  │  │ │
│  │  │  │  └────┘ └────┘ └────┘                               │  │  │ │
│  │  │  └──────────────────────────────────────────────────────┘  │  │ │
│  │  │  ┌──────────────────────────────────────────────────────┐  │  │ │
│  │  │  │  [Footer with Helpdesk Link]                        │  │  │ │
│  │  │  └──────────────────────────────────────────────────────┘  │  │ │
│  │  └────────────────────────────────────────────────────────────┘  │ │
│  └───────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

**Спрощена схема Data → UI:**

```
DATA SOURCES
├─ config/notebooks.json
│  └─ 7 registries with metadata
└─ locales/ua.json (or en.json)
   └─ UI translations

      ↓ LOAD

SERVER COMPONENT
├─ loadRegistries() → registries[]
├─ getTranslations() → t{}
└─ getRegistryTitle() → merge data

      ↓ PROCESS

JSX RENDERING
├─ Hero: t.siteTitle
├─ Section: t.medicalRegistries
└─ Grid: registries.map((r) => Card)
   ├─ href: /registers/{slug}
   ├─ image: links[0].image
   └─ title: t.registryCards[slug]

      ↓ BUILD

STATIC HTML
└─ Pre-rendered at build time

      ↓ DEPLOY

CDN (Vercel Edge Network)
└─ Instant delivery to users

      ↓ REQUEST

USER BROWSER
└─ Display rendered page
   ├─ 7 clickable cards
   ├─ Localized text
   └─ Optimized images
```

**Interaction Flow (User Click):**

```
User sees card: "ЕКОПФО"
      ↓
Clicks on card
      ↓
<Link href="/registers/ekopfo">
      ↓
Client-side navigation (Next.js)
      ↓
Navigates to: /registers/ekopfo
      ↓
Registry detail page loads
```

---

**Дата створення:** 13 грудня 2025  
**Файл:** `app/page.tsx`  
**Тип компонента:** Server Component (SSG)  
**Кількість карток:** 7  
**Підтримувані мови:** Ukrainian (uk), English (en)
