# 📋 ПАСПОРТ САЙТУ
## Розділ 2: Архітектура проєкту

---

## 1. 🏗️ ЗАГАЛЬНА АРХІТЕКТУРА

### 1.1 Архітектурний підхід

**Основа:** Next.js 14 App Router з TypeScript

**Ключові принципи:**
- **File-based routing** - структура файлів визначає маршрути
- **Server-first** - переважно серверні компоненти
- **Static generation** - статична генерація сторінок при збірці
- **Zero-runtime overhead** - мінімальний JavaScript на клієнті

### 1.2 Архітектурна парадигма

```
┌─────────────────────────────────────────────┐
│          NEXT.JS APP ROUTER                 │
│                                             │
│  ┌─────────────┐         ┌──────────────┐  │
│  │   Server    │────────▶│   Client     │  │
│  │ Components  │         │ Components   │  │
│  │  (Default)  │         │ ("use client")│  │
│  └─────────────┘         └──────────────┘  │
│         │                        │          │
│         ▼                        ▼          │
│  ┌─────────────────────────────────────┐   │
│  │      Static HTML + Hydration        │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### 1.3 Типи компонентів

#### 1.3.1 Server Components (за замовчуванням)
**Призначення:** Рендеринг на сервері, доступ до файлової системи, БД

**Переваги:**
- ✅ Менший bundle розмір
- ✅ Прямий доступ до файлів/БД
- ✅ SEO-friendly
- ✅ Швидке завантаження

**Приклади:**
```typescript
// app/page.tsx
export default async function HomePage() {
  const t = await getTranslations(locale); // Server-side
  return <div>{t.title}</div>;
}

// app/documentation/page.tsx
export default function DocumentationPage() {
  const { t } = useTranslations(); // ❌ Помилка - це клієнтська логіка
}
```

**Файли-приклади:**
- `app/page.tsx`
- `app/registers/[slug]/page.tsx`
- `app/layout.tsx`

#### 1.3.2 Client Components
**Ознака:** Директива `"use client"` на початку файлу

**Призначення:** Інтерактивність, hooks, браузерні API

**Приклади:**
```typescript
// app/components/Header.tsx
"use client"
import { useState, useEffect } from 'react'

export default function Header() {
  const [activeDropdown, setActiveDropdown] = useState(null)
  const { t } = useTranslations() // ✅ Працює в клієнті
  
  return <header>...</header>
}
```

**Файли-приклади:**
- `app/components/Header.tsx`
- `app/components/Footer.tsx`
- `app/components/LanguageSwitcher.tsx`
- `app/components/DocumentCard.tsx`

### 1.4 Backend-логіка

#### 1.4.1 API Routes
**Розташування:** `app/api/`

**Приклад:**
```typescript
// app/api/registries/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  const file = path.join(process.cwd(), 'config', 'notebooks.json')
  const data = fs.readFileSync(file, 'utf-8')
  return NextResponse.json(JSON.parse(data))
}
```

**Доступні API:**
| Метод | URL | Призначення |
|-------|-----|-------------|
| `GET` | `/api/registries` | Список реєстрів для меню |

#### 1.4.2 Server Actions
**Статус:** ❌ Відсутні

У проєкті немає server actions (форми, мутації даних). Весь контент статичний.

#### 1.4.3 Middleware
**Статус:** ❌ Відсутній

Немає `middleware.ts` - локалізація реалізована через cookies та localStorage.

### 1.5 Принципи побудови

#### 1.5.1 Сторінки
```
app/
├── page.tsx                    # Головна (Server Component)
├── layout.tsx                  # Root Layout
├── documentation/
│   └── page.tsx                # Документація (Client Component)
└── registers/
    ├── page.tsx                # Статус реєстрів (Server Component)
    └── [slug]/page.tsx         # Деталі реєстру (Server Component)
```

**Патерн:**
1. **Server Component** - завантаження даних
2. **Client Component** - інтерактивність
3. **Hybrid** - Server Component передає дані клієнтським

#### 1.5.2 Конфігурації
```
config/
└── notebooks.json              # Єдине джерело даних про реєстри

