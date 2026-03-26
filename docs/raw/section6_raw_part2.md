# 📋 ПАСПОРТ САЙТУ
## Розділ 6: Картки реєстрів (Registry Cards) — Частина 2

---

## 6.9. 🧩 КОМПОНЕНТ REGISTERCARD

### 6.9.1 Призначення компонента

**RegisterCard** — це reusable React-компонент для відображення картки реєстру. Компонент створений для універсального використання, але **наразі не використовується** на Home Page (там inline реалізація).

```yaml
Design Purpose:
  - Створений як reusable компонент
  - Може використовуватись на різних сторінках
  - Підтримує зовнішні посилання (target="_blank")
  - Minimal props interface (title, image, url)

Current Status:
  ❌ НЕ використовується на Home Page (app/page.tsx)
  ❌ НЕ використовується на інших сторінках
  ✅ Готовий до використання (working implementation)
  ✅ Type-safe (TypeScript)

Potential Use Cases:
  - Документація (список реєстрів з посиланнями)
  - About Page (огляд систем)
  - Sidebar (швидкий доступ)
  - Footer (посилання на системи)
```

**Відмінність від Home Page Implementation:**

```typescript
// RegisterCard компонент:
// - External links (target="_blank")
// - Image width 50% (w-1/2)
// - Fixed height 128px (h-32)
// - Opens in new tab

// Home Page inline:
// - Internal links (Next.js <Link>)
// - Image width 100% (full card width)
// - Square ratio (paddingBottom: 100%)
// - Opens in same window (SPA navigation)

// Conclusion: Different use cases
```

### 6.9.2 TypeScript Interface

**Props Definition:**

```typescript
interface RegisterCardProps {
  title: string    // REQUIRED: Display title
  image: string    // REQUIRED: Image URL/path
  url: string      // REQUIRED: Destination URL
}

// Usage:
export default function RegisterCard({
  title,
  image,
  url
}: RegisterCardProps) {
  // Component implementation
}

// Alternative inline type (actual code):
export default function RegisterCard({
  title,
  image,
  url
}: {
  title: string
  image: string
  url: string
}) {
  // Same, but inline type definition
}
```

**Props Validation:**

```yaml
title:
  Type: string
  Required: YES
  Validation: None (accepts any string)
  Constraints:
    - Рекомендовано: 5-50 символів
    - Обрізається: line-clamp-2 (max 2 lines)
    - Empty string: працює, але незручно
  Examples:
    ✅ "ЕКОПФО"
    ✅ "Система Безперервного Розвитку"
    ⚠️ "" (порожній рядок — працює, але не має сенсу)

image:
  Type: string
  Required: YES
  Validation: None (browser validates)
  Constraints:
    - Має бути valid path (відносний або абсолютний)
    - Browser handles invalid URLs (broken image icon)
    - Рекомендовані формати: .webp, .png, .jpg, .svg
    - Optimal size: 384×384 або більше (для Retina)
  Examples:
    ✅ "/images/ai-ekopfo.webp"
    ✅ "https://example.com/image.png"
    ⚠️ "/nonexistent.jpg" (browser shows broken image)

url:
  Type: string
  Required: YES
  Validation: None (browser validates)
  Constraints:
    - Має бути valid URL (відносний або абсолютний)
    - target="_blank" → opens in new tab
    - noopener noreferrer → security
  Examples:
    ✅ "https://notebooklm.google.com/notebook/..."
    ✅ "https://e-health-ua.atlassian.net/..."
    ✅ "/registers/ekopfo" (працює, але зайво через target="_blank")
    ⚠️ "invalid-url" (browser може не перейти)
```

### 6.9.3 Структура компонента

**Component Breakdown:**

```tsx
// File: app/components/RegisterCard.tsx
import Image from 'next/image'

export default function RegisterCard({
  title,
  image,
  url
}: {
  title: string
  image: string
  url: string
}) {
  return (
    // ┌─────────────────────────────────────────────┐
    // │ 1. Wrapper <a> (Card Container)             │
    // └─────────────────────────────────────────────┘
    <a
      href={url}                        // External URL
      target="_blank"                   // New tab
      rel="noopener noreferrer"         // Security
      className="block border rounded overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* ┌─────────────────────────────────────────┐ */}
      {/* │ 2. Image Container                      │ */}
      {/* └─────────────────────────────────────────┘ */}
      <div className="w-1/2 h-32 relative bg-gray-200 mx-auto rounded overflow-hidden">
        <Image
          src={image}                   // Image path/URL
          alt={`${title} image`}        // Accessibility
          fill                          // Fill parent (Next.js Image)
          className="object-cover"      // Cover (crop to fit)
          priority={false}              // Lazy load
        />
      </div>

      {/* ┌─────────────────────────────────────────┐ */}
      {/* │ 3. Text Container                       │ */}
      {/* └─────────────────────────────────────────┘ */}
      <div className="p-4 text-center">
        <h4 className="font-semibold text-lg line-clamp-2">
          {title}                       // Display title
        </h4>
      </div>
    </a>
  )
}
```

