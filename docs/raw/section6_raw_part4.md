# 📋 ПАСПОРТ САЙТУ
## Розділ 6: Картки реєстрів (Registry Cards) — Частина 4

---

## 6.11. 💻 ПРИКЛАДИ КОДУ

### 6.11.1 TypeScript Interface для RegisterCardProps

**Базовий інтерфейс (поточний):**

```typescript
// File: app/components/RegisterCard.tsx
// Current implementation

interface RegisterCardProps {
  title: string    // Required: Display title for the card
  image: string    // Required: Image path or URL
  url: string      // Required: Destination URL (external link)
}

// Usage in function signature:
export default function RegisterCard({
  title,
  image,
  url
}: RegisterCardProps) {
  return (
    // Component JSX
  )
}
```

**Розширений інтерфейс (пропонований):**

```typescript
// File: app/components/RegisterCard.tsx
// Extended version with optional fields

interface RegisterCardProps {
  // Core required fields
  title: string
  image: string
  url: string
  
  // Optional fields
  description?: string           // Card description (shown below title)
  badge?: string                 // Badge text (e.g., "New", "Updated")
  badgeColor?: 'blue' | 'green' | 'red' | 'yellow'
  openInNewTab?: boolean         // Default: true (target="_blank")
  imageAlt?: string              // Custom alt text (default: "{title} image")
  className?: string             // Additional CSS classes
  priority?: boolean             // Image loading priority (default: false)
  
  // Event handlers
  onClick?: () => void           // Click handler (before navigation)
  onImageLoad?: () => void       // Image load callback
  onImageError?: () => void      // Image error callback
}

// With defaults:
export default function RegisterCard({
  title,
  image,
  url,
  description,
  badge,
  badgeColor = 'blue',
  openInNewTab = true,
  imageAlt,
  className = '',
  priority = false,
  onClick,
  onImageLoad,
  onImageError
}: RegisterCardProps) {
  // Implementation
}
```

**З JSDoc коментарями:**

```typescript
/**
 * RegisterCard - Reusable card component for displaying registry links
 * 
 * @component
 * @example
 * <RegisterCard
 *   title="ЕКОПФО"
 *   image="/images/ai-ekopfo.webp"
 *   url="https://notebooklm.google.com/notebook/..."
 * />
 */

interface RegisterCardProps {
  /**
   * Card title displayed to user
   * Will be truncated after 2 lines with ellipsis
   * @required
   */
  title: string
  
  /**
   * Path to card image (relative or absolute URL)
   * Optimal size: 384x384px or larger for Retina displays
   * @required
   */
  image: string
  
  /**
   * Destination URL when card is clicked
   * Opens in new tab by default (target="_blank")
   * @required
   */
  url: string
  
  /**
   * Optional description shown below title
   * Truncated after 2 lines if too long
   * @optional
   */
  description?: string
  
  /**
   * Optional badge text (e.g., "New", "Popular")
   * Displayed in top-right corner of card
   * @optional
   */
  badge?: string
  
  /**
   * Badge background color
   * @default 'blue'
   * @optional
   */
  badgeColor?: 'blue' | 'green' | 'red' | 'yellow'
  
  /**
   * Whether to open link in new tab
   * @default true
   * @optional
   */
  openInNewTab?: boolean
  
  /**
   * Custom alt text for image accessibility
   * @default "{title} image"
   * @optional
   */
  imageAlt?: string
  
  /**
   * Additional CSS classes to apply to card
   * @optional
   */
  className?: string
  
  /**
   * Image loading priority (for above-fold images)
   * @default false
   * @optional
   */
  priority?: boolean
}

export default function RegisterCard(props: RegisterCardProps) {
  // Implementation
}
```

**Type Guards та Validation:**