locales/
├── ua.json                     # Українська локалізація
└── en.json                     # Англійська локалізація
```

**Принцип:** Single Source of Truth - одна конфігурація на всі сторінки

#### 1.5.3 Утиліти
```
lib/
├── i18n.ts                     # Server-side translations
└── useTranslations.ts          # Client-side translations hook
```

---

## 2. 📁 СТРУКТУРА ДИРЕКТОРІЙ (ДЕТАЛЬНА)

### 2.1 Корінь проєкту (`/`)

```
vscode-cerebras-chat/
│
├── .git/                       # Git репозиторій
├── .github/                    # GitHub Actions workflows
│   └── workflows/
│
├── .vscode/                    # VS Code налаштування
│   ├── settings.json
│   └── launch.json
│
├── archive/                    # Архівні файли
│   └── backups/
│       ├── page.tsx.bak
│       └── page.new.tsx
│
├── docs/                       # Технічна документація
│   ├── technical-spec.md
│   └── raw/
│       ├── section1_raw.md
│       └── section2_raw_part1.md
│
├── src/                        # VS Code extension (окремий проєкт)
│   ├── extension.ts
│   └── provider.ts
│
├── web/                        # ⭐ ОСНОВНИЙ NEXT.JS ДОДАТОК
│   └── (див. розділ 2.2)
│
├── dist/                       # Compiled extension output
├── node_modules/               # Залежності (корінь)
│
├── package.json                # Root package.json
├── tsconfig.json               # Root TypeScript config
├── esbuild.js                  # Build config для extension
├── eslint.config.mjs           # ESLint правила
│
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── SECURITY.md
├── SUPPORT.md
│
├── .gitignore
├── .vscodeignore
├── cerebras.png
├── logo.jpeg
└── project.prompt              # AI промпт для проєкту
```

**Ключові файли:**

| Файл | Призначення | Тип |
|------|-------------|-----|
| `package.json` | Конфігурація root проєкту | JSON |
| `tsconfig.json` | TypeScript налаштування | JSON |
| `esbuild.js` | Збірка VS Code extension | JavaScript |
| `eslint.config.mjs` | Правила лінтингу | ESModule |
| `project.prompt` | Промпт для AI | Text |

### 2.2 Web додаток (`web/`)

```
web/
│
├── app/                        # Next.js App Router
│   └── (див. розділ 2.3)
│
├── components/                 # Legacy компоненти (не використовуються)
│   └── (порожня або застаріла)
│
├── config/                     # Конфігураційні JSON
│   └── notebooks.json          # 128 рядків
│
├── lib/                        # Утиліти та хелпери
│   ├── i18n.ts                 # Server-side translations
│   └── useTranslations.ts      # Client-side hook
│
├── locales/                    # i18n файли
│   ├── ua.json                 # 357 рядків
│   └── en.json                 # 357 рядків
│
├── public/                     # Статичні ресурси
│   ├── images/                 # 15+ зображень
│   ├── documents/              # 29 документів
│   └── docs/                   # (порожньо)
│
├── pages/                      # Pages Router (НЕ використовується)
│   └── (порожня)
│
├── .next/                      # Build output (автогенерований)
│   ├── cache/
│   ├── server/
│   └── static/
│
├── node_modules/               # Залежності web-додатку
│
├── package.json                # Web package.json
├── tsconfig.json               # Web TypeScript config
├── next.config.js              # Next.js налаштування
├── tailwind.config.cjs         # Tailwind CSS
├── postcss.config.cjs          # PostCSS
│
├── next-env.d.ts               # Next.js type definitions
├── tsconfig.tsbuildinfo        # TypeScript incremental info
│
├── README.md
├── structure.txt               # Список структури
└── tree.txt                    # Дерево файлів
```

**Ключові файли:**

| Файл | Розмір | Призначення |
|------|--------|-------------|
| `package.json` | ~20 рядків | Залежності та скрипти |
| `tsconfig.json` | ~40 рядків | TypeScript конфігурація |
| `next.config.js` | ~6 рядків | Базова Next.js конфігурація |
| `tailwind.config.cjs` | ~9 рядків | Tailwind налаштування |
| `postcss.config.cjs` | ~8 рядків | PostCSS плагіни |

### 2.3 App директорія (`web/app/`)

```
app/
│
├── page.tsx                    # 🏠 Головна сторінка (Server)
├── layout.tsx                  # Root layout (Server)
├── globals.css                 # Глобальні стилі
│
├── components/                 # React компоненти
│   ├── DocumentCard.tsx        # Картка документа (Client)
│   ├── Footer.tsx              # Футер (Client)
│   ├── Header.tsx              # Хедер з навігацією (Client)
│   ├── HelpdeskLink.tsx        # Кнопка Helpdesk (Client)
│   ├── LanguageSwitcher.tsx    # Перемикач UA/EN (Client)
│   ├── RegisterCard.tsx        # Картка реєстру (Server)
│   └── UserSupportContent.tsx  # Контент підтримки (Server)
│
├── about/                      # 📘 Про нас
│   ├── ehealth/
│   │   └── page.tsx            # Про ДП е-Здоров'я (Client)
│   └── helpdesk/
│       └── page.tsx            # Про Helpdesk (Client)
│
├── documentation/              # 📚 Документація
│   ├── page.tsx                # Каталог документів (Client)
│   ├── faq/
│   │   └── page.tsx            # FAQ (Client)
│   ├── guidelines/
│   │   └── page.tsx            # Загальні настанови (Client)
│   └── regulatory/
│       └── page.tsx            # Нормативні документи (Client)
│
├── registers/                  # 📊 Реєстри
│   ├── page.tsx                # Статус реєстрів iframe grid (Server)
│   ├── page.new.tsx            # Резервна версія (не активна)
│   ├── page.tsx.bak            # Бекап
│   └── [slug]/
│       └── page.tsx            # Деталі реєстру (Server, dynamic)
│
├── registry/                   # Застаріла сторінка
│   └── page.tsx                # (не використовується)
│
├── api/                        # API Routes
│   └── registries/
│       └── route.ts            # GET /api/registries
│
└── test/                       # Тестова сторінка
    └── page.tsx                # Експериментальна (Client)
