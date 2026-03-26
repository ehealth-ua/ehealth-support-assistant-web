# 📋 ПАСПОРТ САЙТУ
## Розділ 4: Опис сторінок сайту (Частина 4.A)

---

## 4.4. 📚 СТОРІНКА «ДОКУМЕНТАЦІЯ» (Documentation Page) — Частина 1

### 4.4.1 Призначення сторінки

#### 4.4.1.1 Роль у структурі сайту

**URL:** `/documentation`  
**Файл:** `web/app/documentation/page.tsx`  
**Тип:** Client Component (`"use client"`)

**Основна роль:**

```yaml
Primary Purpose:
  - Централізоване сховище документів
  - Доступ до технічної документації
  - Навчальні матеріали та інструкції
  - Візуалізація структур даних (моделі БД)

Secondary Purpose:
  - Швидкий пошук документів за типом
  - Перегляд розміру файлів перед завантаженням
  - Організація документів у grid layout
  - Підтримка різних типів файлів (PDF, DOCX, XLSX, IMG)
```

**Місце в ієрархії:**

```
Site Hierarchy:
┌─────────────────────────────────────────┐
│          / (Home Page)                  │
│                 │                        │
│    ┌────────────┼────────────┐          │
│    │            │            │          │
│    ▼            ▼            ▼          │
│  /registers  /documentation  /about     │
│              ===============             │
│                   ↑                      │
│              Ви тут                      │
│                   │                      │
│              12 документів               │
│              (PDF, DOCX, XLSX, IMG)      │
└─────────────────────────────────────────┘
```

**Відмінності від інших сторінок:**

| Аспект | HomePage | RegistersPage | DocumentationPage |
|--------|----------|---------------|-------------------|
| **Мета** | Навігація | Статус систем | Документи |
| **Контент** | Картки реєстрів | Instatus iframes | Документи |
| **Тип** | Server Component | Server Component | Client Component |
| **Інтеракція** | Клік → перехід | Перегляд статусу | Клік → відкриття файлу |

#### 4.4.1.2 Задачі для користувачів

**User Story 1: Завантаження навчальних матеріалів**

```
As a: Новий співробітник
I want to: Завантажити інструкції з промптів
So that: Я можу ефективно працювати з AI-системами

User Journey:
1. Відкриває /documentation
2. Бачить grid з документами
3. Знаходить "Техніки промптів" (PDF, 2.5 MB)
4. Клікає на назву документа
5. Файл відкривається в новій вкладці
6. Зберігає документ локально
```

**User Story 2: Вивчення моделі бази даних**

```
As a: Розробник
I want to: Переглянути структуру БД ЕКОПФО
So that: Я можу зрозуміти зв'язки між таблицями

User Journey:
1. Відкриває /documentation
2. Фільтрує візуально за типом IMG (жовта мітка)
3. Знаходить "EKOPFO database model" (IMG)
4. Клікає на картку
5. Відкривається повний розмір зображення
6. Аналізує структуру БД
```

**User Story 3: Робота з чек-листами**

```
As a: Менеджер проєкту
I want to: Відкрити чек-лист для команди
So that: Можу відстежувати виконання завдань

User Journey:
1. Відкриває /documentation
2. Шукає документи з міткою DOCX (зелена)
3. Знаходить "EK Teams Checklist" (0.5 MB)
4. Клікає на назву
5. Відкривається DOCX файл
6. Редагує в Microsoft Word/Google Docs
```

**Типові завдання:**

| Задача | Частота | Тип документа |
|--------|---------|---------------|
| **Навчання промптам** | Щотижня | PDF (навчальні матеріали) |
| **Перегляд моделей БД** | При розробці | IMG (діаграми) |
| **Робота з чек-листами** | Щодня | DOCX (редаговані файли) |
| **Аналіз довідників** | Рідко | XLSX (таблиці даних) |

### 4.4.2 Структура файлу `app/documentation/page.tsx`

