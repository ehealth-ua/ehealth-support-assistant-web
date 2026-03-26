# 📋 ПАСПОРТ САЙТУ
## Розділ 4: Опис сторінок сайту (Частина 4.B)

---

## 4.4. 📚 СТОРІНКА «ДОКУМЕНТАЦІЯ» (Documentation Page) — Частина 2

### 4.4.6 Робота з файлами

#### 4.4.6.1 Підключення файлів (PDF, DOCX, XLSX, IMG)

**File Path Structure:**

```
public/
├─ docs/                          ← PDF, DOCX, XLSX documents
│  ├─ prompt-techniques.pdf       (2.5 MB)
│  ├─ prompting.pdf               (1.8 MB)
│  ├─ ek-teams-checklist.docx     (0.5 MB)
│  └─ dzr-reference.xlsx          (1.2 MB)
│
├─ documents/                     ← Additional PDF documents
│  └─ EKOPFO-new digital way.pdf  (14.8 MB)
│
└─ images/                        ← Image files
   ├─ EKOPFO database model.png   (0.8 MB)
   ├─ Model_1_maintrack.svg       (0.2 MB)
   └─ Model_2_skarga.svg          (0.2 MB)
```

**Next.js Public Folder:**

```yaml
Public Folder Behavior:
  - Files in /public served at root URL
  - /public/docs/file.pdf → URL: /docs/file.pdf
  - /public/images/img.png → URL: /images/img.png
  - No build processing (served as-is)
  - Direct browser access

Access Pattern:
  - Static files
  - No authentication required
  - CDN cacheable
  - Direct download links
```

**File Type Mapping:**

```typescript
// Document configuration in page.tsx
const documents: Document[] = [
  // PDF Documents
  {
    key: 'promptTechniques',
    fileType: 'PDF',
    filePath: '/docs/prompt-techniques.pdf',
    //        ↑ Absolute path from public folder
    fileSize: '2.5 MB',
  },
  
  // DOCX Documents
  {
    key: 'ekTeamsChecklist',
    fileType: 'DOCX',
    filePath: '/docs/ek-teams-checklist.docx',
    fileSize: '0.5 MB',
  },
  
  // XLSX Documents
  {
    key: 'dzrReference',
    fileType: 'XLSX',
    filePath: '/docs/dzr-reference.xlsx',
    fileSize: '1.2 MB',
  },
  
  // IMG Documents
  {
    key: 'ekopfoDatabaseModel',
    fileType: 'IMG',
    filePath: '/images/EKOPFO database model.png',
    fileSize: '0.8 MB',
  },
]
```

**File Access Flow:**

```
User clicks DocumentCard
      ↓
handleOpenDocument() executes
      ↓
window.open(filePath, '_blank')
      ↓
Browser requests: https://site.com/docs/prompt-techniques.pdf
      ↓
Next.js serves: public/docs/prompt-techniques.pdf
      ↓
Browser handles file:
  - PDF: Opens in browser PDF viewer
  - DOCX: Downloads (browser can't render)
  - XLSX: Downloads (browser can't render)
  - IMG: Opens in new tab (image viewer)
```

**File Type Handling by Browser:**

```yaml
PDF Files:
  Browser: Opens in built-in PDF viewer
  Actions: View, Download, Print
  Example: Chrome PDF viewer, Firefox PDF.js
  Fallback: Download if viewer disabled

DOCX Files:
  Browser: Prompts download
  Opens: Microsoft Word, Google Docs, LibreOffice
  No inline preview (browser limitation)
  User must have compatible app

XLSX Files:
  Browser: Prompts download
  Opens: Microsoft Excel, Google Sheets, LibreOffice Calc
  No inline preview
  User must have compatible app

IMG Files (PNG, SVG):
  Browser: Opens in new tab
  Actions: View, Download, Zoom
  SVG: Scalable, high quality
  PNG: Raster image
```

#### 4.4.6.2 Відкриття файлів у новому вікні

**Click Handler Implementation:**