```

**Статистика:**
- **Всього файлів:** 20+ файлів
- **Server Components:** 4 файли
- **Client Components:** 13 файлів
- **API Routes:** 1 файл
- **Layouts:** 1 файл

### 2.4 Компоненти (`web/app/components/`)

**Повний список:**

| Компонент | Тип | Рядків коду | Призначення |
|-----------|-----|-------------|-------------|
| `DocumentCard.tsx` | Client | ~120 | Картка PDF/DOCX/XLSX/IMG |
| `Footer.tsx` | Client | ~25 | Футер з контактами |
| `Header.tsx` | Client | ~102 | Навігація + dropdown меню |
| `HelpdeskLink.tsx` | Client | ~60 | Посилання на Jira ServiceDesk |
| `LanguageSwitcher.tsx` | Client | ~58 | Перемикач UA/EN |
| `RegisterCard.tsx` | Server | ~35 | Картка реєстру з зображенням |
| `UserSupportContent.tsx` | Server | ~50 | FAQ та інструкції |

**Загальний обсяг:** ~450 рядків коду

### 2.5 Конфігурації (`web/config/`)

```
config/
└── notebooks.json              # 128 рядків
```

**Структура `notebooks.json`:**
```json
[
  {
    "slug": "ekopfo",                    // Унікальний ідентифікатор
    "title": "ЕКОПФО",                   // Назва (fallback)
    "description": "...",                // Опис (fallback)
    "statusUrl": "https://...",          // Instatus iframe
    "links": [                           // Посилання на сторінці реєстру
      {
        "label": "Аналітичний ШІ...",
        "url": "https://notebooklm...",  // NotebookLM
        "image": "/images/ai-ekopfo.webp"
      },
      {
        "label": "Підтримка користувачів",
        "url": "https://...atlassian...", // Jira ServiceDesk
        "image": "/images/Helpdesk.webp"
      }
    ]
  }
]
```

**Використання:**
- ✅ API: `/api/registries`
- ✅ Сторінка: `/registers/[slug]`
- ✅ Генерація маршрутів: `generateStaticParams()`
- ✅ Header dropdown меню

### 2.6 Утиліти (`web/lib/`)

#### 2.6.1 `i18n.ts` (Server-side)
```typescript
import fs from 'fs'
import path from 'path'

export async function getTranslations(locale: string) {
  const filename = locale === 'uk' ? 'ua.json' : `${locale}.json`
  const file = path.join(process.cwd(), 'locales', filename)
  const data = fs.readFileSync(file, 'utf-8')
  return JSON.parse(data)
}
```

**Використання:**
```typescript
// Server Component
const t = await getTranslations('uk')
<h1>{t.title}</h1>
```

#### 2.6.2 `useTranslations.ts` (Client-side)
```typescript
"use client"
import { useState, useEffect } from 'react'
import uaTranslations from '../locales/ua.json'
import enTranslations from '../locales/en.json'

export function useTranslations() {
  const [locale, setLocale] = useState('uk')
  const [t, setTranslations] = useState(uaTranslations)
  
  useEffect(() => {
    const storedLocale = getLocaleFromCookie()
    setLocale(storedLocale)
    setTranslations(translations[storedLocale])
  }, [])
  
  return { t, locale, setLocale }
}
```

**Використання:**
```typescript
// Client Component
"use client"
const { t, locale, setLocale } = useTranslations()
<h1>{t.title}</h1>
```

### 2.7 Локалізації (`web/locales/`)

```
locales/
├── ua.json                     # 357 рядків
└── en.json                     # 357 рядків
```

**Ключові секції:**
- `header` - 9 ключів
- `footer` - 3 ключі
- `registryCards` - 7 ключів
- `registryDetails` - 7 об'єктів
- `documentation.cards` - 12 об'єктів

### 2.8 Статичні ресурси (`web/public/`)

#### 2.8.1 `public/images/`

```
images/
├── Hero_ezdorovya.webp         # 1920x400, Hero-банер
├── Logo for Header.webp        # 200x200, Логотип
│
├── ai-ekopfo.webp              # 400x400, AI-іконка ЕКОПФО
├── ai-endoprosthesis.webp      # 400x400, AI-іконка Ендопротезування
├── ai-internatura.webp         # 400x400, AI-іконка Інтернатури
├── ai-vacancies.webp           # 400x400, AI-іконка Вакансій
├── ai-bpr.webp                 # 400x400, AI-іконка БПР
├── ai-ekrov.webp               # 400x400, AI-іконка е-Кров
├── ai-senikp.webp              # 400x400, AI-іконка СЕН ІКП
│
├── Helpdesk.webp               # 200x200, Іконка Helpdesk
├── Helpdesk team.webp          # 400x400, Команда Helpdesk
│
├── EKOPFO database model.png   # 2000x1500, Схема БД
├── Model_1_maintrack.svg       # Векторна схема основного флоу
├── Model_2_skarga.svg          # Векторна схема оскарження
│
└── preparation sources/        # Вихідні матеріали (PSD, AI)
    └── ...
