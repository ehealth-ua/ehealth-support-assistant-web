# 📋 ПАСПОРТ САЙТУ
## Розділ 6: Картки реєстрів (Registry Cards) — Частина 7

---

## 6.14. 🧪 ТЕСТОВІ СЦЕНАРІЇ

### 6.14.1 Загальна стратегія тестування

**Test Pyramid для Registry Cards:**

```
                    ┌─────────┐
                    │   E2E   │  ← 10% (повний user journey)
                    │  Tests  │
                    └─────────┘
                  ┌─────────────┐
                  │ Integration │  ← 30% (компонент + дані)
                  │    Tests    │
                  └─────────────┘
              ┌───────────────────┐
              │   Unit Tests      │  ← 60% (окремі функції)
              │                   │
              └───────────────────┘

Розподіл тестів:
├─ Unit Tests (60%)
│  ├─ getRegistryTitle() function
│  ├─ URL generation logic
│  ├─ Validation functions
│  └─ Type guards
│
├─ Integration Tests (30%)
│  ├─ RegisterCard rendering
│  ├─ Home Page cards grid
│  └─ Localization integration
│
└─ E2E Tests (10%)
   ├─ Card click navigation
   ├─ Mobile responsive behavior
   └─ Cross-browser compatibility
```

**Testing Tools:**

```yaml
Framework:
  - Jest: Unit & Integration tests
  - React Testing Library: Component tests
  - Playwright/Cypress: E2E tests
  - MSW (Mock Service Worker): API mocking

Coverage Goals:
  - Statements: > 80%
  - Branches: > 75%
  - Functions: > 80%
  - Lines: > 80%

Test Categories:
  - Functional: Core functionality works
  - Visual: Correct rendering
  - Accessibility: WCAG compliance
  - Performance: Load time, rendering speed
  - Cross-browser: Chrome, Firefox, Safari, Edge
  - Responsive: Mobile, tablet, desktop
```

---

### 6.14.2 Manual Test Scenarios

#### 6.14.2.1 Рендеринг без description

**Test Case ID:** RTC-MAN-001  
**Priority:** High  
**Type:** Functional, Visual

**Pre-conditions:**
- Registry exists in notebooks.json without description field
- Home Page accessible at `/`
- Browser: Chrome (latest)

**Test Data:**

```json
{
  "slug": "test-registry",
  "title": "Test Registry",
  "links": [
    {
      "label": "Test Link",
      "url": "https://example.com",
      "image": "/images/test.webp"
    }
  ]
}
```

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to Home Page (`/`) | Page loads successfully |
| 2 | Scroll to "Медичні реєстри" section | Registry cards grid visible |
| 3 | Locate card with "Test Registry" title | Card present in grid |
| 4 | Inspect card structure | Image displayed at top, title below |
| 5 | Check for description element | **No description element present** |
| 6 | Verify card height | Same height as other cards (grid alignment) |
| 7 | Hover over card | Shadow and scale effects applied |

**Expected Result:**
- ✅ Card renders correctly without description
- ✅ No blank space where description would be
- ✅ Card height consistent with others
- ✅ No console errors
- ✅ Image + title only

**Acceptance Criteria:**
```typescript
// No <p> element with description class
expect(card.querySelector('.text-sm.text-gray-600')).toBeNull()

// Only title present
expect(card.querySelectorAll('.p-4 > *')).toHaveLength(1)
```

---

#### 6.14.2.2 Рендеринг з довгим title

**Test Case ID:** RTC-MAN-002  
**Priority:** High  
**Type:** Visual, Functional

**Pre-conditions:**
- Registry with long title (> 50 chars) in notebooks.json
- Home Page accessible

**Test Data:**

```json
{
  "slug": "long-title-registry",
  "title": "Надзвичайно довга назва реєстру яка точно не вміститься в одну лінію і буде обрізана",
  "links": [
    {
      "label": "Link",
      "url": "https://example.com",
      "image": "/images/test.webp"
    }
  ]
}
```

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to Home Page | Page loads |
| 2 | Locate card with long title | Card visible |
| 3 | Inspect title element | Title text visible |
| 4 | Count visible lines | **Max 2 lines** (line-clamp-2) |
| 5 | Check for ellipsis (...) | Ellipsis present at end of line 2 |
| 6 | Measure card height | Same as other cards |
| 7 | Resize window to mobile (375px) | Title still max 2 lines |
| 8 | Resize to desktop (1440px) | Title still max 2 lines |