#### 4.4.2.1 Тип компонента

**Client Component:**

```typescript
// app/documentation/page.tsx
"use client"  // ← Client Component directive

import DocumentCard from '../components/DocumentCard'
import { useTranslations } from '../../lib/useTranslations'

export default function DocumentationPage() {
  const { t } = useTranslations()  // Client-side hook
  
  // Client-side state and interactions
  // Can use onClick, useState, useEffect, etc.
  
  return (/* JSX */)
}
```

**Чому Client Component:**

```yaml
Reasons for Client Component:
  - Uses useTranslations hook (client-side)
  - Interactive document cards (onClick handlers)
  - DocumentCard components are client components
  - No server-side data fetching needed
  - Static document list (hardcoded array)

Could be Server Component if:
  - Documents loaded from file/database
  - No client-side interactivity needed
  - Using async getTranslations() instead of hook
  
Current approach makes sense:
  ✅ Simple static data
  ✅ Immediate interactivity
  ✅ Client-side translations
```

#### 4.4.2.2 Анатомія файлу

**Повна структура файлу:**

```typescript
// ============================================
// CLIENT DIRECTIVE
// ============================================
"use client"

// ============================================
// IMPORTS
// ============================================
import DocumentCard from '../components/DocumentCard'  // Custom component
import { useTranslations } from '../../lib/useTranslations'  // Client hook

// ============================================
// TYPE DEFINITIONS
// ============================================
interface Document {
  key: string                               // Translation key
  fileType: 'PDF' | 'DOCX' | 'XLSX' | 'IMG' // File type (4 options)
  filePath?: string                         // Optional file path
  fileSize?: string                         // Optional file size
}

// ============================================
// STATIC DATA (12 documents)
// ============================================
const documents: Document[] = [
  // PDF Documents (4 items)
  {
    key: 'promptTechniques',
    fileType: 'PDF',
    filePath: '/docs/prompt-techniques.pdf',
    fileSize: '2.5 MB',
  },
  {
    key: 'prompting',
    fileType: 'PDF',
    filePath: '/docs/prompting.pdf',
    fileSize: '1.8 MB',
  },
  {
    key: 'statusModelImage',
    fileType: 'PDF',
    filePath: '/documents/EKOPFO-new digital way.pdf',
    fileSize: '14.8 MB',
  },
  {
    key: 'document9',
    fileType: 'PDF',
    // No filePath → placeholder card
  },
  
  // DOCX Documents (2 items)
  {
    key: 'ekTeamsChecklist',
    fileType: 'DOCX',
    filePath: '/docs/ek-teams-checklist.docx',
    fileSize: '0.5 MB',
  },
  {
    key: 'document10',
    fileType: 'DOCX',
    // No filePath → placeholder
  },
  
  // XLSX Documents (2 items)
  {
    key: 'dzrReference',
    fileType: 'XLSX',
    filePath: '/docs/dzr-reference.xlsx',
    fileSize: '1.2 MB',
  },
  {
    key: 'document12',
    fileType: 'XLSX',
    // No filePath → placeholder
  },
  
  // IMG Documents (4 items)
  {
    key: 'ekopfoDatabaseModel',
    fileType: 'IMG',
    filePath: '/images/EKOPFO database model.png',
    fileSize: '0.8 MB',
  },
  {
    key: 'statusModelCase',
    fileType: 'IMG',
    filePath: '/images/Model_1_maintrack.svg',
    fileSize: '0.2 MB',
  },
  {
    key: 'statusModelVector',
    fileType: 'IMG',
    filePath: '/images/Model_2_skarga.svg',
    fileSize: '0.2 MB',
  },
  {
    key: 'document11',
    fileType: 'IMG',
    // No filePath → placeholder
  },
]

// ============================================
// PAGE COMPONENT
// ============================================
export default function DocumentationPage() {
  // 1. Load translations (client-side)
  const { t } = useTranslations()
  
  // 2. Helper function: Get translation for document card
  const getCardTranslation = (key: string) => {
    const cards = t.documentation?.cards as Record<string, { 
      title: string
      description: string 
    }> | undefined
    
    return cards?.[key] || { 
      title: key,           // Fallback to key
      description: ''       // Empty description
    }
  }
  
  // 3. Render JSX
  return (
    <>
      {/* Hero Banner */}
      <div className="w-full h-32 bg-cover bg-top relative" {...}>
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white text-center">
            {t.documentation?.title || 'Документація'}
          </h1>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="w-full px-4 py-8">
        <div className="container mx-auto">
          {/* Section Title */}
          <h2 className="text-3xl font-bold text-blue-600 mb-8">
            {t.documentation?.subtitle || 'Загальні матеріали та інструкції'}
          </h2>
          
          {/* Documents Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {documents.map((doc, idx) => {
              // Get translation for current document
              const translation = getCardTranslation(doc.key)
              
              return (
                <DocumentCard
                  key={idx}
                  title={translation.title}
                  description={translation.description}
                  fileType={doc.fileType}
                  filePath={doc.filePath}
                  fileSize={doc.fileSize}
                />
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
```