```

**Типи файлів:**
- `.webp` - 13 файлів (оптимізовані зображення)
- `.svg` - 2 файли (векторна графіка)
- `.png` - 1 файл (схема БД)

#### 2.8.2 `public/documents/`

```
documents/
│
├── EKOPFO-new digital way.pdf  # 14.8 MB, Презентація
│
├── varinaty-tekhniki.pdf       # Методичка
├── prompting-oglyad.pdf        # Методичка
├── chek-list.docx              # Чеклист (DOCX)
├── dzr-dovidnyk.xlsx           # Довідник (XLSX)
│
└── Інструкція *.pdf            # 25 PDF-інструкцій українською
```

**Статистика:**
- **PDF:** 27 файлів (0.5 - 14.8 MB)
- **DOCX:** 1 файл (0.5 MB)
- **XLSX:** 1 файл (1.2 MB)
- **Загальний розмір:** ~20-25 MB

---

## 3. 🗺️ АРХІТЕКТУРА МАРШРУТИЗАЦІЇ

### 3.1 Статичні маршрути (File-based Routing)

**Таблиця маршрутів:**

| URL | Файл | Тип | Компонент |
|-----|------|-----|-----------|
| `/` | `app/page.tsx` | Server | HomePage |
| `/documentation` | `app/documentation/page.tsx` | Client | DocumentationPage |
| `/documentation/faq` | `app/documentation/faq/page.tsx` | Client | FAQPage |
| `/documentation/guidelines` | `app/documentation/guidelines/page.tsx` | Client | GuidelinesPage |
| `/documentation/regulatory` | `app/documentation/regulatory/page.tsx` | Client | RegulatoryPage |
| `/registers` | `app/registers/page.tsx` | Server | RegistersStatusPage |
| `/registry` | `app/registry/page.tsx` | Server | RegistryPage (deprecated) |
| `/about/ehealth` | `app/about/ehealth/page.tsx` | Client | EHealthPage |
| `/about/helpdesk` | `app/about/helpdesk/page.tsx` | Client | HelpdeskPage |
| `/test` | `app/test/page.tsx` | Client | TestPage |

**Всього статичних маршрутів:** 10

### 3.2 Динамічні маршрути

**Pattern:** `/registers/[slug]`

**Файл:** `app/registers/[slug]/page.tsx`

**Доступні slug:**

| Slug | URL | Назва реєстру |
|------|-----|---------------|
| `ekopfo` | `/registers/ekopfo` | ЕКОПФО |
| `endoprosthesis` | `/registers/endoprosthesis` | Ендопротезування |
| `internatura` | `/registers/internatura` | Інтернатура |
| `vacancies` | `/registers/vacancies` | Вакансії |
| `bpr` | `/registers/bpr` | Система Безперервного Розвитку |
| `ekrov` | `/registers/ekrov` | е-Кров |
| `sen-ikp` | `/registers/sen-ikp` | СЕН ІКП |

**Всього динамічних маршрутів:** 7

### 3.3 `generateStaticParams()` - Static Site Generation

**Код:**
```typescript
// app/registers/[slug]/page.tsx
export function generateStaticParams() {
  const items = Array.isArray(notebooks) ? notebooks : []
  return items.map((n) => ({ slug: n.slug }))
}
```

**Результат при збірці (`npm run build`):**
```bash
○ /registers/ekopfo
○ /registers/endoprosthesis
○ /registers/internatura
○ /registers/vacancies
○ /registers/bpr
○ /registers/ekrov
○ /registers/sen-ikp
```

**Переваги:**
- ✅ Всі 7 сторінок генеруються статично
- ✅ Instant page load (HTML вже готовий)
- ✅ SEO-friendly
- ✅ No runtime overhead

### 3.4 Root Layout - `app/layout.tsx`

**Код:**
```typescript
import './globals.css'
import { ReactNode } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'