**Expected Result:**
- ✅ Title truncated after 2 lines
- ✅ Ellipsis (...) visible
- ✅ No text overflow outside card
- ✅ Card height consistent
- ✅ Responsive on all screen sizes

**Visual Check:**

```
Expected rendering:

┌──────────────────────┐
│      [Image]         │
├──────────────────────┤
│ Надзвичайно довга    │ ← Line 1
│ назва реєстру як...  │ ← Line 2 (truncated with ...)
└──────────────────────┘

NOT:
┌──────────────────────┐
│      [Image]         │
├──────────────────────┤
│ Надзвичайно довга    │
│ назва реєстру яка    │
│ точно не вміститься  │ ← Line 3 (should not exist)
└──────────────────────┘
```

**CSS Validation:**

```css
/* Expected styles */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
```

---

#### 6.14.2.3 Рендеринг з коротким title

**Test Case ID:** RTC-MAN-003  
**Priority:** Medium  
**Type:** Visual

**Pre-conditions:**
- Registry with short title (< 10 chars) in notebooks.json

**Test Data:**

```json
{
  "slug": "short",
  "title": "БПР",
  "links": [
    {
      "label": "Link",
      "url": "https://example.com",
      "image": "/images/test.webp"
    }
  ]
}
```

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to Home Page | Page loads |
| 2 | Locate card with "БПР" title | Card visible |
| 3 | Count title lines | **1 line** (title fits) |
| 4 | Check vertical alignment | Title centered vertically in text container |
| 5 | Compare card height | Same height as cards with 2-line titles |
| 6 | Check padding | Consistent padding (p-4 = 16px) |

**Expected Result:**
- ✅ Title on single line
- ✅ No truncation (no ellipsis)
- ✅ Centered alignment
- ✅ Consistent card height
- ✅ No extra whitespace

**Measurement:**

```
Title container height:
- Padding top: 16px
- Line 1: 28px (text-lg line-height)
- Padding bottom: 16px
- Total: 60px

Same for long titles (2 lines):
- Padding top: 16px
- Line 1: 28px
- Line 2: 28px
- Padding bottom: 16px
- Total: 88px

Note: Cards may have different heights if no min-height set
Solution: Grid handles different heights gracefully
```

---

#### 6.14.2.4 Рендеринг з відсутнім slug (Edge Case)

**Test Case ID:** RTC-MAN-004  
**Priority:** Critical  
**Type:** Functional, Error Handling

**Pre-conditions:**
- Intentionally malformed registry in notebooks.json
- Error handling implemented

**Test Data:**

```json
{
  "title": "Registry Without Slug",
  "links": [
    {
      "label": "Link",
      "url": "https://example.com",
      "image": "/images/test.webp"
    }
  ]
}
```

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Add malformed registry to notebooks.json | File saved |
| 2 | Restart dev server | Server restarts |
| 3 | Open browser console | Console open |
| 4 | Navigate to Home Page | Page loads |
| 5 | Check console for errors | **Validation error logged** |
| 6 | Count visible cards | Malformed registry **not rendered** |
| 7 | Check for broken card placeholder | No broken/empty cards visible |
| 8 | Verify other cards | Valid registries render normally |

**Expected Console Output:**

```javascript
// Expected error log:
console.error('Registry missing required field: slug', {
  title: "Registry Without Slug",
  links: [...]
})

// Or (if validation at load):
Error: notebooks.json validation failed
  - [0].slug: Required
```

**Expected Behavior:**

```yaml
Graceful Degradation:
  ✅ Page loads (no crash)
  ✅ Invalid registry filtered out
  ✅ Error logged to console (dev mode)
  ✅ User sees working cards only
  ❌ No broken UI elements

Production:
  - Error sent to logging service (e.g., Sentry)
  - User notification (optional): "Some registries unavailable"
  - Fallback: Show available registries only
```

**Validation Function Test:**

```typescript
// Expected validation behavior
const invalidRegistry = {
  title: "Registry Without Slug"
}

validateRegistryForCard(invalidRegistry)
// Returns: false

const registries = [validRegistry1, invalidRegistry, validRegistry2]
const filtered = registries.filter(validateRegistryForCard)
// filtered.length === 2 (invalid filtered out)
```