**ASCII Structure:**

```
┌───────────────────────────────────────────────────────────┐
│  RegisterCard Component                                   │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  <a> Wrapper (External Link)                        │  │
│  │  • href={url}                                       │  │
│  │  • target="_blank" (new tab)                        │  │
│  │  • rel="noopener noreferrer" (security)             │  │
│  │  • className="block border rounded..."             │  │
│  │  ┌───────────────────────────────────────────────┐  │  │
│  │  │  Image Container                              │  │  │
│  │  │  • w-1/2 (50% width)                          │  │  │
│  │  │  • h-32 (128px height)                        │  │  │
│  │  │  • mx-auto (centered horizontally)            │  │  │
│  │  │  • bg-gray-200 (placeholder background)       │  │  │
│  │  │  ┌─────────────────────────────────────────┐  │  │  │
│  │  │  │  <Image> (Next.js)                      │  │  │  │
│  │  │  │  • src={image}                          │  │  │  │
│  │  │  │  • alt="{title} image"                  │  │  │  │
│  │  │  │  • fill (fills parent container)        │  │  │  │
│  │  │  │  • object-cover (crop to fit)           │  │  │  │
│  │  │  │  • priority={false} (lazy load)         │  │  │  │
│  │  │  └─────────────────────────────────────────┘  │  │  │
│  │  └───────────────────────────────────────────────┘  │  │
│  │  ┌───────────────────────────────────────────────┐  │  │
│  │  │  Text Container                               │  │  │
│  │  │  • p-4 (16px padding)                         │  │  │
│  │  │  • text-center                                │  │  │
│  │  │  ┌─────────────────────────────────────────┐  │  │  │
│  │  │  │  <h4> Title                             │  │  │  │
│  │  │  │  • font-semibold                        │  │  │  │
│  │  │  │  • text-lg (18px)                       │  │  │  │
│  │  │  │  • line-clamp-2 (max 2 lines)           │  │  │  │
│  │  │  │  • {title}                              │  │  │  │
│  │  │  └─────────────────────────────────────────┘  │  │  │
│  │  └───────────────────────────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────┘

Visual Result:
┌─────────────────┐
│   ┌─────────┐   │
│   │         │   │ ← Image (50% width, 128px height)
│   │  Image  │   │   Centered (mx-auto)
│   │         │   │
│   └─────────┘   │
│                 │
│  Registry Title │ ← Title (centered, max 2 lines)
│                 │
└─────────────────┘
  Hover: shadow-lg
```

### 6.9.4 Логіка рендерингу

**Rendering Steps:**

```yaml
Step 1: Create Anchor Element
  - Element: <a>
  - Attributes:
      href: {url} (prop)
      target: "_blank" (hardcoded)
      rel: "noopener noreferrer" (security)
  - Classes: "block border rounded overflow-hidden hover:shadow-lg transition-shadow"

Step 2: Render Image Container
  - Element: <div>
  - Classes: "w-1/2 h-32 relative bg-gray-200 mx-auto rounded overflow-hidden"
  - Purpose:
      • Create fixed-size container (50% width, 128px height)
      • Center horizontally (mx-auto)
      • Provide fallback background (bg-gray-200)
  - Child: <Image> component

Step 3: Render Next.js Image
  - Component: <Image> from 'next/image'
  - Props:
      src: {image} (prop)
      alt: "{title} image" (dynamic)
      fill: true (fill parent container)
      className: "object-cover" (crop to fit)
      priority: false (lazy load)
  - Behavior:
      • Automatically optimizes image
      • Lazy loads (not priority)
      • Fills parent (absolute positioning)
      • Crops to cover (maintains aspect ratio)

Step 4: Render Title
  - Element: <h4>
  - Classes: "font-semibold text-lg line-clamp-2"
  - Content: {title} (prop)
  - Behavior:
      • Truncates after 2 lines (line-clamp-2)
      • Shows ellipsis (...) if overflow
      • Centered (inherited from parent text-center)

Step 5: Apply Hover State
  - Trigger: Mouse hover over <a>
  - Effect: hover:shadow-lg
  - Transition: transition-shadow
  - Result: Smooth shadow animation on hover
```