```typescript
// In DocumentCard component
const handleOpenDocument = () => {
  if (filePath) {
    window.open(filePath, '_blank')
    //          ↑         ↑
    //          URL       Target: new tab/window
  }
}

// Usage:
<button onClick={handleOpenDocument}>
  {title}
</button>
```

**window.open() Parameters:**

```typescript
window.open(url, target, features?)

// Our usage:
window.open('/docs/prompt-techniques.pdf', '_blank')

// Parameters:
// url: '/docs/prompt-techniques.pdf'
//   → File path to open
//
// target: '_blank'
//   → Opens in new tab (or window)
//   → Other options: '_self', '_parent', '_top'
//
// features: undefined
//   → Browser default behavior
//   → Could specify: 'width=800,height=600'
```

**Target Options:**

```yaml
'_blank':
  - Opens in new tab (modern browsers)
  - Or new window (older browsers/settings)
  - User can Ctrl+Click for background tab
  - Default browser behavior

'_self':
  - Opens in same tab
  - Replaces current page
  - User loses documentation page

'_parent':
  - Opens in parent frame
  - Rarely used (no iframes here)

'_top':
  - Opens in topmost frame
  - Breaks out of all iframes
```

**Browser Security:**

```typescript
// Modern browsers may block window.open()
// if not triggered by user interaction

// ✅ Works (user click):
<button onClick={handleOpenDocument}>Open</button>

// ❌ Blocked (automatic):
useEffect(() => {
  window.open('/docs/file.pdf', '_blank')  // Popup blocker!
}, [])

// Security considerations:
window.open(filePath, '_blank', 'noopener,noreferrer')
//                                ↑ Recommended for security
//                                Prevents tab access to opener

// Current implementation:
// No explicit noopener → browser applies by default
// Modern browsers automatically secure '_blank' links
```

**User Experience:**

```
User Journey:
1. User clicks "Техніки промптів" title
   ↓
2. onClick handler fires
   ↓
3. window.open() executes
   ↓
4. Browser opens new tab
   ↓
5. New tab loads: /docs/prompt-techniques.pdf
   ↓
6. Browser PDF viewer renders document
   ↓
7. User can:
   - Read document
   - Download (💾 button)
   - Print (🖨️ button)
   - Close tab → returns to documentation page ✅

Original documentation page remains open
User can open multiple documents simultaneously
```

#### 4.4.6.3 Визначення іконки документа

**Icon Selection Logic:**

```typescript
// In DocumentCard preview area
<div className="h-48 bg-gray-100 flex items-center justify-center">
  {filePath && isImageType ? (
    // Show actual image for IMG type
    <Image src={filePath} alt={title} fill />
  ) : (
    // Show emoji icon for other types
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
</div>
```

**Icon Mapping:**

```yaml
PDF (📄):
  Emoji: 📄 (U+1F4C4 Page Facing Up)
  Size: text-6xl (60px)
  Color: Inherits text-gray-400
  Usage: All PDF documents
  
DOCX (📝):
  Emoji: 📝 (U+1F4DD Memo)
  Size: text-6xl (60px)
  Color: Inherits text-gray-400
  Usage: Word documents

XLSX (📊):
  Emoji: 📊 (U+1F4CA Bar Chart)
  Size: text-6xl (60px)
  Color: Inherits text-gray-400
  Usage: Excel spreadsheets

IMG (🖼️):
  Emoji: 🖼️ (U+1F5BC Frame with Picture)
  Size: text-6xl (60px)
  Color: Inherits text-gray-400
  Usage: Only when no filePath
  Note: With filePath, shows actual image
```

**Icon vs Image Preview:**

```typescript
const isImageType = fileType === 'IMG'

// Scenario 1: IMG with filePath
{
  key: 'ekopfoDatabaseModel',
  fileType: 'IMG',
  filePath: '/images/EKOPFO database model.png',
}
// Result: Shows <Image> preview (actual PNG)

// Scenario 2: IMG without filePath (placeholder)
{
  key: 'document11',
  fileType: 'IMG',
  // No filePath
}
// Result: Shows 🖼️ emoji icon

// Scenario 3: PDF (always icon)
{
  key: 'promptTechniques',
  fileType: 'PDF',
  filePath: '/docs/prompt-techniques.pdf',
}
// Result: Shows 📄 emoji icon (no PDF preview)
```