export const metadata = {
  title: 'eHealth Portal',
  description: 'Інформаційний портал eHealth'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

**Структура:**
```
┌───────────────────────────────────┐
│          <Header />               │ ← Навігація + dropdown
├───────────────────────────────────┤
│                                   │
│         <main>                    │ ← Контент сторінки
│           {children}              │   (app/page.tsx, etc.)
│         </main>                   │
│                                   │
├───────────────────────────────────┤
│          <Footer />               │ ← Контакти + Helpdesk
└───────────────────────────────────┘
```

**Ролі:**
- ✅ Загальна структура HTML (`<html>`, `<body>`)
- ✅ Metadata (SEO: title, description)
- ✅ Глобальні компоненти (Header, Footer)
- ✅ Глобальні стилі (`globals.css`)
- ✅ Flexbox layout (Header + Main + Footer)

---

## 4. ⚛️ АРХІТЕКТУРА КОМПОНЕНТІВ

### 4.1 Повний список компонентів

| # | Компонент | Тип | Рядків | Призначення |
|---|-----------|-----|--------|-------------|
| 1 | `DocumentCard.tsx` | Client | 120 | Картка документа (PDF/DOCX/XLSX/IMG) |
| 2 | `Footer.tsx` | Client | 25 | Футер з контактами |
| 3 | `Header.tsx` | Client | 102 | Хедер з навігацією та dropdown |
| 4 | `HelpdeskLink.tsx` | Client | 60 | Кнопка посилання на Jira ServiceDesk |
| 5 | `LanguageSwitcher.tsx` | Client | 58 | Перемикач UA/EN |
| 6 | `RegisterCard.tsx` | Server | 35 | Картка реєстру з зображенням |
| 7 | `UserSupportContent.tsx` | Server | 50 | FAQ та інструкції підтримки |

**Загалом:** 7 компонентів, ~450 рядків коду

### 4.2 Деталі компонентів

#### 4.2.1 `DocumentCard.tsx` (Client Component)

**Призначення:** Картка для відображення документів (PDF, DOCX, XLSX) та зображень (IMG)

**Тип:** Client Component (`"use client"`)

**Використання:**
- `app/documentation/page.tsx` (12 карток)

**Пропси:**
```typescript
interface DocumentCardProps {
  title: string              // Назва документа
  description?: string       // Опис (тип файлу)
  fileType: 'PDF' | 'DOCX' | 'XLSX' | 'IMG'
  filePath?: string          // Шлях до файлу (/docs/*.pdf)
  fileSize?: string          // Розмір файлу (2.5 MB)
}
```

**Функціонал:**
- ✅ Відображення preview для IMG
- ✅ Іконка типу файлу для PDF/DOCX/XLSX
- ✅ Кольорове кодування (червоний/зелений/синій/жовтий)
- ✅ Відкриття файлу у новому вікні при кліку
- ✅ Hover-ефекти (shadow, underline)

---

## 5. 📊 АРХІТЕКТУРА ДАНИХ ТА КОНФІГУРАЦІЙ

### 5.1 Структура `config/notebooks.json`

**Розташування:** `web/config/notebooks.json`  
**Розмір:** 128 рядків  
**Формат:** JSON Array з 7 об'єктами

**Повна структура одного реєстру:**

```json
{
  "slug": "ekopfo",                          // Унікальний ідентифікатор для URL
  "title": "ЕКОПФО",                         // Назва (fallback якщо немає локалізації)
  "description": "Надані документи...",      // Опис (fallback)
  "statusUrl": "https://ekoppho.instatus.com", // URL для iframe моніторингу
  "links": [                                  // Масив посилань (відображаються картками)
    {
      "label": "Аналітичний ШІ по модулю ЕКОПФО",
      "url": "https://notebooklm.google.com/notebook/...",
      "image": "/images/ai-ekopfo.webp"
    },
    {
      "label": "Підтримка користувачів",
      "url": "https://e-health-ua.atlassian.net/servicedesk/...",
      "image": "/images/Helpdesk.webp"
    }
  ]
}
```

**TypeScript інтерфейс:**

```typescript
interface Registry {
  slug: string                    // 'ekopfo' | 'endoprosthesis' | ...
  title: string                   // Назва реєстру
  description?: string            // Опис системи
  statusUrl?: string              // URL Instatus iframe
  links?: RegistryLink[]          // Посилання на сторінці реєстру
}

interface RegistryLink {
  label: string                   // Текст кнопки
  url: string                     // URL посилання
  image?: string                  // Шлях до іконки
}
```

### 5.2 Завантаження конфігурацій у код

#### 5.2.1 Server-side завантаження (Static)

**Метод 1: Прямий імпорт (для Server Components)**

```typescript
// app/registers/[slug]/page.tsx
import notebooks from "../../../config/notebooks.json"

export default async function RegisterDetail({ params }) {
  const items = Array.isArray(notebooks) ? notebooks : []
  const item = items.find((n) => n.slug === params.slug)
  
  return <div>{item.title}</div>
}
```

**Переваги:**
- ✅ Статична типізація
- ✅ Build-time validation
- ✅ Zero runtime overhead

**Метод 2: File System (для API Routes)**

```typescript
// app/api/registries/route.ts
import fs from 'fs'
import path from 'path'

export async function GET() {
  const file = path.join(process.cwd(), 'config', 'notebooks.json')
  const data = fs.readFileSync(file, 'utf-8')
  const registries = JSON.parse(data)
  return NextResponse.json(registries)
}
```

**Переваги:**
- ✅ Динамічне читання з диску
- ✅ Можливість hot-reload
- ✅ RESTful API

### 5.3 Статичні vs Динамічні дані

#### 5.3.1 Статичні дані (Build-time)

**Що є статичним:**

| Дані | Джерело | Коли завантажується |
|------|---------|---------------------|
| Реєстри (slug, title) | `notebooks.json` | Build time (`npm run build`) |
| Локалізації (ua, en) | `locales/*.json` | Build time |
| Зображення | `public/images/` | Build time |
| Документи | `public/documents/` | Build time |
| Маршрути | `app/**/*.tsx` | Build time |

#### 5.3.2 Динамічні дані (Runtime)

**Що є динамічним:**

| Дані | Джерело | Коли завантажується |
|------|---------|---------------------|
| Instatus iframe | `https://*.instatus.com` | Runtime (client-side) |
| Jira ServiceDesk | `https://...atlassian.net` | Runtime (on click) |
| NotebookLM | `https://notebooklm.google.com` | Runtime (on click) |
| Локаль (UA/EN) | Cookie `NEXT_LOCALE` | Runtime (client-side) |

### 5.4 Зберігання посилань

#### 5.4.1 Instatus (Моніторинг статусу)

**Всі URL Instatus:**

| Реєстр | URL |
|--------|-----|
| ЕКОПФО | `https://ekoppho.instatus.com` |
| Ендопротезування | `https://endo.instatus.com/` |
| Інтернатура | `https://intern.instatus.com/` |
| Вакансії | `https://vacancy.instatus.com/` |
| БПР | `https://bpr-moh.instatus.com/` |
| е-Кров | `https://eblood.instatus.com/` |
| СЕН ІКП | `https://ensicp.instatus.com/` |

#### 5.4.2 Jira ServiceDesk (Підтримка користувачів)

**Структура URL:**

```
https://e-health-ua.atlassian.net/servicedesk/customer/portal/{portalId}/group/{groupId}/create/{requestType}
```

**Параметри:**

| Реєстр | Portal ID | Group ID | Request Type |
|--------|-----------|----------|--------------|
| ЕКОПФО | 32 | 88 | 296 |
| Ендопротезування | 33 | 89 | 299 |
| Інтернатура | 34 | - | - |
| Вакансії | 27 | - | - |
| БПР | 26 | - | - |
| е-Кров | 30 | 86 | 287 |
| СЕН ІКП | 31 | - | - |

#### 5.4.3 NotebookLM (AI аналітика)

**Всі Notebook ID:**

| Реєстр | Notebook ID |
|--------|-------------|
| ЕКОПФО | `5ed43304-90a2-4193-a706-daec18cc8e33` |
| Ендопротезування | `2ba648ae-a69d-4912-959f-cb04d3d7e383` |
| Інтернатура | `fc75d28d-509b-47e4-a3c0-8cff2a589ce7` |
| Вакансії | `e4ec4760-68d9-4ca2-a564-df02e0484ccf` |
| БПР | `7e2d73f0-ec55-4e20-926d-0e532db34a07` |
| е-Кров | `76d8e964-6d04-4a87-8515-187b66e3e3c2` |
| СЕН ІКП | `70c4d740-9fc0-4dfe-af5e-4a65a721b26b` |

---

## 6. 🌐 АРХІТЕКТУРА ЛОКАЛІЗАЦІЇ

### 6.1 Механізм локалізації (Server + Client)

**Гібридний підхід:**
- 🖥️ **Server Components** → `lib/i18n.ts` (файлова система)
- 💻 **Client Components** → `lib/useTranslations.ts` (статичний імпорт)

#### 6.1.1 Server-side локалізація

**Файл:** `lib/i18n.ts`

```typescript
import fs from 'fs'
import path from 'path'

export async function getTranslations(locale: string) {
  // Мапінг локалей: 'uk' → 'ua.json'
  const filename = locale === 'uk' ? 'ua.json' : `${locale}.json`
  const file = path.join(process.cwd(), 'locales', filename)
  
  try {
    const data = fs.readFileSync(file, 'utf-8')
    return JSON.parse(data)
  } catch (e) {
    // Fallback до української мови
    const fallback = path.join(process.cwd(), 'locales', 'ua.json')
    const data = fs.readFileSync(fallback, 'utf-8')
    return JSON.parse(data)
  }
}
```

**Переваги:**
- ✅ Zero JavaScript overhead на клієнті
- ✅ SEO-friendly (HTML вже з правильною мовою)
- ✅ Швидше завантаження (без fetch)

#### 6.1.2 Client-side локалізація

**Файл:** `lib/useTranslations.ts`

```typescript
"use client"
import { useState, useEffect } from 'react'
import uaTranslations from '../locales/ua.json'
import enTranslations from '../locales/en.json'

const translations = {
  uk: uaTranslations,
  en: enTranslations
}

export function useTranslations() {
  const [locale, setLocale] = useState('uk')
  const [t, setTranslations] = useState(uaTranslations)
  
  useEffect(() => {
    const storedLocale = getLocaleFromCookie()
    setLocale(storedLocale)
    setTranslations(translations[storedLocale])
  }, [])
  
  return { t, locale, setLocale }
}
```

**Переваги:**
- ✅ Реактивність (миттєва зміна мови)
- ✅ Синхронізація через cookie
- ✅ Працює без перезавантаження

### 6.2 Перемикач мов (`LanguageSwitcher.tsx`)

**Код:**

```typescript
"use client"
import { useState, useEffect } from 'react'

function setLocaleCookie(locale: string) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${60*60*24*365}`
}

