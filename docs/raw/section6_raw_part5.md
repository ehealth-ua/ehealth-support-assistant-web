# 📋 ПАСПОРТ САЙТУ
## Розділ 6: Картки реєстрів (Registry Cards) — Частина 5

---

## 6.12. 🎨 UI/UX АСПЕКТИ КАРТОК РЕЄСТРІВ

### 6.12.1 Правила відступів (Spacing System)

**Tailwind Spacing Scale:**

```yaml
Spacing System (базується на 4px grid):
  0: 0px
  1: 4px    (0.25rem)
  2: 8px    (0.5rem)
  3: 12px   (0.75rem)
  4: 16px   (1rem)
  5: 20px   (1.25rem)
  6: 24px   (1.5rem)
  8: 32px   (2rem)
  10: 40px  (2.5rem)
  12: 48px  (3rem)

Використовується в проєкті:
  p-2: 8px padding
  p-4: 16px padding
  p-6: 24px padding
  gap-6: 24px gap between grid items
  mb-8: 32px margin bottom
```

#### 6.12.1.1 Home Page Inline Cards

**Структура відступів:**

```typescript
// File: app/page.tsx
<div className="w-full px-4 py-8">
  {/* Container padding */}
  {/* px-4: 16px horizontal padding (mobile) */}
  {/* py-8: 32px vertical padding */}
  
  <div className="container mx-auto">
    <h2 className="text-4xl font-bold text-center mb-8 text-blue-600">
      {/* mb-8: 32px margin bottom */}
      Медичні реєстри
    </h2>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {/* gap-6: 24px gap between cards */}
      
      {registries.map((r) => (
        <div className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow hover:scale-105">
          {/* Card container */}
          
          <div className="relative w-full" style={{ paddingBottom: '100%' }}>
            {/* Image container (no internal padding) */}
            <Image src={img} alt={title} fill className="object-cover absolute inset-0" />
          </div>
          
          <div className="p-4 text-center">
            {/* p-4: 16px padding all sides for text */}
            <span className="text-lg font-semibold text-blue-600">
              {title}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
```

**Детальна карта відступів:**

```
Card Structure (with spacing):

┌─────────────────────────────────────────────────────────┐
│ Container (w-full px-4 py-8)                            │
│ Padding: Left/Right 16px, Top/Bottom 32px              │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Inner Container (container mx-auto)                 │ │
│ │ Max-width: responsive, centered                     │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ Heading (mb-8)                                  │ │ │
│ │ │ Margin bottom: 32px                             │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ │                                                     │ │
│ │ ↓ 32px gap                                          │ │
│ │                                                     │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ Grid (gap-6)                                    │ │ │
│ │ │ Gap between items: 24px                         │ │ │
│ │ │ ┌──────────┐ ← 24px → ┌──────────┐             │ │ │
│ │ │ │  Card 1  │           │  Card 2  │             │ │ │
│ │ │ │ ┌──────┐ │           │ ┌──────┐ │             │ │ │
│ │ │ │ │Image │ │           │ │Image │ │             │ │ │
│ │ │ │ │(no p)│ │           │ │(no p)│ │             │ │ │
│ │ │ │ └──────┘ │           │ └──────┘ │             │ │ │
│ │ │ │ ┌──────┐ │           │ ┌──────┐ │             │ │ │
│ │ │ │ │p-4:  │ │           │ │p-4:  │ │             │ │ │
│ │ │ │ │Title │ │           │ │Title │ │             │ │ │
│ │ │ │ └──────┘ │           │ └──────┘ │             │ │ │
│ │ │ └──────────┘           └──────────┘             │ │ │
│ │ │                                                  │ │ │
│ │ │ ↓ 24px gap (vertical)                           │ │ │
│ │ │                                                  │ │ │
│ │ │ ┌──────────┐ ← 24px → ┌──────────┐             │ │ │
│ │ │ │  Card 3  │           │  Card 4  │             │ │ │
│ │ │ └──────────┘           └──────────┘             │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Spacing по елементах:**

| Element | Class | Spacing | Purpose |
|---------|-------|---------|---------|
| **Page Container** | `px-4 py-8` | 16px horizontal, 32px vertical | Забезпечує відступи від країв екрана |
| **Heading** | `mb-8` | 32px bottom margin | Відділяє заголовок від карток |
| **Grid** | `gap-6` | 24px between items | Проміжки між картками (horizontal + vertical) |
| **Card Text** | `p-4` | 16px all sides | Внутрішні відступи для title |
| **Card Image** | no padding | 0px | Зображення без відступів (fill parent) |
| **Card Border** | `border` | 1px | Візуальне обрамлення картки |
| **Card Rounded** | `rounded-lg` | 8px border-radius | Заокруглені кути |

#### 6.12.1.2 RegisterCard Component

**Spacing structure:**

```tsx
// File: app/components/RegisterCard.tsx
<a className="block border rounded overflow-hidden hover:shadow-lg transition-shadow">
  {/* Anchor wrapper (no padding) */}
  
  <div className="w-1/2 h-32 relative bg-gray-200 mx-auto rounded overflow-hidden">
    {/* Image container */}
    {/* mx-auto: centers horizontally (auto left/right margins) */}
    {/* No padding - image fills container */}
    <Image src={image} alt={alt} fill className="object-cover" />
  </div>
  
  <div className="p-4 text-center">
    {/* Text container */}
    {/* p-4: 16px padding all sides */}
    <h4 className="font-semibold text-lg line-clamp-2">{title}</h4>
  </div>