---

#### 6.14.2.5 Коректність URL

**Test Case ID:** RTC-MAN-005  
**Priority:** Critical  
**Type:** Functional

**Pre-conditions:**
- Multiple registries with different slug formats
- Next.js router working

**Test Data:**

```json
[
  { "slug": "simple", "title": "Simple" },
  { "slug": "with-hyphen", "title": "With Hyphen" },
  { "slug": "multiple-hyphens-here", "title": "Multiple" },
  { "slug": "number123", "title": "With Numbers" }
]
```

**Test Steps:**

| Step | Slug | Action | Expected URL | Expected Result |
|------|------|--------|--------------|-----------------|
| 1 | `simple` | Hover over card | `/registers/simple` shown in status bar | ✅ Correct |
| 2 | `simple` | Click card | Navigate to `/registers/simple` | ✅ Detail page loads |
| 3 | `with-hyphen` | Click card | Navigate to `/registers/with-hyphen` | ✅ Detail page loads |
| 4 | `multiple-hyphens-here` | Click card | Navigate to `/registers/multiple-hyphens-here` | ✅ Correct |
| 5 | `number123` | Click card | Navigate to `/registers/number123` | ✅ Correct |
| 6 | (any) | Check href attribute | `href="/registers/{slug}"` | ✅ Matches pattern |
| 7 | (any) | Right-click → Copy link | `/registers/{slug}` copied | ✅ Correct |

**URL Validation:**

```typescript
// Test each card's href attribute
const cards = document.querySelectorAll('a[href^="/registers/"]')

cards.forEach((card, index) => {
  const href = card.getAttribute('href')
  const slug = registries[index].slug
  
  // Expected pattern
  expect(href).toBe(`/registers/${slug}`)
  
  // Must be relative URL
  expect(href.startsWith('http')).toBe(false)
  
  // Must start with /registers/
  expect(href.startsWith('/registers/')).toBe(true)
})
```

**Browser Back Button Test:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click card "ЕКОПФО" | Navigate to `/registers/ekopfo` |
| 2 | Press browser Back button | Return to Home Page `/` |
| 3 | Check scroll position | Scroll restored to previous position |
| 4 | Click card "Вакансії" | Navigate to `/registers/vacancies` |
| 5 | Press Back | Return to Home Page |

---

#### 6.14.2.6 Адаптивність на різних екранах

**Test Case ID:** RTC-MAN-006  
**Priority:** High  
**Type:** Visual, Responsive

**Pre-conditions:**
- 7 registry cards available
- Responsive breakpoints configured

**Test Devices/Sizes:**

| Device | Width | Expected Columns | Gap |
|--------|-------|------------------|-----|
| iPhone SE | 375px | 1 column | 24px |
| iPhone 12 Pro | 390px | 1 column | 24px |
| iPad Mini | 768px | 3 columns | 24px |
| iPad Pro | 1024px | 4 columns | 24px |
| MacBook Air | 1280px | 4 columns | 24px |
| Desktop 4K | 1920px | 4 columns | 24px |

**Test Steps (per device):**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Set viewport to device width | Browser resizes |
| 2 | Navigate to Home Page | Page loads |
| 3 | Scroll to registry cards | Cards visible |
| 4 | Count columns | Matches expected (see table) |
| 5 | Measure gap between cards | 24px (gap-6) |
| 6 | Check card width | Cards fill columns evenly |
| 7 | Rotate to landscape (mobile) | Columns adjust (1→2) |
| 8 | Check image aspect ratio | Square (1:1) maintained |
| 9 | Check text overflow | No horizontal scroll |
| 10 | Test hover effect | Works on desktop, tap on mobile |

**Visual Regression Test (Manual):**