#### 4.4.2.3 Основні секції сторінки

**Логічне розділення:**

```
DocumentationPage Component
├─ Hero Banner Section
│  ├─ Background image (Hero_ezdorovya.webp)
│  ├─ Dark overlay (bg-black/20)
│  └─ Page title (h1: "Документація")
│
└─ Main Content Section
   ├─ Container (container mx-auto)
   ├─ Section Title (h2: "Загальні матеріали та інструкції")
   └─ Documents Grid
      ├─ Grid container (1-4 columns responsive)
      └─ Document Cards (12 cards)
         ├─ PDF cards (4) - червона мітка
         ├─ DOCX cards (2) - зелена мітка
         ├─ XLSX cards (2) - синя мітка
         └─ IMG cards (4) - жовта мітка
```

**Візуальна структура:**

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │         HERO BANNER (h-32)                      │   │
│  │  ┌───────────────────────────────────────────┐  │   │
│  │  │  Background: Hero_ezdorovya.webp          │  │   │
│  │  │  ┌─────────────────────────────────────┐  │  │   │
│  │  │  │  Документація (h1, text-5xl)        │  │  │   │
│  │  │  └─────────────────────────────────────┘  │  │   │
│  │  └───────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │    MAIN CONTENT (container mx-auto, px-4 py-8) │   │
│  │  ┌───────────────────────────────────────────┐  │   │
│  │  │ Section Title (h2, text-3xl)              │  │   │
│  │  │ "Загальні матеріали та інструкції"       │  │   │
│  │  └───────────────────────────────────────────┘  │   │
│  │  ┌───────────────────────────────────────────┐  │   │
│  │  │     DOCUMENTS GRID (lg:4 cols)            │  │   │
│  │  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐             │  │   │
│  │  │  │PDF │ │PDF │ │DOCX│ │XLSX│             │  │   │
│  │  │  │Card│ │Card│ │Card│ │Card│             │  │   │
│  │  │  └────┘ └────┘ └────┘ └────┘             │  │   │
│  │  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐             │  │   │
│  │  │  │IMG │ │IMG │ │IMG │ │IMG │             │  │   │
│  │  │  │Card│ │Card│ │Card│ │Card│             │  │   │
│  │  │  └────┘ └────┘ └────┘ └────┘             │  │   │
│  │  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐             │  │   │
│  │  │  │PDF │ │PDF │ │DOCX│ │XLSX│             │  │   │
│  │  │  │Card│ │Card│ │Card│ │Card│             │  │   │
│  │  │  └────┘ └────┘ └────┘ └────┘             │  │   │
│  │  └───────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Responsive Grid:**

