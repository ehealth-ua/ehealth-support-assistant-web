# 📋 ПАСПОРТ САЙТУ
## Розділ 4: Опис сторінок сайту (Частина 3.B)

---

## 4.3. 📄 СТОРІНКИ ОКРЕМИХ РЕЄСТРІВ (Registry Detail Pages) — Частина 2

### 4.3.6 Робота з даними

#### 4.3.6.1 Завантаження даних про реєстр

**Direct Import з notebooks.json:**

```typescript
// Top of file: app/registers/[slug]/page.tsx
import notebooks from "../../../config/notebooks.json"

// notebooks is parsed automatically by Next.js
// Type: Array of registry objects
// Length: 7 items
// Access: Direct JavaScript array
```

**Data Loading Process:**

```
Build Time (npm run build):
┌─────────────────────────────────────────────────┐
│  1. Next.js imports notebooks.json              │
│     ├─ File: web/config/notebooks.json          │
│     ├─ Parsing: Automatic JSON → JavaScript     │
│     └─ Result: Array of 7 NotebookItem objects  │
│     ↓                                            │
│  2. generateStaticParams() executes             │
│     ├─ Maps notebooks to slug array             │
│     └─ Returns: [{ slug: "ekopfo" }, ...]       │
│     ↓                                            │
│  3. For each slug, RegisterDetail() executes    │
│     ├─ Receives: params.slug                    │
│     ├─ Finds: item by slug                      │
│     └─ Renders: Page with item data             │
│     ↓                                            │
│  4. Static HTML generated                       │
│     └─ Saved to: .next/server/app/registers/... │
└─────────────────────────────────────────────────┘

Production Request:
┌─────────────────────────────────────────────────┐
│  User visits: /registers/ekopfo                 │
│     ↓                                            │
│  Serve pre-generated HTML                       │
│     └─ No JSON parsing ✅                       │
│     └─ No data loading ✅                       │
│     └─ Instant response ✅                      │
└─────────────────────────────────────────────────┘
```

**Type Safety:**

```typescript
type NotebookItem = {
  slug: string              // Required: URL identifier
  title: string             // Required: Display title
  description?: string      // Optional: Full description
  statusUrl?: string        // Optional: Instatus iframe URL
  links?: {                 // Optional: External links array
    label: string           // Link label
    url: string             // Link URL
    image?: string          // Optional link image
  }[]
  instructions?: string[]   // Optional: Instruction URLs
}

// Type assertion for safety
const items = Array.isArray(notebooks) 
  ? (notebooks as NotebookItem[]) 
  : []
//    ↑ Ensures TypeScript knows the structure
//    ↑ Fallback to empty array if invalid
```

#### 4.3.6.2 Вибір потрібного елемента за slug

**Find Operation:**

```typescript
export default async function RegisterDetail({ 
  params 
}: { 
  params: { slug: string } 
}) {
  // 1. Convert notebooks to typed array
  const items = Array.isArray(notebooks) ? (notebooks as NotebookItem[]) : []
  
  // 2. Find item by slug
  const item = items.find((n) => n.slug === params.slug)
  //           ↑ Array.find() method
  //           ↑ Compares n.slug with params.slug
  //           ↑ Returns first match or undefined
  
  // Examples:
  // params.slug = "ekopfo"
  //   → item = { slug: "ekopfo", title: "ЕКОПФО", ... } ✅
  //
  // params.slug = "invalid"
  //   → item = undefined ❌
}
```

**Execution Examples:**

```typescript
// Example 1: Valid slug
URL: /registers/ekopfo
params.slug = "ekopfo"
  ↓
items.find(n => n.slug === "ekopfo")
  ↓ Iteration:
  items[0].slug = "ekopfo" → MATCH ✅
  ↓ Result:
item = {
  slug: "ekopfo",
  title: "ЕКОПФО",
  description: "Надані документи описують систему...",
  statusUrl: "https://ekoppho.instatus.com",
  links: [
    { label: "Аналітичний ШІ...", url: "https://...", image: "/images/ai-ekopfo.webp" },
    { label: "Підтримка користувачів", url: "https://...", image: "/images/Helpdesk.webp" }
  ]
}

// Example 2: Invalid slug
URL: /registers/nonexistent
params.slug = "nonexistent"
  ↓
items.find(n => n.slug === "nonexistent")
  ↓ Iteration:
  items[0].slug = "ekopfo" → No match
  items[1].slug = "endoprosthesis" → No match
  items[2].slug = "internatura" → No match
  ... (all 7 items checked)
  ↓ Result:
item = undefined ❌
  ↓
Shows error page: "Реєстр не знайдено"
```

**Not Found Handling:**

```typescript
if (!item) {
  // Render 404-like error page
  return (
    <main style={{ padding: "24px" }}>
      <h1>{t.registryPage?.notFound || 'Реєстр не знайдено'}</h1>
      <p>
        {t.registryPage?.checkSlug || 
         'Перевірте, що slug існує у web/config/notebooks.json.'}
      </p>
    </main>
  )
}

// This prevents rendering with undefined data
// User sees friendly error message
// Page doesn't crash
```