**Conditional Rendering:**

```typescript
// Current implementation: NO conditionals
// All props are required, no optional rendering

// Potential improvements:
{/* Conditional description (if added to props): */}
{description && (
  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
    {description}
  </p>
)}

{/* Conditional badge (if added to props): */}
{badge && (
  <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 text-xs rounded">
    {badge}
  </div>
)}

// Current: No conditionals → simple, predictable rendering
```

### 6.9.5 Умови відображення description

**Current State:**

```yaml
Description Support: NO
  ❌ No description prop
  ❌ No description rendering
  ❌ Not planned in current implementation

Reason:
  - Minimalist design (image + title only)
  - External links (description less important)
  - Space constraints (small card)
```

**Proposed Enhancement (Optional):**

```typescript
// Extended interface with description:
interface RegisterCardProps {
  title: string
  image: string
  url: string
  description?: string  // Optional prop
}

// Conditional rendering:
export default function RegisterCard({
  title,
  image,
  url,
  description
}: RegisterCardProps) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="...">
      <div className="w-1/2 h-32 relative bg-gray-200 mx-auto rounded overflow-hidden">
        <Image src={image} alt={`${title} image`} fill className="object-cover" />
      </div>
      <div className="p-4 text-center">
        <h4 className="font-semibold text-lg line-clamp-2">{title}</h4>
        
        {/* Conditional description */}
        {description && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </a>
  )
}

// Usage:
<RegisterCard
  title="ЕКОПФО"
  image="/images/ai-ekopfo.webp"
  url="https://notebooklm.google.com/..."
  description="Система управління медичними справами пацієнтів"
/>

// Benefits:
// ✅ More informative cards
// ✅ Backwards compatible (description optional)
// ✅ Truncated after 2 lines (no overflow)
```

### 6.9.6 Побудова URL

**URL Handling:**

```typescript
// Props:
url: string  // Can be relative or absolute

// Rendering:
<a href={url} target="_blank" rel="noopener noreferrer">

// Examples:

// 1. External URL (typical use case):
<RegisterCard
  title="Analytics"
  image="/images/ai-ekopfo.webp"
  url="https://notebooklm.google.com/notebook/5ed43304-90a2-4193-a706-daec18cc8e33"
/>
// Result: Opens NotebookLM in new tab ✅

// 2. Helpdesk URL:
<RegisterCard
  title="Support"
  image="/images/Helpdesk.webp"
  url="https://e-health-ua.atlassian.net/servicedesk/customer/portal/32"
/>
// Result: Opens Atlassian in new tab ✅

// 3. Internal URL (not recommended, but works):
<RegisterCard
  title="Registry"
  image="/images/ai-ekopfo.webp"
  url="/registers/ekopfo"
/>
// Result: Opens /registers/ekopfo in new tab
// Problem: target="_blank" → loses SPA benefits ⚠️
// Better: Use Next.js <Link> instead

// 4. Relative URL:
<RegisterCard
  title="Docs"
  image="/images/docs.webp"
  url="../documentation"
/>
// Result: Browser resolves relative to current page
// Works, but absolute paths preferred ✅
```

**Security Attributes:**

```yaml
target="_blank":
  Purpose: Open link in new tab/window
  Security Risk: Opener can access window.opener
  Mitigation: Use rel="noopener noreferrer"

rel="noopener":
  Prevents new page from accessing window.opener
  Protects against tabnabbing attacks

rel="noreferrer":
  Prevents browser from sending HTTP Referer header
  Privacy protection (target site doesn't know source)

Combined: rel="noopener noreferrer"
  Best practice for all target="_blank" links
  Implemented in RegisterCard ✅
```

### 6.9.7 Взаємодія з локалізацією

**Current State:**

```yaml
Localization: NO DIRECT SUPPORT
  ❌ Component doesn't use i18n
  ❌ No translation hooks
  ❌ Accepts pre-translated props

Approach: Props-Based Translation
  ✅ Parent component handles translation
  ✅ RegisterCard receives translated strings
  ✅ Separation of concerns (component stays simple)
```