</a>
```

**Visual spacing:**

```
RegisterCard Component:

┌───────────────────────────────────────┐
│ <a> wrapper (no padding)              │
│ ┌───────────────────────────────────┐ │
│ │ Image Container (mx-auto)         │ │
│ │ Width: 50% of card                │ │
│ │ Height: 128px fixed               │ │
│ │ Centered horizontally (auto L/R)  │ │
│ │ ┌───────────────────────────────┐ │ │
│ │ │ Image (no padding)            │ │ │
│ │ │ Fills container (fill prop)   │ │ │
│ │ └───────────────────────────────┘ │ │
│ └───────────────────────────────────┘ │
│ ┌───────────────────────────────────┐ │
│ │ Text Container (p-4)              │ │
│ │ ↑ 16px top padding                │ │
│ │ ← 16px → Title ← 16px →           │ │
│ │ ↓ 16px bottom padding             │ │
│ └───────────────────────────────────┘ │
└───────────────────────────────────────┘
```

**Порівняння spacing:**

| Aspect | Home Page Inline | RegisterCard Component |
|--------|------------------|------------------------|
| **Image padding** | 0 (fill parent) | 0 (fill parent) |
| **Text padding** | p-4 (16px) | p-4 (16px) |
| **Card gap** | gap-6 (24px in grid) | N/A (standalone) |
| **Image centering** | No (full width) | Yes (mx-auto, 50% width) |
| **Container padding** | px-4 py-8 (page level) | No (component level) |

---

### 6.12.2 Розміри шрифтів (Typography Scale)

**Tailwind Font Size Scale:**

```yaml
Font Sizes (Tailwind default):
  text-xs:   12px (0.75rem)    line-height: 16px (1rem)
  text-sm:   14px (0.875rem)   line-height: 20px (1.25rem)
  text-base: 16px (1rem)       line-height: 24px (1.5rem)
  text-lg:   18px (1.125rem)   line-height: 28px (1.75rem)
  text-xl:   20px (1.25rem)    line-height: 28px (1.75rem)
  text-2xl:  24px (1.5rem)     line-height: 32px (2rem)
  text-3xl:  30px (1.875rem)   line-height: 36px (2.25rem)
  text-4xl:  36px (2.25rem)    line-height: 40px (2.5rem)
  text-5xl:  48px (3rem)       line-height: 48px (3rem)

Font Weights (Tailwind):
  font-normal:    400
  font-medium:    500
  font-semibold:  600
  font-bold:      700
  font-extrabold: 800
```

#### 6.12.2.1 Використання в Home Page

**Typography hierarchy:**

```typescript
// Hero Banner
<h1 className="text-5xl font-bold text-white text-center">
  {/* 48px, weight 700, centered, white */}
  {t.siteTitle}
</h1>

// Section Heading
<h2 className="text-4xl font-bold text-center mb-8 text-blue-600">
  {/* 36px, weight 700, centered, blue-600 */}
  {t.medicalRegistries}
</h2>

// Card Title
<span className="text-lg font-semibold text-blue-600">
  {/* 18px, weight 600, blue-600 */}
  {getRegistryTitle(r)}
</span>
```

**Visual hierarchy:**

```
Typography Scale (Home Page):