export default function LanguageSwitcher() {
  const [locale, setLocale] = useState('uk')
  
  const change = (newLocale: string) => {
    setLocale(newLocale)
    setLocaleCookie(newLocale)      // ← Зберігання в cookie
    window.location.reload()        // ← Перезавантаження для SSR
  }
  
  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={() => change('uk')} 
        className={locale === 'uk' ? 'bg-sky-600 text-white' : 'text-sky-700'}
      >
        UA
      </button>
      <button 
        onClick={() => change('en')} 
        className={locale === 'en' ? 'bg-sky-600 text-white' : 'text-sky-700'}
      >
        EN
      </button>
    </div>
  )
}
```

---

## 7. 📄 АРХІТЕКТУРА РОБОТИ З ФАЙЛАМИ

### 7.1 Підключення файлів різних типів

#### 7.1.1 PDF файли

**Розташування:** `public/documents/*.pdf`

**Код:**
```typescript
const handleOpenDocument = () => {
  if (filePath) {
    window.open('/documents/varinaty-tekhniki.pdf', '_blank')
  }
}
```

#### 7.1.2 Типи файлів

| Тип | Колір бейджу | Emoji |
|-----|--------------|-------|
| PDF | `bg-red-500` (червоний) | 📄 |
| DOCX | `bg-green-500` (зелений) | 📝 |
| XLSX | `bg-blue-500` (синій) | 📊 |
| IMG | `bg-yellow-400` (жовтий) | 🖼️ |

### 7.2 Логіка `DocumentCard.tsx`

**Код компонента:**

```typescript
'use client'
import Image from 'next/image'

export default function DocumentCard({ title, fileType, filePath, fileSize }: DocumentCardProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PDF':  return 'bg-red-500'
      case 'DOCX': return 'bg-green-500'
      case 'XLSX': return 'bg-blue-500'
      case 'IMG':  return 'bg-yellow-400'
      default:     return 'bg-gray-500'
    }
  }
  
  const handleOpenDocument = () => {
    if (filePath) {
      window.open(filePath, '_blank')
    }
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border hover:shadow-lg transition-shadow">
      <div className={`${getTypeColor(fileType)} text-white px-4 py-2 font-bold text-sm`}>
        {fileType}
      </div>
      {/* Preview area, title, description, size */}
    </div>
  )
}
```

---

## 8. 🎨 АРХІТЕКТУРА СТИЛІВ

### 8.1 TailwindCSS

**Версія:** `3.4.7`

**Принципи:**
- ✅ Utility-first approach
- ✅ No custom CSS classes (майже)
- ✅ JIT (Just-In-Time) компіляція
- ✅ Purge unused styles (build-time optimization)

**Найчастіше використовувані класи:**

| Категорія | Класи | Призначення |
|-----------|-------|-------------|
| **Layout** | `flex`, `grid`, `container`, `mx-auto` | Flexbox, Grid, центрування |
| **Spacing** | `px-4`, `py-6`, `mb-8`, `gap-4` | Padding, Margin, Gap |
| **Typography** | `text-lg`, `font-bold`, `text-blue-600` | Розмір, вага, колір тексту |
| **Colors** | `bg-white`, `bg-sky-600`, `text-gray-500` | Фон та колір тексту |
| **Effects** | `shadow-md`, `hover:shadow-lg`, `transition-shadow` | Тіні та анімації |
| **Responsive** | `sm:grid-cols-2`, `md:grid-cols-3`, `lg:grid-cols-4` | Адаптивність |

### 8.2 Глобальні стилі (`globals.css`)

**Файл:** `app/globals.css`  
**Розмір:** 15 рядків

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body, #__next {
  height: 100%;
}

body {
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
}

.container {
  max-width: 1024px;
}
```

