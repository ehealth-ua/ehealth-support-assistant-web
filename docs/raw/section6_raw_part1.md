# 📋 ПАСПОРТ САЙТУ
## Розділ 6: Картки реєстрів (Registry Cards)

---

## 6.1. 🎴 ПРИЗНАЧЕННЯ ТА СТРУКТУРА

### 6.1.1 Призначення карток реєстрів

**Роль у системі:**

Картки реєстрів — це основний UI-елемент Home Page, що забезпечує візуальну навігацію до окремих реєстрів. Кожна картка представляє один реєстр і слугує точкою входу до детальної інформації.

```yaml
Primary Purpose:
  - Візуальне представлення реєстру (зображення + назва)
  - Навігація до детальної сторінки (/registers/[slug])
  - Швидкий доступ до основних систем

Secondary Purpose:
  - Брендинг (унікальні зображення для кожного реєстру)
  - UX (hover ефекти, responsive design)
  - SEO (семантична розмітка, alt tags)
```

### 6.1.2 Inline implementation на Home Page

**Важливо:** RegisterCard компонент існує (`app/components/RegisterCard.tsx`), але **не використовується** на Home Page. Замість цього, картки рендеряться **inline** безпосередньо в `app/page.tsx`.

**Actual Implementation (app/page.tsx):**

```typescript
// Home Page рендерить картки inline:
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {registries.map((r) => {
    const img = (r.links && r.links.length > 0 && r.links[0].image) 
      ? r.links[0].image 
      : '/images/Helpdesk.webp'
    
    return (
      <div
        key={r.slug}
        className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow hover:scale-105"
      >
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
```

**Структура картки:**

```
┌─────────────────────────────┐
│  ┌───────────────────────┐  │
│  │                       │  │
│  │   Registry Image      │  │ ← Square (1:1 ratio)
│  │   (384×384 or equiv)  │  │   paddingBottom: 100%
│  │                       │  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │  Registry Title       │  │ ← Translated title
│  │  (text-lg font-semibold)│ │   text-blue-600
│  └───────────────────────┘  │
└─────────────────────────────┘
   Hover: shadow-lg + scale-105
```

---

## 6.2. 📊 ПРАВИЛА РЕНДЕРИНГУ

### 6.2.1 Grid Layout (Responsive)

**Breakpoints:**

```css
grid-cols-1           /* Mobile: 1 column (< 640px) */
sm:grid-cols-2        /* Small tablets: 2 columns (≥ 640px) */
md:grid-cols-3        /* Tablets: 3 columns (≥ 768px) */
lg:grid-cols-4        /* Desktop: 4 columns (≥ 1024px) */
gap-6                 /* 1.5rem (24px) gap between cards */
```

**Visual representation:**

```
Mobile (< 640px):     Tablet (≥ 768px):      Desktop (≥ 1024px):
┌────────────┐        ┌────┐ ┌────┐ ┌────┐  ┌────┐ ┌────┐ ┌────┐ ┌────┐
│  Card 1    │        │ C1 │ │ C2 │ │ C3 │  │ C1 │ │ C2 │ │ C3 │ │ C4 │
├────────────┤        ├────┤ ├────┤ ├────┤  ├────┤ ├────┤ ├────┤ ├────┤
│  Card 2    │        │ C4 │ │ C5 │ │ C6 │  │ C5 │ │ C6 │ │ C7 │ │    │
├────────────┤        └────┘ └────┘ └────┘  └────┘ └────┘ └────┘ └────┘
│  Card 3    │
└────────────┘
```

### 6.2.2 Image Selection Logic

**Priority system:**

```typescript
const img = (r.links && r.links.length > 0 && r.links[0].image) 
  ? r.links[0].image           // 1. First link's image (Analytics)
  : '/images/Helpdesk.webp'    // 2. Fallback to Helpdesk image

// For all 7 registries:
// ЕКОПФО → /images/ai-ekopfo.webp
// Ендопротезування → /images/ai-endoprosthesis.webp
// Інтернатура → /images/ai-internatura.webp
// Вакансії → /images/ai-vacancies.webp
// БПР → /images/ai-bpr.webp
// е-Кров → /images/ai-ekrov.webp
// СЕН ІКП → /images/ai-senikp.webp

// All have links[0].image → fallback не використовується
```