```typescript
// Type guard for valid image URL
function isValidImageUrl(url: string): boolean {
  const validExtensions = ['.webp', '.png', '.jpg', '.jpeg', '.svg']
  return validExtensions.some(ext => url.toLowerCase().endsWith(ext)) ||
         url.startsWith('http://') || 
         url.startsWith('https://')
}

// Type guard for valid external URL
function isExternalUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://')
}

// Validation helper
function validateProps(props: RegisterCardProps): void {
  if (!props.title || props.title.trim().length === 0) {
    throw new Error('RegisterCard: title is required and cannot be empty')
  }
  
  if (!props.image || props.image.trim().length === 0) {
    throw new Error('RegisterCard: image is required and cannot be empty')
  }
  
  if (!props.url || props.url.trim().length === 0) {
    throw new Error('RegisterCard: url is required and cannot be empty')
  }
  
  // Warnings (non-blocking)
  if (!isValidImageUrl(props.image)) {
    console.warn(`RegisterCard: image "${props.image}" may not be a valid image URL`)
  }
  
  if (props.openInNewTab === false && isExternalUrl(props.url)) {
    console.warn('RegisterCard: External URL without target="_blank" may confuse users')
  }
}

// Usage with validation:
export default function RegisterCard(props: RegisterCardProps) {
  if (process.env.NODE_ENV === 'development') {
    validateProps(props)
  }
  
  // Component implementation
}
```

---

### 6.11.2 JSX приклад компонента RegisterCard

**Поточна реалізація (actual code):**

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
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border rounded overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="w-1/2 h-32 relative bg-gray-200 mx-auto rounded overflow-hidden">
        <Image
          src={image}
          alt={`${title} image`}
          fill
          className="object-cover"
          priority={false}
        />
      </div>
      <div className="p-4 text-center">
        <h4 className="font-semibold text-lg line-clamp-2">{title}</h4>
      </div>
    </a>
  )
}
```

**Розширена версія з description та badge:**

```tsx
// File: app/components/RegisterCard.tsx (extended)
import Image from 'next/image'

interface RegisterCardProps {
  title: string
  image: string
  url: string
  description?: string
  badge?: string
  badgeColor?: 'blue' | 'green' | 'red' | 'yellow'
  openInNewTab?: boolean
}

export default function RegisterCard({
  title,
  image,
  url,
  description,
  badge,
  badgeColor = 'blue',
  openInNewTab = true
}: RegisterCardProps) {
  // Badge color mapping
  const badgeColors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500'
  }
  
  return (
    <a
      href={url}
      target={openInNewTab ? '_blank' : '_self'}
      rel={openInNewTab ? 'noopener noreferrer' : undefined}
      className="block border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 relative"
    >
      {/* Badge (if provided) */}
      {badge && (
        <div className={`absolute top-2 right-2 ${badgeColors[badgeColor]} text-white px-2 py-1 text-xs rounded z-10`}>
          {badge}
        </div>
      )}
      
      {/* Image Container */}
      <div className="w-1/2 h-32 relative bg-gray-200 mx-auto rounded overflow-hidden">
        <Image
          src={image}
          alt={`${title} image`}
          fill
          className="object-cover"
          priority={false}
        />
      </div>
      
      {/* Text Container */}
      <div className="p-4 text-center">
        <h4 className="font-semibold text-lg line-clamp-2 mb-2">{title}</h4>
        
        {/* Description (if provided) */}
        {description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </a>
  )
}
```

**З error handling та fallback:**

```tsx
// File: app/components/RegisterCard.tsx (with error handling)
'use client'

import { useState } from 'react'
import Image from 'next/image'

interface RegisterCardProps {
  title: string
  image: string
  url: string
  description?: string
}

export default function RegisterCard({
  title,
  image,
  url,
  description
}: RegisterCardProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  
  // Fallback image if primary fails
  const fallbackImage = '/images/placeholder.webp'
  
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
    >
      {/* Image Container */}
      <div className="w-1/2 h-32 relative bg-gray-200 mx-auto rounded overflow-hidden">
        {/* Loading skeleton */}
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-300 animate-pulse" />
        )}
        
        {/* Image */}
        <Image
          src={imageError ? fallbackImage : image}
          alt={`${title} image`}
          fill
          className={`object-cover transition-opacity duration-300 ${
            imageLoading ? 'opacity-0' : 'opacity-100'
          }`}
          priority={false}
          onLoadingComplete={() => setImageLoading(false)}
          onError={() => {
            setImageError(true)
            setImageLoading(false)
          }}
        />
        
        {/* Error state indicator */}
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      
      {/* Text Container */}
      <div className="p-4 text-center">
        <h4 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h4>
        
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