**Alternative Icon Implementations:**

```typescript
// Current: Emoji icons (simple, no dependencies)
{fileType === 'PDF' && '📄'}

// Alternative 1: SVG icons from library
import { FileText, FileSpreadsheet } from 'lucide-react'
{fileType === 'PDF' && <FileText size={60} />}

// Alternative 2: Custom SVG
{fileType === 'PDF' && (
  <svg className="w-16 h-16">
    <path d="..." />
  </svg>
)}

// Alternative 3: Image icons
{fileType === 'PDF' && (
  <img src="/icons/pdf.svg" alt="PDF" />
)}

// Current approach (emoji) advantages:
// ✅ No dependencies
// ✅ Cross-platform
// ✅ Accessible (text-based)
// ✅ Colorful by default
// ✅ No HTTP requests
```

**Preview Area Height:**

```css
h-48  /* 192px (12rem) */

/* Ensures consistent card height */
/* Large enough for icons */
/* Fits image previews */

/* Preview area CSS: */
.preview-area {
  height: 192px;
  background-color: #f3f4f6;  /* gray-100 */
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### 4.4.7 Локалізація

#### 4.4.7.1 Підключення useTranslations()

**Client-side Hook:**

```typescript
// app/documentation/page.tsx
"use client"  // Required for hooks

import { useTranslations } from '../../lib/useTranslations'

export default function DocumentationPage() {
  // Load translations (client-side)
  const { t } = useTranslations()
  //      ↑ Translation object
  
  // Use in JSX:
  <h1>{t.documentation?.title || 'Документація'}</h1>
}
```

**Hook Implementation (lib/useTranslations.ts):**

```typescript
// Simplified version
export function useTranslations() {
  const [locale, setLocale] = useState('uk')
  const [translations, setTranslations] = useState({})
  
  useEffect(() => {
    // Load translations from cookie
    const cookieLocale = getCookie('NEXT_LOCALE') || 'uk'
    setLocale(cookieLocale)
    
    // Load translation file
    import(`../locales/${cookieLocale}.json`)
      .then(module => setTranslations(module.default))
  }, [])
  
  return { 
    t: translations,
    locale,
    setLocale 
  }
}
```

**Difference from Server Component:**

```typescript
// Server Component (app/registers/[slug]/page.tsx):
import { getTranslations } from '../../../lib/i18n'

export default async function RegisterDetail() {
  const t = await getTranslations(locale)  // async function
  //          ↑ Server-side file read
}

// Client Component (app/documentation/page.tsx):
import { useTranslations } from '../../lib/useTranslations'

export default function DocumentationPage() {
  const { t } = useTranslations()  // hook
  //              ↑ Client-side dynamic import
}