**Performance Considerations:**

```yaml
Array.find() Performance:
  - Time Complexity: O(n) - linear search
  - Average Case: Checks ~3-4 items (7 total)
  - Worst Case: Checks all 7 items
  - Fast enough: Only executed at build time (SSG)
  
Optimization (not needed for 7 items):
  - Could use Map for O(1) lookup
  - But overkill for small dataset
  - Build-time performance not critical
  
Current approach:
  ✅ Simple and readable
  ✅ Type-safe
  ✅ Sufficient performance
```

### 4.3.7 Структура контенту сторінки

#### 4.3.7.1 Назва реєстру (Hero Banner)

**Hero Section:**

```typescript
<div
  className="w-full h-32 bg-cover bg-top relative"
  style={{
    backgroundImage: "url('/images/Hero_ezdorovya.webp')",
    backgroundSize: 'cover',
    backgroundPosition: 'top',
  }}
>
  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
    <h1 className="text-5xl font-bold text-white text-center">
      {translatedTitle}
    </h1>
  </div>
</div>
```

**Title Translation:**

```typescript
// Get translated title
const translatedTitle = 
  t.registryCards?.[item.slug as keyof typeof t.registryCards] 
  || item.title

// Examples:
// Locale: 'uk'
//   item.slug = "ekopfo"
//   t.registryCards.ekopfo = "ЕКОПФО"
//   translatedTitle = "ЕКОПФО" ✅
//
// Locale: 'en'
//   item.slug = "ekopfo"
//   t.registryCards.ekopfo = "EKOPFO"
//   translatedTitle = "EKOPFO" ✅
//
// Missing translation:
//   item.slug = "new-registry"
//   t.registryCards["new-registry"] = undefined
//   translatedTitle = item.title (fallback) ✅
```

#### 4.3.7.2 Опис реєстру

**Description Section:**

```typescript
{translatedDescription && (
  <p style={{ 
    marginBottom: 24, 
    fontSize: '1.1rem', 
    lineHeight: 1.6 
  }}>
    {translatedDescription}
  </p>
)}
```

**Description Translation:**

```typescript
// Get registry-specific details from translations
const registryDetails = t.registryDetails?.[item.slug]

// Get translated description
const translatedDescription = 
  registryDetails?.description || item.description

// Translation structure (locales/ua.json):
{
  "registryDetails": {
    "ekopfo": {
      "description": "Електронна картка амбулаторного пацієнта...",
      "commentary": "NotebookLM дозволяє отримати відповіді...",
      "analyticsTitle": "Аналітичний ШІ по модулю ЕКОПФО"
    }
  }
}

// Examples:
// Locale: 'uk'
//   item.slug = "ekopfo"
//   registryDetails = { description: "Електронна картка...", ... }
//   translatedDescription = "Електронна картка..." ✅
//
// Locale: 'en'
//   registryDetails = { description: "Electronic patient card...", ... }
//   translatedDescription = "Electronic patient card..." ✅
//
// Missing translation:
//   registryDetails = undefined
//   translatedDescription = item.description (fallback from JSON) ✅
```

**Conditional Rendering:**

```typescript
// Only render if description exists
{translatedDescription && <p>...</p>}

// Falsy values that skip rendering:
// - undefined (no translation or JSON data)
// - null
// - "" (empty string)

// Example:
// translatedDescription = undefined → No <p> rendered ✅
// translatedDescription = "Some text" → <p> rendered ✅
```

#### 4.3.7.3 Картки посилань (Links Grid)

**Grid Container:**

```typescript
<section style={{ 
  display: "grid", 
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: 24, 
  maxWidth: 1100 
}}>
  {(item.links || []).map((link, index) => (/* Card */))}
</section>
```

**CSS Grid Breakdown:**

```css
display: grid;
  /* Enable CSS Grid layout */

gridTemplateColumns: repeat(auto-fit, minmax(320px, 1fr));
  /* auto-fit: Create as many columns as fit */
  /* minmax(320px, 1fr): Each column min 320px, max 1fr (equal width) */
  /* Result: Responsive columns based on container width */

gap: 24;
  /* 24px spacing between grid items */

maxWidth: 1100;
  /* Container max width 1100px */
```

**Responsive Behavior:**

```
Container width: 1100px (desktop)
  320px min × 3 columns = 960px → 3 columns fit ✅
  ┌────────┬────────┬────────┐
  │ Card 1 │ Card 2 │ Card 3 │
  └────────┴────────┴────────┘

Container width: 768px (tablet)
  320px min × 2 columns = 640px → 2 columns fit ✅
  ┌────────┬────────┐
  │ Card 1 │ Card 2 │
  ├────────┴────────┤
  │ Card 3          │
  └─────────────────┘

Container width: 375px (mobile)
  320px min × 1 column = 320px → 1 column fits ✅
  ┌────────┐
  │ Card 1 │
  ├────────┤
  │ Card 2 │
  ├────────┤
  │ Card 3 │
  └────────┘
```

