# 📋 ПАСПОРТ САЙТУ
## Розділ 2: Архітектура проєкту (Частина 2)

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

#### 5.2.2 Client-side завантаження (Dynamic)

**Через API:**

```typescript
// app/components/Header.tsx
"use client"
import { useState, useEffect } from 'react'

export default function Header() {
  const [registries, setRegistries] = useState([])
  
  useEffect(() => {
    fetch('/api/registries')
      .then(res => res.json())
      .then(data => setRegistries(data))
  }, [])
  
  return <nav>{registries.map(...)}</nav>
}
```

**Переваги:**
- ✅ Реактивність (можливість оновлення без перезавантаження)
- ✅ Lazy loading (не блокує SSR)

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

**Генерація при збірці:**

```bash
npm run build
# Результат:
○ /registers/ekopfo         # Static HTML
○ /registers/endoprosthesis # Static HTML
○ /registers/internatura    # Static HTML
# ... всього 7 сторінок
```

#### 5.3.2 Динамічні дані (Runtime)

**Що є динамічним:**

| Дані | Джерело | Коли завантажується |
|------|---------|---------------------|
| Instatus iframe | `https://*.instatus.com` | Runtime (client-side) |
| Jira ServiceDesk | `https://...atlassian.net` | Runtime (on click) |
| NotebookLM | `https://notebooklm.google.com` | Runtime (on click) |
| Локаль (UA/EN) | Cookie `NEXT_LOCALE` | Runtime (client-side) |

**Приклад динамічного контенту:**

```typescript
// app/registers/page.tsx - iframe завантажується на клієнті
{item.statusUrl && (
  <iframe 
    src={item.statusUrl}              // ← Завантажується в браузері
    className="w-full h-[42vh]"
  />
)}
```

### 5.4 Зберігання посилань

#### 5.4.1 Instatus (Моніторинг статусу)

**Формат у `notebooks.json`:**

```json
{
  "slug": "ekopfo",
  "statusUrl": "https://ekoppho.instatus.com"
}
```

**Використання:**

```typescript
// app/registers/page.tsx - сітка iframe
<iframe src={registry.statusUrl} />

// app/registers/[slug]/page.tsx - повноекранний iframe
<iframe src={item.statusUrl} className="w-full h-[80vh]" />
```

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

**Формат у `notebooks.json`:**

```json
{
  "links": [
    {
      "label": "Підтримка користувачів",
      "url": "https://e-health-ua.atlassian.net/servicedesk/customer/portal/32/group/88/create/296",
      "image": "/images/Helpdesk.webp"
    }
  ]
}
```

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

**Використання:**

```typescript
// app/registers/[slug]/page.tsx
{(item.links || []).map(link => (
  <a href={link.url} target="_blank">
    <Image src={link.image} alt={link.label} />
    {link.label}
  </a>
))}
```

#### 5.4.3 NotebookLM (AI аналітика)

**Формат у `notebooks.json`:**

```json
{
  "links": [
    {
      "label": "Аналітичний ШІ по модулю ЕКОПФО",
      "url": "https://notebooklm.google.com/notebook/5ed43304-90a2-4193-a706-daec18cc8e33",
      "image": "/images/ai-ekopfo.webp"
    }
  ]
}
```

**Структура URL:**

```
https://notebooklm.google.com/notebook/{notebookId}
```

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

#### 5.4.4 Зображення (Icons)

**Формат у `notebooks.json`:**

```json
{
  "links": [
    {
      "image": "/images/ai-ekopfo.webp"
    }
  ]
}
```

**Патерн іменування:**

```
/images/ai-{slug}.webp
```

**Всі іконки AI:**

| Реєстр | Шлях до іконки |
|--------|----------------|
| ЕКОПФО | `/images/ai-ekopfo.webp` |
| Ендопротезування | `/images/ai-endoprosthesis.webp` |
| Інтернатура | `/images/ai-internatura.webp` |
| Вакансії | `/images/ai-vacancies.webp` |
| БПР | `/images/ai-bpr.webp` |
| е-Кров | `/images/ai-ekrov.webp` |
| СЕН ІКП | `/images/ai-senikp.webp` |