```css
grid-cols-1           /* Mobile: 1 column (stacked) */
sm:grid-cols-2        /* ≥640px: 2 columns */
md:grid-cols-3        /* ≥768px: 3 columns */
lg:grid-cols-4        /* ≥1024px: 4 columns */
gap-6                 /* 1.5rem (24px) gap */
```

### 4.4.3 Компоненти, що використовуються

#### 4.4.3.1 DocumentCard (Client Component)

**Розташування:** `app/components/DocumentCard.tsx`  
**Тип:** Client Component (`"use client"`)

**Props Interface:**

```typescript
interface DocumentCardProps {
  title: string               // Document title
  description?: string        // Optional description
  fileType: 'PDF' | 'DOCX' | 'XLSX' | 'IMG'  // File type
  filePath?: string          // Optional file path
  fileSize?: string          // Optional file size (e.g., "2.5 MB")
}
```

**Component Structure:**

```
DocumentCard
├─ Type Badge (colored header)
│  ├─ PDF: bg-red-500 (червоний)
│  ├─ DOCX: bg-green-500 (зелений)
│  ├─ XLSX: bg-blue-500 (синій)
│  └─ IMG: bg-yellow-400 (жовтий)
│
├─ Preview Area (h-48)
│  ├─ If IMG + filePath: <Image> component
│  └─ Else: Icon + type label
│     ├─ PDF: 📄
│     ├─ DOCX: 📝
│     ├─ XLSX: 📊
│     └─ IMG: 🖼️
│
├─ Document Info (p-4)
│  ├─ Title (button, clickable)
│  ├─ Description (optional)
│  └─ File Size (optional)
│
└─ Edit Icon (top-right corner)
   └─ SVG pencil icon
```

**Visual Appearance:**

```
┌─────────────────────────────────────┐
│ PDF                                 │ ← Type badge (red)
├─────────────────────────────────────┤
│                                     │
│           📄                        │ ← Icon (h-48)
│          PDF                        │
│                                     │
├─────────────────────────────────────┤
│ Техніки промптів            ✏️      │ ← Title + Edit icon
│ Навчальні матеріали з AI...        │ ← Description
│ Розмір: 2.5 MB                      │ ← File size
└─────────────────────────────────────┘
```

**Color Coding Function:**

```typescript
const getTypeColor = (type: string) => {
  switch (type) {
    case 'PDF':
      return 'bg-red-500'      // Red
    case 'DOCX':
      return 'bg-green-500'    // Green
    case 'XLSX':
      return 'bg-blue-500'     // Blue
    case 'IMG':
      return 'bg-yellow-400'   // Yellow
    default:
      return 'bg-gray-500'     // Gray (fallback)
  }
}
```

**Click Handler:**

```typescript
const handleOpenDocument = () => {
  if (filePath) {
    window.open(filePath, '_blank')
    // Opens document in new browser tab
  }
}

// Usage:
<button onClick={handleOpenDocument}>
  {title}
</button>
```

**Image Preview (IMG type):**

```typescript
const isImageType = fileType === 'IMG'

// Preview area rendering:
{filePath && isImageType ? (
  // Show actual image preview
  <div className="relative w-full h-full">
    <Image
      src={filePath}
      alt={title}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, 33vw"
    />
  </div>
) : (
  // Show icon placeholder
  <div className="text-center text-gray-400">
    <div className="text-6xl mb-2">
      {fileType === 'PDF' && '📄'}
      {fileType === 'DOCX' && '📝'}
      {fileType === 'XLSX' && '📊'}
      {fileType === 'IMG' && '🖼️'}
    </div>
    <p className="text-sm">{fileType}</p>
  </div>
)}
```

#### 4.4.3.2 Header (Global Component)

**Розташування:** `app/components/Header.tsx`  
**Тип:** Client Component  
**Використання:** Через `app/layout.tsx` (не безпосередньо в page.tsx)

**Функціональність на цій сторінці:**

