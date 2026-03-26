# 📋 ПАСПОРТ САЙТУ
## Розділ 4: Опис сторінок сайту (Частина 2.B)

---

## 4.2. 📊 СТОРІНКА «РЕЄСТРИ» (Registers Page) — Частина 2

### 4.2.6 Робота з даними

#### 4.2.6.1 Завантаження даних про реєстри

**Функція loadRegistries():**

```typescript
async function loadRegistries(): Promise<Registry[]> {
  // 1. Construct file path
  const file = path.join(process.cwd(), 'config', 'notebooks.json')
  //    process.cwd() → /path/to/web/
  //    Result: /path/to/web/config/notebooks.json
  
  try {
    // 2. Read file synchronously (Server Component, build time)
    const data = fs.readFileSync(file, 'utf-8')
    //    Returns: JSON string (entire file content)
    
    // 3. Parse JSON
    return JSON.parse(data)
    //    Returns: Array<Registry> (7 items)
    
  } catch {
    // 4. Error handling (file missing/invalid JSON)
    console.error('Failed to load registries')
    return []  // Empty array fallback
  }
}
```

**Registry interface:**

```typescript
interface Registry {
  id: string           // Unique identifier (not always used)
  name: string         // Internal name
  slug: string         // URL slug (e.g., "ekopfo")
  title: string        // Display title (e.g., "ЕКОПФО")
  description: string  // Full description (not used on this page)
  heroImage?: string   // Optional banner image (not used on this page)
  statusUrl?: string   // Instatus iframe URL ← KEY FIELD
}
```

**Приклад даних з notebooks.json:**

```json
[
  {
    "slug": "ekopfo",
    "title": "ЕКОПФО",
    "description": "Надані документи описують систему управління медичними справами пацієнтів...",
    "statusUrl": "https://ekoppho.instatus.com",
    "links": [...]
  },
  {
    "slug": "endoprosthesis",
    "title": "Ендопротезування",
    "description": "Надані документи описують електронну систему для управління чергою на ендопротезування...",
    "statusUrl": "https://endo.instatus.com/",
    "links": [...]
  },
  {
    "slug": "internatura",
    "title": "Інтернатура",
    "statusUrl": "https://intern.instatus.com/",
    "links": [...]
  },
  {
    "slug": "vacancies",
    "title": "Вакансії",
    "statusUrl": "https://vacancy.instatus.com/",
    "links": [...]
  },
  {
    "slug": "bpr",
    "title": "Система Безперервного Розвитку",
    "statusUrl": "https://bpr-moh.instatus.com/",
    "links": [...]
  },
  {
    "slug": "ekrov",
    "title": "е-Кров",
    "statusUrl": "https://eblood.instatus.com/",
    "links": [...]
  },
  {
    "slug": "sen-ikp",
    "title": "СЕН ІКП",
    "statusUrl": "https://ensicp.instatus.com/",
    "links": [...]
  }
]
```

**Виконання під час збірки:**

```
Build Time (npm run build):
┌─────────────────────────────────────────────────┐
│  Next.js executes RegistersPage component       │
│     ↓                                            │
│  loadRegistries() called                        │
│     ├─ Read: config/notebooks.json              │
│     ├─ Parse: JSON → Array                      │
│     └─ Return: Registry[] (7 items)             │
│     ↓                                            │
│  Data available for filtering/rendering         │
│     ├─ registries[0].slug = "ekopfo"            │
│     ├─ registries[0].statusUrl = "https://..."  │
│     └─ ... (7 registries total)                 │
└─────────────────────────────────────────────────┘

Production Request:
┌─────────────────────────────────────────────────┐
│  User visits /registers                         │
│     ↓                                            │
│  Serve pre-rendered HTML (no file read)         │
│     └─ Instant response ✅                      │
└─────────────────────────────────────────────────┘
```

#### 4.2.6.2 Формування масиву фреймів

**Процес фільтрації:**

