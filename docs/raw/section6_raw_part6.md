# 📋 ПАСПОРТ САЙТУ
## Розділ 6: Картки реєстрів (Registry Cards) — Частина 6

---

## 6.13. 🔗 ВЗАЄМОДІЯ З NOTEBOOKS.JSON

### 6.13.1 Загальна архітектура взаємодії

**Data Flow Overview:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATA SOURCE LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  config/notebooks.json                                          │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ [                                                         │ │
│  │   {                                                       │ │
│  │     "slug": "ekopfo",                  ← Required         │ │
│  │     "title": "ЕКОПФО",                 ← Required         │ │
│  │     "description": "...",              ← Optional         │ │
│  │     "statusUrl": "...",                ← Optional         │ │
│  │     "links": [                         ← Optional         │ │
│  │       {                                                   │ │
│  │         "label": "Analytics",                             │ │
│  │         "url": "https://...",                             │ │
│  │         "image": "/images/ai-ekopfo.webp"  ← Used in card │ │
│  │       },                                                  │ │
│  │       { ... Helpdesk ... }                                │ │
│  │     ],                                                    │ │
│  │     "instructions": [...]              ← Not used in cards│ │
│  │   },                                                      │ │
│  │   { ... 6 more registries ... }                           │ │
│  │ ]                                                         │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                          ↓
                    loadRegistries()
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Home Page (app/page.tsx)                                       │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ const registries = await loadRegistries()                 │ │
│  │ const t = await getTranslations(locale)                   │ │
│  │                                                           │ │
│  │ registries.map((r) => {                                   │ │
│  │   // Extract fields for card:                            │ │
│  │   const img = r.links?.[0]?.image || fallback  ← Image   │ │
│  │   const title = getRegistryTitle(r)             ← Title   │ │
│  │   const url = `/registers/${r.slug}`            ← URL     │ │
│  │                                                           │ │
│  │   return <InlineCard image={img} title={title} url={url}/>│ │
│  │ })                                                        │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  OR (if using RegisterCard component)                           │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ registries.map((r) => (                                   │ │
│  │   <RegisterCard                                           │ │
│  │     title={getRegistryTitle(r)}                           │ │
│  │     image={r.links?.[0]?.image || '/images/Helpdesk.webp'}│ │
│  │     url={`/registers/${r.slug}`}                          │ │
│  │   />                                                      │ │
│  │ ))                                                        │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                  PRESENTATION LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  7 Registry Cards (rendered in grid)                            │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                           │
│  │[img] │ │[img] │ │[img] │ │[img] │                           │
│  │Title │ │Title │ │Title │ │Title │                           │
│  └──────┘ └──────┘ └──────┘ └──────┘                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Key Principles:**

```yaml
Single Source of Truth:
  - All registry data stored in notebooks.json
  - No data duplication across components
  - Single file to edit for updates

Selective Field Usage:
  - Cards use only: slug, title, links[0].image
  - Detail pages use: all fields
  - Different pages, same data source

Type Safety:
  - TypeScript interfaces enforce structure
  - Compile-time validation
  - Runtime optional chaining for safety
```

---

### 6.13.2 Обов'язкові поля (Required Fields)

#### 6.13.2.1 TypeScript Interface

**NotebookItem structure:**

```typescript
// File: types/notebook.ts or inline in page.tsx
interface NotebookItem {
  slug: string           // REQUIRED
  title: string          // REQUIRED
  description?: string   // OPTIONAL
  statusUrl?: string     // OPTIONAL
  links?: LinkItem[]     // OPTIONAL
  instructions?: string[] // OPTIONAL
}

interface LinkItem {
  label: string          // REQUIRED (if links array exists)
  url: string            // REQUIRED (if links array exists)
  image?: string         // OPTIONAL
}
```

#### 6.13.2.2 Required Fields для карток

**Minimum data для рендерингу картки:**

```typescript
// Minimal valid registry object:
const minimalRegistry: NotebookItem = {
  slug: "ekopfo",           // ✅ REQUIRED - for URL generation
  title: "ЕКОПФО",          // ✅ REQUIRED - for display name
  // description: optional  // ❌ Not used in cards
  // statusUrl: optional    // ❌ Not used in cards
  // links: optional        // ⚠️ Used if present (for image)
  // instructions: optional // ❌ Not used in cards
}

// Card will render:
// - URL: /registers/ekopfo (from slug)
// - Title: "ЕКОПФО" (from title)
// - Image: /images/Helpdesk.webp (fallback, no links)
```