**Спільна іконка:**

```json
{
  "image": "/images/Helpdesk.webp"  // Для всіх Jira посилань
}
```

#### 5.4.5 PDF-файли (Документація)

**Формат у `page.tsx`:**

```typescript
// app/documentation/page.tsx
const documents: Document[] = [
  {
    key: 'promptTechniques',
    fileType: 'PDF',
    filePath: '/docs/prompt-techniques.pdf',  // Відносний шлях від public/
    fileSize: '2.5 MB',
  }
]
```

**Патерн іменування:**

```
/documents/{filename}.pdf
/docs/{filename}.pdf         # Альтернативна директорія (не використовується)
/images/{filename}.svg       # Для схем та діаграм
```

**Приклади:**

| Назва | Шлях | Розмір |
|-------|------|--------|
| EKOPFO New Digital Way | `/documents/EKOPFO-new digital way.pdf` | 14.8 MB |
| Промптинг (Огляд) | `/documents/prompting-oglyad.pdf` | 1.8 MB |
| Варіанти техніки | `/documents/varinaty-tekhniki.pdf` | 2.5 MB |
| Чек-лист | `/documents/chek-list.docx` | 0.5 MB |
| ДЗР довідник | `/documents/dzr-dovidnyk.xlsx` | 1.2 MB |

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

**Використання:**

```typescript
// app/registers/[slug]/page.tsx (Server Component)
import { cookies } from 'next/headers'
import { getTranslations } from '../../../lib/i18n'

export default async function RegisterDetail({ params }) {
  const c = cookies().get('NEXT_LOCALE')
  const locale = c?.value ?? 'uk'              // Читання з cookie
  const t = await getTranslations(locale)      // Завантаження JSON
  
  return <h1>{t.registryCards?.[params.slug]}</h1>
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

// Статичний імпорт (включено в bundle)
const translations = {
  uk: uaTranslations,
  en: enTranslations
}

function getLocaleFromCookie(): string {
  if (typeof document !== 'undefined') {
    const m = document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]*)/)
    return m ? decodeURIComponent(m[1]) : 'uk'
  }
  return 'uk'
}

export function useTranslations() {
  const [locale, setLocale] = useState('uk')
  const [t, setTranslations] = useState(uaTranslations)
  
  useEffect(() => {
    const storedLocale = getLocaleFromCookie()
    setLocale(storedLocale)
    setTranslations(translations[storedLocale])
  }, [])
  
  const switchLocale = (newLocale: string) => {
    setLocale(newLocale)
    setTranslations(translations[newLocale])
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60*60*24*365}`
  }
  
  return { t, locale, setLocale: switchLocale }
}
```

**Використання:**

```typescript
// app/components/Header.tsx (Client Component)
"use client"
import { useTranslations } from '../../lib/useTranslations'