┌─────────────────────────────────────────────────────────┐
│ Hero Banner                                             │
│ ┌─────────────────────────────────────────────────────┐ │
│ │                                                     │ │
│ │        е-Здоров'я                                   │ │ ← text-5xl (48px)
│ │                                                     │ │   font-bold (700)
│ └─────────────────────────────────────────────────────┘ │   white
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │    Медичні реєстри                                  │ │ ← text-4xl (36px)
│ └─────────────────────────────────────────────────────┘ │   font-bold (700)
│                                                         │   text-blue-600
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐           │
│ │ [img]  │ │ [img]  │ │ [img]  │ │ [img]  │           │
│ │        │ │        │ │        │ │        │           │
│ │ ЕКОПФО │ │  Ендо  │ │ Інтерн │ │Вакансії│           │ ← text-lg (18px)
│ └────────┘ └────────┘ └────────┘ └────────┘           │   font-semibold (600)
│                                                         │   text-blue-600
└─────────────────────────────────────────────────────────┘

Ratio: 48px : 36px : 18px = 8:6:3
```

#### 6.12.2.2 RegisterCard Typography

**Font configuration:**

```tsx
<h4 className="font-semibold text-lg line-clamp-2">
  {/* Font size: 18px (text-lg) */}
  {/* Font weight: 600 (font-semibold) */}
  {/* Line clamp: 2 lines max */}
  {/* Line height: 28px (1.75rem) - auto from text-lg */}
  {title}
</h4>
```

**Line height calculation:**

```yaml
Title Typography (text-lg):
  Font size: 18px (1.125rem)
  Line height: 28px (1.75rem)
  Ratio: 1.56 (28 / 18)
  
  Single line:
    Height: 28px
    Total space: 28px
  
  Two lines (line-clamp-2):
    Height per line: 28px
    Total height: 56px
    Truncation: ellipsis (...) if overflow
  
  Three+ lines (truncated):
    Displayed: 2 lines (56px)
    Hidden: remaining text
    Indicator: ... at end of line 2
```

**Typography comparison:**

| Location | Element | Class | Size | Weight | Line Height | Color |
|----------|---------|-------|------|--------|-------------|-------|
| **Hero** | h1 | `text-5xl font-bold` | 48px | 700 | 48px (1:1) | white |
| **Section** | h2 | `text-4xl font-bold` | 36px | 700 | 40px (1.11:1) | blue-600 |
| **Card (Inline)** | span | `text-lg font-semibold` | 18px | 600 | 28px (1.56:1) | blue-600 |
| **Card (RegisterCard)** | h4 | `text-lg font-semibold` | 18px | 600 | 28px (1.56:1) | default |

---

### 6.12.3 Поведінка при hover

#### 6.12.3.1 Home Page Inline Cards

**Hover effects:**

```typescript
<div className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow hover:scale-105">
  {/* Default state:
    - border: 1px solid (gray)
    - shadow: none
    - scale: 1 (100%)
  
  Hover state:
    - border: unchanged
    - shadow: shadow-lg (0 10px 15px -3px rgba(0,0,0,0.1), ...)
    - scale: 1.05 (105%)
    - transition: shadow and transform
  */}