**Validation at runtime:**

```typescript
// File: lib/loadRegistries.ts
function validateRegistryForCard(item: NotebookItem): boolean {
  // Required fields check
  if (!item.slug || typeof item.slug !== 'string' || item.slug.trim() === '') {
    console.error('Registry missing required field: slug', item)
    return false
  }
  
  if (!item.title || typeof item.title !== 'string' || item.title.trim() === '') {
    console.error('Registry missing required field: title', item)
    return false
  }
  
  // Slug format validation (lowercase, alphanumeric, hyphens only)
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  if (!slugPattern.test(item.slug)) {
    console.warn(`Invalid slug format: "${item.slug}". Expected lowercase alphanumeric with hyphens.`)
    return false
  }
  
  return true
}

// Usage:
const registries = await loadRegistries()
const validRegistries = registries.filter(validateRegistryForCard)
```

**Required fields summary:**

| Field | Type | Required | Purpose | Validation | Example |
|-------|------|----------|---------|------------|---------|
| **slug** | `string` | ✅ Yes | URL generation (`/registers/${slug}`) | Non-empty, lowercase, alphanumeric+hyphens | `"ekopfo"` |
| **title** | `string` | ✅ Yes | Card display name | Non-empty string | `"ЕКОПФО"` |

**What happens if required fields missing:**

```typescript
// Missing slug:
{
  title: "ЕКОПФО"
}
// Error: Cannot generate URL
// Result: Card not rendered (filtered out)

// Missing title:
{
  slug: "ekopfo"
}
// Error: Cannot display card name
// Result: Card not rendered (filtered out)

// Empty slug:
{
  slug: "",
  title: "ЕКОПФО"
}
// Error: Invalid URL (/registers/)
// Result: Card not rendered (validation fails)

// Empty title:
{
  slug: "ekopfo",
  title: ""
}
// Error: Blank card (bad UX)
// Result: Card not rendered (validation fails)
```

---

### 6.13.3 Опціональні поля (Optional Fields)

#### 6.13.3.1 Поля що використовуються картками

**links (optional, but recommended):**

```typescript
interface NotebookItem {
  // ...
  links?: LinkItem[]  // OPTIONAL, but used if present
}

// Usage in Home Page:
const img = (r.links && r.links.length > 0 && r.links[0].image)
  ? r.links[0].image           // Use first link's image
  : '/images/Helpdesk.webp'    // Fallback to Helpdesk

// Scenarios:
// 1. links present with image:
{
  slug: "ekopfo",
  title: "ЕКОПФО",
  links: [
    {
      label: "Analytics",
      url: "https://notebooklm.google.com/...",
      image: "/images/ai-ekopfo.webp"  ← Used
    }
  ]
}
// Result: Card shows /images/ai-ekopfo.webp

// 2. links present without image:
{
  slug: "ekopfo",
  title: "ЕКОПФО",
  links: [
    {
      label: "Analytics",
      url: "https://notebooklm.google.com/..."
      // No image field
    }
  ]
}
// Result: Card shows /images/Helpdesk.webp (fallback)

// 3. links array empty:
{
  slug: "ekopfo",
  title: "ЕКОПФО",
  links: []
}
// Result: Card shows /images/Helpdesk.webp (fallback)

// 4. links missing entirely:
{
  slug: "ekopfo",
  title: "ЕКОПФО"
  // No links field
}
// Result: Card shows /images/Helpdesk.webp (fallback)
```

**Optional chaining safety:**

```typescript
// Safe access pattern:
r.links?.[0]?.image
//    ↑    ↑      ↑
//    |    |      └─ image may be undefined
//    |    └──────── first item may not exist
//    └───────────── links may be undefined

// Breakdown:
r.links          // May be undefined
r.links?.[0]     // Access first element only if links exists
r.links?.[0]?.image // Access image only if first element exists

// Without optional chaining (unsafe):
r.links[0].image
// ❌ Error if links is undefined: Cannot read property '0' of undefined
// ❌ Error if links is empty []: Cannot read property 'image' of undefined

// With optional chaining (safe):
r.links?.[0]?.image
// ✅ Returns undefined if links is undefined
// ✅ Returns undefined if links is empty
// ✅ Returns undefined if links[0] has no image
// ✅ Returns image value if all exist
```

#### 6.13.3.2 Поля що НЕ використовуються картками

**description (not used):**