export default function Header() {
  const { t, locale } = useTranslations()
  
  return <nav>{t.header?.home}</nav>
}
```

**Переваги:**
- ✅ Реактивність (миттєва зміна мови)
- ✅ Синхронізація через cookie
- ✅ Працює без перезавантаження

### 6.2 Структура ключів локалізації

**Файли:** `locales/ua.json`, `locales/en.json` (по 357 рядків)

**Повна схема:**

```json
{
  // Глобальні ключі (топ-рівень)
  "siteTitle": "е-Здоров'я",
  "home": "Головна",
  "registries": "Реєстри",
  "documentation": "Документація",
  "supportContact": "...",
  "helpdeskButton": "...",
  "copyright": "...",
  
  // Хедер
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
  
  // Футер
  "footer": {
    "supportContact": "За підтримкою зверніться до Helpdesk команди",
    "helpdeskButton": "Звернутися до Helpdesk",
    "copyright": "Державне підприємство «Електронне здоров'я»"
  },
  
  // Назви реєстрів (для меню та карток)
  "registryCards": {
    "ekopfo": "ЕКОПФО",
    "endoprosthesis": "Ендопротезування",
    "internatura": "Інтернатура",
    "vacancies": "Вакансії",
    "bpr": "Система Безперервного Розвитку",
    "ekrov": "е-Кров",
    "sen-ikp": "СЕН ІКП"
  },
  
  // Деталі реєстрів (для сторінок /registers/[slug])
  "registryDetails": {
    "ekopfo": {
      "description": "Електронна картка оцінки первинної професійної...",
      "commentary": "Додаткові коментарі...",
      "analyticsTitle": "Аналітика та звіти",
      "userSupportText": {
        "intro": "Якщо у вас виникли питання...",
        "chatsLabel": "Чати підтримки",
        "orText": "або",
        "formText": "заповніть форму",
        "faqIntro": "Часті питання:",
        "faqItems": ["Як зареєструватися?", "Як подати заявку?", ...],
        "instructionsText": "Інструкції користувача:",
        "links": [
          { "label": "Інструкція адміністратора", "href": "/documents/..." }
        ]
      }
    },
    // ... інші 6 реєстрів
  },
  
  // Сторінка статусу реєстрів
  "registers": {
    "title": "Реєстри – Статус",
    "catalogTitle": "Каталог реєстрів",
    "registersNotFound": "Реєстри не знайдено"
  },
  
  // Документація
  "documentation": {
    "title": "Документація",
    "subtitle": "Загальні матеріали та інструкції",
    "fileSize": "Розмір",                    // ← Для DocumentCard
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
  },
  
  // FAQ
  "faq": {
    "title": "FAQ",
    "subtitle": "Часті питання та відповіді",
    "sections": [...]
  },
  
  // Нормативні документи
  "regulatory": {
    "title": "Нормативні документи",
    "subtitle": "Закони, постанови, накази",
    "documents": [...]
  },
  
  // Загальні настанови
  "guidelines": {
    "title": "Загальні настанови",
    "subtitle": "Інструкції та рекомендації",
    "content": "..."
  },
  
  // Про е-Здоров'я
  "ehealth": {
    "title": "ДП «Електронне здоров'я»",
    "subtitle": "Про підприємство",
    "about": "...",
    "mission": "...",
    "values": [...]
  },
  
  // Про Helpdesk
  "helpdesk": {
    "title": "Helpdesk команда",
    "subtitle": "Служба підтримки користувачів",
    "description": "...",
    "contact": "..."
  }
}
```

**Статистика:**

| Секція | Кількість ключів | Призначення |
|--------|------------------|-------------|
| `header` | 9 | Навігація |
| `footer` | 3 | Контакти |
| `registryCards` | 7 | Назви реєстрів |
| `registryDetails` | 7 об'єктів | Деталі сторінок реєстрів |
| `documentation.cards` | 12 | Картки документів |
| `faq` | 10+ | FAQ секції |
| `regulatory` | 5+ | Нормативні документи |
| **Всього** | **~357 рядків** | Повна локалізація |

### 6.3 Підключення локалізації до компонентів

#### 6.3.1 Server Component

```typescript
// app/registers/page.tsx
import { cookies } from 'next/headers'
import { getTranslations } from '../../lib/i18n'

export default async function RegistersPage() {
  const c = cookies().get('NEXT_LOCALE')
  const locale = c?.value ?? 'uk'
  const t = await getTranslations(locale)        // ← Асинхронне завантаження
  
  return (
    <>
      <h1>{t.registers?.title}</h1>              {/* Реєстри – Статус */}
      <h2>{t.registers?.catalogTitle}</h2>       {/* Каталог реєстрів */}
    </>
  )
}
```

**Доступ до вкладених ключів:**

```typescript
t.registryCards?.ekopfo              // "ЕКОПФО"
t.registryDetails?.ekopfo?.description  // "Електронна картка..."
t.documentation?.cards?.prompting?.title // "Промптинг (Огляд)"
```

#### 6.3.2 Client Component

```typescript
// app/components/Header.tsx
"use client"
import { useTranslations } from '../../lib/useTranslations'