**Link Card Structure:**

```typescript
{(item.links || []).map((link, index) => {
  // Determine card type
  const isSupport = link.label === 'Підтримка користувачів'
  const isAnalytics = index === 0 && !isSupport
  
  // Image size based on type
  const imgSize = isSupport ? 320 : 384
  //    Support cards: 320×320
  //    Analytics cards: 384×384 (reduced by 20% from 480)
  
  // Translate label
  let translatedLabel = link.label
  if (isSupport) {
    translatedLabel = t.registryPage?.userSupport || link.label
  } else if (isAnalytics && translatedAnalyticsTitle) {
    translatedLabel = translatedAnalyticsTitle
  }
  
  return (
    <div key={link.url} style={{ border: "1px solid #ddd", ... }}>
      {/* Link with title */}
      <a href={link.url} target="_blank">
        <span style={{ fontWeight: 'bold' }}>{translatedLabel}</span>
      </a>
      
      {/* Image (if exists) */}
      {link.image && (
        <a href={link.url} target="_blank">
          <Image
            src={link.image}
            alt={translatedLabel}
            width={imgSize}
            height={imgSize}
            style={{ objectFit: 'cover', borderRadius: 8 }}
          />
        </a>
      )}
      
      {/* Conditional content based on card type */}
      {isAnalytics && translatedCommentary && (
        <p>{translatedCommentary}</p>
      )}
      {isSupport && userSupportText && (
        <UserSupportContent userSupportText={userSupportText} />
      )}
    </div>
  )
})}
```

**Card Types:**

```yaml
Analytics Card (Card 1):
  - Usually first link (index = 0)
  - Links to NotebookLM
  - Image size: 384×384
  - Shows commentary text
  - Example: "Аналітичний ШІ по модулю ЕКОПФО"

Support Card (Card 2):
  - Label matches 'Підтримка користувачів'
  - Links to Atlassian Helpdesk
  - Image size: 320×320
  - Shows UserSupportContent component
  - Includes: FAQ, chat links, form links

Other Cards (rare):
  - Additional links if defined
  - Default styling
  - No special content
```

#### 4.3.7.4 Статус-фрейм (Status Iframe)

**Status Section (Conditional):**

```typescript
{item.statusUrl && (
  <section style={{ marginTop: 32, maxWidth: 1100 }}>
    {/* Section Title */}
    <h2 style={{ 
      fontSize: '1.5rem', 
      fontWeight: 'bold', 
      marginBottom: 16, 
      color: '#1a1a1a' 
    }}>
      {t.registers?.statusIframe || 'Статус системи'}
    </h2>
    
    {/* Iframe Container */}
    <div style={{ 
      width: '100%', 
      height: '70vh',           // 70% of viewport height
      minHeight: '400px',       // Minimum 400px
      border: '1px solid #ddd', 
      borderRadius: 8, 
      overflow: 'hidden' 
    }}>
      <iframe 
        src={item.statusUrl} 
        style={{ width: '100%', height: '100%', border: 'none' }}
        title={`${translatedTitle} - ${t.registers?.statusIframe || 'Статус системи'}`}
      />
    </div>
  </section>
)}
```

**Iframe Height Calculation:**

```
Viewport Height Examples:

Screen 1920×1080 (desktop):
  Viewport Height: 1080px
  70vh = 1080 × 0.70 = 756px
  minHeight: 400px (not applied, 756 > 400) ✅
  Final height: 756px

Screen 1366×768 (laptop):
  Viewport Height: 768px
  70vh = 768 × 0.70 = 537.6px
  minHeight: 400px (not applied, 537 > 400) ✅
  Final height: 537px

Screen 667×375 (mobile portrait):
  Viewport Height: 667px
  70vh = 667 × 0.70 = 466.9px
  minHeight: 400px (not applied, 466 > 400) ✅
  Final height: 466px

Screen 568×320 (small mobile):
  Viewport Height: 568px
  70vh = 568 × 0.70 = 397.6px
  minHeight: 400px APPLIED (397 < 400) ✅
  Final height: 400px (enforced minimum)
```

**Iframe Attributes:**

```typescript
<iframe 
  src={item.statusUrl}
  // Example: "https://ekoppho.instatus.com"
  
  style={{ width: '100%', height: '100%', border: 'none' }}
  // Fill container, no default border
  
  title={`${translatedTitle} - ${t.registers?.statusIframe || 'Статус системи'}`}
  // Accessibility: "ЕКОПФО - Статус системи"
  // Screen readers announce iframe purpose
/>
```

**Conditional Rendering:**

```typescript
// Only render if statusUrl exists
{item.statusUrl && <section>...</section>}

// Examples:
// item.statusUrl = "https://ekoppho.instatus.com" → Rendered ✅
// item.statusUrl = undefined → Not rendered ✅
// item.statusUrl = "" → Not rendered (falsy) ✅

// Current data: ALL 7 registries have statusUrl
// So this section always renders for existing registries
```