**Кастомна ширина контейнера:**
- Tailwind default: `max-width: 1280px`
- Custom: `max-width: 1024px`

---

## 9. 🔌 АРХІТЕКТУРА API

### 9.1 API Route: `/api/registries`

**Файл:** `app/api/registries/route.ts`  
**Метод:** `GET`

**Повний код:**

```typescript
import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export async function GET() {
  const file = path.join(process.cwd(), 'config', 'notebooks.json')
  try {
    const data = fs.readFileSync(file, 'utf-8')
    const registries = JSON.parse(data)
    
    // Return only slug and title for header menu
    const simplified = registries.map(r => ({ 
      slug: r.slug, 
      title: r.title 
    }))
    
    return NextResponse.json(simplified)
  } catch (e) {
    return NextResponse.json([], { status: 500 })
  }
}
```

### 9.2 Формат відповіді

**Success Response (200 OK):**

```json
[
  { "slug": "ekopfo", "title": "ЕКОПФО" },
  { "slug": "endoprosthesis", "title": "Ендопротезування" },
  { "slug": "internatura", "title": "Інтернатура" },
  { "slug": "vacancies", "title": "Вакансії" },
  { "slug": "bpr", "title": "Система Безперервного Розвитку" },
  { "slug": "ekrov", "title": "е-Кров" },
  { "slug": "sen-ikp", "title": "СЕН ІКП" }
]
```

**Розмір відповіді:**
- Compressed: ~200 bytes
- Uncompressed: ~350 bytes

---

## 10. 🔗 АРХІТЕКТУРА ІНТЕГРАЦІЙ

### 10.1 Instatus (Моніторинг статусу систем)

**Сервіс:** https://instatus.com  
**Метод:** iframe embedding

**Код інтеграції:**