**Usage Pattern:**

```typescript
// Parent component handles translation:
import { useTranslations } from '../lib/useTranslations'

function ParentComponent() {
  const { t } = useTranslations()
  
  // Translate before passing to RegisterCard:
  const translatedTitle = t.registryCards?.ekopfo || "ЕКОПФО"
  
  return (
    <RegisterCard
      title={translatedTitle}  // ← Pre-translated
      image="/images/ai-ekopfo.webp"
      url="https://notebooklm.google.com/..."
    />
  )
}

// RegisterCard just displays the string:
export default function RegisterCard({ title, image, url }) {
  return (
    <a href={url}>
      <h4>{title}</h4>  {/* No translation, just display */}
    </a>
  )
}

// Benefits:
// ✅ Component stays simple (no i18n logic)
// ✅ Reusable (works with any language)
// ✅ Parent controls translation strategy
```

**Alternative: Built-in Localization (Not Implemented):**

```typescript
// If RegisterCard had built-in i18n:
interface RegisterCardProps {
  titleKey: string  // Translation key instead of string
  image: string
  url: string
}

export default function RegisterCard({ titleKey, image, url }) {
  const { t } = useTranslations()
  const title = t.registryCards?.[titleKey] || titleKey
  
  return (
    <a href={url}>
      <h4>{title}</h4>
    </a>
  )
}

// Usage:
<RegisterCard
  titleKey="ekopfo"  // Translation key
  image="/images/ai-ekopfo.webp"
  url="..."
/>

// Pros:
// ✅ Component handles translation
// ✅ Less code in parent

// Cons:
// ❌ Tight coupling to i18n system
// ❌ Less flexible (hardcoded translation path)
// ❌ Not implemented (current approach better)
```

### 6.9.8 Адаптивність компонента

**Component-Level Responsiveness:**

```yaml
Image Width: w-1/2 (FIXED)
  - 50% width on ALL screen sizes
  - No responsive variants (sm:, md:, lg:)
  - Centered with mx-auto

Image Height: h-32 (FIXED)
  - 128px height on ALL screen sizes
  - No responsive variants

Result:
  Component itself is NOT responsive
  Grid/container handles responsive layout
```

**Grid-Level Responsiveness (Parent Responsibility):**

```typescript
// Parent component creates responsive grid:
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  <RegisterCard title="ЕКОПФО" image="..." url="..." />
  <RegisterCard title="Ендопротезування" image="..." url="..." />
  <RegisterCard title="Інтернатура" image="..." url="..." />
  {/* ... more cards */}
</div>

// Breakpoints:
// Mobile (< 640px):    1 column  → 1 card per row
// Small (≥ 640px):     2 columns → 2 cards per row
// Medium (≥ 768px):    3 columns → 3 cards per row
// Large (≥ 1024px):    4 columns → 4 cards per row

// RegisterCard adapts to grid column width:
// - Mobile: card width ≈ 100% of container
// - Desktop: card width ≈ 25% of container
// - Image inside card: 50% of card width (always centered)
```

**Visual Representation:**

```
Desktop (lg: 4 columns):
┌──────────┬──────────┬──────────┬──────────┐
│  ┌────┐  │  ┌────┐  │  ┌────┐  │  ┌────┐  │
│  │img │  │  │img │  │  │img │  │  │img │  │ ← 50% of card
│  └────┘  │  └────┘  │  └────┘  │  └────┘  │
│  Title   │  Title   │  Title   │  Title   │
└──────────┴──────────┴──────────┴──────────┘
    25%         25%         25%         25%     (card width)

Mobile (1 column):
┌─────────────────────┐
│      ┌────────┐     │
│      │  img   │     │ ← 50% of card (wider than desktop)
│      └────────┘     │
│       Title         │
└─────────────────────┘
         100%          (card width)
```

### 6.9.9 Приклад використання

**JSX Example:**

```tsx
import RegisterCard from './components/RegisterCard'

export default function ExamplePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Зовнішні ресурси</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Analytics Link */}
        <RegisterCard
          title="Аналітичний ШІ по модулю ЕКОПФО"
          image="/images/ai-ekopfo.webp"
          url="https://notebooklm.google.com/notebook/5ed43304-90a2-4193-a706-daec18cc8e33"
        />
        
        {/* Helpdesk Link */}
        <RegisterCard
          title="Підтримка користувачів"
          image="/images/Helpdesk.webp"
          url="https://e-health-ua.atlassian.net/servicedesk/customer/portal/32/group/88/create/296"
        />
        
        {/* Documentation Link */}
        <RegisterCard
          title="Документація системи"
          image="/images/docs.webp"
          url="https://docs.e-health.gov.ua/ekopfo"
        />
      </div>
    </div>
  )
}
```