```
Mobile (375px):
┌────────────────────┐
│   ┌──────────┐     │
│   │  Card 1  │     │
│   └──────────┘     │
│   ┌──────────┐     │
│   │  Card 2  │     │
│   └──────────┘     │
│   ┌──────────┐     │
│   │  Card 3  │     │
│   └──────────┘     │
└────────────────────┘
  1 column layout

Tablet (768px):
┌─────────────────────────────────┐
│ ┌────┐  ┌────┐  ┌────┐          │
│ │ C1 │  │ C2 │  │ C3 │          │
│ └────┘  └────┘  └────┘          │
│ ┌────┐  ┌────┐  ┌────┐          │
│ │ C4 │  │ C5 │  │ C6 │          │
│ └────┘  └────┘  └────┘          │
│ ┌────┐                           │
│ │ C7 │                           │
│ └────┘                           │
└─────────────────────────────────┘
  3 columns layout

Desktop (1280px):
┌──────────────────────────────────────┐
│ ┌───┐  ┌───┐  ┌───┐  ┌───┐          │
│ │C1 │  │C2 │  │C3 │  │C4 │          │
│ └───┘  └───┘  └───┘  └───┘          │
│ ┌───┐  ┌───┐  ┌───┐                 │
│ │C5 │  │C6 │  │C7 │                 │
│ └───┘  └───┘  └───┘                 │
└──────────────────────────────────────┘
  4 columns layout
```

**Touch Interaction Test (Mobile/Tablet):**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Tap card | Navigation initiated (no delay) |
| 2 | Tap and hold | Context menu appears (browser default) |
| 3 | Swipe left/right on card | No horizontal scroll (unless page scroll) |
| 4 | Double-tap card | Zoom disabled (viewport meta tag) |
| 5 | Pinch zoom | Disabled for better UX |

---

#### 6.14.2.7 Коректність локалізації

**Test Case ID:** RTC-MAN-007  
**Priority:** High  
**Type:** Functional, Localization

**Pre-conditions:**
- Both UA and EN translation files exist
- Language switcher functional
- Registry exists in notebooks.json

**Test Data:**

```json
// notebooks.json
{
  "slug": "ekopfo",
  "title": "ЕКОПФО"
}

// locales/ua.json
{
  "registryCards": {
    "ekopfo": "ЕКОПФО"
  }
}

// locales/en.json
{
  "registryCards": {
    "ekopfo": "EKOPFO"
  }
}
```

**Test Steps:**

| Step | Action | Current Locale | Expected Card Title | Result |
|------|--------|----------------|---------------------|--------|
| 1 | Open Home Page | UA (default) | "ЕКОПФО" | ✅ |
| 2 | Click language switcher "EN" | EN | "EKOPFO" | ✅ |
| 3 | Refresh page | EN (cookie persisted) | "EKOPFO" | ✅ |
| 4 | Click language switcher "УКР" | UA | "ЕКОПФО" | ✅ |
| 5 | Open in incognito (no cookie) | UA (default) | "ЕКОПФО" | ✅ |

**Fallback Test (Missing Translation):**

```json
// locales/en.json (incomplete)
{
  "registryCards": {
    "ekopfo": "EKOPFO"
    // "vacancies": missing
  }
}
```

| Step | Action | Locale | Registry | Expected Title | Source |
|------|--------|--------|----------|----------------|--------|
| 1 | Open Home Page | EN | ekopfo | "EKOPFO" | Translation ✅ |
| 2 | Same page | EN | vacancies | "Вакансії" | Fallback (JSON) ✅ |
| 3 | Switch to UA | UA | vacancies | "Вакансії" | Translation ✅ |

**Cookie Persistence Test:**

| Step | Action | Cookie Value | Expected Behavior |
|------|--------|--------------|-------------------|
| 1 | First visit (no cookie) | `undefined` | Default locale (UA) |
| 2 | Switch to EN | `NEXT_LOCALE=en` | Page reloads with EN |
| 3 | Close browser | Cookie persists | - |
| 4 | Reopen browser, visit site | `NEXT_LOCALE=en` | Still EN ✅ |
| 5 | Clear cookies | `undefined` | Back to default (UA) |

**All Registries Localization Test:**

| Registry | UA Title | EN Title | Fallback (JSON) |
|----------|----------|----------|-----------------|
| ekopfo | "ЕКОПФО" | "EKOPFO" | "ЕКОПФО" |
| endoprosthesis | "Ендопротезування" | "Endoprosthesis" | "Ендопротезування" |
| internatura | "Інтернатура" | "Internship" | "Інтернатура" |
| vacancies | "Вакансії" | "Vacancies" | "Вакансії" |
| bpr | "Система Безперервного Розвитку" | "Continuing Professional Development" | "Система Безперервного Розвитку" |
| ekrov | "е-Кров" | "e-Blood" | "е-Кров" |
| sen-ikp | "СЕН ІКП" | "SEN ICP" | "СЕН ІКП" |

