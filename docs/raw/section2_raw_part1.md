# 📋 ПАСПОРТ САЙТУ
## Розділ 2: Архітектура проєкту (Частина 1)

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

**Структура файлів:**
```json
{
  "siteTitle": "е-Здоров'я",
  "home": "Головна",
  "registries": "Реєстри",
  "documentation": "Документація",
  
  "header": {
    "siteTitle": "е-Здоров'я",
    "home": "Головна",
    "registries": "Реєстри",
    "documentation": "Документація",
    "aboutEHealth": "ДП е-Здоров'я",
    "helpdeskTeam": "Helpdesk team",
    "guidelines": "Загальні настанови",
    "regulatory": "Нормативні документи",
    "faq": "FAQ"
  },
  
  "footer": {
    "supportContact": "...",
    "helpdeskButton": "...",
    "copyright": "..."
  },
  
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
      "description": "...",
      "commentary": "...",
      "analyticsTitle": "...",
      "userSupportText": { ... }
    }
  },
  
  "documentation": {
    "title": "Документація",
    "subtitle": "Загальні матеріали та інструкції",
    "fileSize": "Розмір",
    "cards": {
      "promptTechniques": { "title": "...", "description": "..." },
      "prompting": { ... },
      "ekTeamsChecklist": { ... },
      "dzrReference": { ... },
      "ekopfoDatabaseModel": { ... },
      "statusModelCase": { ... },
      "statusModelVector": { ... },
      "statusModelImage": { ... },
      "document9": { ... },
      "document10": { ... },
      "document11": { ... },
      "document12": { ... }
    }
  },
  
  "ehealth": { ... },
  "helpdesk": { ... },
  "faq": { ... },
  "regulatory": { ... },
  "guidelines": { ... }
}
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

**Використання:**
- Header: `Logo for Header.webp`
- Hero blocks: `Hero_ezdorovya.webp`
- Register cards: `ai-*.webp`
- Documentation: `Model_*.svg`, `EKOPFO database model.png`

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
└── Інструкція *.pdf            # 25 PDF-інструкцій українською:
    ├── Інструкція АДМІНІСТРАТОРА ЗОЗ (ЕК).pdf
    ├── Інструкція АДМІНІСТРАТОРА СИСТЕМИ.pdf
    ├── Інструкція АДМІНІСТРАТОРА ЦЕНТРУ ОЦІНЮВАННЯ.pdf
    ├── Інструкція ГОЛОВИ ВЛК.pdf
    ├── Інструкція ГОЛОВУЮЧОГО ЕКСПЕРТНОЇ КОМАНДИ ЦО.pdf
    ├── Інструкція ГОЛОВУЮЧОГО ЕКСПЕРТНОЇ КОМАНДИ.pdf
    ├── Інструкція ЗАСТУПНИКА КЕРІВНИКА ЗОЗ (ЕК).pdf
    ├── Інструкція ЗАСТУПНИКА КЕРІВНИКА ЗОЗ.pdf
    ├── Інструкція ЗАСТУПНИКА КЕРІВНИКА ЦЕНТРУ ОЦІНЮВАННЯ.pdf
    ├── Інструкція КЕРІВНИКА ЗОЗ (ЕК).pdf
    ├── Інструкція КЕРІВНИКА ЗОЗ.pdf
    ├── Інструкція КЕРІВНИКА ЦЕНТРУ ОЦІНЮВАННЯ.pdf
    ├── Інструкція ЛІКУЮЧОГО ЛІКАРЯ.pdf
    ├── Інструкція РЕЄСТРАТОРА ЗОЗ (ПОМІЧНИК ЛЛ).pdf
    ├── Інструкція УПОВНОВАЖЕНИХ ПРАЦІВНИКІВ НАЦІОНАЛЬНОЇ ПОЛІЦІЇ-ДБР-СБУ-НАБУ.pdf
    ├── Інструкція УПОВНОВАЖЕНОЇ ОСОБИ МОЗ.pdf
    ├── Інструкція ЧЛЕНА ЕКСПЕРТНОЇ КОМАНДИ ЦО.pdf
    ├── Інструкція ЧЛЕНА ЕКСПЕРТНОЇ КОМАНДИ-ВІДПОВІДАЛЬНОГО ЗА ВЕДЕННЯ СПРАВ ЦО.pdf
    ├── Інструкція ЧЛЕНА ЕКСПЕРТНОЇ КОМАНДИ-ВІДПОВІДАЛЬНОГО ЗА ВЕДЕННЯ СПРАВ.pdf
    └── Інструкція ЧЛЕНА ЕКСПЕРТНОЇ КОМАНДИ.pdf
```

**Статистика:**
- **PDF:** 27 файлів (0.5 - 14.8 MB)
- **DOCX:** 1 файл (0.5 MB)
- **XLSX:** 1 файл (1.2 MB)
- **Загальний розмір:** ~20-25 MB

**Використання:**
- `app/documentation/page.tsx` - відображення карток
- `app/components/DocumentCard.tsx` - компонент картки

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

**Вкладені Layouts:**
- ❌ Відсутні - тільки один Root Layout

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

**Приклад використання:**
```typescript
<DocumentCard
  title="Варіанти техніки побудови промптів"
  description="Тип: PDF"
  fileType="PDF"
  filePath="/docs/prompt-techniques.pdf"
  fileSize="2.5 MB"
/>
```

---

**Дата створення:** 12 грудня 2025  
**Версія:** 0.1.0  
**Технології:** Next.js 14 + React 18 + TypeScript 5