// Why different approaches:
// Server: Can use fs.readFileSync (Node.js APIs)
// Client: Must use dynamic imports (browser)
```

#### 4.4.7.2 Ключі локалізації

**Translation Structure:**

```json
// locales/ua.json
{
  "documentation": {
    "title": "Документація",
    "subtitle": "Загальні матеріали та інструкції",
    "fileSize": "Розмір",
    "cards": {
      "promptTechniques": {
        "title": "Варіанти техніки побудови промптів",
        "description": "Тип: PDF"
      },
      "prompting": {
        "title": "Промптинг (Огляд)",
        "description": "Тип: PDF"
      },
      "ekTeamsChecklist": {
        "title": "Чек-лист для новостворених команд ЕК",
        "description": "Тип: DOCX"
      },
      "dzrReference": {
        "title": "ДЗР довідник",
        "description": "Тип: XLSX"
      },
      "ekopfoDatabaseModel": {
        "title": "EKOPFO database model",
        "description": "Тип: Зображення (Схема)"
      },
      "statusModelCase": {
        "title": "Статус-модель основного флоу справи",
        "description": "Тип: Зображення (Схема)"
      },
      "statusModelVector": {
        "title": "Статус-модель процесів оскарження",
        "description": "Тип: Зображення (Схема)"
      },
      "statusModelImage": {
        "title": "ЕКОПФО Новий цифровий шлях оцінювання",
        "description": "Тип: PDF"
      },
      "document9": {
        "title": "Документ №9 (Резерв)",
        "description": "Місце для майбутнього файлу PDF"
      },
      "document10": {
        "title": "Документ №10 (Резерв)",
        "description": "Місце для майбутнього файлу DOCX"
      },
      "document11": {
        "title": "Документ №11 (Резерв)",
        "description": "Місце для майбутнього зображення"
      },
      "document12": {
        "title": "Документ №12 (Резерв)",
        "description": "Місце для майбутнього файлу XLSX"
      }
    }
  }
}
```

**English Translations:**

```json
// locales/en.json
{
  "documentation": {
    "title": "Documentation",
    "subtitle": "General materials and instructions",
    "fileSize": "Size",
    "cards": {
      "promptTechniques": {
        "title": "Prompt Building Techniques",
        "description": "Type: PDF"
      },
      "prompting": {
        "title": "Prompting (Overview)",
        "description": "Type: PDF"
      },
      "ekTeamsChecklist": {
        "title": "EK Teams Checklist",
        "description": "Type: DOCX"
      },
      // ... etc
    }
  }
}
```

**Usage Examples:**

```typescript
// 1. Page Title (Hero Banner)
<h1>{t.documentation?.title || 'Документація'}</h1>
// UA: "Документація"
// EN: "Documentation"

// 2. Section Subtitle
<h2>{t.documentation?.subtitle || 'Загальні матеріали та інструкції'}</h2>
// UA: "Загальні матеріали та інструкції"
// EN: "General materials and instructions"

// 3. File Size Label (in DocumentCard)
<p>{t.documentation?.fileSize || 'Розмір'}: {fileSize}</p>
// UA: "Розмір: 2.5 MB"
// EN: "Size: 2.5 MB"

// 4. Document Card Translations
const getCardTranslation = (key: string) => {
  const cards = t.documentation?.cards as Record<string, { 
    title: string
    description: string 
  }> | undefined
  
  return cards?.[key] || { 
    title: key,           // Fallback to key
    description: '' 
  }
}

// Example for 'promptTechniques':
const translation = getCardTranslation('promptTechniques')
// UA: {
//   title: "Варіанти техніки побудови промптів",
//   description: "Тип: PDF"
// }
// EN: {
//   title: "Prompt Building Techniques",
//   description: "Type: PDF"
// }
```

**Fallback Chain:**

```typescript
// Level 1: Try to get translation
const cards = t.documentation?.cards
const cardData = cards?.[key]

// Level 2: If missing, use fallback
return cardData || { 
  title: key,           // Use key as title
  description: ''       // Empty description
}

// Example execution:
// key = 'promptTechniques'
//
// Step 1: Look up t.documentation.cards.promptTechniques
//   If locale = 'uk': returns { title: "Варіанти...", description: "Тип: PDF" } ✅
//   If locale = 'en': returns { title: "Prompt Building...", description: "Type: PDF" } ✅
//   If key missing: returns undefined → go to Step 2
//
// Step 2: Use fallback
//   returns { title: "promptTechniques", description: "" } ✅
```

**Локалізовані елементи:**

```
┌─────────────────────────────────────────────────┐
│  Hero Banner                                    │
│  ┌───────────────────────────────────────────┐  │
│  │  t.documentation.title                    │  │
│  │  UA: "Документація"                       │  │
│  │  EN: "Documentation"                      │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Section Subtitle                               │
│  ┌───────────────────────────────────────────┐  │
│  │  t.documentation.subtitle                 │  │
│  │  UA: "Загальні матеріали та інструкції"  │  │
│  │  EN: "General materials and instructions"│  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Document Cards (x12)                           │
│  ┌───────────────────────────────────────────┐  │
│  │  t.documentation.cards.promptTechniques   │  │
│  │  UA: "Варіанти техніки побудови промптів"│  │
│  │  EN: "Prompt Building Techniques"        │  │
│  └───────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────┐  │
│  │  t.documentation.fileSize                 │  │
│  │  UA: "Розмір: 2.5 MB"                    │  │
│  │  EN: "Size: 2.5 MB"                      │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### 4.4.8 Приклади коду (Key Logic)