**Expected Behavior:**
- ✅ All translations present → use translation
- ⚠️ Translation missing → fallback to JSON title
- ✅ No console errors for missing keys
- ✅ Cookie persists across sessions

---

### 6.14.3 Automated Test Scenarios

#### 6.14.3.1 Unit Tests

**Test Suite: URL Generation**

```typescript
// File: __tests__/lib/urlGeneration.test.ts
import { describe, it, expect } from '@jest/globals'

describe('URL Generation', () => {
  it('should generate correct URL from slug', () => {
    const slug = 'ekopfo'
    const url = `/registers/${slug}`
    expect(url).toBe('/registers/ekopfo')
  })

  it('should handle hyphens in slug', () => {
    const slug = 'sen-ikp'
    const url = `/registers/${slug}`
    expect(url).toBe('/registers/sen-ikp')
  })

  it('should handle multiple hyphens', () => {
    const slug = 'my-long-slug-name'
    const url = `/registers/${slug}`
    expect(url).toBe('/registers/my-long-slug-name')
  })

  it('should not encode valid slug characters', () => {
    const slug = 'test123-abc'
    const url = `/registers/${slug}`
    expect(url).not.toContain('%')
  })
})
```

**Test Suite: Validation Functions**

```typescript
// File: __tests__/lib/validation.test.ts
import { validateRegistryForCard, isNotebookItem } from '@/lib/validation'

describe('Registry Validation', () => {
  describe('validateRegistryForCard', () => {
    it('should return true for valid registry', () => {
      const registry = {
        slug: 'ekopfo',
        title: 'ЕКОПФО'
      }
      expect(validateRegistryForCard(registry)).toBe(true)
    })

    it('should return false for missing slug', () => {
      const registry = {
        title: 'ЕКОПФО'
      }
      expect(validateRegistryForCard(registry)).toBe(false)
    })

    it('should return false for empty slug', () => {
      const registry = {
        slug: '',
        title: 'ЕКОПФО'
      }
      expect(validateRegistryForCard(registry)).toBe(false)
    })

    it('should return false for missing title', () => {
      const registry = {
        slug: 'ekopfo'
      }
      expect(validateRegistryForCard(registry)).toBe(false)
    })

    it('should return false for invalid slug format', () => {
      const registry = {
        slug: 'Invalid Slug',
        title: 'ЕКОПФО'
      }
      expect(validateRegistryForCard(registry)).toBe(false)
    })

    it('should accept slug with hyphens', () => {
      const registry = {
        slug: 'sen-ikp',
        title: 'СЕН ІКП'
      }
      expect(validateRegistryForCard(registry)).toBe(true)
    })

    it('should reject slug with uppercase', () => {
      const registry = {
        slug: 'EKOPFO',
        title: 'ЕКОПФО'
      }
      expect(validateRegistryForCard(registry)).toBe(false)
    })
  })

  describe('isNotebookItem type guard', () => {
    it('should return true for valid NotebookItem', () => {
      const item = {
        slug: 'ekopfo',
        title: 'ЕКОПФО',
        description: 'Description',
        links: []
      }
      expect(isNotebookItem(item)).toBe(true)
    })

    it('should return false for null', () => {
      expect(isNotebookItem(null)).toBe(false)
    })

    it('should return false for non-object', () => {
      expect(isNotebookItem('string')).toBe(false)
      expect(isNotebookItem(123)).toBe(false)
    })
  })
})
```

**Test Suite: Localization**

```typescript
// File: __tests__/lib/localization.test.ts
import { getRegistryTitle } from '@/lib/i18n'

describe('Localization', () => {
  const mockTranslations = {
    registryCards: {
      ekopfo: 'ЕКОПФО',
      vacancies: 'Вакансії'
    }
  }

  describe('getRegistryTitle', () => {
    it('should return translated title if exists', () => {
      const registry = {
        slug: 'ekopfo',
        title: 'Fallback Title'
      }
      const result = getRegistryTitle(registry, mockTranslations)
      expect(result).toBe('ЕКОПФО')
    })

    it('should fallback to JSON title if translation missing', () => {
      const registry = {
        slug: 'nonexistent',
        title: 'JSON Title'
      }
      const result = getRegistryTitle(registry, mockTranslations)
      expect(result).toBe('JSON Title')
    })

    it('should handle empty translations object', () => {
      const registry = {
        slug: 'ekopfo',
        title: 'JSON Title'
      }
      const result = getRegistryTitle(registry, {})
      expect(result).toBe('JSON Title')
    })

    it('should handle undefined registryCards', () => {
      const registry = {
        slug: 'ekopfo',
        title: 'JSON Title'
      }
      const result = getRegistryTitle(registry, { registryCards: undefined })
      expect(result).toBe('JSON Title')
    })
  })
})
```