</div>
```

**CSS breakdown:**

```css
/* Default state */
.card {
  border: 1px solid rgb(229, 231, 235); /* border class */
  border-radius: 0.5rem; /* rounded-lg (8px) */
  box-shadow: none;
  transform: scale(1);
  transition-property: box-shadow, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Hover state */
.card:hover {
  box-shadow: 
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -4px rgba(0, 0, 0, 0.1); /* shadow-lg */
  transform: scale(1.05); /* scale-105 (5% larger) */
}
```

**Visual representation:**

```
Default State:                 Hover State:
┌──────────┐                   ┌────────────┐
│          │                   │▒▒▒▒▒▒▒▒▒▒▒▒│ ← Shadow (larger)
│  [img]   │                   │▒┌──────────┐
│          │    →  HOVER  →    │▒│          │ ← Scale 105%
│  Title   │                   │▒│  [img]   │
│          │                   │▒│          │
└──────────┘                   │▒│  Title   │
  Scale: 1                     │▒│          │
  Shadow: none                 │▒└──────────┘
                               └─────────────┘
                                 Scale: 1.05
                                 Shadow: lg

Timing:
  0ms ──────────────────────────────── 150ms
  [Default] ──→ [Hover transition] ──→ [Hover complete]
              ← Smooth cubic-bezier →
```

**Title color change (on hover):**

```typescript
<span className="text-lg font-semibold text-blue-600">
  {/* Color: text-blue-600 (#2563eb) */}
  {/* No hover color change (stays blue-600) */}
  {getRegistryTitle(r)}
</span>

// Note: Title color doesn't change on hover
// Card shadow and scale are only hover effects
```

#### 6.12.3.2 RegisterCard Component

**Hover configuration:**

```tsx
<a className="block border rounded overflow-hidden hover:shadow-lg transition-shadow">
  {/* Hover: shadow-lg only (no scale) */}
  {/* Transition: shadow only */}
</a>
```

**Comparison:**

| Aspect | Home Page Inline | RegisterCard Component |
|--------|------------------|------------------------|
| **Shadow** | ✅ shadow-lg | ✅ shadow-lg |
| **Scale** | ✅ scale-105 (5% larger) | ❌ No scale |
| **Transition** | ✅ shadow + transform | ✅ shadow only |
| **Duration** | 150ms (default) | 150ms (default) |
| **Easing** | cubic-bezier(0.4, 0, 0.2, 1) | cubic-bezier(0.4, 0, 0.2, 1) |
| **Title color** | No change (blue-600) | No change (default) |

**Reasoning:**

```yaml
Home Page (with scale):
  Purpose: Interactive cards for navigation
  User expectation: Strong visual feedback on hover
  Scale effect: Emphasizes clickability
  UX: "This card is selectable"

RegisterCard (without scale):
  Purpose: External links (new tab)
  User expectation: Clear but subtle feedback
  No scale: Less aggressive (external link warning)
  UX: "This opens a new tab"
```

---

### 6.12.4 Поведінка при focus

#### 6.12.4.1 Current Implementation

**Focus state (Home Page):**

```typescript
<Link href={`/registers/${r.slug}`} className="block">
  {/* Next.js Link component */}
  {/* Browser default focus outline */}
  {/* No custom focus styles applied */}
</Link>
```

**Browser default focus:**

```css
/* Chrome/Edge default */
a:focus {
  outline: 2px solid #4285f4; /* Blue outline */
  outline-offset: 2px;
}

/* Firefox default */
a:focus {
  outline: 1px dotted #000; /* Black dotted */
}

/* Safari default */
a:focus {
  outline: 3px solid rgba(0, 125, 250, 0.6); /* Blue semi-transparent */
}
```

**Problem:**

```yaml
Issues:
  ❌ Inconsistent across browsers
  ❌ Not aligned with design system
  ❌ May be hidden by browser styles
  ❌ Не видно в деяких темах браузера

Accessibility Impact:
  ⚠️ Keyboard navigation unclear
  ⚠️ Screen reader users may be confused
  ⚠️ WCAG 2.4.7 (Focus Visible) - Level AA at risk
```

#### 6.12.4.2 Recommended Focus Styles

**Enhanced focus implementation:**

```typescript
// Home Page card with proper focus
<div className="block border rounded-lg overflow-hidden hover:shadow-lg transition-all hover:scale-105 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2">
  <Link href={`/registers/${r.slug}`} className="block outline-none focus:outline-none">
    {/* Inner link has no outline (handled by parent) */}
    {/* focus-within on parent shows ring */}
    <div className="relative w-full" style={{ paddingBottom: '100%' }}>
      <Image src={img} alt={title} fill className="object-cover" />
    </div>
    <div className="p-4 text-center">
      <span className="text-lg font-semibold text-blue-600">{title}</span>
    </div>
  </Link>
</div>
```

**Focus styles breakdown:**

```css
/* Tailwind focus classes */
.focus-within\:ring-2:focus-within {
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.5); /* ring-blue-500 */
}

.focus-within\:ring-offset-2:focus-within {
  box-shadow: 
    0 0 0 2px white,              /* offset (white gap) */
    0 0 0 4px rgba(37, 99, 235, 0.5); /* ring (blue) */
}

/* Remove default outline */
.outline-none:focus {
  outline: none;
}
```

**Visual representation:**

```
Default:                 Focus:                  Hover + Focus:
┌──────────┐            ┌──────────┐            ┌────────────┐
│          │            │▓▓▓▓▓▓▓▓▓▓│ ← Ring     │▓▓▓▓▓▓▓▓▓▓▓▓│
│  [img]   │            │▓┌────────┤   offset   │▓▓┌──────────┐
│          │     →      │▓│        │   2px      │▓▓│▒▒▒▒▒▒▒▒▒▒│ ← Shadow
│  Title   │            │▓│  [img] │   +        │▓▓│▒         │   + Ring
│          │            │▓│        │   ring 2px │▓▓│▒ [img]   │   + Scale
└──────────┘            │▓│  Title │            │▓▓│▒         │
                        │▓└────────┘            │▓▓│▒  Title  │
                        └───────────┘           │▓▓│▒         │
                                                │▓▓└───────────┘
                                                └──────────────┘