```typescript
{
  slug: "ekopfo",
  title: "ЕКОПФО",
  description: "Надані документи описують систему управління..."  // ❌ Ignored by cards
}

// Home Page cards: description not displayed
// RegisterCard: description not supported (no prop)
// Detail Page: description is used (full text)

// Future enhancement:
// Could add description prop to RegisterCard
// Could show description on hover (tooltip)
// Could add description below title (line-clamp-2)
```

**statusUrl (not used):**

```typescript
{
  slug: "ekopfo",
  title: "ЕКОПФО",
  statusUrl: "https://ekoppho.instatus.com"  // ❌ Ignored by cards
}

// Home Page cards: statusUrl not used
// Detail Page: statusUrl used (iframe)

// Future enhancement:
// Could add status badge on card (green/red dot)
// Could fetch status and show on card
```

**instructions (not used):**

```typescript
{
  slug: "ekopfo",
  title: "ЕКОПФО",
  instructions: [
    "Перша інструкція...",
    "Друга інструкція..."
  ]  // ❌ Ignored by cards
}

// Cards: instructions not used
// Detail Page: instructions may be used (not currently implemented)
```

**Optional fields summary:**

| Field | Type | Used in Cards | Purpose | Default/Fallback |
|-------|------|---------------|---------|------------------|
| **links** | `LinkItem[]` | ⚠️ Partially | Image source (`links[0].image`) | `/images/Helpdesk.webp` |
| **description** | `string` | ❌ No | Not displayed on cards | N/A |
| **statusUrl** | `string` | ❌ No | Not used on cards | N/A |
| **instructions** | `string[]` | ❌ No | Not used on cards | N/A |

---

### 6.13.4 Обробка відсутності description

#### 6.13.4.1 Current State (No Description Support)

**Home Page inline cards:**

```typescript
// No description field used:
<div className="p-4 text-center">
  <span className="text-lg font-semibold text-blue-600">
    {getRegistryTitle(r)}  {/* Only title */}
  </span>
  {/* No description element */}
</div>
```

**RegisterCard component:**

```typescript
// No description prop:
interface RegisterCardProps {
  title: string
  image: string
  url: string
  // description: NOT supported
}

export default function RegisterCard({ title, image, url }) {
  return (
    <a href={url}>
      <div>{/* Image */}</div>
      <div className="p-4 text-center">
        <h4>{title}</h4>
        {/* No description rendering */}
      </div>
    </a>
  )
}
```

**Reasoning:**

```yaml
Why No Description Currently:

Design Decision:
  - Cards are minimal (image + title only)
  - Space constraints (especially mobile)
  - Focus on visual navigation (image primary)
  - Click-through model (details on next page)

UX Consideration:
  - Too much text reduces scannability
  - Description may not fit in grid layout
  - Consistent card height needed for grid alignment
  - Title truncation (line-clamp-2) already exists

Performance:
  - Less DOM nodes (faster rendering)
  - Smaller HTML payload
  - Simpler component logic
```

#### 6.13.4.2 Proposed Description Support (Future)

**Enhanced RegisterCard with description:**

```typescript
interface RegisterCardProps {
  title: string
  image: string
  url: string
  description?: string  // NEW: Optional description
}

export default function RegisterCard({
  title,
  image,
  url,
  description
}: RegisterCardProps) {
  return (
    <a href={url} className="...">
      <div className="w-1/2 h-32 relative bg-gray-200 mx-auto rounded overflow-hidden">
        <Image src={image} alt={`${title} image`} fill className="object-cover" />
      </div>
      
      <div className="p-4 text-center">
        <h4 className="font-semibold text-lg line-clamp-2 mb-2">{title}</h4>
        
        {/* Conditional description */}
        {description && (
          <p className="text-sm text-gray-600 line-clamp-2 mt-2">
            {description}
          </p>
        )}
      </div>
    </a>
  )
}
```

**Usage with notebooks.json:**