export default function Header() {
  const { t, locale } = useTranslations()      // ← React Hook
  
  return (
    <header>
      <Link href="/">{t.header?.home}</Link>   {/* Головна */}
      <Link href="/registers">{t.header?.registries}</Link> {/* Реєстри */}
    </header>
  )
}
```

**Optional chaining (`?.`):**

Використовується для безпечного доступу до вкладених ключів:

```typescript
t.header?.home          // ✅ Не викличе помилку якщо header === undefined
t.header.home           // ❌ Error: Cannot read property 'home' of undefined
```

### 6.4 Перемикач мов (`LanguageSwitcher.tsx`)

**Архітектура:**

```
┌─────────────────────────────────────┐
│      LanguageSwitcher.tsx           │
│                                     │
│  ┌───────┐        ┌───────┐        │
│  │  UA   │        │  EN   │        │
│  └───────┘        └───────┘        │
│      │                 │            │
│      └─────────┬───────┘            │
│                ▼                    │
│         setLocaleCookie()           │
│                │                    │
│                ▼                    │
│  Cookie: NEXT_LOCALE=uk/en          │
│                │                    │
│                ▼                    │
│         window.location.reload()    │
└─────────────────────────────────────┘
```

**Код:**

```typescript
"use client"
import { useState, useEffect } from 'react'

function setLocaleCookie(locale: string) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${60*60*24*365}`
}

export default function LanguageSwitcher() {
  const [locale, setLocale] = useState('uk')
  
  useEffect(() => {
    // Читання з cookie при mount
    const m = document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]*)/)
    if (m) setLocale(decodeURIComponent(m[1]))
  }, [])
  
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

**Потік даних:**

```
1. Користувач клікає "EN"
   ↓
2. setLocale('en')                  // React state
   ↓
3. setLocaleCookie('en')            // document.cookie
   ↓
4. window.location.reload()         // Повне перезавантаження
   ↓
5. Server читає cookie NEXT_LOCALE
   ↓
6. getTranslations('en')            // Завантаження en.json
   ↓