---

### 6.11.3 Приклад map() для Home Page

**Базовий приклад (inline cards):**

```tsx
// File: app/page.tsx
import Link from 'next/link'
import Image from 'next/image'

interface Registry {
  slug: string
  title: string
  description?: string
  links?: { label: string; url: string; image?: string }[]
}

export default function HomePage() {
  // Assume registries is loaded from notebooks.json
  const registries: Registry[] = await loadRegistries()
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-4xl font-bold text-center mb-8">
        Медичні реєстри
      </h2>
      
      {/* Registry Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {registries.map((registry) => {
          // Extract image (first link's image or fallback)
          const image = (registry.links && registry.links.length > 0 && registry.links[0].image)
            ? registry.links[0].image
            : '/images/Helpdesk.webp'
          
          return (
            <div
              key={registry.slug}
              className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow hover:scale-105"
            >
              <Link href={`/registers/${registry.slug}`} className="block">
                {/* Square image container */}
                <div className="relative w-full" style={{ paddingBottom: '100%' }}>
                  <Image
                    src={image}
                    alt={registry.title}
                    fill
                    className="object-cover absolute inset-0"
                  />
                </div>
                
                {/* Title */}
                <div className="p-4 text-center">
                  <span className="text-lg font-semibold text-blue-600">
                    {registry.title}
                  </span>
                </div>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

**З RegisterCard компонентом:**

```tsx
// File: app/page.tsx
import RegisterCard from './components/RegisterCard'

interface Registry {
  slug: string
  title: string
  links?: { image?: string }[]
}

export default function HomePage() {
  const registries: Registry[] = await loadRegistries()
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-4xl font-bold text-center mb-8">
        Зовнішні ресурси
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {registries.map((registry) => (
          <RegisterCard
            key={registry.slug}
            title={registry.title}
            image={registry.links?.[0]?.image || '/images/Helpdesk.webp'}
            url={`/registers/${registry.slug}`}
          />
        ))}
      </div>
    </div>
  )
}
```

**З локалізацією та умовним рендерингом:**

```tsx
// File: app/page.tsx
import { getTranslations } from '../lib/i18n'
import { cookies } from 'next/headers'
import Link from 'next/link'
import Image from 'next/image'