```typescript
// Header navigation
<Link href="/documentation">Документація</Link>
//      ↑ Active link (current page)

// Navigation structure:
- Головна (/)
- Реєстри (/registers)
  └─ Dropdown with individual registries
- Документація (/documentation) ← Active
- Про компанію (/about)
  └─ Dropdown with eHealth, Helpdesk
```

#### 4.4.3.3 Footer (Global Component)

**Розташування:** `app/components/Footer.tsx`  
**Тип:** Client Component  
**Використання:** Через `app/layout.tsx`

**Функціональність:**

```typescript
Features:
├─ Support contact text
├─ HelpdeskLink button
└─ Copyright notice

Same as on all pages (consistent footer)
```

### 4.4.4 Логіка рендерингу

#### 4.4.4.1 Формування списку документів

**Static Array:**

```typescript
// Hardcoded array of 12 documents
const documents: Document[] = [
  {
    key: 'promptTechniques',  // Translation key
    fileType: 'PDF',          // Visual indicator
    filePath: '/docs/prompt-techniques.pdf',  // Download link
    fileSize: '2.5 MB',       // Display info
  },
  // ... 11 more documents
]
```

**Document Categories (by type):**

```yaml
PDF Documents (4):
  - promptTechniques (2.5 MB)
  - prompting (1.8 MB)
  - statusModelImage (14.8 MB)
  - document9 (placeholder, no file)

DOCX Documents (2):
  - ekTeamsChecklist (0.5 MB)
  - document10 (placeholder, no file)

XLSX Documents (2):
  - dzrReference (1.2 MB)
  - document12 (placeholder, no file)

IMG Documents (4):
  - ekopfoDatabaseModel (0.8 MB, PNG)
  - statusModelCase (0.2 MB, SVG)
  - statusModelVector (0.2 MB, SVG)
  - document11 (placeholder, no file)
```

**Placeholder Documents:**

```typescript
// Documents without filePath
{
  key: 'document9',
  fileType: 'PDF',
  // No filePath → onClick won't open anything
  // No fileSize → won't display size
}

// Purpose:
// - Reserve grid space for future documents
// - Show planned document structure
// - Maintain consistent grid layout
```

**Mapping to Cards:**

```typescript
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {documents.map((doc, idx) => {
    // 1. Get translation for document key
    const translation = getCardTranslation(doc.key)
    //    Returns: { title: "...", description: "..." }
    
    // 2. Render DocumentCard
    return (
      <DocumentCard
        key={idx}               // React key (index)
        title={translation.title}        // Translated title
        description={translation.description}  // Translated description
        fileType={doc.fileType}          // PDF/DOCX/XLSX/IMG
        filePath={doc.filePath}          // Optional path
        fileSize={doc.fileSize}          // Optional size
      />
    )
  })}
</div>

// Loop execution:
// Iteration 1: doc = { key: 'promptTechniques', fileType: 'PDF', ... }
//   → <DocumentCard title="Техніки промптів" fileType="PDF" ... />
//
// Iteration 2: doc = { key: 'prompting', fileType: 'PDF', ... }
//   → <DocumentCard title="Промптінг" fileType="PDF" ... />
//
// ... (12 iterations total)
```

#### 4.4.4.2 Визначення типу документа

**Type Detection (in DocumentCard):**

```typescript
// fileType prop determines:
// 1. Badge color
const getTypeColor = (type: string) => {
  switch (type) {
    case 'PDF':   return 'bg-red-500'
    case 'DOCX':  return 'bg-green-500'
    case 'XLSX':  return 'bg-blue-500'
    case 'IMG':   return 'bg-yellow-400'
    default:      return 'bg-gray-500'
  }
}

// 2. Icon display
{fileType === 'PDF' && '📄'}
{fileType === 'DOCX' && '📝'}
{fileType === 'XLSX' && '📊'}
{fileType === 'IMG' && '🖼️'}

// 3. Preview behavior
const isImageType = fileType === 'IMG'
// If IMG + filePath → show image preview
// Else → show icon
```

**Type-based Rendering:**