```typescript
// Home Page with description support:
{registries.map((r) => (
  <RegisterCard
    key={r.slug}
    title={getRegistryTitle(r)}
    image={r.links?.[0]?.image || '/images/Helpdesk.webp'}
    url={`/registers/${r.slug}`}
    description={r.description}  // Pass description if exists
  />
))}

// Scenarios:

// 1. Registry with description:
{
  slug: "ekopfo",
  title: "ЕКОПФО",
  description: "Система управління медичними справами пацієнтів"
}
// Result: Card shows title + description (2 lines max)

// 2. Registry without description:
{
  slug: "ekopfo",
  title: "ЕКОПФО"
  // No description
}
// Result: Card shows title only (no description element rendered)

// 3. Registry with empty description:
{
  slug: "ekopfo",
  title: "ЕКОПФО",
  description: ""
}
// Result: Card shows title only (empty string is falsy, condition fails)

// 4. Registry with long description:
{
  slug: "ekopfo",
  title: "ЕКОПФО",
  description: "Надані документи описують систему управління медичними справами пацієнтів і включають детальні інструкції щодо використання всіх функцій системи..."
}
// Result: Card shows title + description (truncated after 2 lines with ...)
```

**Conditional rendering logic:**

```typescript
// Falsy values that prevent description rendering:
{description && <p>{description}</p>}

// False (no render):
description = undefined     // ❌ Not rendered
description = null          // ❌ Not rendered
description = ""            // ❌ Not rendered (empty string is falsy)
description = 0             // ❌ Not rendered (unlikely for description)
description = false         // ❌ Not rendered (invalid type)

// True (render):
description = "Text"        // ✅ Rendered
description = " "           // ✅ Rendered (space is truthy, but bad UX)
description = "A"           // ✅ Rendered (even single character)

// Improved validation:
{description && description.trim().length > 0 && (
  <p className="text-sm text-gray-600 line-clamp-2">
    {description}
  </p>
)}

// This prevents rendering for:
description = ""            // ❌ Empty string
description = "   "         // ❌ Whitespace only
description = "\n\t"        // ❌ Whitespace characters only
```

---

### 6.13.5 Формування URL

#### 6.13.5.1 URL Generation Pattern

**Internal navigation (Home Page):**

```typescript
// Template literal pattern:
const cardUrl = `/registers/${r.slug}`

// Examples:
slug: "ekopfo"           → URL: /registers/ekopfo
slug: "endoprosthesis"   → URL: /registers/endoprosthesis
slug: "internatura"      → URL: /registers/internatura
slug: "vacancies"        → URL: /registers/vacancies
slug: "bpr"              → URL: /registers/bpr
slug: "ekrov"            → URL: /registers/ekrov
slug: "sen-ikp"          → URL: /registers/sen-ikp

// Next.js routing:
/registers/ekopfo  →  app/registers/[slug]/page.tsx
                      params.slug = "ekopfo"
```

**URL structure breakdown:**

```
Full URL: https://example.com/registers/ekopfo
          └────┬────┘└────┬────┘└───┬───┘
              │          │         │
           Protocol    Path       Slug
                       (static)  (dynamic)

Relative URL: /registers/ekopfo
              └────┬────┘└───┬───┘
                  │         │
              Static    Dynamic
              segment   segment

Next.js route: /registers/[slug]
               └────┬────┘└─┬──┘
                   │       │
               Static   Dynamic
               path     param
```

#### 6.13.5.2 Slug Validation

**Valid slug patterns:**

```typescript
// Regex pattern:
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

// Valid slugs:
"ekopfo"          ✅ Lowercase alphanumeric
"endoprosthesis"  ✅ Lowercase letters only
"sen-ikp"         ✅ Hyphen separator
"e-krov"          ✅ Single letter before hyphen
"bpr"             ✅ Short slug (3 chars)
"test-123"        ✅ Numbers allowed
"my-slug-123"     ✅ Multiple hyphens

// Invalid slugs:
"EKOPFO"          ❌ Uppercase not allowed
"eko_pfo"         ❌ Underscore not allowed
"eko pfo"         ❌ Spaces not allowed
"eko.pfo"         ❌ Dots not allowed
"-ekopfo"         ❌ Cannot start with hyphen
"ekopfo-"         ❌ Cannot end with hyphen
"eko--pfo"        ❌ Double hyphens not allowed
""                ❌ Empty string
"123"             ✅ Numbers only (valid, but not recommended)
```

**Slug sanitization function:**

```typescript
function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()                    // Convert to lowercase
    .trim()                           // Remove leading/trailing spaces
    .replace(/\s+/g, '-')            // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '')      // Remove invalid characters
    .replace(/-+/g, '-')             // Replace multiple hyphens with single
    .replace(/^-|-$/g, '')           // Remove leading/trailing hyphens
}

// Examples:
sanitizeSlug("ЕКОПФО")                    → "екопфо" (Cyrillic preserved if allowed)
sanitizeSlug("E-Health System")           → "e-health-system"
sanitizeSlug("Test___Slug")               → "test-slug"
sanitizeSlug("  My Slug  ")               → "my-slug"
sanitizeSlug("My--Slug--123")             → "my-slug-123"
sanitizeSlug("-leading-and-trailing-")    → "leading-and-trailing"

// Note: Current implementation expects slugs already valid in JSON
// Sanitization would be needed if slugs are user-generated
```