7. Рендеринг з англійською мовою
```

**Альтернативи (не використовуються):**

- ❌ `next-i18next` - складна бібліотека
- ❌ `react-intl` - зайвий overhead
- ❌ URL-based locale (`/en/registers`) - не SEO-friendly для України

---

## 7. 📄 АРХІТЕКТУРА РОБОТИ З ФАЙЛАМИ

### 7.1 Підключення файлів різних типів

#### 7.1.1 PDF файли

**Розташування:** `public/documents/*.pdf`

**Конфігурація:**

```typescript
// app/documentation/page.tsx
{
  key: 'promptTechniques',
  fileType: 'PDF',
  filePath: '/documents/varinaty-tekhniki.pdf',  // Відносний від public/
  fileSize: '2.5 MB',
}
```

**Відображення:**

```typescript
<DocumentCard
  title={t.documentation?.cards?.promptTechniques?.title}
  fileType="PDF"
  filePath="/documents/varinaty-tekhniki.pdf"
/>
```

**Як відкривається:**

```typescript
// Клік на назву → window.open()
const handleOpenDocument = () => {
  if (filePath) {
    window.open('/documents/varinaty-tekhniki.pdf', '_blank')
  }
}
```

#### 7.1.2 DOCX файли

**Розташування:** `public/documents/*.docx`

**Конфігурація:**

```typescript
{
  key: 'ekTeamsChecklist',
  fileType: 'DOCX',
  filePath: '/documents/chek-list.docx',
  fileSize: '0.5 MB',
}
```

**Колір бейджу:** `bg-green-500` (зелений)

#### 7.1.3 XLSX файли

**Розташування:** `public/documents/*.xlsx`

**Конфігурація:**

```typescript
{
  key: 'dzrReference',
  fileType: 'XLSX',
  filePath: '/documents/dzr-dovidnyk.xlsx',
  fileSize: '1.2 MB',
}
```

**Колір бейджу:** `bg-blue-500` (синій)

#### 7.1.4 IMG файли (Зображення)

**Розташування:** `public/images/*.svg`, `*.png`

**Конфігурація:**

```typescript
{
  key: 'statusModelCase',
  fileType: 'IMG',
  filePath: '/images/Model_1_maintrack.svg',
  fileSize: '0.2 MB',
}
```

**Відображення:**

```typescript
// Для IMG - показується preview
<Image
  src="/images/Model_1_maintrack.svg"
  alt="Статус-модель основного флоу справи"
  fill
  className="object-cover"
/>
```

**Колір бейджу:** `bg-yellow-400` (жовтий)

### 7.2 Логіка `DocumentCard.tsx`

**Повний алгоритм:**

```
┌─────────────────────────────────────────┐
│         DocumentCard.tsx                │
├─────────────────────────────────────────┤
│                                         │
│  Props:                                 │
│  - title: string                        │
│  - fileType: 'PDF' | 'DOCX' | 'XLSX' | 'IMG'
│  - filePath?: string                    │
│  - fileSize?: string                    │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  1. getTypeColor(fileType)              │
│     ├─ PDF  → bg-red-500                │
│     ├─ DOCX → bg-green-500              │
│     ├─ XLSX → bg-blue-500               │
│     └─ IMG  → bg-yellow-400             │
│                                         │
│  2. Render Preview Area                 │
│     ├─ if IMG: <Image src={filePath} />│
│     └─ else: emoji icon (📄📝📊🖼️)     │
│                                         │
│  3. Render Info                         │
│     ├─ Title (clickable)                │
│     ├─ Description                      │
│     └─ File Size                        │
│                                         │
│  4. handleOpenDocument()                │
│     └─ window.open(filePath, '_blank')  │
│                                         │
└─────────────────────────────────────────┘
```

**Код компонента:**

```typescript
'use client'
import Image from 'next/image'
import { useTranslations } from '../../lib/useTranslations'

interface DocumentCardProps {
  title: string
  description?: string
  fileType: 'PDF' | 'DOCX' | 'XLSX' | 'IMG'
  filePath?: string
  fileSize?: string
}

export default function DocumentCard({
  title,
  description,
  fileType,
  filePath,
  fileSize,
}: DocumentCardProps) {
  const { t } = useTranslations()
  
  // 1. Визначення кольору бейджу
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PDF':  return 'bg-red-500'
      case 'DOCX': return 'bg-green-500'
      case 'XLSX': return 'bg-blue-500'
      case 'IMG':  return 'bg-yellow-400'
      default:     return 'bg-gray-500'
    }
  }
  
  // 2. Обробка кліку - відкриття файлу
  const handleOpenDocument = () => {
    if (filePath) {
      window.open(filePath, '_blank')
    }
  }
  
  const isImageType = fileType === 'IMG'
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border hover:shadow-lg transition-shadow">
      
      {/* Бейдж типу файлу */}
      <div className={`${getTypeColor(fileType)} text-white px-4 py-2 font-bold text-sm`}>
        {fileType}
      </div>
      
      {/* Preview область (192px висота) */}
      <div className="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
        {filePath && isImageType ? (
          // Для IMG - показ зображення
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
          // Для PDF/DOCX/XLSX - emoji іконка
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
      
      {/* Інформація про документ */}
      <div className="p-4">
        <button
          onClick={handleOpenDocument}
          className="text-blue-600 hover:text-blue-800 font-semibold text-lg mb-2 text-left hover:underline cursor-pointer"
        >
          {title}
        </button>
        {description && (
          <p className="text-gray-600 text-sm mb-2">{description}</p>
        )}
        {fileSize && (
          <p className="text-gray-500 text-xs">
            {t.documentation?.fileSize || 'Розмір'}: {fileSize}
          </p>
        )}
      </div>
      
      {/* Іконка редагування (декоративна) */}
      <div className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 cursor-pointer">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </div>
    </div>
  )
}
```

### 7.3 Відкриття файлів у новому вікні

**Механізм:**

```typescript
const handleOpenDocument = () => {
  if (filePath) {
    window.open(filePath, '_blank')
  }
}
```

**Виклик:**

```typescript
<button onClick={handleOpenDocument}>
  {title}