export default async function HomePage() {
  // Load data and translations
  const registries = await loadRegistries()
  const locale = cookies().get('NEXT_LOCALE')?.value ?? 'uk'
  const t = await getTranslations(locale)
  
  // Translation helper
  const getRegistryTitle = (registry: Registry) => {
    return t.registryCards?.[registry.slug] || registry.title
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-4xl font-bold text-center mb-8 text-blue-600">
        {t.medicalRegistries}
      </h2>
      
      {/* Empty state */}
      {registries.length === 0 ? (
        <p className="text-red-600 text-center text-xl">
          {t.registersNotFound}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {registries.map((registry) => {
            const image = registry.links?.[0]?.image || '/images/Helpdesk.webp'
            const translatedTitle = getRegistryTitle(registry)
            
            return (
              <div
                key={registry.slug}
                className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow hover:scale-105"
              >
                <Link href={`/registers/${registry.slug}`} className="block">
                  <div className="relative w-full" style={{ paddingBottom: '100%' }}>
                    <Image
                      src={image}
                      alt={translatedTitle}
                      fill
                      className="object-cover absolute inset-0"
                      priority={false}
                    />
                  </div>
                  <div className="p-4 text-center">
                    <span className="text-lg font-semibold text-blue-600">
                      {translatedTitle}
                    </span>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
```

**З фільтрацією та пагінацією:**

```tsx
// File: app/page.tsx
'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage({ registries }: { registries: Registry[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8
  
  // Filtered registries
  const filteredRegistries = useMemo(() => {
    if (!searchQuery) return registries
    
    return registries.filter(r =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.slug.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [registries, searchQuery])
  
  // Paginated registries
  const paginatedRegistries = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredRegistries.slice(startIndex, endIndex)
  }, [filteredRegistries, currentPage])
  
  const totalPages = Math.ceil(filteredRegistries.length / itemsPerPage)
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Пошук реєстру..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setCurrentPage(1) // Reset to first page on search
          }}
          className="w-full max-w-md mx-auto block px-4 py-2 border rounded-lg"
        />
      </div>
      
      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {paginatedRegistries.map((registry) => {
          const image = registry.links?.[0]?.image || '/images/Helpdesk.webp'
          
          return (
            <div key={registry.slug} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <Link href={`/registers/${registry.slug}`} className="block">
                <div className="relative w-full" style={{ paddingBottom: '100%' }}>
                  <Image src={image} alt={registry.title} fill className="object-cover" />
                </div>
                <div className="p-4 text-center">
                  <span className="text-lg font-semibold text-blue-600">{registry.title}</span>
                </div>
              </Link>
            </div>
          )
        })}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            ← Попередня
          </button>
          <span className="px-4 py-2">
            Сторінка {currentPage} з {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Наступна →
          </button>
        </div>
      )}
    </div>
  )
}
```

---

### 6.11.4 Приклад імпорту notebooks.json

**Server-side import (Node.js fs):**

```typescript
// File: app/page.tsx or app/registers/[slug]/page.tsx
import fs from 'fs'
import path from 'path'

interface NotebookItem {
  slug: string
  title: string
  description?: string
  statusUrl?: string
  links?: { label: string; url: string; image?: string }[]
  instructions?: string[]
}

/**
 * Load registries from notebooks.json (server-side only)
 * Uses Node.js fs module, works in Server Components
 */
async function loadRegistries(): Promise<NotebookItem[]> {
  const filePath = path.join(process.cwd(), 'config', 'notebooks.json')
  
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const data: NotebookItem[] = JSON.parse(fileContent)
    return data
  } catch (error) {
    console.error('Error loading notebooks.json:', error)
    return []
  }
}

// Usage in Server Component:
export default async function HomePage() {
  const registries = await loadRegistries()
  
  return (
    <div>
      {registries.map(r => (
        <div key={r.slug}>{r.title}</div>
      ))}
    </div>
  )
}
```

**З валідацією та error handling:**

```typescript
// File: lib/loadRegistries.ts
import fs from 'fs'
import path from 'path'
import { z } from 'zod' // Optional: runtime validation with Zod

// Zod schema for validation
const NotebookItemSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  statusUrl: z.string().url().optional(),
  links: z.array(z.object({
    label: z.string(),
    url: z.string().url(),
    image: z.string().optional()
  })).optional(),
  instructions: z.array(z.string()).optional()
})

const NotebooksSchema = z.array(NotebookItemSchema)

type NotebookItem = z.infer<typeof NotebookItemSchema>

/**
 * Load and validate registries from notebooks.json
 * @throws Error if file not found or invalid JSON
 * @returns Array of validated NotebookItem objects
 */
export async function loadRegistries(): Promise<NotebookItem[]> {
  const filePath = path.join(process.cwd(), 'config', 'notebooks.json')
  
  // Check file exists
  if (!fs.existsSync(filePath)) {
    throw new Error(`notebooks.json not found at ${filePath}`)
  }
  
  try {
    // Read file
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    
    // Parse JSON
    let data: unknown
    try {
      data = JSON.parse(fileContent)
    } catch (parseError) {
      throw new Error(`Invalid JSON in notebooks.json: ${parseError}`)
    }
    
    // Validate schema
    const validatedData = NotebooksSchema.parse(data)
    
    // Additional business logic validation
    const slugs = new Set<string>()
    for (const item of validatedData) {
      if (slugs.has(item.slug)) {
        throw new Error(`Duplicate slug found: "${item.slug}"`)
      }
      slugs.add(item.slug)
    }
    
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

// Usage with error boundary:
export default async function HomePage() {
  let registries: NotebookItem[] = []
  let error: string | null = null
  
  try {
    registries = await loadRegistries()
  } catch (e) {
    error = e instanceof Error ? e.message : 'Unknown error'
  }
  
  if (error) {
    return (
      <div className="text-red-600 p-4">
        <h2>Error loading registries:</h2>
        <p>{error}</p>
      </div>
    )
  }
  
  return (
    <div>
      {registries.map(r => <div key={r.slug}>{r.title}</div>)}
    </div>
  )
}
```

**Client-side fetch (API route):**

```typescript
// File: app/api/registries/route.ts
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  const filePath = path.join(process.cwd(), 'config', 'notebooks.json')
  
  try {
    const data = fs.readFileSync(filePath, 'utf-8')
    return NextResponse.json(JSON.parse(data))
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load registries' },
      { status: 500 }
    )
  }
}