#### 6.13.5.3 URL Encoding

**Special characters handling:**

```typescript
// Next.js handles URL encoding automatically:
const slug = "sen-ikp"
const url = `/registers/${slug}`
// Next.js Link: encodes automatically if needed
<Link href={url}>{title}</Link>

// Manual encoding (if needed):
const encodedSlug = encodeURIComponent(slug)
const url = `/registers/${encodedSlug}`

// Examples:
"sen-ikp"         → "sen-ikp"        (no encoding needed)
"test slug"       → "test%20slug"    (space encoded)
"test/slug"       → "test%2Fslug"    (slash encoded)
"тест"            → "%D1%82%D0%B5..." (Cyrillic encoded)

// Current slugs (all ASCII, no encoding needed):
"ekopfo"          → "ekopfo"
"endoprosthesis"  → "endoprosthesis"
"sen-ikp"         → "sen-ikp"
```

#### 6.13.5.4 URL Building Examples

**Different URL patterns:**

```typescript
// 1. Internal navigation (current):
const internalUrl = `/registers/${r.slug}`
// Target: Same application (SPA navigation)
// Component: Next.js <Link>
// Opens: Same window

// 2. External link (RegisterCard with external URL):
const externalUrl = `https://example.com/registry/${r.slug}`
// Target: External site
// Component: <a href>
// Opens: New tab (target="_blank")

// 3. Query parameters:
const urlWithParams = `/registers/${r.slug}?ref=home&tab=analytics`
// URL: /registers/ekopfo?ref=home&tab=analytics
// Usage: Tracking, tab selection

// 4. Hash fragments:
const urlWithHash = `/registers/${r.slug}#description`
// URL: /registers/ekopfo#description
// Usage: Scroll to section

// 5. Absolute URL construction:
const baseUrl = typeof window !== 'undefined' 
  ? window.location.origin 
  : 'https://example.com'
const absoluteUrl = `${baseUrl}/registers/${r.slug}`
// URL: https://example.com/registers/ekopfo
// Usage: Sharing, SEO, Open Graph
```

---

### 6.13.6 Type Safety

#### 6.13.6.1 TypeScript Interface Definition

**Complete type structure:**

```typescript
// File: types/notebook.ts

/**
 * Represents a medical registry item
 */
export interface NotebookItem {
  /**
   * Unique identifier for the registry (used in URL)
   * Must be lowercase, alphanumeric with hyphens only
   * @example "ekopfo", "sen-ikp"
   */
  slug: string

  /**
   * Display name of the registry
   * Shown on cards and detail pages
   * @example "ЕКОПФО", "Ендопротезування"
   */
  title: string

  /**
   * Detailed description of the registry
   * Optional - used on detail pages, not on cards
   * @example "Надані документи описують систему управління..."
   */
  description?: string

  /**
   * Instatus monitoring URL
   * Optional - used for status iframe on detail pages
   * @example "https://ekoppho.instatus.com"
   */
  statusUrl?: string

  /**
   * External links (analytics, helpdesk, etc.)
   * Optional - first link's image used for card
   */
  links?: LinkItem[]

  /**
   * Usage instructions for the registry
   * Optional - not currently used in UI
   */
  instructions?: string[]
}

/**
 * Represents an external link item
 */
export interface LinkItem {
  /**
   * Display label for the link
   * @example "Аналітичний ШІ по модулю ЕКОПФО"
   */
  label: string

  /**
   * Target URL
   * @example "https://notebooklm.google.com/notebook/..."
   */
  url: string

  /**
   * Image path for visual representation
   * Optional - used for card images
   * @example "/images/ai-ekopfo.webp"
   */
  image?: string
}

/**
 * Array of notebook items (entire notebooks.json)
 */
export type NotebooksData = NotebookItem[]
```

#### 6.13.6.2 Compile-Time Validation

**TypeScript compiler checks:**

```typescript
// Valid usage (passes type check):
const registry: NotebookItem = {
  slug: "ekopfo",
  title: "ЕКОПФО",
  description: "Optional description",
  links: [
    {
      label: "Analytics",
      url: "https://example.com",
      image: "/images/ai-ekopfo.webp"
    }
  ]
}
// ✅ Compiles successfully