```
PDF Document:
  Badge: bg-red-500 (red)
  Preview: 📄 icon
  Click: Opens PDF in new tab

DOCX Document:
  Badge: bg-green-500 (green)
  Preview: 📝 icon
  Click: Opens DOCX (browser/app handles)

XLSX Document:
  Badge: bg-blue-500 (blue)
  Preview: 📊 icon
  Click: Opens XLSX (Excel/Sheets)

IMG Document:
  Badge: bg-yellow-400 (yellow)
  Preview: Actual image (Next.js Image)
  Click: Opens full-size image
```

**File Extension Detection (implicit):**

```typescript
// Type is explicitly set in documents array
// No automatic detection from filePath

// Example:
{
  key: 'ekopfoDatabaseModel',
  fileType: 'IMG',  // ← Explicitly set
  filePath: '/images/EKOPFO database model.png',  // .png extension
}

// Could implement automatic detection:
const getFileTypeFromPath = (path: string) => {
  if (path.endsWith('.pdf')) return 'PDF'
  if (path.endsWith('.docx')) return 'DOCX'
  if (path.endsWith('.xlsx')) return 'XLSX'
  if (path.match(/\.(png|jpg|svg|webp)$/)) return 'IMG'
  return 'PDF'  // Default
}

// Not used in current implementation
// fileType is manually specified for each document
```

### 4.4.5 ASCII схема структури сторінки

**Компактна DOM-структура:**