```typescript
// app/registers/page.tsx
{registry.statusUrl && (
  <iframe
    src={registry.statusUrl}
    className="w-full h-[42vh] border-0"
    title={`${registry.title} status`}
    loading="lazy"
  />
)}
```

**Переваги:**
- ✅ Real-time updates (без reload сторінки)
- ✅ Автономний (працює навіть якщо Next.js недоступний)
- ✅ Професійний UI від Instatus

### 10.2 Jira ServiceDesk (Підтримка користувачів)

**Сервіс:** Atlassian Jira Service Management  
**Метод:** External links

**Код:**

```typescript
<a
  href={url}
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-2 px-4 py-3 rounded border"
>
  {children}
</a>
```

### 10.3 NotebookLM (AI аналітика)

**Сервіс:** Google NotebookLM  
**Метод:** External links

**Структура URL:**
```
https://notebooklm.google.com/notebook/{notebookId}
```

---

## 11. ⚙️ АРХІТЕКТУРА ЗБІРКИ ТА КОНФІГУРАЦІЙ

### 11.1 `next.config.js`

```javascript
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
```

### 11.2 `tsconfig.json`

**Ключові налаштування:**

```jsonc
{
  "compilerOptions": {
    "target": "ES2022",
    "strict": true,
    "jsx": "preserve",
    "noEmit": true,
    "plugins": [{ "name": "next" }]
  }
}
```

### 11.3 `package.json`

**Scripts:**

| Команда | Призначення |
|---------|-------------|
| `npm run dev` | Development server (port 3000) |
| `npm run build` | Production build |
| `npm start` | Production server |
| `npm run lint` | ESLint перевірка |

**Dependencies:**

```json
{
  "next": "14.0.0",
  "react": "18.2.0",
  "react-dom": "18.2.0"
}
```

**DevDependencies:**

```json
{
  "autoprefixer": "10.4.14",
  "postcss": "8.4.24",
  "tailwindcss": "3.4.7",
  "typescript": "5.1.6",
  "@types/react": "18.2.28",
  "@types/node": "20.4.2"
}
```

---

## 12. 🔍 ДОДАТКОВІ ТЕХНІЧНІ ДЕТАЛІ

### 12.1 Server Actions

**Статус:** ❌ Відсутні

Проєкт не має форм для створення/оновлення даних. Весь контент статичний (JSON + локалізації).

### 12.2 Middleware

**Статус:** ❌ Відсутній

Локалізація реалізована через Cookie + Client/Server-side хуки.

### 12.3 Edge Runtime

**Статус:** ❌ Не використовується

Проєкт використовує Node.js APIs (`fs.readFileSync`) та Static generation.

### 12.4 Оптимізація зображень

**Статус:** ⚠️ Часткова

**Використовується:**
- ✅ Next.js Image Component
- ✅ WebP формат (13 файлів)
- ✅ Lazy loading
- ✅ Responsive images

**Формати:**

| Формат | Кількість | Переваги |
|--------|-----------|----------|
| WebP | 13 файлів | Стиснення ~30% краще ніж JPG |
| SVG | 2 файли | Векторна графіка |
| PNG | 1 файл | Без втрат якості |

### 12.5 Redirects та Rewrites

**Статус:** ❌ Відсутні

Структура маршрутів стабільна, немає потреби в редиректах або проксі.

---

## 📊 ПІДСУМКОВА СТАТИСТИКА АРХІТЕКТУРИ

### Технічний стек

| Компонент | Версія | Призначення |
|-----------|--------|-------------|
| **Next.js** | 14.0.0 | React framework (App Router) |
| **React** | 18.2.0 | UI library |
| **TypeScript** | 5.1.6 | Type safety |
| **TailwindCSS** | 3.4.7 | CSS framework |

### Файлова структура

| Категорія | Кількість |
|-----------|-----------|
| **Сторінки (page.tsx)** | 11 статичних + 7 динамічних = 18 |
| **Компоненти** | 7 файлів (~450 рядків) |
| **API Routes** | 1 файл |
| **Конфігурації** | 6 файлів |
| **Локалізації** | 2 файли (357 рядків кожен) |
| **Зображення** | 15+ файлів |
| **Документи** | 29 файлів |

### Інтеграції

| Сервіс | Метод | Кількість |
|--------|-------|-----------|
| **Instatus** | iframe | 7 реєстрів |
| **Jira ServiceDesk** | External link | 7 порталів |
| **NotebookLM** | External link | 7 notebooks |

### Особливості архітектури

| Функція | Статус |
|---------|--------|
| Server Components | ✅ Використовуються |
| Client Components | ✅ Використовуються |
| API Routes | ✅ 1 route |
| Server Actions | ❌ Відсутні |
| Middleware | ❌ Відсутній |
| Edge Runtime | ❌ Не використовується |
| ISR | ❌ Не використовується |
| Image Optimization | ✅ Next/Image |
| Redirects | ❌ Відсутні |
| Rewrites | ❌ Відсутні |

---

**Дата створення:** 12 грудня 2025  
**Версія проєкту:** 0.1.0  
**Архітектура:** Next.js 14 App Router + Static Generation  
**Автор:** AI Assistant (Claude Sonnet 4.5)