### 4.3.8 Компоненти, що використовуються

#### 4.3.8.1 UserSupportContent (Client Component)

**Розташування:** `app/components/UserSupportContent.tsx`  
**Тип:** Client Component (`"use client"`)

**Props Interface:**

```typescript
type LinkSegment = {
  text: string       // Display text
  href?: string      // Optional link URL
}

type UserSupportTextType = {
  intro?: string                        // Introduction text
  chatsLabel?: string                   // Label for chat links
  orText?: string                       // "or" separator text
  formText?: string | LinkSegment[]     // Form description (with links)
  faqIntro?: string                     // FAQ introduction
  faqItems?: (string | LinkSegment[])[] // FAQ items (with links)
  instructionsText?: string | LinkSegment[]  // Instructions (with links)
  links?: {                             // Chat platform links
    label: string
    href: string
  }[]
}

interface UserSupportContentProps {
  userSupportText: UserSupportTextType
}
```

**Component Structure:**

```typescript
export function UserSupportContent({ userSupportText }: UserSupportContentProps) {
  return (
    <div style={{ margin: 0, fontSize: '0.95rem', ... }}>
      {/* 1. Introduction */}
      <p>{userSupportText.intro}</p>
      
      {/* 2. Chat Links */}
      <p>
        {userSupportText.chatsLabel}{' '}
        {userSupportText.links?.map((link, idx) => (
          <span key={idx}>
            {idx > 0 && ` ${userSupportText.orText} `}
            <a href={link.href} target="_blank">{link.label}</a>
          </span>
        ))}
      </p>
      
      {/* 3. Form Description */}
      <p>{renderTextWithLinks(userSupportText.formText)}</p>
      
      {/* 4. FAQ Section */}
      <p>{userSupportText.faqIntro}</p>
      <ol>
        {userSupportText.faqItems?.map((item, idx) => (
          <li key={idx}>{renderTextWithLinks(item)}</li>
        ))}
      </ol>
      
      {/* 5. Instructions */}
      <p>{renderTextWithLinks(userSupportText.instructionsText)}</p>
    </div>
  )
}
```

**Helper Function (renderTextWithLinks):**

```typescript
function renderTextWithLinks(content: string | LinkSegment[] | undefined) {
  if (!content) return null
  
  // If plain string, return as is
  if (typeof content === 'string') {
    return content
  }
  
  // If array of segments, render with links
  return content.map((segment, idx) => {
    if (segment.href) {
      // Render as link
      return (
        <a 
          key={idx}
          href={segment.href} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: '#0066cc', textDecoration: 'underline' }}
          onClick={(e) => e.stopPropagation()}
        >
          {segment.text}
        </a>
      )
    }
    // Render as plain text
    return <span key={idx}>{segment.text}</span>
  })
}
```

**Usage Example:**

```typescript
// In RegisterDetail component:
{isSupport && userSupportText && (
  <UserSupportContent userSupportText={userSupportText} />
)}

// userSupportText comes from translations:
const userSupportText = registryDetails?.userSupportText

// Example data structure:
userSupportText = {
  intro: "Якщо у вас виникли запитання:",
  chatsLabel: "Зв'яжіться через",
  orText: "або",
  links: [
    { label: "Telegram", href: "https://t.me/ekopfo_support" },
    { label: "Viber", href: "https://viber.com/ekopfo" }
  ],
  formText: "Або заповніть форму на сайті",
  faqIntro: "Часті запитання:",
  faqItems: [
    "Як зареєструватись?",
    "Як скинути пароль?"
  ],
  instructionsText: "Детальні інструкції доступні в розділі документації"
}
```

**Rendered Output:**

```html
<div>
  <p>Якщо у вас виникли запитання:</p>
  <p>
    Зв'яжіться через 
    <a href="https://t.me/ekopfo_support">Telegram</a>
     або 
    <a href="https://viber.com/ekopfo">Viber</a>
  </p>
  <p>Або заповніть форму на сайті</p>
  <p>Часті запитання:</p>
  <ol>
    <li>Як зареєструватись?</li>
    <li>Як скинути пароль?</li>
  </ol>
  <p>Детальні інструкції доступні в розділі документації</p>
</div>
```

#### 4.3.8.2 Next.js Image Component

**Import:**

```typescript
import Image from 'next/image'
```

**Usage in Link Cards:**

```typescript
{link.image && (
  <a href={link.url} target="_blank" rel="noopener noreferrer">
    <Image
      src={link.image}
      alt={translatedLabel}
      width={imgSize}
      height={imgSize}
      style={{ 
        objectFit: 'cover', 
        borderRadius: 8, 
        width: imgSize, 
        height: imgSize 
      }}
    />
  </a>
)}
```

**Image Optimization:**