```typescript
// Inside RegistersPage component

// Step 1: Load all registries
const registries = await loadRegistries()
// Result: Array of 7 registries

// Step 2: Filter registries with statusUrl
const registriesWithStatus = registries
  .filter(r => r.statusUrl)
//         ↑ Boolean check: only include if statusUrl exists

// Current data: ALL 7 registries have statusUrl
// registriesWithStatus = [
//   { slug: "ekopfo", statusUrl: "https://ekoppho.instatus.com" },
//   { slug: "endoprosthesis", statusUrl: "https://endo.instatus.com/" },
//   { slug: "internatura", statusUrl: "https://intern.instatus.com/" },
//   { slug: "vacancies", statusUrl: "https://vacancy.instatus.com/" },
//   { slug: "bpr", statusUrl: "https://bpr-moh.instatus.com/" },
//   { slug: "ekrov", statusUrl: "https://eblood.instatus.com/" },
//   { slug: "sen-ikp", statusUrl: "https://ensicp.instatus.com/" }
// ]

// registriesWithStatus.length === 7 ✅
```

**Навіщо фільтрація?**

```yaml
Purpose:
  - Prepare for future where some registries might not have Instatus
  - Defensive programming (avoid rendering iframes with undefined src)
  - Clean separation: only show status for systems with monitoring

Example (hypothetical):
  registries = [
    { slug: "ekopfo", statusUrl: "https://..." },     ✅ Included
    { slug: "new-system", statusUrl: undefined },     ❌ Excluded
  ]
  
  registriesWithStatus = [
    { slug: "ekopfo", statusUrl: "https://..." }
  ]
  // Only 1 iframe rendered
```

**Альтернативний підхід (без фільтрації):**

```typescript
// Could also use conditional rendering:
{registries.map(r => (
  r.statusUrl ? (
    <iframe src={r.statusUrl} />
  ) : null
))}

// Current approach (filter first) is cleaner:
{registriesWithStatus.map(r => (
  <iframe src={r.statusUrl} />  // No need for conditional
))}
```

**Повний Data Flow:**

```
notebooks.json (file on disk)
      ↓ fs.readFileSync()
JSON string
      ↓ JSON.parse()
Array<Registry> (7 items)
      ↓ .filter(r => r.statusUrl)
Array<Registry> (7 items with statusUrl)
      ↓ .map(registry => (...))
7 iframe JSX elements
      ↓ Next.js rendering
Static HTML with 7 <iframe> tags
```

### 4.2.7 Рендеринг статус-фреймів (iframe)

#### 4.2.7.1 Правила розміщення (2 в ряд)

**CSS Grid Layout:**

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Cards rendered here */}
</div>

// Breakdown:
// grid                 → Enable CSS Grid
// grid-cols-1          → 1 column on mobile (default)
// md:grid-cols-2       → 2 columns on medium+ screens (≥768px)
// gap-6                → 1.5rem (24px) gap between items
```

**Responsive behavior:**

```
Mobile (< 768px):
┌──────────────────┐
│  Card 1 (ЕКОПФО) │
├──────────────────┤
│  Card 2 (Ендо..) │
├──────────────────┤
│  Card 3 (Інтер.) │
├──────────────────┤
│  Card 4 (Вакан.) │
├──────────────────┤
│  Card 5 (БПР)    │
├──────────────────┤
│  Card 6 (е-Кров) │
├──────────────────┤
│  Card 7 (СЕН ІКП)│
└──────────────────┘
1 column (stacked vertically)

Desktop (≥ 768px):
┌──────────────────┬──────────────────┐
│  Card 1 (ЕКОПФО) │  Card 2 (Ендо..) │
├──────────────────┼──────────────────┤
│  Card 3 (Інтер.) │  Card 4 (Вакан.) │
├──────────────────┼──────────────────┤
│  Card 5 (БПР)    │  Card 6 (е-Кров) │
├──────────────────┼──────────────────┤
│  Card 7 (СЕН ІКП)│                  │
└──────────────────┴──────────────────┘
2 columns (side-by-side)
```

**Grid auto-flow:**

```css
/* CSS Grid automatically places items */
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);  /* 2 equal columns */
  grid-auto-flow: row;                     /* Fill rows first */
  gap: 1.5rem;
}