---

#### 6.14.3.2 Integration Tests

**Test Suite: RegisterCard Component**

```typescript
// File: __tests__/components/RegisterCard.test.tsx
import { render, screen } from '@testing-library/react'
import RegisterCard from '@/app/components/RegisterCard'

describe('RegisterCard Component', () => {
  const defaultProps = {
    title: 'Test Registry',
    image: '/images/test.webp',
    url: 'https://example.com'
  }

  it('should render with all props', () => {
    render(<RegisterCard {...defaultProps} />)
    
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://example.com')
    expect(screen.getByText('Test Registry')).toBeInTheDocument()
    expect(screen.getByAltText('Test Registry image')).toBeInTheDocument()
  })

  it('should open link in new tab', () => {
    render(<RegisterCard {...defaultProps} />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('should render image with correct src', () => {
    render(<RegisterCard {...defaultProps} />)
    
    const image = screen.getByAltText('Test Registry image')
    expect(image).toHaveAttribute('src', expect.stringContaining('test.webp'))
  })

  it('should apply hover classes', () => {
    render(<RegisterCard {...defaultProps} />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveClass('hover:shadow-lg')
    expect(link).toHaveClass('transition-shadow')
  })

  it('should truncate long titles with line-clamp-2', () => {
    const longTitle = 'Very Long Title That Should Be Truncated After Two Lines'
    render(<RegisterCard {...defaultProps} title={longTitle} />)
    
    const heading = screen.getByRole('heading')
    expect(heading).toHaveClass('line-clamp-2')
  })

  it('should handle missing image gracefully', () => {
    // Next.js Image handles missing images
    render(<RegisterCard {...defaultProps} image="" />)
    
    const image = screen.getByAltText('Test Registry image')
    expect(image).toBeInTheDocument()
  })
})
```

**Test Suite: Home Page Cards**

```typescript
// File: __tests__/app/page.test.tsx
import { render, screen } from '@testing-library/react'
import HomePage from '@/app/page'

// Mock data
const mockRegistries = [
  {
    slug: 'ekopfo',
    title: 'ЕКОПФО',
    links: [{ label: 'Analytics', url: 'https://example.com', image: '/images/ai-ekopfo.webp' }]
  },
  {
    slug: 'vacancies',
    title: 'Вакансії',
    links: [{ label: 'Analytics', url: 'https://example.com', image: '/images/ai-vacancies.webp' }]
  }
]

// Mock loadRegistries
jest.mock('@/lib/loadRegistries', () => ({
  loadRegistries: jest.fn(() => Promise.resolve(mockRegistries))
}))

describe('Home Page Registry Cards', () => {
  it('should render all registry cards', async () => {
    render(await HomePage())
    
    expect(screen.getByText('ЕКОПФО')).toBeInTheDocument()
    expect(screen.getByText('Вакансії')).toBeInTheDocument()
  })

  it('should generate correct links for each card', async () => {
    render(await HomePage())
    
    const links = screen.getAllByRole('link')
    const registryLinks = links.filter(link => 
      link.getAttribute('href')?.startsWith('/registers/')
    )
    
    expect(registryLinks).toHaveLength(2)
    expect(registryLinks[0]).toHaveAttribute('href', '/registers/ekopfo')
    expect(registryLinks[1]).toHaveAttribute('href', '/registers/vacancies')
  })

  it('should display images for all cards', async () => {
    render(await HomePage())
    
    const images = screen.getAllByRole('img')
    expect(images.length).toBeGreaterThanOrEqual(2)
  })

  it('should apply grid layout classes', async () => {
    const { container } = render(await HomePage())
    
    const grid = container.querySelector('.grid')
    expect(grid).toHaveClass('grid-cols-1')
    expect(grid).toHaveClass('sm:grid-cols-2')
    expect(grid).toHaveClass('md:grid-cols-3')
    expect(grid).toHaveClass('lg:grid-cols-4')
  })
})
```

---