// File: app/page.tsx (client component)
'use client'

import { useEffect, useState } from 'react'

export default function HomePage() {
  const [registries, setRegistries] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetch('/api/registries')
      .then(res => res.json())
      .then(data => {
        setRegistries(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching registries:', error)
        setLoading(false)
      })
  }, [])
  
  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      {registries.map(r => <div key={r.slug}>{r.title}</div>)}
    </div>
  )
}
```

---

### 6.11.5 Приклад адаптивної grid-сітки

**Базовий Tailwind grid:**

```tsx
// Simple responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {registries.map(r => (
    <div key={r.slug}>Card content</div>
  ))}
</div>

// Breakpoints:
// grid-cols-1       → Mobile (< 640px):   1 column
// sm:grid-cols-2    → Small (≥ 640px):    2 columns
// md:grid-cols-3    → Medium (≥ 768px):   3 columns
// lg:grid-cols-4    → Large (≥ 1024px):   4 columns
// gap-6             → 24px gap between items
```

**З кастомними breakpoints:**

```tsx
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      }
    }
  }
}

// Component
<div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
  {registries.map(r => (
    <div key={r.slug}>Card</div>
  ))}
</div>

// Breakpoints:
// < 480px:     1 column  (mobile portrait)
// 480-639px:   2 columns (mobile landscape)
// 640-767px:   2 columns (small tablet)
// 768-1023px:  3 columns (tablet)
// 1024-1279px: 4 columns (desktop)
// 1280-1535px: 5 columns (large desktop)
// ≥ 1536px:    6 columns (extra large)
```

**З адаптивними gap та padding:**

```tsx
<div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
    {registries.map(r => (
      <div key={r.slug}>Card</div>
    ))}
  </div>
</div>

// Adaptive spacing:
// Padding:
//   Mobile:     px-2 py-4    (8px horizontal, 16px vertical)
//   Small:      px-4 py-6    (16px horizontal, 24px vertical)
//   Medium:     px-6 py-8    (24px horizontal, 32px vertical)
//   Large:      px-8 py-8    (32px horizontal, 32px vertical)
//
// Gap:
//   Mobile:     gap-3        (12px)
//   Small:      gap-4        (16px)
//   Medium:     gap-6        (24px)
//   Large:      gap-8        (32px)
```

**З CSS Grid auto-fit:**

```tsx
// CSS Module or Tailwind @apply
<div className="custom-grid">
  {registries.map(r => (
    <div key={r.slug}>Card</div>
  ))}
</div>

// CSS:
.custom-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}

// Auto-fit:
// - Automatically adjusts number of columns
// - Each column minimum 250px wide
// - Fills available space (1fr)
// - No breakpoints needed (fluid)

// Example widths:
// 300px container:  1 column  (250px min)
// 600px container:  2 columns (2 × 250px = 500px)
// 900px container:  3 columns (3 × 250px = 750px)
// 1200px container: 4 columns (4 × 250px = 1000px)
```

**З dynamic columns (JavaScript):**

```tsx
'use client'

import { useState, useEffect } from 'react'

export default function ResponsiveGrid({ registries }) {
  const [columns, setColumns] = useState(4)
  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 640) setColumns(1)
      else if (width < 768) setColumns(2)
      else if (width < 1024) setColumns(3)
      else setColumns(4)
    }
    
    handleResize() // Initial
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  return (
    <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {registries.map(r => (
        <div key={r.slug}>Card</div>
      ))}
    </div>
  )
}
```

---

### 6.11.6 Приклад локалізації title через t.registryCards

**Базова локалізація:**

```typescript
// File: app/page.tsx
import { getTranslations } from '../lib/i18n'
import { cookies } from 'next/headers'