/* Result:
   Item 1 → Column 1, Row 1
   Item 2 → Column 2, Row 1
   Item 3 → Column 1, Row 2
   Item 4 → Column 2, Row 2
   Item 5 → Column 1, Row 3
   Item 6 → Column 2, Row 3
   Item 7 → Column 1, Row 4 (last item, column 2 empty)
*/
```

#### 4.2.7.2 Формування URL для кожного фрейму

**URL Source:**

```typescript
{registriesWithStatus.map((registry) => {
  // registry.statusUrl is used directly
  return (
    <iframe 
      src={registry.statusUrl}  // ← Direct usage from JSON
      {...}
    />
  )
})}
```

**Приклади URL для кожного реєстру:**

```yaml
ЕКОПФО:
  slug: "ekopfo"
  statusUrl: "https://ekoppho.instatus.com"
  # Note: Different domain (ekoppho vs ekopfo)

Ендопротезування:
  slug: "endoprosthesis"
  statusUrl: "https://endo.instatus.com/"
  # Shortened domain name

Інтернатура:
  slug: "internatura"
  statusUrl: "https://intern.instatus.com/"
  # Shortened domain name

Вакансії:
  slug: "vacancies"
  statusUrl: "https://vacancy.instatus.com/"
  # Singular form (vacancy vs vacancies)

БПР:
  slug: "bpr"
  statusUrl: "https://bpr-moh.instatus.com/"
  # Includes "-moh" (Ministry of Health)

е-Кров:
  slug: "ekrov"
  statusUrl: "https://eblood.instatus.com/"
  # English translation (eblood)

СЕН ІКП:
  slug: "sen-ikp"
  statusUrl: "https://ensicp.instatus.com/"
  # Abbreviated (ensicp)
```

**URL validation (implicit):**

```typescript
// No explicit URL validation in code
// Trusts that notebooks.json has valid URLs

// If invalid URL:
// - Browser will show error in iframe
// - No page crash (iframe is sandboxed)
// - User sees "This site can't be reached" in iframe

// Production safeguard (could add):
const isValidUrl = (url: string) => {
  try {
    new URL(url)
    return url.startsWith('https://')
  } catch {
    return false
  }
}

// Usage (not currently implemented):
{registriesWithStatus
  .filter(r => r.statusUrl && isValidUrl(r.statusUrl))
  .map(r => <iframe src={r.statusUrl} />)
}
```

#### 4.2.7.3 Адаптивність фреймів

**Iframe розміри:**

```typescript
<div className="w-full h-[42vh] min-h-[280px] border rounded overflow-hidden shadow-lg">
  <iframe 
    src={registry.statusUrl} 
    className="w-full h-full" 
    title={`${registryName} Status`}
  />
</div>

// Container:
//   w-full        → 100% width (fills grid column)
//   h-[42vh]      → 42% of viewport height
//   min-h-[280px] → Minimum 280px (prevent too small on short screens)
//
// Iframe:
//   w-full        → 100% width (fills container)
//   h-full        → 100% height (fills container)
```

**Viewport-based height calculation:**

```
Viewport Height Examples:

Screen 1920x1080 (laptop):
  Viewport Height: 1080px
  42vh = 1080 * 0.42 = 453.6px
  min-h-[280px] not applied (453px > 280px) ✅
  Final height: 453px

Screen 1366x768 (small laptop):
  Viewport Height: 768px
  42vh = 768 * 0.42 = 322.56px
  min-h-[280px] not applied (322px > 280px) ✅
  Final height: 322px