**JSON Data Example:**

```json
{
  "externalLinks": [
    {
      "id": 1,
      "title": "Аналітичний ШІ по модулю ЕКОПФО",
      "image": "/images/ai-ekopfo.webp",
      "url": "https://notebooklm.google.com/notebook/5ed43304-90a2-4193-a706-daec18cc8e33"
    },
    {
      "id": 2,
      "title": "Підтримка користувачів",
      "image": "/images/Helpdesk.webp",
      "url": "https://e-health-ua.atlassian.net/servicedesk/customer/portal/32/group/88/create/296"
    },
    {
      "id": 3,
      "title": "Документація ЕКОПФО",
      "image": "/images/docs-ekopfo.webp",
      "url": "https://docs.e-health.gov.ua/ekopfo/user-guide"
    },
    {
      "id": 4,
      "title": "API Reference",
      "image": "/images/api.webp",
      "url": "https://api.e-health.gov.ua/docs"
    }
  ]
}
```

**Dynamic Rendering from JSON:**

```tsx
import RegisterCard from './components/RegisterCard'
import linksData from './data/external-links.json'

export default function DynamicExample() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {linksData.externalLinks.map((link) => (
        <RegisterCard
          key={link.id}
          title={link.title}
          image={link.image}
          url={link.url}
        />
      ))}
    </div>
  )
}
```

### 6.9.10 Порівняння RegisterCard vs Home Page Implementation

**Feature Comparison Table:**

| Feature | RegisterCard Component | Home Page Inline |
|---------|------------------------|------------------|
| **Location** | `app/components/RegisterCard.tsx` | `app/page.tsx` (inline JSX) |
| **Usage** | Exported component (reusable) | Inline code (one-time use) |
| **Link Type** | External (`<a href>`) | Internal (`<Link>`) |
| **Target** | `_blank` (new tab) | Same window (SPA) |
| **Image Width** | 50% (`w-1/2`) | 100% (full card width) |
| **Image Height** | 128px (`h-32`) fixed | Dynamic (square ratio, `paddingBottom: 100%`) |
| **Image Ratio** | Variable (depends on source) | 1:1 (square, enforced) |
| **Title Element** | `<h4>` | `<span>` |
| **Title Styles** | `font-semibold text-lg line-clamp-2` | `text-lg font-semibold text-blue-600` |
| **Hover Effect** | `hover:shadow-lg transition-shadow` | `hover:shadow-lg hover:scale-105` |
| **Data Source** | Props (any source) | `notebooks.json` (specific) |
| **Localization** | Parent responsibility | Built-in (`getRegistryTitle()`) |
| **Description** | Not supported | Not shown (but available in data) |
| **Security** | `noopener noreferrer` ✅ | Not needed (internal links) |
| **SEO** | Alt tags ✅ | Alt tags ✅ |
| **Current Status** | ❌ Not used | ✅ Active (Home Page) |

**When to Use Each:**

```yaml
Use RegisterCard when:
  ✅ Need external links (new tab behavior)
  ✅ Want reusable component (multiple pages)
  ✅ Different image ratios acceptable
  ✅ Building generic card grid

Use Home Page Inline when:
  ✅ Internal navigation (SPA routing)
  ✅ Specific to notebooks.json data
  ✅ Need square image ratio (consistent design)
  ✅ One-time implementation (no reuse planned)

Current Decision:
  - Home Page uses inline (better for SPA)
  - RegisterCard available for future (external links)
  - Both approaches valid for different use cases
```

---

**Дата створення:** 13 грудня 2025  
**Компонент:** `app/components/RegisterCard.tsx`  
**Props:** 3 required (title, image, url)  
**Target:** `_blank` (new tab)  
**Security:** `noopener noreferrer` ✅  
**Локалізація:** Props-based (parent responsibility)  
**Адаптивність:** Grid-level (component fixed width 50%)  
**Current Usage:** ❌ Not used (inline implementation preferred)  
**Future Use:** External links, documentation pages, generic grids