</button>
```

**Поведінка браузера:**

| Тип файлу | Поведінка браузера |
|-----------|-------------------|
| **PDF** | Відкриття в PDF viewer (Chrome, Firefox) або download |
| **DOCX** | Download файлу (не може відкритися в браузері) |
| **XLSX** | Download файлу (не може відкритися в браузері) |
| **IMG** (SVG/PNG) | Відкриття зображення в новій вкладці |

**Альтернативи (не використовуються):**

```typescript
// ❌ Download атрибут (завантажує замість відкриття)
<a href={filePath} download>{title}</a>

// ❌ iframe (вбудований перегляд)
<iframe src={filePath} />

// ✅ window.open (відкриття в новій вкладці)
window.open(filePath, '_blank')
```

### 7.4 Визначення типу файлу та іконки

#### 7.4.1 Кольорове кодування

**Функція:**

```typescript
const getTypeColor = (type: string) => {
  switch (type) {
    case 'PDF':  return 'bg-red-500'      // Червоний
    case 'DOCX': return 'bg-green-500'    // Зелений
    case 'XLSX': return 'bg-blue-500'     // Синій
    case 'IMG':  return 'bg-yellow-400'   // Жовтий
    default:     return 'bg-gray-500'     // Сірий (fallback)
  }
}
```

**Візуалізація:**

```
┌─────────────────────┐
│   PDF (червоний)    │ bg-red-500
├─────────────────────┤
│   📄 PDF Icon       │
│                     │
│  Варіанти техніки   │
│  Тип: PDF           │
│  Розмір: 2.5 MB     │
└─────────────────────┘

┌─────────────────────┐
│  DOCX (зелений)     │ bg-green-500
├─────────────────────┤
│   📝 DOCX Icon      │
│                     │
│  Чек-лист для ЕК    │
│  Тип: DOCX          │
│  Розмір: 0.5 MB     │
└─────────────────────┘

┌─────────────────────┐
│  XLSX (синій)       │ bg-blue-500
├─────────────────────┤
│   📊 XLSX Icon      │
│                     │
│  ДЗР довідник       │
│  Тип: XLSX          │
│  Розмір: 1.2 MB     │
└─────────────────────┘

┌─────────────────────┐
│  IMG (жовтий)       │ bg-yellow-400
├─────────────────────┤
│  [SVG Preview]      │
│  Model_1_maintrack  │
│                     │
│  Статус-модель...   │
│  Тип: Зображення    │
│  Розмір: 0.2 MB     │
└─────────────────────┘
```

#### 7.4.2 Emoji іконки

**Мапінг:**

```typescript
<div className="text-6xl mb-2">
  {fileType === 'PDF' && '📄'}
  {fileType === 'DOCX' && '📝'}
  {fileType === 'XLSX' && '📊'}
  {fileType === 'IMG' && '🖼️'}
</div>
```

**Unicode символи:**

| Тип | Emoji | Unicode |
|-----|-------|---------|
| PDF | 📄 | U+1F4C4 |
| DOCX | 📝 | U+1F4DD |
| XLSX | 📊 | U+1F4CA |
| IMG | 🖼️ | U+1F5BC |

**Переваги emoji:**
- ✅ Zero dependencies (не потрібні іконки)
- ✅ Універсальна підтримка браузерів
- ✅ Кросплатформність (однаково виглядають)

---

## 8. 🎨 АРХІТЕКТУРА СТИЛІВ

### 8.1 TailwindCSS

**Версія:** `3.4.7`

**Конфігурація:** `tailwind.config.cjs`

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {}
  },
  plugins: []
}
```

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