Screen 375x667 (mobile portrait):
  Viewport Height: 667px
  42vh = 667 * 0.42 = 280.14px
  min-h-[280px] not applied (280px ≈ 280px) ✅
  Final height: 280px

Screen 320x568 (small mobile):
  Viewport Height: 568px
  42vh = 568 * 0.42 = 238.56px
  min-h-[280px] APPLIED (238px < 280px) ✅
  Final height: 280px (enforced minimum)
```

**Responsive Grid + Iframe Sizes:**

```
Mobile (375x667):
┌────────────────────────────┐
│  Container: w-full (375px) │
│  ┌──────────────────────┐  │
│  │ ЕКОПФО               │  │
│  │ iframe: 375px x 280px│  │
│  └──────────────────────┘  │
│  ┌──────────────────────┐  │
│  │ Ендопротезування     │  │
│  │ iframe: 375px x 280px│  │
│  └──────────────────────┘  │
│  ...                       │
└────────────────────────────┘
1 column, each iframe full width

Desktop (1920x1080):
┌──────────────────────────────────────────────────┐
│  Grid gap: 24px                                  │
│  ┌────────────────────┐  ┌────────────────────┐ │
│  │ ЕКОПФО             │  │ Ендопротезування   │ │
│  │ iframe:            │  │ iframe:            │ │
│  │ 948px x 453px      │  │ 948px x 453px      │ │
│  └────────────────────┘  └────────────────────┘ │
│  ┌────────────────────┐  ┌────────────────────┐ │
│  │ Інтернатура        │  │ Вакансії           │ │
│  │ iframe:            │  │ iframe:            │ │
│  │ 948px x 453px      │  │ 948px x 453px      │ │
│  └────────────────────┘  └────────────────────┘ │
│  ...                                             │
└──────────────────────────────────────────────────┘
2 columns, each iframe half width minus gap
```

**Iframe content scaling:**

```yaml
Instatus Widget Behavior:
  - Responsive by default
  - Detects iframe dimensions
  - Adjusts content layout accordingly
  - Shows:
    * Status indicators (🟢 Operational / 🟠 Degraded / 🔴 Outage)
    * Uptime percentage
    * Incident history
    * Performance graphs (if enabled)

Mobile Optimization:
  - Instatus widget adapts to narrow width
  - Stacks components vertically
  - Hides less important details
  - Prioritizes status indicators

Desktop:
  - Full widget layout
  - Side-by-side components
  - Detailed graphs and metrics
  - More incident history visible
```

### 4.2.8 Локалізація

#### 4.2.8.1 Підключення getTranslations()

**Імпорт та виклик:**

```typescript
// app/registers/page.tsx
import { getTranslations } from '../../lib/i18n'

export default async function RegistersPage() {
  // 1. Get locale from cookie
  const c = cookies().get('NEXT_LOCALE')
  const locale = c?.value ?? 'uk'  // Default to Ukrainian
  
  // 2. Load translations
  const t = await getTranslations(locale)
  //    ↑ async function call (Server Component)
  //    Returns: Promise<TranslationObject>
  
  // 3. Use translations in JSX
  return (
    <>
      <h1>{t.registers?.title || 'Реєстри - Статус'}</h1>
      {/* ... */}
    </>
  )
}
```

**Реалізація getTranslations (lib/i18n.ts):**

```typescript
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

#### 4.2.8.2 Ключі локалізації

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

**Використання ключів локалізації:**

```typescript
// 1. Page Title (Hero Banner)
<h1>
  {t.registers?.title || 'Реєстри - Статус'}
</h1>
// UA: "Реєстри - Статус"
// EN: "Registries - Status"
// Fallback: "Реєстри - Статус" (if t.registers is undefined)

// 2. Registry Card Titles
{registriesWithStatus.map((registry) => {
  const registryName = 
    t.registryCards?.[registry.slug as keyof typeof t.registryCards] 
    || registry.title
  
  return <h3>{registryName}</h3>
})}
// UA: "ЕКОПФО", "Ендопротезування", ...
// EN: "EKOPFO", "Endoprosthesis", ...
// Fallback: registry.title from JSON

// 3. Iframe Accessibility Title
<iframe 
  title={`${registryName} Status`}
/>
// UA: "ЕКОПФО Status"
// EN: "EKOPFO Status"
```