// Invalid: missing required field
const invalid1: NotebookItem = {
  slug: "ekopfo"
  // ❌ Error: Property 'title' is missing
}

// Invalid: wrong type
const invalid2: NotebookItem = {
  slug: "ekopfo",
  title: 123  // ❌ Error: Type 'number' is not assignable to type 'string'
}

// Invalid: wrong nested structure
const invalid3: NotebookItem = {
  slug: "ekopfo",
  title: "ЕКОПФО",
  links: [
    {
      label: "Analytics"
      // ❌ Error: Property 'url' is missing in type LinkItem
    }
  ]
}

// Invalid: extra property
const invalid4: NotebookItem = {
  slug: "ekopfo",
  title: "ЕКОПФО",
  extraField: "value"  // ❌ Error: Object literal may only specify known properties
}
```

#### 6.13.6.3 Runtime Validation

**Zod schema (optional but recommended):**

```typescript
import { z } from 'zod'

// Define Zod schema
const LinkItemSchema = z.object({
  label: z.string().min(1, "Label cannot be empty"),
  url: z.string().url("Must be a valid URL"),
  image: z.string().optional()
})

const NotebookItemSchema = z.object({
  slug: z.string()
    .min(1, "Slug cannot be empty")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  
  title: z.string()
    .min(1, "Title cannot be empty")
    .max(100, "Title too long (max 100 chars)"),
  
  description: z.string().optional(),
  
  statusUrl: z.string().url("Must be a valid URL").optional(),
  
  links: z.array(LinkItemSchema).optional(),
  
  instructions: z.array(z.string()).optional()
})

const NotebooksDataSchema = z.array(NotebookItemSchema)