```yaml
Next.js Image Features:
  - Automatic WebP conversion
  - Lazy loading (loads when visible)
  - Responsive image sizes
  - Blur placeholder (optional)
  - Priority loading (optional)

Our Implementation:
  src: "/images/ai-ekopfo.webp"
  width: 384 (Analytics) or 320 (Support)
  height: 384 or 320
  objectFit: 'cover' (maintains aspect ratio, crops if needed)
  borderRadius: 8px (rounded corners)
```

**Image Sizes:**

```typescript
const imgSize = isSupport ? 320 : 384

// Support Card:
//   width: 320px
//   height: 320px
//
// Analytics Card:
//   width: 384px
//   height: 384px
//   (Originally 480px, reduced by 20%)
```

#### 4.3.8.3 RegisterCard Component

**Status:** ❌ **НЕ використовується** на цій сторінці

**Причина:**

```typescript
// RegisterDetail uses INLINE card rendering:
<div key={link.url} style={{ border: "1px solid #ddd", ... }}>
  <a href={link.url}>...</a>
  <Image src={link.image} />
  {isAnalytics && <p>{translatedCommentary}</p>}
  {isSupport && <UserSupportContent {...} />}
</div>

// RegisterCard component (app/components/RegisterCard.tsx):
// - Different structure
// - Used on other pages (if any)
// - NOT imported in RegisterDetail
```

#### 4.3.8.4 DocumentCard Component

**Status:** ❌ **НЕ використовується** на цій сторінці

**Можливе використання (майбутнє):**

```typescript
// If instructions section were to use DocumentCard:
{item.instructions && item.instructions.length > 0 && (
  <section>
    {item.instructions.map(href => (
      <DocumentCard 
        title="Instruction Document"
        url={href}
      />
    ))}
  </section>
)}

// Current implementation: Plain <a> links
{item.instructions && (
  <ul>
    {item.instructions.map(href => (
      <li><a href={href}>{href}</a></li>
    ))}
  </ul>
)}
```

### 4.3.9 Приклади коду (Key Logic)

#### 4.3.9.1 Пошук реєстру за slug

```typescript
export default async function RegisterDetail({ params }: { params: { slug: string } }) {
  // Load and find registry
  const items = Array.isArray(notebooks) ? (notebooks as NotebookItem[]) : []
  const item = items.find((n) => n.slug === params.slug)
  
  // Handle not found
  if (!item) {
    return <ErrorPage />
  }
  
  // Continue with rendering
  return <RegistryPage item={item} />
}
```

#### 4.3.9.2 Визначення типу картки

```typescript
{(item.links || []).map((link, index) => {
  // Determine card type
  const isSupport = link.label === 'Підтримка користувачів'
  const isAnalytics = index === 0 && !isSupport
  
  // Set image size
  const imgSize = isSupport ? 320 : 384
  
  // Render appropriate content
  return (
    <div>
      {isAnalytics && <AnalyticsContent />}
      {isSupport && <SupportContent />}
    </div>
  )
})}
```

#### 4.3.9.3 Conditional iframe rendering

```typescript
{item.statusUrl && (
  <section>
    <h2>Статус системи</h2>
    <iframe src={item.statusUrl} />
  </section>
)}

// Short-circuit evaluation:
// If item.statusUrl is falsy → section not rendered
// If item.statusUrl is truthy → section rendered
```

#### 4.3.9.4 Translation fallback chain

```typescript
// Title translation
const translatedTitle = 
  t.registryCards?.[item.slug] || item.title

// Description translation
const translatedDescription = 
  registryDetails?.description || item.description

// Fallback chain:
// 1. Try translation from locales/*.json
// 2. Fall back to value from notebooks.json
// 3. Ensure always has value (no undefined rendering)
```

#### 4.3.9.5 Responsive grid layout

```typescript
<section style={{ 
  display: "grid", 
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: 24, 
  maxWidth: 1100 
}}>
  {/* Cards auto-arrange based on container width */}
  {/* 1 column on mobile, 2-3 columns on desktop */}
</section>
```

### 4.3.10 ASCII схема потоку даних