**Fallback chain:**

```typescript
const registryName = 
  t.registryCards?.[registry.slug]  // 1. Try translation
  || registry.title                  // 2. Fallback to JSON title

// Example execution:
// registry.slug = "ekopfo"
//
// Step 1: Look up t.registryCards["ekopfo"]
//   If locale = 'uk': returns "ЕКОПФО" ✅
//   If locale = 'en': returns "EKOPFO" ✅
//   If key missing: returns undefined → go to Step 2
//
// Step 2: Use registry.title
//   returns "ЕКОПФО" (from notebooks.json) ✅
```

**Локалізовані елементи на сторінці:**

```
┌─────────────────────────────────────────────────┐
│  Hero Banner                                    │
│  ┌───────────────────────────────────────────┐  │
│  │  t.registers.title                        │  │
│  │  UA: "Реєстри - Статус"                  │  │
│  │  EN: "Registries - Status"               │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Status Cards (x7)                              │
│  ┌───────────────────────────────────────────┐  │
│  │  t.registryCards.ekopfo                   │  │
│  │  UA: "ЕКОПФО"                             │  │
│  │  EN: "EKOPFO"                             │  │
│  └───────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────┐  │
│  │  t.registryCards.endoprosthesis           │  │
│  │  UA: "Ендопротезування"                   │  │
│  │  EN: "Endoprosthesis"                     │  │
│  └───────────────────────────────────────────┘  │
│  ... (5 more cards)                             │
└─────────────────────────────────────────────────┘
```

### 4.2.9 Приклади коду (Key Logic)

#### 4.2.9.1 Завантаження та фільтрація даних

```typescript
export default async function RegistersPage() {
  // Load data sources
  const locale = cookies().get('NEXT_LOCALE')?.value ?? 'uk'
  const t = await getTranslations(locale)
  const registries = await loadRegistries()
  
  // Filter registries with statusUrl
  const registriesWithStatus = registries.filter(r => r.statusUrl)
  
  return (/* JSX */)
}
```