#### 4.4.8.1 Отримання перекладу для картки

```typescript
const getCardTranslation = (key: string) => {
  const cards = t.documentation?.cards as Record<string, { 
    title: string
    description: string 
  }> | undefined
  
  return cards?.[key] || { 
    title: key, 
    description: '' 
  }
}

// Usage:
const translation = getCardTranslation('promptTechniques')
// Returns: { title: "Варіанти...", description: "Тип: PDF" }
```

#### 4.4.8.2 Рендеринг DocumentCard з перекладами

```typescript
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {documents.map((doc, idx) => {
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
```

#### 4.4.8.3 Відкриття документа (DocumentCard)

```typescript
const handleOpenDocument = () => {
  if (filePath) {
    window.open(filePath, '_blank')
  }
}

// Trigger:
<button onClick={handleOpenDocument}>
  {title}
</button>
```

#### 4.4.8.4 Визначення кольору бейджа

```typescript
const getTypeColor = (type: string) => {
  switch (type) {
    case 'PDF':
      return 'bg-red-500'
    case 'DOCX':
      return 'bg-green-500'
    case 'XLSX':
      return 'bg-blue-500'
    case 'IMG':
      return 'bg-yellow-400'
    default:
      return 'bg-gray-500'
  }
}

// Usage:
<div className={`${getTypeColor(fileType)} text-white px-4 py-2`}>
  {fileType}
</div>
```

#### 4.4.8.5 Conditional Image Preview

```typescript
const isImageType = fileType === 'IMG'

{filePath && isImageType ? (
  // Show actual image
  <Image
    src={filePath}
    alt={title}
    fill
    className="object-cover"
  />
) : (
  // Show icon
  <div className="text-6xl">
    {fileType === 'PDF' && '📄'}
    {fileType === 'DOCX' && '📝'}
    {fileType === 'XLSX' && '📊'}
    {fileType === 'IMG' && '🖼️'}
  </div>
)}
```

### 4.4.9 ASCII схема потоку даних