**Повний Data Flow:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│              REGISTRY DETAIL PAGE DATA FLOW                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  BUILD TIME (npm run build)                                             │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                   │ │
│  │  1. DATA SOURCE                                                   │ │
│  │     ┌─────────────────────────────────────────────────────────┐  │ │
│  │     │ config/notebooks.json                                   │  │ │
│  │     │ [                                                       │  │ │
│  │     │   {                                                     │  │ │
│  │     │     "slug": "ekopfo",                                   │  │ │
│  │     │     "title": "ЕКОПФО",                                  │  │ │
│  │     │     "description": "Надані документи...",               │  │ │
│  │     │     "statusUrl": "https://ekoppho.instatus.com",        │  │ │
│  │     │     "links": [                                          │  │ │
│  │     │       {                                                 │  │ │
│  │     │         "label": "Аналітичний ШІ...",                  │  │ │
│  │     │         "url": "https://notebooklm...",                │  │ │
│  │     │         "image": "/images/ai-ekopfo.webp"              │  │ │
│  │     │       },                                                │  │ │
│  │     │       {                                                 │  │ │
│  │     │         "label": "Підтримка користувачів",             │  │ │
│  │     │         "url": "https://e-health-ua.atlassian...",     │  │ │
│  │     │         "image": "/images/Helpdesk.webp"               │  │ │
│  │     │       }                                                 │  │ │
│  │     │     ]                                                   │  │ │
│  │     │   },                                                    │  │ │
│  │     │   ... (6 more registries)                              │  │ │
│  │     │ ]                                                       │  │ │
│  │     └─────────────────────────────────────────────────────────┘  │ │
│  │              ↓                                                    │ │
│  │     ┌─────────────────────────────────────────────────────────┐  │ │
│  │     │ locales/ua.json (or en.json)                            │  │ │
│  │     │ {                                                       │  │ │
│  │     │   "registryCards": {                                    │  │ │
│  │     │     "ekopfo": "ЕКОПФО"                                  │  │ │
│  │     │   },                                                    │  │ │
│  │     │   "registryDetails": {                                  │  │ │
│  │     │     "ekopfo": {                                         │  │ │
│  │     │       "description": "Електронна картка...",            │  │ │
│  │     │       "commentary": "NotebookLM дозволяє...",           │  │ │
│  │     │       "analyticsTitle": "Аналітичний ШІ...",           │  │ │
│  │     │       "userSupportText": { ... }                        │  │ │
│  │     │     }                                                   │  │ │
│  │     │   }                                                     │  │ │
│  │     │ }                                                       │  │ │
│  │     └─────────────────────────────────────────────────────────┘  │ │
│  │              ↓                                                    │ │
│  │  ┌───────────────────────────────────────────────────────────┐   │ │
│  │  │  2. STATIC PARAMS GENERATION                              │   │ │
│  │  │     ┌─────────────────────────────────────────────────┐   │   │ │
│  │  │     │  generateStaticParams()                         │   │   │ │
│  │  │     │  ├─ import notebooks                            │   │   │ │
│  │  │     │  ├─ map to { slug: "..." }                      │   │   │ │
│  │  │     │  └─ return [                                    │   │   │ │
│  │  │     │       { slug: "ekopfo" },                       │   │   │ │
│  │  │     │       { slug: "endoprosthesis" },               │   │   │ │
│  │  │     │       ... (7 total)                             │   │   │ │
│  │  │     │     ]                                            │   │   │ │
│  │  │     └─────────────────────────────────────────────────┘   │   │ │
│  │  └───────────────────────────────────────────────────────────┘   │ │
│  │              ↓                                                    │ │
│  │  ┌───────────────────────────────────────────────────────────┐   │ │
│  │  │  3. PAGE GENERATION (for slug: "ekopfo")                  │   │ │
│  │  │     ┌─────────────────────────────────────────────────┐   │   │ │
│  │  │     │  RegisterDetail({ params: { slug: "ekopfo" } })│   │   │ │
│  │  │     │  ↓                                             │   │   │ │
│  │  │     │  1. Load locale from cookie                    │   │   │ │
│  │  │     │     locale = 'uk'                              │   │   │ │
│  │  │     │  ↓                                             │   │   │ │
│  │  │     │  2. Load translations                          │   │   │ │
│  │  │     │     t = getTranslations('uk')                  │   │   │ │
│  │  │     │  ↓                                             │   │   │ │
│  │  │     │  3. Find registry by slug                      │   │   │ │
│  │  │     │     item = notebooks.find(n => n.slug==="ekopfo")│   │   │ │
│  │  │     │     item = {                                   │   │   │ │
│  │  │     │       slug: "ekopfo",                          │   │   │ │
│  │  │     │       title: "ЕКОПФО",                         │   │   │ │
│  │  │     │       statusUrl: "https://...",                │   │   │ │
│  │  │     │       links: [...]                             │   │   │ │
│  │  │     │     }                                           │   │   │ │
│  │  │     │  ↓                                             │   │   │ │
│  │  │     │  4. Extract translations                       │   │   │ │
│  │  │     │     translatedTitle = "ЕКОПФО"                 │   │   │ │
│  │  │     │     translatedDescription = "Електронна..."    │   │   │ │
│  │  │     │     userSupportText = { ... }                  │   │   │ │
│  │  │     │  ↓                                             │   │   │ │
│  │  │     │  5. Render JSX                                 │   │   │ │
│  │  │     │     ├─ Hero Banner (translatedTitle)           │   │   │ │
│  │  │     │     ├─ Description (translatedDescription)     │   │   │ │
│  │  │     │     ├─ Links Grid (item.links)                 │   │   │ │
│  │  │     │     ├─ Status Iframe (item.statusUrl)          │   │   │ │
│  │  │     │     └─ Instructions (item.instructions)        │   │   │ │
│  │  │     └─────────────────────────────────────────────────┘   │   │ │
│  │  └───────────────────────────────────────────────────────────┘   │ │
│  │              ↓                                                    │ │
│  │  ┌───────────────────────────────────────────────────────────┐   │ │
│  │  │  4. STATIC HTML GENERATED                                 │   │ │
│  │  │                                                           │   │ │
│  │  │     <html>                                                │   │ │
│  │  │       <body>                                              │   │ │
│  │  │         <Header />                                        │   │ │
│  │  │         <div class="hero">                                │   │ │
│  │  │           <h1>ЕКОПФО</h1>                                │   │ │
│  │  │         </div>                                            │   │ │
│  │  │         <main>                                            │   │ │
│  │  │           <p>Електронна картка амбулаторного...</p>       │   │ │
│  │  │           <section class="grid">                          │   │ │
│  │  │             <div>                                         │   │ │
│  │  │               <a href="https://notebooklm...">            │   │ │
│  │  │                 Аналітичний ШІ...                         │   │ │
│  │  │               </a>                                        │   │ │
│  │  │               <img src="/images/ai-ekopfo.webp" />        │   │ │
│  │  │               <p>NotebookLM дозволяє...</p>               │   │ │
│  │  │             </div>                                        │   │ │
│  │  │             <div>                                         │   │ │
│  │  │               <a href="https://e-health-ua...">           │   │ │
│  │  │                 Підтримка користувачів                    │   │ │
│  │  │               </a>                                        │   │ │
│  │  │               <img src="/images/Helpdesk.webp" />         │   │ │
│  │  │               <!-- UserSupportContent rendered -->        │   │ │
│  │  │             </div>                                        │   │ │
│  │  │           </section>                                      │   │ │
│  │  │           <section>                                       │   │ │
│  │  │             <h2>Статус системи</h2>                      │   │ │
│  │  │             <iframe src="https://ekoppho.instatus.com">   │   │ │
│  │  │             </iframe>                                     │   │ │
│  │  │           </section>                                      │   │ │
│  │  │         </main>                                           │   │ │
│  │  │         <Footer />                                        │   │ │
│  │  │       </body>                                             │   │ │
│  │  │     </html>                                               │   │ │
│  │  │                                                           │   │ │
│  │  │     Saved to: .next/server/app/registers/ekopfo.html     │   │ │
│  │  │                                                           │   │ │
│  │  │     Repeat for all 7 slugs...                             │   │ │
│  │  └───────────────────────────────────────────────────────────┘   │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  RUNTIME (User Request)                                                 │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                   │ │
│  │  User Request: GET /registers/ekopfo                              │ │
│  │       ↓                                                           │ │
│  │  Vercel CDN                                                       │ │
│  │       ↓                                                           │ │
│  │  Serve: .next/server/app/registers/ekopfo.html (pre-rendered)    │ │
│  │       ↓                                                           │ │
│  │  Browser receives HTML                                            │ │
│  │       ↓                                                           │ │
│  │  ┌────────────────────────────────────────────────────────────┐  │ │
│  │  │  Browser Rendering                                         │  │ │
│  │  │  ┌──────────────────────────────────────────────────────┐  │  │ │
│  │  │  │  1. Parse HTML                                       │  │  │ │
│  │  │  │     ├─ DOM construction                              │  │  │ │
│  │  │  │     ├─ CSS parsing (inline styles)                   │  │  │ │
│  │  │  │     └─ Layout calculation (Grid)                     │  │  │ │
│  │  │  └──────────────────────────────────────────────────────┘  │  │ │
│  │  │  ┌──────────────────────────────────────────────────────┐  │  │ │
│  │  │  │  2. Hydration (Client Components)                    │  │  │ │
│  │  │  │     ├─ Header (navigation)                           │  │  │ │
│  │  │  │     ├─ LanguageSwitcher                              │  │  │ │
│  │  │  │     ├─ UserSupportContent (interactive)              │  │  │ │
│  │  │  │     └─ Footer                                        │  │  │ │
│  │  │  └──────────────────────────────────────────────────────┘  │  │ │
│  │  │  ┌──────────────────────────────────────────────────────┐  │  │ │
│  │  │  │  3. Image Loading (Next.js optimization)             │  │  │ │
│  │  │  │     ├─ /images/ai-ekopfo.webp (384×384)              │  │  │ │
│  │  │  │     ├─ /images/Helpdesk.webp (320×320)               │  │  │ │
│  │  │  │     └─ Lazy load (viewport detection)                │  │  │ │
│  │  │  └──────────────────────────────────────────────────────┘  │  │ │
│  │  │  ┌──────────────────────────────────────────────────────┐  │  │ │
│  │  │  │  4. Iframe Loading                                   │  │  │ │
│  │  │  │     ├─ Browser requests: https://ekoppho.instatus.com│  │  │ │
│  │  │  │     ├─ Instatus responds with status widget          │  │  │ │
│  │  │  │     └─ Real-time status displayed                    │  │  │ │
│  │  │  └──────────────────────────────────────────────────────┘  │  │ │
│  │  └────────────────────────────────────────────────────────────┘  │ │
│  │       ↓                                                           │ │
│  │  ┌────────────────────────────────────────────────────────────┐  │ │
│  │  │  USER INTERFACE                                            │  │ │
│  │  │  ┌──────────────────────────────────────────────────────┐  │  │ │
│  │  │  │  [Header: Logo + Nav + Lang Switcher]               │  │  │ │
│  │  │  └──────────────────────────────────────────────────────┘  │  │ │
│  │  │  ┌──────────────────────────────────────────────────────┐  │  │ │
│  │  │  │  [Hero Banner: "ЕКОПФО"]                            │  │  │ │
│  │  │  └──────────────────────────────────────────────────────┘  │  │ │
│  │  │  ┌──────────────────────────────────────────────────────┐  │  │ │
│  │  │  │  [Description]                                       │  │  │ │
│  │  │  │  Електронна картка амбулаторного пацієнта...        │  │  │ │
│  │  │  └──────────────────────────────────────────────────────┘  │  │ │
│  │  │  ┌──────────────────────────────────────────────────────┐  │  │ │
│  │  │  │  [Links Grid: 2 columns on desktop]                 │  │  │ │
│  │  │  │  ┌──────────────────┐ ┌──────────────────┐          │  │  │ │
│  │  │  │  │ Analytics Card   │ │ Support Card     │          │  │  │ │
│  │  │  │  │ ┌──────────────┐ │ │ ┌──────────────┐ │          │  │  │ │
│  │  │  │  │ │ NotebookLM   │ │ │ │ Helpdesk     │ │          │  │  │ │
│  │  │  │  │ │ Link         │ │ │ │ Link         │ │          │  │  │ │
│  │  │  │  │ └──────────────┘ │ │ └──────────────┘ │          │  │  │ │
│  │  │  │  │ ┌──────────────┐ │ │ ┌──────────────┐ │          │  │  │ │
│  │  │  │  │ │ Image        │ │ │ │ Image        │ │          │  │  │ │
│  │  │  │  │ │ 384×384      │ │ │ │ 320×320      │ │          │  │  │ │
│  │  │  │  │ └──────────────┘ │ │ └──────────────┘ │          │  │  │ │
│  │  │  │  │ Commentary text  │ │ FAQ + Links      │          │  │  │ │
│  │  │  │  └──────────────────┘ └──────────────────┘          │  │  │ │
│  │  │  └──────────────────────────────────────────────────────┘  │  │ │
│  │  │  ┌──────────────────────────────────────────────────────┐  │  │ │
│  │  │  │  [Status Iframe Section]                             │  │  │ │
│  │  │  │  ┌────────────────────────────────────────────────┐  │  │  │ │
│  │  │  │  │ Статус системи                                 │  │  │  │ │
│  │  │  │  │ ┌────────────────────────────────────────────┐ │  │  │  │ │
│  │  │  │  │ │ 🟢 All Systems Operational                 │ │  │  │  │ │
│  │  │  │  │ │ Uptime: 99.9%                              │ │  │  │  │ │
│  │  │  │  │ │ [Performance graphs]                       │ │  │  │  │ │
│  │  │  │  │ └────────────────────────────────────────────┘ │  │  │  │ │
│  │  │  │  └────────────────────────────────────────────────┘  │  │  │ │
│  │  │  └──────────────────────────────────────────────────────┘  │  │ │
│  │  │  ┌──────────────────────────────────────────────────────┐  │  │ │
│  │  │  │  [Footer: Helpdesk Link + Copyright]                │  │  │ │
│  │  │  └──────────────────────────────────────────────────────┘  │  │ │
│  │  └────────────────────────────────────────────────────────────┘  │ │
│  └───────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