// Runtime validation
export async function loadRegistries(): Promise<NotebookItem[]> {
  const filePath = path.join(process.cwd(), 'config', 'notebooks.json')
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const data = JSON.parse(fileContent)
  
  try {
    // Validate against schema
    const validatedData = NotebooksDataSchema.parse(data)
    return validatedData
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation errors in notebooks.json:')
      error.errors.forEach(err => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`)
      })
      throw new Error('notebooks.json validation failed')
    }
    throw error
  }
}

// Usage:
const registries = await loadRegistries()
// If validation fails, throws error with detailed messages
// If success, returns type-safe NotebookItem[]
```

#### 6.13.6.4 Type Guards

**Custom type guards:**

```typescript
// Check if object is valid NotebookItem
export function isNotebookItem(obj: unknown): obj is NotebookItem {
  if (typeof obj !== 'object' || obj === null) return false
  
  const item = obj as Record<string, unknown>
  
  // Check required fields
  if (typeof item.slug !== 'string' || item.slug.trim() === '') return false
  if (typeof item.title !== 'string' || item.title.trim() === '') return false
  
  // Check optional fields (if present)
  if (item.description !== undefined && typeof item.description !== 'string') return false
  if (item.statusUrl !== undefined && typeof item.statusUrl !== 'string') return false
  if (item.links !== undefined && !Array.isArray(item.links)) return false
  if (item.instructions !== undefined && !Array.isArray(item.instructions)) return false
  
  return true
}

// Check if LinkItem has image
export function hasImage(item: NotebookItem): boolean {
  return !!(item.links && item.links.length > 0 && item.links[0].image)
}

// Usage:
const data = JSON.parse(fileContent)

if (Array.isArray(data)) {
  const validItems = data.filter(isNotebookItem)
  const itemsWithImages = validItems.filter(hasImage)
  
  console.log(`Valid items: ${validItems.length}/${data.length}`)
  console.log(`Items with images: ${itemsWithImages.length}/${validItems.length}`)
}
```

#### 6.13.6.5 Generic Type Helpers

**Utility types:**

```typescript
// Extract only card-relevant fields
export type RegistryCardData = Pick<NotebookItem, 'slug' | 'title' | 'links'>

// Make all fields optional (for partial updates)
export type PartialNotebookItem = Partial<NotebookItem>

// Make all fields required (for strict validation)
export type RequiredNotebookItem = Required<NotebookItem>

// Extract image URL from NotebookItem
export type RegistryImage = string | undefined

// Helper function with specific return type
export function getRegistryImage(item: NotebookItem): RegistryImage {
  return item.links?.[0]?.image
}

// Usage:
const cardData: RegistryCardData = {
  slug: "ekopfo",
  title: "ЕКОПФО",
  links: [...]
}

// ✅ Valid: contains slug, title, links
// ✅ description, statusUrl, instructions not required (not in Pick)
```

---

### 6.13.7 Fallback локалізації

#### 6.13.7.1 Локалізаційна архітектура

**Translation chain:**

```
User Request
     ↓
Get locale from cookies (NEXT_LOCALE)
     ↓
Load translation file (locales/{locale}.json)
     ↓
Look up translation key (t.registryCards[slug])
     ↓
┌──────────────────────────────────────┐
│ Found?                               │
├──────────────────────────────────────┤
│ YES → Use translated title           │ ✅ "EKOPFO" (EN)
│  NO → Use fallback (notebooks.json)  │ ✅ "ЕКОПФО" (from JSON)
└──────────────────────────────────────┘
```

#### 6.13.7.2 getRegistryTitle Function

**Implementation:**

```typescript
// File: app/page.tsx
const getRegistryTitle = (registry: NotebookItem) => {
  // Try to get translation first
  const translatedTitle = t.registryCards?.[registry.slug as keyof typeof t.registryCards]
  
  // Fallback to JSON title if translation not found
  return translatedTitle || registry.title
}

// Breakdown:
// 1. t.registryCards - translation object (may be undefined)
// 2. ?.[registry.slug] - optional chaining (safe access)
// 3. as keyof typeof t.registryCards - type assertion (TypeScript)
// 4. || registry.title - fallback to original title

// Examples:

// Scenario 1: Translation exists (Ukrainian)
const t = {
  registryCards: {
    ekopfo: "ЕКОПФО",
    endoprosthesis: "Ендопротезування"
  }
}
const registry = { slug: "ekopfo", title: "EKOPFO" }
getRegistryTitle(registry)  // → "ЕКОПФО" (from translation)

// Scenario 2: Translation exists (English)
const t = {
  registryCards: {
    ekopfo: "EKOPFO",
    endoprosthesis: "Endoprosthesis"
  }
}
const registry = { slug: "ekopfo", title: "ЕКОПФО" }
getRegistryTitle(registry)  // → "EKOPFO" (from translation)

// Scenario 3: Translation missing for specific slug
const t = {
  registryCards: {
    ekopfo: "ЕКОПФО"
    // endoprosthesis: missing
  }
}
const registry = { slug: "endoprosthesis", title: "Ендопротезування" }
getRegistryTitle(registry)  // → "Ендопротезування" (fallback to JSON)

// Scenario 4: registryCards section missing entirely
const t = {
  // registryCards: missing
}
const registry = { slug: "ekopfo", title: "ЕКОПФО" }
getRegistryTitle(registry)  // → "ЕКОПФО" (fallback to JSON)

// Scenario 5: Translation is empty string
const t = {
  registryCards: {
    ekopfo: ""  // Empty string (falsy)
  }
}
const registry = { slug: "ekopfo", title: "ЕКОПФО" }
getRegistryTitle(registry)  // → "ЕКОПФО" (fallback, empty string is falsy)
```

#### 6.13.7.3 Translation File Structure

**Ukrainian (locales/ua.json):**

```json
{
  "siteTitle": "Портал eHealth",
  "medicalRegistries": "Медичні реєстри",
  "registersNotFound": "Реєстри не знайдені",
  
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

**English (locales/en.json):**

```json
{
  "siteTitle": "eHealth Portal",
  "medicalRegistries": "Medical Registries",
  "registersNotFound": "Registries not found",
  
  "registryCards": {
    "ekopfo": "EKOPFO",
    "endoprosthesis": "Endoprosthesis",
    "internatura": "Internship",
    "vacancies": "Vacancies",
    "bpr": "Continuing Professional Development",
    "ekrov": "e-Blood",
    "sen-ikp": "SEN ICP"
  }
}
```

#### 6.13.7.4 Fallback Chain

**Multi-level fallback:**

```typescript
// Level 1: Specific locale translation
// Level 2: Default locale translation (if different from current)
// Level 3: notebooks.json title (always exists)

function getRegistryTitleWithFallback(
  registry: NotebookItem,
  translations: Record<string, any>,
  defaultLocale: string = 'uk'
): string {
  // Level 1: Current locale translation
  const currentTranslation = translations.registryCards?.[registry.slug]
  if (currentTranslation) return currentTranslation
  
  // Level 2: Default locale translation (if available)
  if (defaultLocale !== 'uk') {
    // Load default locale translations
    const defaultTranslations = getTranslations(defaultLocale)
    const defaultTranslation = defaultTranslations.registryCards?.[registry.slug]
    if (defaultTranslation) return defaultTranslation
  }
  
  // Level 3: Original title from JSON (always exists)
  return registry.title
}

// Example flow:
// Current locale: pl (Polish - not supported)
// Default locale: uk (Ukrainian)
// Registry: { slug: "ekopfo", title: "ЕКОПФО" }

// Fallback chain:
// 1. Try pl translation: pl.registryCards.ekopfo → undefined ❌
// 2. Try uk translation: uk.registryCards.ekopfo → "ЕКОПФО" ✅
// 3. Return "ЕКОПФО"

// If uk translation also missing:
// 1. Try pl translation: undefined ❌
// 2. Try uk translation: undefined ❌
// 3. Use JSON title: "ЕКОПФО" ✅ (always exists)
```

#### 6.13.7.5 Type-Safe Translation Access

**TypeScript type for translations:**

```typescript
// File: lib/i18n.ts
export interface Translations {
  siteTitle: string
  medicalRegistries: string
  registersNotFound: string
  
  registryCards: {
    ekopfo: string
    endoprosthesis: string
    internatura: string
    vacancies: string
    bpr: string
    ekrov: string
    'sen-ikp': string  // Note: hyphen requires quotes
  }
  
  registryDetails: {
    ekopfo: {
      description: string
      analyticsTitle: string
      analyticsCommentary: string
    }
    // ... other registries
  }
}

// Type-safe access:
function getRegistryTitle(
  registry: NotebookItem,
  t: Translations
): string {
  // TypeScript ensures registryCards exists
  const translated = t.registryCards[registry.slug as keyof typeof t.registryCards]
  return translated || registry.title
}

// Compile-time error if key missing:
t.registryCards.nonexistent  // ❌ Error: Property 'nonexistent' does not exist
t.registryCards.ekopfo       // ✅ OK: string
```

---

## 6.13.8 Summary: Data Integration Best Practices

**Key Principles:**

✅ **Required Fields:**
- Always validate `slug` and `title` presence
- Enforce slug format (lowercase, alphanumeric, hyphens)
- Check non-empty strings

✅ **Optional Fields:**
- Use optional chaining (`?.`) for safe access
- Provide fallbacks for missing data
- Don't assume optional fields exist

✅ **Type Safety:**
- Define TypeScript interfaces
- Use Zod for runtime validation
- Implement type guards

✅ **Localization:**
- Always provide fallback to JSON title
- Use optional chaining for translation access
- Support multiple locale fallbacks

✅ **URL Generation:**
- Use template literals for consistency
- Validate slug format before URL construction
- Consider encoding for special characters

**Anti-Patterns to Avoid:**

❌ **Direct Property Access:**
```typescript
const image = r.links[0].image  // ❌ May throw error
const image = r.links?.[0]?.image  // ✅ Safe
```

❌ **No Fallback:**
```typescript
const title = t.registryCards[r.slug]  // ❌ May be undefined
const title = t.registryCards[r.slug] || r.title  // ✅ Always has value
```

❌ **Type Assertions Without Validation:**
```typescript
const item = data as NotebookItem  // ❌ Unsafe cast
if (isNotebookItem(data)) { /* use data */ }  // ✅ Validated
```

**Checklist for notebooks.json Updates:**

```yaml
Before Adding New Registry:
  ☐ Ensure slug is unique
  ☐ Validate slug format (lowercase, alphanumeric, hyphens)
  ☐ Provide title (non-empty)
  ☐ Add translations to locales/ua.json and locales/en.json
  ☐ Include links[0].image for card display
  ☐ Test with both locales (UA/EN)
  ☐ Verify URL generation (/registers/{slug})
  ☐ Check for TypeScript errors
  ☐ Validate JSON syntax
  ☐ Commit with descriptive message
```

---

**Дата створення:** 13 грудня 2025  
**Розділ:** 6.13 Взаємодія з notebooks.json  
**Підрозділів:** 8 (архітектура, required fields, optional fields, description, URL, type safety, i18n fallback, summary)  
**Таблиць:** 5+ comparison tables  
**Code Examples:** 30+ TypeScript/JSON snippets  
**Validation:** Runtime (Zod) + Compile-time (TypeScript) + Type Guards