#### 4.2.9.2 Рендеринг статус-карток

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {registriesWithStatus.map((registry) => {
    const registryName = 
      t.registryCards?.[registry.slug] || registry.title
    
    return (
      <div key={registry.slug} className="space-y-2">
        {/* Title */}
        <h3 className="text-xl font-semibold text-center text-blue-600">
          {registryName}
        </h3>
        
        {/* Iframe */}
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
```

#### 4.2.9.3 Локалізований заголовок

```typescript
<h1 className="text-5xl font-bold text-white">
  {t.registers?.title || 'Реєстри - Статус'}
</h1>

// Equivalent to:
let title;
if (t.registers && t.registers.title) {
  title = t.registers.title;
} else {
  title = 'Реєстри - Статус';
}
```

#### 4.2.9.4 Dynamic iframe attributes

```typescript
<iframe 
  src={registry.statusUrl}
  // Example values:
  // "https://ekoppho.instatus.com"
  // "https://endo.instatus.com/"
  
  className="w-full h-full"
  // 100% width and height of parent container
  
  title={`${registryName} Status`}
  // Accessibility: screen readers announce iframe purpose
  // Examples:
  // "ЕКОПФО Status"
  // "Endoprosthesis Status"
/>
```

#### 4.2.9.5 Responsive container

```typescript
<div className="w-full h-[42vh] min-h-[280px] border rounded overflow-hidden shadow-lg">
  {/* 
    w-full: 100% width
    h-[42vh]: 42% of viewport height (custom Tailwind value)
    min-h-[280px]: Minimum 280px height
    border: 1px border
    rounded: 0.25rem border-radius
    overflow-hidden: Clip iframe content to container
    shadow-lg: Large box shadow
  */}
  <iframe {...} />
</div>
```

### 4.2.10 ASCII схема потоку даних

**Повний Data Flow:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                  REGISTERS PAGE DATA FLOW                               │
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
│  │     │   {                 │    │   "registers": {    │           │ │
│  │     │     "slug": "...",  │    │     "title": "…"    │           │ │
│  │     │     "statusUrl":    │    │   },                │           │ │
│  │     │     "https://..."   │    │   "registryCards": {│           │ │
│  │     │   },                │    │     "ekopfo": "…",  │           │ │
│  │     │   ... (7 items)     │    │     ...             │           │ │
│  │     │ ]                   │    │   }                 │           │ │
│  │     └─────────────────────┘    └─────────────────────┘           │ │
│  │              ↓                           ↓                        │ │
│  │  ┌───────────────────────────────────────────────────────────┐   │ │
│  │  │  2. LOADING FUNCTIONS                                     │   │ │
│  │  │     ┌──────────────────────┐  ┌──────────────────────┐    │   │ │
│  │  │     │ loadRegistries()     │  │ getTranslations()    │    │   │ │
│  │  │     │ ├─ fs.readFileSync() │  │ ├─ cookies().get()   │    │   │ │
│  │  │     │ ├─ JSON.parse()      │  │ ├─ fs.readFileSync() │    │   │ │
│  │  │     │ └─ return Array (7)  │  │ └─ JSON.parse()      │    │   │ │
│  │  │     └──────────────────────┘  └──────────────────────┘    │   │ │
│  │  │              ↓                           ↓                 │   │ │
│  │  │     registries: Registry[]       t: TranslationObject     │   │ │
│  │  └───────────────────────────────────────────────────────────┘   │ │
│  │              ↓                           ↓                        │ │
│  │  ┌───────────────────────────────────────────────────────────┐   │ │
│  │  │  3. DATA FILTERING                                        │   │ │
│  │  │     ┌─────────────────────────────────────────────────┐   │   │ │
│  │  │     │  registries.filter(r => r.statusUrl)           │   │   │ │
│  │  │     │  ↓                                             │   │   │ │
│  │  │     │  registriesWithStatus: Registry[] (7 items)    │   │   │ │
│  │  │     │  All current registries have statusUrl ✅      │   │   │ │
│  │  │     └─────────────────────────────────────────────────┘   │   │ │
│  │  └───────────────────────────────────────────────────────────┘   │ │
│  │              ↓                                                    │ │
│  │  ┌───────────────────────────────────────────────────────────┐   │ │
│  │  │  4. COMPONENT RENDERING                                   │   │ │
│  │  │                                                           │   │ │
│  │  │     RegistersPage Component (Server)                      │   │ │
│  │  │     ├─ Hero Banner                                        │   │ │
│  │  │     │  └─ <h1>{t.registers.title}</h1>                    │   │ │
│  │  │     │                                                      │   │ │
│  │  │     └─ Status Grid (grid-cols-1 md:2)                     │   │ │
│  │  │        └─ registriesWithStatus.map((registry) => (        │   │ │
│  │  │           <StatusCard                                     │   │ │
│  │  │             key={registry.slug}                           │   │ │
│  │  │             title={t.registryCards[slug] || title}        │   │ │
│  │  │             iframeSrc={registry.statusUrl}                │   │ │
│  │  │           />                                              │   │ │
│  │  │        ))                                                 │   │ │
│  │  │                                                           │   │ │
│  │  │     Generates 7 status cards:                             │   │ │
│  │  │     ┌─────────────────┐  ┌─────────────────┐             │   │ │
│  │  │     │ ЕКОПФО          │  │ Ендопротезу...  │             │   │ │
│  │  │     │ <iframe         │  │ <iframe         │             │   │ │
│  │  │     │  src="https://  │  │  src="https://  │             │   │ │
│  │  │     │  ekoppho..."    │  │  endo..."       │             │   │ │
│  │  │     └─────────────────┘  └─────────────────┘             │   │ │
│  │  │     ... (5 more cards)                                    │   │ │
│  │  └───────────────────────────────────────────────────────────┘   │ │
│  │              ↓                                                    │ │
│  │  ┌───────────────────────────────────────────────────────────┐   │ │
│  │  │  5. STATIC HTML GENERATION                                │   │ │
│  │  │                                                           │   │ │
│  │  │     <html>                                                │   │ │
│  │  │       <body>                                              │   │ │
│  │  │         <Header />                                        │   │ │
│  │  │         <div class="hero">                                │   │ │
│  │  │           <h1>Реєстри - Статус</h1>                      │   │ │
│  │  │         </div>                                            │   │ │
│  │  │         <div class="grid grid-cols-1 md:grid-cols-2">    │   │ │
│  │  │           <div>                                           │   │ │
│  │  │             <h3>ЕКОПФО</h3>                               │   │ │
│  │  │             <iframe src="https://ekoppho.instatus.com">   │   │ │
│  │  │             </iframe>                                     │   │ │
│  │  │           </div>                                          │   │ │
│  │  │           <!-- 6 more cards -->                           │   │ │
│  │  │         </div>                                            │   │ │
│  │  │         <Footer />                                        │   │ │
│  │  │       </body>                                             │   │ │
│  │  │     </html>                                               │   │ │
│  │  │                                                           │   │ │
│  │  │     Saved to: .next/server/app/registers/page.html       │   │ │
│  │  └───────────────────────────────────────────────────────────┘   │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  RUNTIME (User Request)                                                 │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                   │ │
│  │  User Request: GET /registers                                     │ │
│  │       ↓                                                           │ │
│  │  Vercel CDN                                                       │ │
│  │       ↓                                                           │ │
│  │  Serve: .next/server/app/registers/page.html (pre-rendered)      │ │
│  │       ↓                                                           │ │
│  │  Browser receives HTML                                            │ │
│  │       ↓                                                           │ │
│  │  ┌────────────────────────────────────────────────────────────┐  │ │
│  │  │  Browser Rendering                                         │  │ │
│  │  │  ┌──────────────────────────────────────────────────────┐  │  │ │
│  │  │  │  Parse HTML                                          │  │  │ │
│  │  │  │  ├─ DOM construction                                 │  │  │ │
│  │  │  │  ├─ CSS parsing (Tailwind)                           │  │  │ │
│  │  │  │  └─ Layout calculation (Grid)                        │  │  │ │
│  │  │  └──────────────────────────────────────────────────────┘  │  │ │
│  │  │  ┌──────────────────────────────────────────────────────┐  │  │ │
│  │  │  │  Hydration (Client Components)                       │  │  │ │
│  │  │  │  ├─ Header (interactive navigation)                  │  │  │ │
│  │  │  │  ├─ LanguageSwitcher (click handlers)                │  │  │ │
│  │  │  │  └─ Footer (HelpdeskLink)                            │  │  │ │
│  │  │  └──────────────────────────────────────────────────────┘  │  │ │
│  │  │  ┌──────────────────────────────────────────────────────┐  │  │ │
│  │  │  │  Iframe Loading (7 iframes)                          │  │  │ │
│  │  │  │  ├─ Browser initiates 7 requests to Instatus         │  │  │ │
│  │  │  │  ├─ Each iframe loads independently                  │  │  │ │
│  │  │  │  ├─ Instatus servers respond with status widgets     │  │  │ │
│  │  │  │  └─ Real-time status data displayed                  │  │  │ │
│  │  │  └──────────────────────────────────────────────────────┘  │  │ │
│  │  └────────────────────────────────────────────────────────────┘  │ │
│  │       ↓                                                           │ │
│  │  ┌────────────────────────────────────────────────────────────┐  │ │
│  │  │  USER INTERFACE                                            │  │ │
│  │  │  ┌──────────────────────────────────────────────────────┐  │  │ │
│  │  │  │  [Header with Logo + Nav + Lang Switcher]           │  │  │ │
│  │  │  └──────────────────────────────────────────────────────┘  │  │ │
│  │  │  ┌──────────────────────────────────────────────────────┐  │  │ │
│  │  │  │  [Hero Banner: "Реєстри - Статус"]                  │  │  │ │
│  │  │  └──────────────────────────────────────────────────────┘  │  │ │
│  │  │  ┌──────────────────────────────────────────────────────┐  │  │ │
│  │  │  │  [Status Grid: 2 columns on desktop]                │  │  │ │
│  │  │  │  ┌────────────────┐ ┌────────────────┐             │  │  │ │
│  │  │  │  │ ЕКОПФО         │ │ Ендопротезу... │             │  │  │ │
│  │  │  │  │ ┌────────────┐ │ │ ┌────────────┐ │             │  │  │ │
│  │  │  │  │ │ 🟢 Online  │ │ │ │ 🟢 Online  │ │             │  │  │ │
│  │  │  │  │ │ 99.9%      │ │ │ │ 99.8%      │ │             │  │  │ │
│  │  │  │  │ │ Uptime     │ │ │ │ Uptime     │ │             │  │  │ │
│  │  │  │  │ │ [Graph]    │ │ │ │ [Graph]    │ │             │  │  │ │
│  │  │  │  │ └────────────┘ │ │ └────────────┘ │             │  │  │ │
│  │  │  │  └────────────────┘ └────────────────┘             │  │  │ │
│  │  │  │  ... (5 more cards)                                │  │  │ │
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
│  └─ 7 registries with statusUrl
└─ locales/ua.json (or en.json)
   └─ Page title + registry names

      ↓ LOAD

SERVER COMPONENT
├─ loadRegistries() → registries[]
├─ getTranslations() → t{}
└─ filter(r => r.statusUrl) → registriesWithStatus[]

      ↓ PROCESS

JSX RENDERING
├─ Hero: t.registers.title
└─ Grid: registriesWithStatus.map(r => StatusCard)
   ├─ Title: t.registryCards[slug]
   └─ Iframe: <iframe src={r.statusUrl} />

      ↓ BUILD

STATIC HTML
└─ Pre-rendered with 7 <iframe> tags

      ↓ DEPLOY

CDN (Vercel Edge Network)
└─ Instant HTML delivery

      ↓ REQUEST

USER BROWSER
├─ Display rendered page
├─ Load 7 iframes from Instatus
└─ Show real-time status data
   ├─ 🟢 Operational
   ├─ 🟠 Degraded Performance
   └─ 🔴 Major Outage
```

**Iframe Loading Sequence:**

```
Browser receives HTML with 7 <iframe> tags
      ↓
For each iframe:
  1. Browser requests: https://ekoppho.instatus.com
  2. Instatus server responds with status widget HTML
  3. Browser renders widget inside iframe sandbox
  4. Widget fetches real-time status data (via JavaScript)
  5. Widget displays current status (🟢/🟠/🔴)
      ↓
All 7 iframes load in parallel
      ↓
Total load time: ~1-3 seconds (depends on network + Instatus)
      ↓
User sees live status dashboard
```

---

**Дата створення:** 13 грудня 2025  
**Файл:** `app/registers/page.tsx`  
**Тип компонента:** Server Component (SSG)  
**URL:** `/registers`  
**Кількість iframe:** 7  
**Grid Layout:** 1 column (mobile) → 2 columns (desktop)  
**Iframe Height:** 42vh (min: 280px)  
**Instatus Integration:** ✅ Real-time status monitoring