```
DocumentationPage (Client Component)
│
├─ Hero Banner Section
│  └─ <div className="w-full h-32 bg-cover...">
│     └─ <div className="absolute inset-0 bg-black/20...">
│        └─ <h1 className="text-5xl font-bold text-white...">
│           └─ {t.documentation?.title || 'Документація'}
│
└─ Main Content Section
   └─ <div className="w-full px-4 py-8">
      └─ <div className="container mx-auto">
         │
         ├─ Section Title
         │  └─ <h2 className="text-3xl font-bold text-blue-600 mb-8">
         │     └─ {t.documentation?.subtitle || 'Загальні матеріали...'}
         │
         └─ Documents Grid
            └─ <div className="grid grid-cols-1 sm:2 md:3 lg:4 gap-6">
               └─ {documents.map((doc, idx) => (...))}
                  │
                  └─ DocumentCard (x12)
                     └─ <div className="bg-white rounded-lg shadow-md...">
                        │
                        ├─ Type Badge
                        │  └─ <div className={getTypeColor(fileType)}>
                        │     └─ {fileType}  "PDF" / "DOCX" / "XLSX" / "IMG"
                        │
                        ├─ Preview Area
                        │  └─ <div className="h-48 bg-gray-100...">
                        │     ├─ If IMG + filePath:
                        │     │  └─ <Image src={filePath} fill />
                        │     └─ Else:
                        │        └─ Icon (📄/📝/📊/🖼️) + type label
                        │
                        ├─ Document Info
                        │  └─ <div className="p-4">
                        │     ├─ Title (button, clickable)
                        │     │  └─ <button onClick={handleOpenDocument}>
                        │     │     └─ {title}
                        │     ├─ Description (optional)
                        │     │  └─ <p>{description}</p>
                        │     └─ File Size (optional)
                        │        └─ <p>Розмір: {fileSize}</p>
                        │
                        └─ Edit Icon
                           └─ <div className="absolute top-2 right-2...">
                              └─ <svg>...</svg>  (pencil icon)
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
│  │  │  ├─ Navigation                                         │  │  │
│  │  │  │  └─ "Документація" (active) ← Current page         │  │  │
│  │  │  └─ Language Switcher                                  │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  │                                                              │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │  {children} ← DocumentationPage inserted here          │  │  │
│  │  │  ┌──────────────────────────────────────────────────┐  │  │  │
│  │  │  │  DOCUMENTATION PAGE (Client Component)           │  │  │  │
│  │  │  │  ┌────────────────────────────────────────────┐  │  │  │  │
│  │  │  │  │  HERO BANNER (h-32)                        │  │  │  │  │
│  │  │  │  │  ┌──────────────────────────────────────┐  │  │  │  │  │
│  │  │  │  │  │  Background: Hero_ezdorovya.webp     │  │  │  │  │  │
│  │  │  │  │  │  ┌────────────────────────────────┐  │  │  │  │  │  │
│  │  │  │  │  │  │  <h1> Документація            │  │  │  │  │  │  │
│  │  │  │  │  │  └────────────────────────────────┘  │  │  │  │  │  │
│  │  │  │  │  └──────────────────────────────────────┘  │  │  │  │  │
│  │  │  │  └────────────────────────────────────────────┘  │  │  │  │
│  │  │  │  ┌────────────────────────────────────────────┐  │  │  │  │
│  │  │  │  │  MAIN CONTENT (container mx-auto)          │  │  │  │  │
│  │  │  │  │  ┌──────────────────────────────────────┐  │  │  │  │  │
│  │  │  │  │  │  Section Title (h2)                  │  │  │  │  │  │
│  │  │  │  │  │  "Загальні матеріали..."             │  │  │  │  │  │
│  │  │  │  │  └──────────────────────────────────────┘  │  │  │  │  │
│  │  │  │  │  ┌──────────────────────────────────────┐  │  │  │  │  │
│  │  │  │  │  │  GRID (lg:4 cols, gap-6)             │  │  │  │  │  │
│  │  │  │  │  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐         │  │  │  │  │  │
│  │  │  │  │  │  │ DC │ │ DC │ │ DC │ │ DC │         │  │  │  │  │  │
│  │  │  │  │  │  │PDF │ │PDF │ │DOCX│ │XLSX│         │  │  │  │  │  │
│  │  │  │  │  │  └────┘ └────┘ └────┘ └────┘         │  │  │  │  │  │
│  │  │  │  │  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐         │  │  │  │  │  │
│  │  │  │  │  │  │ DC │ │ DC │ │ DC │ │ DC │         │  │  │  │  │  │
│  │  │  │  │  │  │IMG │ │IMG │ │IMG │ │IMG │         │  │  │  │  │  │
│  │  │  │  │  │  └────┘ └────┘ └────┘ └────┘         │  │  │  │  │  │
│  │  │  │  │  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐         │  │  │  │  │  │
│  │  │  │  │  │  │ DC │ │ DC │ │ DC │ │ DC │         │  │  │  │  │  │
│  │  │  │  │  │  │PDF │ │PDF │ │DOCX│ │XLSX│         │  │  │  │  │  │
│  │  │  │  │  │  └────┘ └────┘ └────┘ └────┘         │  │  │  │  │  │
│  │  │  │  │  │  (DC = DocumentCard component)       │  │  │  │  │  │
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

**DocumentCard Detailed Structure:**

```
┌──────────────────────────────────────────────┐
│ PDF                                    ✏️    │ ← Type badge (red) + Edit icon
├──────────────────────────────────────────────┤
│                                              │
│                  📄                          │ ← Preview area (h-48)
│                 PDF                          │    Icon or Image
│                                              │
├──────────────────────────────────────────────┤
│ Техніки промптів                             │ ← Title (clickable button)
│ Навчальні матеріали з роботи з AI...        │ ← Description (optional)
│ Розмір: 2.5 MB                               │ ← File size (optional)
└──────────────────────────────────────────────┘
```

---

**Дата створення:** 13 грудня 2025  
**Файл:** `app/documentation/page.tsx`  
**Тип компонента:** Client Component (`"use client"`)  
**URL:** `/documentation`  
**Кількість документів:** 12 (4 PDF, 2 DOCX, 2 XLSX, 4 IMG)  
**Grid Layout:** 1→2→3→4 columns (responsive)  
**Компонент:** DocumentCard (client-side interactivity)