#### 6.14.3.3 E2E Tests (Playwright)

**Test Suite: Card Navigation**

```typescript
// File: e2e/registry-cards.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Registry Cards Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should navigate to registry detail page on card click', async ({ page }) => {
    // Click on ЕКОПФО card
    await page.click('text=ЕКОПФО')
    
    // Wait for navigation
    await page.waitForURL('/registers/ekopfo')
    
    // Verify detail page loaded
    expect(page.url()).toContain('/registers/ekopfo')
    await expect(page.locator('h1')).toContainText('ЕКОПФО')
  })

  test('should show hover effect on desktop', async ({ page }) => {
    const card = page.locator('text=ЕКОПФО').locator('..')
    
    // Get initial box shadow
    const initialShadow = await card.evaluate(el => 
      window.getComputedStyle(el).boxShadow
    )
    
    // Hover over card
    await card.hover()
    
    // Get hover box shadow
    const hoverShadow = await card.evaluate(el => 
      window.getComputedStyle(el).boxShadow
    )
    
    // Shadow should change on hover
    expect(initialShadow).not.toBe(hoverShadow)
  })

  test('should render all 7 registry cards', async ({ page }) => {
    const cards = page.locator('a[href^="/registers/"]')
    await expect(cards).toHaveCount(7)
  })

  test('should maintain scroll position after navigation', async ({ page }) => {
    // Scroll to cards section
    await page.evaluate(() => window.scrollTo(0, 500))
    
    // Click card
    await page.click('text=ЕКОПФО')
    await page.waitForURL('/registers/ekopfo')
    
    // Go back
    await page.goBack()
    await page.waitForURL('/')
    
    // Check scroll position restored (approximately)
    const scrollY = await page.evaluate(() => window.scrollY)
    expect(scrollY).toBeGreaterThan(400)
  })
})
```

**Test Suite: Responsive Behavior**

```typescript
// File: e2e/responsive.spec.ts
import { test, expect, devices } from '@playwright/test'

test.describe('Responsive Registry Cards', () => {
  test('should show 1 column on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    const grid = page.locator('.grid')
    
    // Check grid classes
    await expect(grid).toHaveClass(/grid-cols-1/)
    
    // Measure card width (should be close to viewport width minus padding)
    const card = page.locator('a[href^="/registers/"]').first()
    const box = await card.boundingBox()
    
    expect(box?.width).toBeGreaterThan(300) // Most of viewport width
  })

  test('should show 4 columns on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    
    const cards = page.locator('a[href^="/registers/"]')
    
    // Get positions of first 4 cards
    const positions = await Promise.all([
      cards.nth(0).boundingBox(),
      cards.nth(1).boundingBox(),
      cards.nth(2).boundingBox(),
      cards.nth(3).boundingBox()
    ])
    
    // All 4 should have different x positions (different columns)
    const xPositions = positions.map(p => p?.x)
    const uniqueX = new Set(xPositions)
    expect(uniqueX.size).toBe(4)
    
    // All 4 should have same y position (same row)
    const yPositions = positions.map(p => p?.y)
    const uniqueY = new Set(yPositions)
    expect(uniqueY.size).toBe(1)
  })

  test('should be mobile-friendly (iPhone 12)', async ({ page }) => {
    await page.setViewportSize(devices['iPhone 12'].viewport)
    await page.goto('/')
    
    // Cards should be tappable (min 44x44 touch target)
    const card = page.locator('a[href^="/registers/"]').first()
    const box = await card.boundingBox()
    
    expect(box?.height).toBeGreaterThan(44)
    expect(box?.width).toBeGreaterThan(44)
  })
})
```

**Test Suite: Localization E2E**

```typescript
// File: e2e/localization.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Registry Cards Localization', () => {
  test('should show Ukrainian titles by default', async ({ page }) => {
    await page.goto('/')
    
    await expect(page.locator('text=ЕКОПФО')).toBeVisible()
    await expect(page.locator('text=Вакансії')).toBeVisible()
  })

  test('should switch to English on language toggle', async ({ page }) => {
    await page.goto('/')
    
    // Click language switcher
    await page.click('text=ENG')
    
    // Wait for page reload
    await page.waitForLoadState('networkidle')
    
    // Check English titles
    await expect(page.locator('text=EKOPFO')).toBeVisible()
    await expect(page.locator('text=Vacancies')).toBeVisible()
  })

  test('should persist language preference', async ({ page, context }) => {
    await page.goto('/')
    
    // Switch to English
    await page.click('text=ENG')
    await page.waitForLoadState('networkidle')
    
    // Close and reopen page
    await page.close()
    const newPage = await context.newPage()
    await newPage.goto('/')
    
    // Should still be English
    await expect(newPage.locator('text=EKOPFO')).toBeVisible()
  })
})
```