### 6.2.3 Hover Effects

**CSS Transitions:**

```yaml
Default State:
  - border: default border color
  - shadow: none
  - scale: 1 (100%)

Hover State:
  - shadow: shadow-lg (large shadow)
  - scale: 1.05 (105%, subtle zoom)
  - transition: transition-shadow (smooth animation)

Active/Click:
  - Navigation to /registers/[slug]
  - No special active state (immediate redirect)
```

---

## 6.3. 🔗 ВЗАЄМОДІЯ З NOTEBOOKS.JSON

### 6.3.1 Data Loading Flow

```
Server Component (app/page.tsx)
      ↓
loadRegistries() function
      ↓
fs.readFileSync('config/notebooks.json')
      ↓
JSON.parse(data)
      ↓
Registry[] array (7 items)
      ↓
registries.map(r => <Card />)
      ↓
7 registry cards rendered
```

### 6.3.2 Data Mapping

**Used fields from notebooks.json:**

```typescript
interface Registry {
  slug: string           // ✅ Used: Link href="/registers/{slug}"
  title: string          // ✅ Used: Fallback for getRegistryTitle()
  description: string    // ❌ NOT used on Home Page
  links?: [{             // ✅ Used: links[0].image for card image
    image?: string
  }]
  statusUrl?: string     // ❌ NOT used on Home Page
  instructions?: string[] // ❌ NOT used on Home Page
}

// Only 3 fields matter for Home Page cards:
// 1. slug → URL routing
// 2. title → Display name (via translation)
// 3. links[0].image → Card image
```

---

## 6.4. 🌍 ЛОКАЛІЗАЦІЯ

### 6.4.1 Translation Function

**getRegistryTitle() logic:**

```typescript
const getRegistryTitle = (registry: Registry) => {
  const translatedTitle = t.registryCards?.[registry.slug]
  return translatedTitle || registry.title
}

// Translation lookup:
// 1. Try: t.registryCards["ekopfo"]
// 2. Fallback: registry.title ("ЕКОПФО")

// locales/ua.json:
{
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

// locales/en.json:
{
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

### 6.4.2 Image Alt Tags

**Accessibility:**

```typescript
<Image
  src={img}
  alt={getRegistryTitle(r)}  // Localized alt text
  fill
  className="object-cover absolute inset-0"
/>

// Examples:
// Ukrainian: alt="ЕКОПФО"
// English: alt="EKOPFO"
// Screen readers read localized title
```

---

## 6.5. 📐 АДАПТИВНІСТЬ

### 6.5.1 Square Image Ratio (1:1)

**Technique: Padding-Bottom Trick**

```typescript
<div className="relative w-full" style={{ paddingBottom: '100%' }}>
  <Image
    src={img}
    alt={title}
    fill                           // Fills parent container
    className="object-cover absolute inset-0"
  />
</div>

// Explanation:
// paddingBottom: 100% → creates square aspect ratio
// width: 100% of parent
// height: 100% of width (due to padding)
// Image fills with object-cover (crop to fit)
```

### 6.5.2 Responsive Grid Behavior

**Breakpoint transitions:**

| Screen Size | Columns | Card Width | Gap | Total Cards Visible |
|-------------|---------|------------|-----|---------------------|
| **< 640px** (Mobile) | 1 | 100% - 32px (padding) | 24px | 1-2 (scroll) |
| **640px - 767px** (Tablet) | 2 | ~50% - 12px | 24px | 2-4 (scroll) |
| **768px - 1023px** (Tablet) | 3 | ~33% - 16px | 24px | 3-6 (visible) |
| **≥ 1024px** (Desktop) | 4 | ~25% - 18px | 24px | 4-7 (all visible) |

**Container padding:**

```typescript
<div className="w-full px-4 py-8">
  <div className="container mx-auto">
    // px-4: 16px horizontal padding on mobile
    // container mx-auto: centered, max-width responsive
```

---

## 6.6. 🔄 ZV'ЯЗОК З REGISTRY DETAIL PAGE

### 6.6.1 Navigation Flow

```
User clicks card
      ↓
<Link href={`/registers/${r.slug}`}>
      ↓
Next.js routing
      ↓
/registers/[slug]/page.tsx
      ↓
Registry Detail Page renders
      ↓