**Приклад використання:**

```typescript
<div className="container mx-auto px-4 py-8">
  <h1 className="text-3xl font-bold text-blue-600 mb-8">
    Документація
  </h1>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {/* Картки */}
  </div>
</div>
```

**Декомпозиція класів:**

```
container          → max-width: 1024px (кастомно)
mx-auto            → margin-left: auto; margin-right: auto
px-4               → padding-left: 1rem; padding-right: 1rem
py-8               → padding-top: 2rem; padding-bottom: 2rem

text-3xl           → font-size: 1.875rem (30px)
font-bold          → font-weight: 700
text-blue-600      → color: #2563eb
mb-8               → margin-bottom: 2rem

grid               → display: grid
grid-cols-1        → grid-template-columns: repeat(1, minmax(0, 1fr))
sm:grid-cols-2     → @media (min-width: 640px) { grid-cols-2 }
md:grid-cols-3     → @media (min-width: 768px) { grid-cols-3 }
lg:grid-cols-4     → @media (min-width: 1024px) { grid-cols-4 }
gap-6              → gap: 1.5rem
```

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

**Пояснення:**

#### 8.2.1 Tailwind директиви

```css
@tailwind base;        /* Базові стилі (normalize, reset) */
@tailwind components;  /* Компонентні класи (якщо є) */
@tailwind utilities;   /* Utility класи (flex, px-4, etc.) */
```

#### 8.2.2 Повна висота сторінки

```css
html, body, #__next {
  height: 100%;
}
```

**Призначення:** Забезпечення sticky footer (Footer завжди внизу)

**Комбінується з:**

```typescript
// app/layout.tsx
<body className="min-h-screen flex flex-col">
  <Header />
  <main className="flex-1">...</main>  {/* flex-1 → розтягується */}
  <Footer />
</body>
```

#### 8.2.3 Шрифт

```css
body {
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
}
```

**Fallback stack:**
1. **Inter** - основний шрифт (якщо завантажено)
2. **ui-sans-serif** - системний UI шрифт
3. **system-ui** - ОС native шрифт
4. **-apple-system** - iOS/macOS San Francisco
5. **Segoe UI** - Windows
6. **Roboto** - Android
7. **Helvetica Neue** - Fallback
8. **Arial** - Universal fallback

**Примітка:** Inter шрифт **не завантажується** явно - використовується системний fallback.

#### 8.2.4 Кастомна ширина контейнера

```css
.container {
  max-width: 1024px;
}
```

**Override Tailwind default:**
- Tailwind default: `max-width: 1280px` (xl breakpoint)
- Custom: `max-width: 1024px`

**Призначення:** Компактніший контент на широких екранах

### 8.3 Кастомні класи та утиліти

**Статус:** ❌ Відсутні

**Пояснення:**
Проєкт використовує **виключно** Tailwind utility classes без створення кастомних CSS класів.

**Що НЕ використовується:**

```css
/* ❌ Немає кастомних компонентних класів */
.btn-primary { ... }
.card { ... }
.header-nav { ... }

/* ❌ Немає кастомних утиліт */
.text-shadow { ... }
.gradient-bg { ... }

/* ❌ Немає @apply директив */
.button {
  @apply px-4 py-2 bg-blue-500 text-white;
}
```

**Замість цього:**

```typescript
// ✅ Inline Tailwind classes
<button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
  Кнопка
</button>
```

**Переваги підходу:**
- ✅ Прозорість (все видно в JSX)
- ✅ Простота підтримки
- ✅ Менше абстракцій
- ✅ Легше кастомізувати окремі елементи

**Винятки:**

Єдиний кастом - override `.container` в `globals.css` (див. вище).

---

**Дата створення:** 12 грудня 2025  
**Версія:** 0.1.0  
**Технології:** Next.js 14 + TailwindCSS 3.4.7