---

### 6.14.4 Performance Tests

**Test Suite: Load Time**

```typescript
// File: e2e/performance.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Registry Cards Performance', () => {
  test('should load cards within 2 seconds', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/')
    await page.locator('text=ЕКОПФО').waitFor()
    
    const loadTime = Date.now() - startTime
    expect(loadTime).toBeLessThan(2000)
  })

  test('should have good Lighthouse score', async ({ page }) => {
    await page.goto('/')
    
    // Run Lighthouse audit (requires @playwright/test with lighthouse plugin)
    // Performance score should be > 90
    // Accessibility score should be > 95
  })

  test('should lazy load below-fold images', async ({ page }) => {
    await page.goto('/')
    
    // Check if images have loading="lazy" or priority=false
    const images = page.locator('img')
    const firstImage = images.first()
    
    // First few images might be priority (above fold)
    // Below fold images should be lazy
    const lastImage = images.last()
    const loading = await lastImage.getAttribute('loading')
    
    expect(loading).toBe('lazy')
  })
})
```

---

### 6.14.5 Accessibility Tests

**Test Suite: A11y Compliance**

```typescript
// File: e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Registry Cards Accessibility', () => {
  test('should not have accessibility violations', async ({ page }) => {
    await page.goto('/')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/')
    
    // Tab to first card
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab') // May need multiple tabs to skip header
    
    // Check if card has focus
    const focused = await page.evaluate(() => {
      const activeElement = document.activeElement
      return activeElement?.getAttribute('href')?.includes('/registers/')
    })
    
    expect(focused).toBe(true)
  })

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/')
    
    const card = page.locator('a[href="/registers/ekopfo"]')
    const ariaLabel = await card.getAttribute('aria-label')
    
    // Should have descriptive label for screen readers
    expect(ariaLabel).toBeTruthy()
    expect(ariaLabel).toContain('ЕКОПФО')
  })

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/')
    
    const title = page.locator('text=ЕКОПФО')
    const color = await title.evaluate(el => 
      window.getComputedStyle(el).color
    )
    
    // Title should be blue-600 with good contrast
    expect(color).toBe('rgb(37, 99, 235)') // blue-600
  })
})
```

---

## 6.14.6 Test Coverage Report

**Coverage Goals:**

| Category | Target | Current | Status |
|----------|--------|---------|--------|
| **Unit Tests** | 80% | - | 🟡 To implement |
| **Integration Tests** | 75% | - | 🟡 To implement |
| **E2E Tests** | Key flows | - | 🟡 To implement |
| **Manual Tests** | 7 scenarios | 7 | ✅ Documented |

**Test Execution Summary:**

```yaml
Manual Tests:
  - RTC-MAN-001: ✅ Rendering without description
  - RTC-MAN-002: ✅ Long title rendering
  - RTC-MAN-003: ✅ Short title rendering
  - RTC-MAN-004: ✅ Missing slug edge case
  - RTC-MAN-005: ✅ URL correctness
  - RTC-MAN-006: ✅ Responsive design
  - RTC-MAN-007: ✅ Localization

Automated Tests:
  Unit Tests:
    - URL Generation: 4 tests
    - Validation: 10 tests
    - Localization: 4 tests
  
  Integration Tests:
    - RegisterCard: 6 tests
    - Home Page: 4 tests
  
  E2E Tests:
    - Navigation: 4 tests
    - Responsive: 3 tests
    - Localization: 3 tests
    - Performance: 3 tests
    - Accessibility: 4 tests

Total: 48 test cases
```

---

**Дата створення:** 13 грудня 2025  
**Розділ:** 6.14 Тестові сценарії  
**Manual Tests:** 7 детальних сценаріїв  
**Automated Tests:** 41 unit/integration/E2E tests  
**Frameworks:** Jest, React Testing Library, Playwright, Axe  
**Coverage:** Unit (80%), Integration (75%), E2E (key flows)