**Спрощена схема:**

```
DATA SOURCES
├─ config/notebooks.json
│  └─ Registry data (slug, title, links, statusUrl)
└─ locales/ua.json (or en.json)
   └─ Translations (titles, descriptions, user support text)

      ↓ LOAD & FIND

SERVER COMPONENT
├─ generateStaticParams() → [{ slug: "..." }, ...]
├─ RegisterDetail({ params })
│  ├─ Find: item = notebooks.find(n => n.slug === params.slug)
│  ├─ Translate: titles, descriptions
│  └─ Render: JSX with data

      ↓ BUILD

STATIC HTML (7 pages)
├─ /registers/ekopfo.html
├─ /registers/endoprosthesis.html
└─ ... (5 more)

      ↓ DEPLOY

CDN (Vercel)
└─ Instant delivery

      ↓ REQUEST

USER BROWSER
└─ Display page
   ├─ Hero with translated title
   ├─ Description
   ├─ Links Grid (Analytics + Support)
   ├─ Status Iframe (real-time)
   └─ Instructions (if any)
```

---

**Дата створення:** 13 грудня 2025  
**Файл:** `app/registers/[slug]/page.tsx`  
**Тип компонента:** Server Component (SSG)  
**URL Pattern:** `/registers/[slug]`  
**Кількість сторінок:** 7  
**Компоненти:** UserSupportContent (Client), Image (Next.js)  
**Grid Layout:** auto-fit, minmax(320px, 1fr)  
**Iframe Height:** 70vh (min: 400px)