Uses SAME data from notebooks.json
      ↓
Shows: Hero + Description + Links + Status
```

### 6.6.2 Data Consistency

**Home Page vs Detail Page:**

```yaml
Home Page:
  Data source: notebooks.json (via loadRegistries())
  Used fields: slug, title, links[0].image
  Display: Card grid (image + title)

Detail Page:
  Data source: notebooks.json (same file)
  Used fields: ALL (slug, title, description, statusUrl, links)
  Display: Full page (hero + content + iframe)

Consistency guaranteed:
  ✅ Same slug → same detail page
  ✅ Same title → same name everywhere
  ✅ Single source of truth (notebooks.json)
```

---

## 6.7. 📋 SUMMARY TABLE

| Аспект | Реалізація | Особливості |
|--------|------------|-------------|
| **Компонент** | Inline в `app/page.tsx` | RegisterCard.tsx існує, але не використовується |
| **Grid Layout** | `grid-cols-1 sm:2 md:3 lg:4` | Responsive 1→2→3→4 columns |
| **Image Source** | `links[0].image` або fallback | Analytics image (384×384) |
| **Image Ratio** | 1:1 (square) | `paddingBottom: 100%` trick |
| **Title** | `getRegistryTitle(r)` | Localized via `t.registryCards[slug]` |
| **Link** | `<Link href="/registers/{slug}">` | Next.js navigation |
| **Hover Effect** | `shadow-lg + scale-105` | Smooth transition |
| **Data Source** | `notebooks.json` | 7 registries, server-side load |
| **Localization** | UA/EN via `registryCards.*` | Fallback to JSON title |
| **Accessibility** | Alt tags, semantic HTML | Localized alt text |

---

## 6.8. 🚀 РЕКОМЕНДАЦІЇ

### 6.8.1 Поточний стан

```yaml
Pros:
  ✅ Просте рішення (inline rendering)
  ✅ Мінімальний код
  ✅ Працює для 7 реєстрів
  ✅ Responsive out of the box
  ✅ Локалізація підтримується

Cons:
  ⚠️ RegisterCard компонент не використовується (мертвий код)
  ⚠️ Логіка inline в page.tsx (не reusable)
  ⚠️ Важко кастомізувати окремі картки
```

### 6.8.2 Майбутні покращення

**Option 1: Використати RegisterCard компонент**

```typescript
// Update app/page.tsx to use RegisterCard:
import RegisterCard from './components/RegisterCard'

<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {registries.map((r) => (
    <RegisterCard
      key={r.slug}
      title={getRegistryTitle(r)}
      image={(r.links?.[0]?.image) || '/images/Helpdesk.webp'}
      url={`/registers/${r.slug}`}
    />
  ))}
</div>

// Benefits:
// ✅ Reusable component
// ✅ Easier to maintain
// ✅ Can use same component elsewhere
```

**Option 2: Додати description на картках**

```typescript
// Show description on hover or below title:
<div className="p-4 text-center">
  <span className="text-lg font-semibold text-blue-600">
    {getRegistryTitle(r)}
  </span>
  {r.description && (
    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
      {r.description}
    </p>
  )}
</div>

// Benefits:
// ✅ More informative cards
// ✅ Better UX (users know what registry does)
```

**Option 3: Масштабування до 20+ реєстрів**

```typescript
// Add pagination or filtering:
const [page, setPage] = useState(1)
const itemsPerPage = 8
const paginatedRegistries = registries.slice(
  (page - 1) * itemsPerPage, 
  page * itemsPerPage
)

// Or add search/filter:
const [filter, setFilter] = useState('')
const filteredRegistries = registries.filter(r =>
  r.title.toLowerCase().includes(filter.toLowerCase())
)

// Benefits:
// ✅ Handles large number of registries
// ✅ Better performance (fewer DOM nodes)
// ✅ Better UX (easier to find specific registry)
```

---

**Дата створення:** 13 грудня 2025  
**Компонент:** Inline cards в `app/page.tsx`  
**Кількість карток:** 7 (всі реєстри)  
**Grid Layout:** Responsive 1→2→3→4 columns  
**Image Ratio:** 1:1 (square, paddingBottom 100%)  
**Локалізація:** UA/EN підтримка через `registryCards.*`  
**Navigation:** Next.js Link до `/registers/[slug]`