**Повний Data Flow:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│           DOCUMENTATION PAGE DATA FLOW                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  CLIENT-SIDE RENDERING                                                  │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                   │ │
│  │  1. STATIC DATA SOURCE                                            │ │
│  │     ┌─────────────────────────────────────────────────────────┐  │ │
│  │     │ const documents: Document[] = [                         │  │ │
│  │     │   {                                                     │  │ │
│  │     │     key: 'promptTechniques',                            │  │ │
│  │     │     fileType: 'PDF',                                    │  │ │
│  │     │     filePath: '/docs/prompt-techniques.pdf',            │  │ │
│  │     │     fileSize: '2.5 MB'                                  │  │ │
│  │     │   },                                                    │  │ │
│  │     │   ... (11 more documents)                               │  │ │
│  │     │ ]                                                       │  │ │
│  │     └─────────────────────────────────────────────────────────┘  │ │
│  │              ↓                                                    │ │
│  │     ┌─────────────────────────────────────────────────────────┐  │ │
│  │     │ Translation Files (locales/*.json)                      │  │ │
│  │     │ - locales/ua.json                                       │  │ │
│  │     │ - locales/en.json                                       │  │ │
│  │     │ {                                                       │  │ │
│  │     │   "documentation": {                                    │  │ │
│  │     │     "title": "Документація",                            │  │ │
│  │     │     "cards": {                                          │  │ │
│  │     │       "promptTechniques": {                             │  │ │
│  │     │         "title": "Варіанти техніки...",                 │  │ │
│  │     │         "description": "Тип: PDF"                       │  │ │
│  │     │       }                                                 │  │ │
│  │     │     }                                                   │  │ │
│  │     │   }                                                     │  │ │
│  │     │ }                                                       │  │ │
│  │     └─────────────────────────────────────────────────────────┘  │ │
│  │              ↓                                                    │ │
│  │  ┌───────────────────────────────────────────────────────────┐   │ │
│  │  │  2. COMPONENT INITIALIZATION                              │   │ │
│  │  │     ┌─────────────────────────────────────────────────┐   │   │ │
│  │  │     │  DocumentationPage component mounts             │   │   │ │
│  │  │     │  ↓                                             │   │   │ │
│  │  │     │  1. useTranslations() hook executes            │   │   │ │
│  │  │     │     ├─ Read locale from cookie                 │   │   │ │
│  │  │     │     │  locale = 'uk' (or 'en')                │   │   │ │
│  │  │     │     ├─ Dynamic import translation file         │   │   │ │
│  │  │     │     │  import(`../locales/${locale}.json`)    │   │   │ │
│  │  │     │     └─ Returns: { t, locale, setLocale }      │   │   │ │
│  │  │     │  ↓                                             │   │   │ │
│  │  │     │  2. Access static documents array              │   │   │ │
│  │  │     │     documents (12 items)                       │   │   │ │
│  │  │     └─────────────────────────────────────────────────┘   │   │ │
│  │  └───────────────────────────────────────────────────────────┘   │ │
│  │              ↓                                                    │ │
│  │  ┌───────────────────────────────────────────────────────────┐   │ │
│  │  │  3. DOCUMENT CARD RENDERING                               │   │ │
│  │  │                                                           │   │ │
│  │  │     documents.map((doc, idx) => {                         │   │ │
│  │  │       ↓                                                   │   │ │
│  │  │       1. Get translation for doc.key                      │   │ │
│  │  │          const translation = getCardTranslation(doc.key)  │   │ │
│  │  │          ├─ Look up: t.documentation.cards[doc.key]       │   │ │
│  │  │          └─ Returns: { title, description }               │   │ │
│  │  │       ↓                                                   │   │ │
│  │  │       2. Render DocumentCard                              │   │ │
│  │  │          <DocumentCard                                    │   │ │
│  │  │            title={translation.title}                      │   │ │
│  │  │            description={translation.description}          │   │ │
│  │  │            fileType={doc.fileType}                        │   │ │
│  │  │            filePath={doc.filePath}                        │   │ │
│  │  │            fileSize={doc.fileSize}                        │   │ │
│  │  │          />                                               │   │ │
│  │  │     })                                                    │   │ │
│  │  │                                                           │   │ │
│  │  │     Result: 12 DocumentCard components                    │   │ │
│  │  └───────────────────────────────────────────────────────────┘   │ │
│  │              ↓                                                    │ │
│  │  ┌───────────────────────────────────────────────────────────┐   │ │
│  │  │  4. DOCUMENTCARD COMPONENT RENDERING                      │   │ │
│  │  │                                                           │   │ │
│  │  │     For each DocumentCard:                                │   │ │
│  │  │     ┌─────────────────────────────────────────────────┐   │   │ │
│  │  │     │  1. Determine badge color                       │   │ │ │
│  │  │     │     const color = getTypeColor(fileType)        │   │ │ │
│  │  │     │     PDF → bg-red-500                            │   │ │ │
│  │  │     │     DOCX → bg-green-500                         │   │ │ │
│  │  │     │     XLSX → bg-blue-500                          │   │ │ │
│  │  │     │     IMG → bg-yellow-400                         │   │ │ │
│  │  │     │  ↓                                             │   │ │ │
│  │  │     │  2. Determine preview content                   │   │ │ │
│  │  │     │     const isImageType = fileType === 'IMG'      │   │ │ │
│  │  │     │     If IMG + filePath:                          │   │ │ │
│  │  │     │       → Show <Image> component                  │   │ │ │
│  │  │     │     Else:                                       │   │ │ │
│  │  │     │       → Show emoji icon (📄/📝/📊/🖼️)           │   │ │ │
│  │  │     │  ↓                                             │   │ │ │
│  │  │     │  3. Render card structure                       │   │ │ │
│  │  │     │     ├─ Type Badge (with color)                  │   │ │ │
│  │  │     │     ├─ Preview Area (h-48)                      │   │ │ │
│  │  │     │     ├─ Title (clickable button)                 │   │ │ │
│  │  │     │     ├─ Description (if provided)                │   │ │ │
│  │  │     │     ├─ File Size (if provided)                  │   │ │ │
│  │  │     │     └─ Edit Icon (top-right)                    │   │ │ │
│  │  │     └─────────────────────────────────────────────────┘   │   │ │
│  │  └───────────────────────────────────────────────────────────┘   │ │
│  │              ↓                                                    │ │
│  │  ┌───────────────────────────────────────────────────────────┐   │ │
│  │  │  5. HTML OUTPUT                                           │   │ │
│  │  │                                                           │   │ │
│  │  │     <div className="grid grid-cols-1 sm:2 md:3 lg:4">    │   │ │
│  │  │       <!-- Card 1: PDF -->                                │   │ │
│  │  │       <div className="bg-white rounded-lg shadow-md">     │   │ │
│  │  │         <div className="bg-red-500">PDF</div>             │   │ │
│  │  │         <div className="h-48">📄</div>                    │   │ │
│  │  │         <button>Варіанти техніки побудови промптів</button>│   │ │
│  │  │         <p>Тип: PDF</p>                                   │   │ │
│  │  │         <p>Розмір: 2.5 MB</p>                             │   │ │
│  │  │       </div>                                              │   │ │
│  │  │                                                           │   │ │
│  │  │       <!-- Card 2: PDF -->                                │   │ │
│  │  │       <div>...</div>                                      │   │ │
│  │  │                                                           │   │ │
│  │  │       <!-- ... 10 more cards -->                          │   │ │
│  │  │     </div>                                                │   │ │
│  │  └───────────────────────────────────────────────────────────┘   │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  USER INTERACTION                                                       │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                   │ │
│  │  User clicks document title                                       │ │
│  │       ↓                                                           │ │
│  │  onClick handler fires                                            │ │
│  │       ↓                                                           │ │
│  │  handleOpenDocument() executes                                    │ │
│  │       ↓                                                           │ │
│  │  if (filePath) {                                                  │ │
│  │    window.open(filePath, '_blank')                                │ │
│  │  }                                                                │ │
│  │       ↓                                                           │ │
│  │  Browser opens new tab                                            │ │
│  │       ↓                                                           │ │
│  │  ┌────────────────────────────────────────────────────────────┐  │ │
│  │  │  File Request Flow                                         │  │ │
│  │  │  ┌──────────────────────────────────────────────────────┐  │  │ │
│  │  │  │  1. Browser requests: /docs/prompt-techniques.pdf   │  │  │ │
│  │  │  │     ↓                                               │  │  │ │
│  │  │  │  2. Next.js serves: public/docs/prompt-techniques...│  │  │ │
│  │  │  │     ↓                                               │  │  │ │
│  │  │  │  3. Browser handles file type:                      │  │  │ │
│  │  │  │     PDF: Opens in PDF viewer                        │  │  │ │
│  │  │  │     DOCX: Prompts download                          │  │  │ │
│  │  │  │     XLSX: Prompts download                          │  │  │ │
│  │  │  │     IMG: Opens in image viewer                      │  │  │ │
│  │  │  │     ↓                                               │  │  │ │
│  │  │  │  4. User interacts with document                    │  │  │ │
│  │  │  │     - View content                                  │  │  │ │
│  │  │  │     - Download (💾 button)                          │  │  │ │
│  │  │  │     - Print (🖨️ button)                             │  │  │ │
│  │  │  │     - Close tab                                     │  │  │ │
│  │  │  └──────────────────────────────────────────────────────┘  │  │ │
│  │  └────────────────────────────────────────────────────────────┘  │ │
│  │       ↓                                                           │ │
│  │  ┌────────────────────────────────────────────────────────────┐  │ │
│  │  │  USER INTERFACE (Final State)                              │  │ │
│  │  │  ┌──────────────────────────────────────────────────────┐  │  │ │
│  │  │  │  [Header: Logo + Nav + Lang Switcher]               │  │  │ │
│  │  │  └──────────────────────────────────────────────────────┘  │  │ │
│  │  │  ┌──────────────────────────────────────────────────────┐  │  │ │
│  │  │  │  [Hero Banner: "Документація"]                      │  │  │ │
│  │  │  └──────────────────────────────────────────────────────┘  │  │ │
│  │  │  ┌──────────────────────────────────────────────────────┐  │  │ │
│  │  │  │  [Section Title: "Загальні матеріали..."]           │  │  │ │
│  │  │  └──────────────────────────────────────────────────────┘  │  │ │
│  │  │  ┌──────────────────────────────────────────────────────┐  │  │ │
│  │  │  │  [Grid: 4 columns on desktop]                       │  │  │ │
│  │  │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │  │  │ │
│  │  │  │  │ PDF 📄  │ │ PDF 📄  │ │ DOCX 📝 │ │ XLSX 📊 │   │  │  │ │
│  │  │  │  │ Red     │ │ Red     │ │ Green   │ │ Blue    │   │  │  │ │
│  │  │  │  │ 2.5 MB  │ │ 1.8 MB  │ │ 0.5 MB  │ │ 1.2 MB  │   │  │  │ │
│  │  │  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘   │  │  │ │
│  │  │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │  │  │ │
│  │  │  │  │ IMG 🖼️  │ │ IMG 🖼️  │ │ IMG 🖼️  │ │ IMG 🖼️  │   │  │  │ │
│  │  │  │  │ Yellow  │ │ Yellow  │ │ Yellow  │ │ Yellow  │   │  │  │ │
│  │  │  │  │ [Image] │ │ [Image] │ │ [Image] │ │ [Icon]  │   │  │  │ │
│  │  │  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘   │  │  │ │
│  │  │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │  │  │ │
│  │  │  │  │ PDF 📄  │ │ PDF 📄  │ │ DOCX 📝 │ │ XLSX 📊 │   │  │  │ │
│  │  │  │  │ Placeholder                                      │  │  │ │
│  │  │  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘   │  │  │ │
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
STATIC DATA
├─ documents[] (hardcoded array)
│  └─ 12 documents (PDF, DOCX, XLSX, IMG)
└─ locales/*.json (translation files)
   └─ titles, descriptions, labels

      ↓ LOAD

CLIENT COMPONENT
├─ useTranslations() hook
│  └─ Dynamic import of translation file
├─ documents.map()
│  └─ Get translation for each document
└─ Render DocumentCard for each

      ↓ RENDER

DOCUMENTCARD COMPONENTS
├─ Determine badge color (by fileType)
├─ Determine preview (icon or image)
├─ Render card structure
└─ Attach onClick handler

      ↓ USER CLICKS

BROWSER ACTION
├─ window.open(filePath, '_blank')
├─ New tab opens with document
└─ Browser handles file type
   ├─ PDF: PDF viewer
   ├─ DOCX/XLSX: Download
   └─ IMG: Image viewer

      ↓ RESULT

USER VIEWS DOCUMENT
└─ Can read, download, print, close
```

---

**Дата створення:** 13 грудня 2025  
**Файл:** `app/documentation/page.tsx`  
**Тип компонента:** Client Component (`"use client"`)  
**URL:** `/documentation`  
**Кількість документів:** 12  
**File Types:** PDF (4), DOCX (2), XLSX (2), IMG (4)  
**Icons:** Emoji (📄📝📊🖼️)  
**Click Action:** window.open(filePath, '_blank')  
**Translations:** useTranslations() hook (client-side)