Legend:
▓ = Focus ring (blue-500)
▒ = Hover shadow (shadow-lg)
```

**Keyboard navigation states:**

| State | Visual Feedback | CSS Classes |
|-------|-----------------|-------------|
| **Default** | Border only | `border` |
| **Hover (mouse)** | Shadow + Scale | `hover:shadow-lg hover:scale-105` |
| **Focus (keyboard)** | Ring + Offset | `focus-within:ring-2 ring-blue-500 ring-offset-2` |
| **Focus + Hover** | Ring + Shadow + Scale | All combined |
| **Active (click)** | Browser default | (momentary flash) |

**WCAG Compliance:**

```yaml
WCAG 2.1 Guidelines:
  
  2.4.7 Focus Visible (Level AA):
    ✅ Focus indicator clearly visible
    ✅ Distinct from hover state (ring vs shadow)
    ✅ Sufficient contrast (blue-500 on white background)
  
  2.4.3 Focus Order (Level A):
    ✅ Logical tab order (left-to-right, top-to-bottom)
    ✅ Grid layout maintains visual order
  
  2.1.1 Keyboard (Level A):
    ✅ All cards accessible via Tab key
    ✅ Enter/Space activates link
    ✅ No keyboard traps

Contrast Ratios:
  Ring color (blue-500 #3b82f6) vs White background:
    Ratio: 4.5:1 ✅ (meets AA for non-text)
  
  Ring width: 2px ✅ (minimum 2px recommended)
  Ring offset: 2px ✅ (clear separation from content)
```

---

### 6.12.5 Адаптивність UI елементів

#### 6.12.5.1 Responsive Typography

**Font size scaling:**

```typescript
// Current implementation (fixed sizes):
<h1 className="text-5xl font-bold">Hero</h1>        // 48px all screens
<h2 className="text-4xl font-bold">Section</h2>     // 36px all screens
<span className="text-lg font-semibold">Title</span> // 18px all screens
```

**Recommended responsive scaling:**

```typescript
// Responsive typography:
<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
  {/* Mobile: 30px, Tablet: 36px, Desktop: 48px */}
  {t.siteTitle}
</h1>

<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
  {/* Mobile: 24px, Tablet: 30px, Desktop: 36px */}
  {t.medicalRegistries}
</h2>

<span className="text-base sm:text-lg font-semibold">
  {/* Mobile: 16px, Desktop: 18px */}
  {getRegistryTitle(r)}
</span>
```

**Breakpoint table:**

| Element | Mobile (< 640px) | Small (≥ 640px) | Medium (≥ 768px) | Large (≥ 1024px) |
|---------|------------------|-----------------|------------------|------------------|
| **Hero Title** | 30px (text-3xl) | 36px (text-4xl) | 48px (text-5xl) | 48px (text-5xl) |
| **Section Heading** | 24px (text-2xl) | 30px (text-3xl) | 36px (text-4xl) | 36px (text-4xl) |
| **Card Title** | 16px (text-base) | 18px (text-lg) | 18px (text-lg) | 18px (text-lg) |

#### 6.12.5.2 Responsive Spacing

**Adaptive padding:**

```typescript
// Current (fixed):
<div className="px-4 py-8">
  {/* 16px horizontal, 32px vertical - all screens */}
</div>

// Recommended (responsive):
<div className="px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
  {/* Horizontal: 8px → 16px → 24px → 32px */}
  {/* Vertical: 16px → 24px → 32px */}
</div>

// Grid gap:
<div className="grid gap-3 sm:gap-4 md:gap-6">
  {/* Gap: 12px → 16px → 24px */}
</div>
```

**Spacing scale table:**

| Breakpoint | Container Padding | Grid Gap | Card Text Padding |
|------------|-------------------|----------|-------------------|
| **Mobile** (< 640px) | `px-2 py-4` (8px, 16px) | `gap-3` (12px) | `p-3` (12px) |
| **Small** (≥ 640px) | `px-4 py-6` (16px, 24px) | `gap-4` (16px) | `p-4` (16px) |
| **Medium** (≥ 768px) | `px-6 py-8` (24px, 32px) | `gap-6` (24px) | `p-4` (16px) |
| **Large** (≥ 1024px) | `px-8 py-8` (32px, 32px) | `gap-6` (24px) | `p-4` (16px) |

#### 6.12.5.3 Responsive Image Sizing

**Current (fixed square):**

```typescript
<div className="relative w-full" style={{ paddingBottom: '100%' }}>
  {/* Always square (1:1 ratio) */}
  {/* Works well on all screens */}
</div>
```

**Alternative (responsive aspect ratio):**

```typescript
// Mobile: taller cards (4:5 ratio)
// Desktop: square cards (1:1 ratio)
<div className="relative w-full aspect-[4/5] sm:aspect-square">
  {/* Mobile: 4:5 (portrait) */}
  {/* Desktop: 1:1 (square) */}
  <Image src={img} alt={title} fill className="object-cover" />
</div>
```

**Aspect ratio comparison:**

```
Mobile (4:5):          Desktop (1:1):
┌────────┐            ┌──────────┐
│        │            │          │
│        │            │  Image   │
│ Image  │            │          │
│        │            └──────────┘
│        │            ┌──────────┐
└────────┘            │  Title   │
┌────────┐            └──────────┘
│ Title  │
└────────┘

Width: 100%           Width: 100%
Height: 125% of width Height: 100% of width
Better vertical fit   Better grid alignment
```

---

### 6.12.6 Обмеження довжини title та description

#### 6.12.6.1 Title Length Constraints

**Current implementation:**

```typescript
<span className="text-lg font-semibold text-blue-600">
  {/* No length validation */}
  {/* Relies on line-clamp-2 for truncation */}
  {getRegistryTitle(r)}
</span>

// RegisterCard:
<h4 className="font-semibold text-lg line-clamp-2">
  {/* Same: line-clamp-2 only */}
  {title}
</h4>
```

**CSS line-clamp behavior:**

```css
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Example rendering:
  Line 1: "Система Безперервного"
  Line 2: "Розвитку" 
  (fits in 2 lines, no truncation)
  
  If longer:
  Line 1: "Дуже довга назва який..."
  Line 2: "не вміщується в дві ря..." ← ellipsis
*/
```

**Character limits analysis:**

| Registry | Title | Length | Lines (estimate) | Truncated? |
|----------|-------|--------|------------------|------------|
| **ЕКОПФО** | "ЕКОПФО" | 6 chars | 1 line | ❌ No |
| **Ендопротезування** | "Ендопротезування" | 16 chars | 1 line | ❌ No |
| **Інтернатура** | "Інтернатура" | 11 chars | 1 line | ❌ No |
| **Вакансії** | "Вакансії" | 8 chars | 1 line | ❌ No |
| **БПР** | "Система Безперервного Розвитку" | 31 chars | 2 lines | ❌ No (barely fits) |
| **е-Кров** | "е-Кров" | 6 chars | 1 line | ❌ No |
| **СЕН ІКП** | "СЕН ІКП" | 8 chars | 1 line | ❌ No |

**Recommended limits:**

```yaml
Title Length Guidelines:

Optimal (no truncation):
  - Max characters: 50 chars
  - Max lines: 1-2 lines
  - Font size: 18px (text-lg)
  - Card width: ~250-300px (mobile-desktop)

Character per line (rough estimate):
  Mobile (250px card): ~15-20 chars per line
  Desktop (300px card): ~20-25 chars per line
  
  2 lines max:
    Mobile: 30-40 chars total
    Desktop: 40-50 chars total

Validation Rules:
  Min length: 1 char (required)
  Recommended min: 3 chars
  Recommended max: 50 chars
  Hard max: 100 chars (line-clamp will handle)

Examples:
  ✅ "ЕКОПФО" (6) - Perfect
  ✅ "Ендопротезування" (16) - Perfect
  ✅ "Система Безперервного Розвитку" (31) - OK (2 lines)
  ⚠️ "Дуже довга назва системи що не вміщується в картку" (50+) - Truncated
  ❌ "Надзвичайно довга назва яка точно не вміститься..." (80+) - Bad UX
```

#### 6.12.6.2 Description Length (Future Feature)

**Proposed description support:**

```typescript
// Extended card with description:
<div className="p-4 text-center">
  <span className="text-lg font-semibold text-blue-600 block mb-2">
    {title}
  </span>
  
  {description && (
    <p className="text-sm text-gray-600 line-clamp-2">
      {/* line-clamp-2: max 2 lines */}
      {/* text-sm: 14px font size */}
      {description}
    </p>
  )}
</div>
```

**Description guidelines:**

```yaml
Description Length:

Character Limits:
  Min: 0 (optional field)
  Recommended: 50-150 chars
  Max display: ~100-120 chars (2 lines at 14px)
  Hard max: 500 chars (stored in JSON)

Line Clamp:
  Max lines: 2 (line-clamp-2)
  Overflow: ellipsis (...)
  Font size: 14px (text-sm)
  Line height: 20px (1.25rem)

Character per line (14px font):
  Mobile: ~25-30 chars per line
  Desktop: ~35-40 chars per line
  
  2 lines:
    Mobile: 50-60 chars visible
    Desktop: 70-80 chars visible

Examples:
  ✅ "Система управління медичними справами пацієнтів" (50 chars) - Perfect
  ✅ "Електронна система для управління чергою на ендопротезування в Україні" (75 chars) - OK
  ⚠️ "Надані документи описують систему управління медичними справами..." (100+ chars) - Truncated
  ❌ Full description (500 chars) - Heavily truncated, bad UX

Validation:
  if (description && description.length > 120) {
    console.warn(`Description too long: ${description.length} chars`)
  }
```

**Truncation preview:**

```
Mobile Card (250px width):
┌──────────────────────┐
│      [Image]         │
├──────────────────────┤
│   Registry Title     │ ← text-lg (18px), 1 line
├──────────────────────┤
│ Система управління   │ ← text-sm (14px), line 1
│ медичними справа...  │ ← text-sm (14px), line 2 (truncated)
└──────────────────────┘

Desktop Card (300px width):
┌──────────────────────────┐
│        [Image]           │
├──────────────────────────┤
│    Registry Title        │ ← text-lg (18px), 1 line
├──────────────────────────┤
│ Система управління меди- │ ← text-sm (14px), line 1
│ чними справами пацієн... │ ← text-sm (14px), line 2 (truncated)
└──────────────────────────┘
```

---

### 6.12.7 Рекомендації щодо майбутнього дизайну

#### 6.12.7.1 Visual Enhancements

**1. Gradient backgrounds:**

```typescript
// Add subtle gradient to cards
<div className="bg-gradient-to-br from-white to-gray-50 border rounded-lg">
  {/* Subtle gradient: white → light gray */}
  {/* Adds depth without distraction */}
</div>
```

**2. Icon integration:**

```typescript
// Add registry-specific icons
<div className="relative w-full" style={{ paddingBottom: '100%' }}>
  <Image src={img} alt={title} fill className="object-cover" />
  
  {/* Overlay icon in corner */}
  <div className="absolute top-2 left-2 bg-white rounded-full p-2 shadow-md">
    <RegistryIcon type={r.slug} size={24} />
  </div>
</div>
```

**3. Status indicators:**

```typescript
// Show system status on card
{r.statusUrl && (
  <div className="absolute top-2 right-2">
    <StatusBadge status="operational" />
    {/* Green dot: operational */}
    {/* Red dot: issues */}
    {/* Yellow dot: maintenance */}
  </div>
)}
```

#### 6.12.7.2 Interaction Improvements

**4. Loading states:**

```typescript
// Skeleton loading for cards
{loading ? (
  <div className="border rounded-lg overflow-hidden animate-pulse">
    <div className="bg-gray-200 w-full" style={{ paddingBottom: '100%' }} />
    <div className="p-4">
      <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto" />
    </div>
  </div>
) : (
  <RegistryCard {...props} />
)}
```

**5. Animated transitions:**

```typescript
// Staggered card appearance
<div className="grid gap-6">
  {registries.map((r, index) => (
    <div
      key={r.slug}
      className="..."
      style={{
        animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
      }}
    >
      {/* Cards appear one by one */}
    </div>
  ))}
</div>

// CSS:
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**6. Haptic feedback (mobile):**

```typescript
// Vibration on card tap (mobile)
const handleCardClick = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate(10) // 10ms vibration
  }
  // Navigate...
}
```

#### 6.12.7.3 Accessibility Enhancements

**7. ARIA labels:**

```typescript
<Link
  href={`/registers/${r.slug}`}
  aria-label={`Перейти до реєстру ${getRegistryTitle(r)}`}
  className="block"
>
  {/* Screen readers: "Перейти до реєстру ЕКОПФО" */}
</Link>
```

**8. Skip links:**

```typescript
// Add skip-to-content link
<a
  href="#registry-grid"
  className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white px-4 py-2"
>
  Перейти до реєстрів
</a>

<div id="registry-grid" className="grid...">
  {/* Registry cards */}
</div>
```

**9. Color contrast modes:**

```typescript
// High contrast mode support
<span className="text-lg font-semibold text-blue-600 dark:text-blue-400 contrast-more:text-blue-900">
  {/* Normal: blue-600 */}
  {/* Dark mode: blue-400 */}
  {/* High contrast: blue-900 */}
  {title}
</span>
```

#### 6.12.7.4 Performance Optimizations

**10. Image preloading:**

```typescript
// Preload above-fold images
<Image
  src={img}
  alt={title}
  fill
  priority={index < 4} // First row (4 cards)
  className="object-cover"
/>
```

**11. Virtual scrolling (for 20+ registries):**

```typescript
import { useVirtualizer } from '@tanstack/react-virtual'

// Render only visible cards
const virtualizer = useVirtualizer({
  count: registries.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 350, // Card height
})
```

**12. Lazy loading below fold:**

```typescript
// Lazy load cards below viewport
<div className="grid gap-6">
  {registries.map((r, index) => (
    <LazyLoad height={350} offset={100} once key={r.slug}>
      <RegistryCard {...r} />
    </LazyLoad>
  ))}
</div>
```

#### 6.12.7.5 Future Layout Options

**13. List view toggle:**

```typescript
// Switch between grid and list
{viewMode === 'grid' ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {/* Current grid view */}
  </div>
) : (
  <div className="space-y-4">
    {/* List view: full-width cards */}
    {registries.map(r => (
      <div className="flex items-center gap-4 border rounded-lg p-4">
        <Image src={r.image} width={80} height={80} className="rounded" />
        <div className="flex-1">
          <h3>{r.title}</h3>
          <p>{r.description}</p>
        </div>
      </div>
    ))}
  </div>
)}
```

**14. Carousel view (mobile):**

```typescript
// Swipeable carousel on mobile
<div className="md:hidden">
  <Swiper spaceBetween={16} slidesPerView={1.2} centeredSlides>
    {registries.map(r => (
      <SwiperSlide key={r.slug}>
        <RegistryCard {...r} />
      </SwiperSlide>
    ))}
  </Swiper>
</div>

<div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-6">
  {/* Desktop grid */}
</div>
```

**15. Masonry layout (Pinterest-style):**

```typescript
// Masonry grid for varied card heights
<Masonry
  breakpointCols={{ default: 4, 1024: 3, 768: 2, 640: 1 }}
  className="masonry-grid"
  columnClassName="masonry-column"
>
  {registries.map(r => (
    <RegistryCard key={r.slug} {...r} />
  ))}
</Masonry>
```

---

## 6.12.8 Summary: UI/UX Best Practices

**Current Implementation Strengths:**

✅ **Spacing:**
- Consistent 24px grid gap
- Proper padding (16px text containers)
- Clean visual hierarchy

✅ **Typography:**
- Clear hierarchy (48px → 36px → 18px)
- Good font weights (700, 600)
- Readable line heights (1.56 ratio)

✅ **Hover:**
- Smooth transitions (150ms)
- Clear feedback (shadow + scale)
- Consistent across cards

**Areas for Improvement:**

⚠️ **Focus:**
- Add custom focus styles (ring-2 ring-blue-500)
- Implement focus-visible strategy
- Ensure WCAG 2.4.7 compliance

⚠️ **Responsive:**
- Add responsive typography scaling
- Implement adaptive spacing
- Consider mobile-specific interactions

⚠️ **Constraints:**
- Enforce title length limits (50 chars recommended)
- Add description support (optional, 120 chars max)
- Implement validation warnings

**Priority Recommendations:**

| Priority | Enhancement | Impact | Effort |
|----------|-------------|--------|--------|
| **🔴 High** | Custom focus styles | Accessibility | Low |
| **🔴 High** | Title length validation | UX consistency | Low |
| **🟡 Medium** | Responsive typography | Mobile UX | Medium |
| **🟡 Medium** | Status indicators | Information | Medium |
| **🟢 Low** | Gradient backgrounds | Visual appeal | Low |
| **🟢 Low** | Animation stagger | Delight | Medium |

---

**Дата створення:** 13 грудня 2025  
**Розділ:** 6.12 UI/UX Аспекти карток реєстрів  
**Підрозділів:** 8 (spacing, typography, hover, focus, responsive, constraints, recommendations, summary)  
**Таблиць:** 10+ comparison tables  
**Примітки:** Детальний аналіз поточного стану + 15 рекомендацій для майбутнього