export default async function HomePage() {
  // Get locale from cookies
  const locale = cookies().get('NEXT_LOCALE')?.value ?? 'uk'
  
  // Load translations
  const t = await getTranslations(locale)
  
  // Load registries
  const registries = await loadRegistries()
  
  // Translation helper function
  const getRegistryTitle = (registry: Registry) => {
    // Try translation first, fallback to JSON title
    const translatedTitle = t.registryCards?.[registry.slug]
    return translatedTitle || registry.title
  }
  
  return (
    <div>
      {registries.map(registry => (
        <div key={registry.slug}>
          <h3>{getRegistryTitle(registry)}</h3>
        </div>
      ))}
    </div>
  )
}
```

**Translation files структура:**

```json
// File: locales/ua.json
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
  },
  
  "registryDetails": {
    "ekopfo": {
      "description": "Система управління медичними справами пацієнтів...",
      "analyticsTitle": "Аналітичний ШІ по модулю ЕКОПФО",
      "analyticsCommentary": "Використовуйте для пошуку інформації..."
    }
  }
}

// File: locales/en.json
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
  },
  
  "registryDetails": {
    "ekopfo": {
      "description": "Patient medical records management system...",
      "analyticsTitle": "AI Analytics for EKOPFO Module",
      "analyticsCommentary": "Use this to search for information..."
    }
  }
}
```

**Повний приклад з локалізацією:**

```tsx
// File: app/page.tsx
import { cookies } from 'next/headers'
import { getTranslations } from '../lib/i18n'
import Link from 'next/link'
import Image from 'next/image'

export default async function HomePage() {
  // Locale detection
  const locale = cookies().get('NEXT_LOCALE')?.value ?? 'uk'
  const t = await getTranslations(locale)
  
  // Load data
  const registries = await loadRegistries()
  
  // Helper: Get translated title
  const getRegistryTitle = (registry: Registry) => {
    return t.registryCards?.[registry.slug as keyof typeof t.registryCards] || registry.title
  }
  
  return (
    <>
      {/* Hero Section */}
      <div className="w-full h-32 bg-cover bg-top relative"
           style={{ backgroundImage: "url('/images/Hero_ezdorovya.webp')" }}>
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white text-center">
            {t.siteTitle}
          </h1>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="w-full px-4 py-8">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8 text-blue-600">
            {t.medicalRegistries}
          </h2>
          
          {registries.length === 0 ? (
            <p className="text-red-600 text-center">
              {t.registersNotFound}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {registries.map((registry) => {
                const image = registry.links?.[0]?.image || '/images/Helpdesk.webp'
                const translatedTitle = getRegistryTitle(registry)
                
                return (
                  <div
                    key={registry.slug}
                    className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow hover:scale-105"
                  >
                    <Link href={`/registers/${registry.slug}`} className="block">
                      <div className="relative w-full" style={{ paddingBottom: '100%' }}>
                        <Image
                          src={image}
                          alt={translatedTitle}
                          fill
                          className="object-cover absolute inset-0"
                        />
                      </div>
                      <div className="p-4 text-center">
                        <span className="text-lg font-semibold text-blue-600">
                          {translatedTitle}
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

**З client-side locale switching:**

```tsx
// File: app/components/LanguageSwitcher.tsx
'use client'

import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

export default function LanguageSwitcher() {
  const router = useRouter()
  
  const switchLanguage = (locale: 'uk' | 'en') => {
    Cookies.set('NEXT_LOCALE', locale, { expires: 365 })
    router.refresh() // Refresh page to apply new translations
  }
  
  return (
    <div className="flex gap-2">
      <button
        onClick={() => switchLanguage('uk')}
        className="px-3 py-1 border rounded hover:bg-blue-600 hover:text-white"
      >
        УКР
      </button>
      <button
        onClick={() => switchLanguage('en')}
        className="px-3 py-1 border rounded hover:bg-blue-600 hover:text-white"
      >
        ENG
      </button>
    </div>
  )
}
```

---

**Дата створення:** 13 грудня 2025  
**Кількість прикладів:** 20+ code snippets  
**Мови програмування:** TypeScript, TSX, JSON  
**Frameworks:** Next.js 14, React, Tailwind CSS  
**Features:** i18n, responsive design, error handling, validation  
**Use Cases:** RegisterCard component, Home Page rendering, data loading, localization
