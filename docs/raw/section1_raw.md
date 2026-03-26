# 📋 ПАСПОРТ САЙТУ
## Розділ: Загальна інформація про сайт

---

## 1. 🗂️ СТРУКТУРА ПРОЄКТУ

### 1.1 Кореневі директорії
```
vscode-cerebras-chat/
├── .git/                    # Git репозиторій
├── .github/                 # GitHub workflows
├── .vscode/                 # VS Code налаштування
├── archive/                 # Архівні файли
├── docs/                    # Технічна документація
├── src/                     # Вихідний код VS Code розширення
├── web/                     # ⭐ Next.js веб-додаток (основний)
├── dist/                    # Скомпільовані файли
├── node_modules/            # Залежності (корінь)
├── package.json             # Конфігурація проєкту (корінь)
├── tsconfig.json            # TypeScript конфігурація (корінь)
└── esbuild.js               # Конфігурація збірки
```

### 1.2 Структура `web/` (основний додаток)
```
web/
├── app/                     # Next.js 14 App Router
├── components/              # Загальні компоненти (застарілі)
├── config/                  # Конфігураційні файли
├── lib/                     # Утиліти та хелпери
├── locales/                 # Мультимовні файли
├── public/                  # Статичні ресурси
├── pages/                   # (порожня, застаріла структура)
├── .next/                   # Build output (автогенерований)
├── node_modules/            # Залежності веб-додатку
├── package.json             # Конфігурація веб-додатку
├── tsconfig.json            # TypeScript конфігурація веб-додатку
├── next.config.js           # Next.js конфігурація
├── tailwind.config.cjs      # Tailwind CSS конфігурація
└── postcss.config.cjs       # PostCSS конфігурація
```

### 1.3 Структура `app/` (Next.js App Router)
```
app/
├── page.tsx                 # 🏠 Головна сторінка
├── layout.tsx               # Root layout (Header + Footer)
├── globals.css              # Глобальні стилі
│
├── components/              # ⚛️ React компоненти
│   ├── DocumentCard.tsx     # Картка документа
│   ├── Footer.tsx           # Футер сайту
│   ├── Header.tsx           # Хедер з навігацією
│   ├── HelpdeskLink.tsx     # Посилання на Helpdesk
│   ├── LanguageSwitcher.tsx # Перемикач мов (UA/EN)
│   ├── RegisterCard.tsx     # Картка реєстру
│   └── UserSupportContent.tsx # Контент підтримки
│
├── about/                   # 📘 Про нас
│   ├── ehealth/page.tsx     # Про ДП е-Здоров'я
│   └── helpdesk/page.tsx    # Про Helpdesk команду
│
├── documentation/           # 📚 Документація
│   ├── page.tsx             # Каталог документів (12 карток)
│   ├── faq/page.tsx         # FAQ
│   ├── guidelines/page.tsx  # Загальні настанови
│   └── regulatory/page.tsx  # Нормативні документи
│
├── registers/               # 📊 Реєстри
│   ├── page.tsx             # Статус реєстрів (iframe grid)
│   ├── page.new.tsx         # Нова версія (не використовується)
│   └── [slug]/page.tsx      # 🔗 Динамічний маршрут окремого реєстру
│
├── registry/                # (застаріла сторінка)
│   └── page.tsx
│
├── api/                     # API routes
│   └── registries/route.ts  # REST API для реєстрів
│
└── test/                    # Тестова сторінка
    └── page.tsx
```

### 1.4 Структура `public/`
```
public/
├── images/                  # 🖼️ Зображення
│   ├── Hero_ezdorovya.webp  # Hero-банер
│   ├── Logo for Header.webp # Логотип
│   ├── Helpdesk.webp        # Іконка підтримки
│   ├── Helpdesk team.webp   # Команда Helpdesk
│   ├── EKOPFO database model.png # Схема БД
│   ├── Model_1_maintrack.svg     # Статус-модель основного флоу
│   ├── Model_2_skarga.svg        # Статус-модель оскарження
│   ├── ai-*.webp            # Іконки AI-модулів (7 реєстрів)
│   └── preparation sources/ # Вихідні матеріали
│
├── documents/               # 📄 Документи
│   ├── EKOPFO-new digital way.pdf (14.8 MB)
│   ├── varinaty-tekhniki.pdf
│   ├── prompting-oglyad.pdf
│   ├── chek-list.docx
│   ├── dzr-dovidnyk.xlsx
│   └── Інструкція *.pdf     # 25 PDF-інструкцій
│
└── docs/                    # (пусто або застарілі)
```

### 1.5 Конфігураційні файли
```
✅ tsconfig.json             # TypeScript конфігурація
✅ next.config.js            # Next.js налаштування
✅ tailwind.config.cjs       # Tailwind CSS
✅ postcss.config.cjs        # PostCSS
✅ package.json              # Залежності та скрипти
✅ eslint.config.mjs         # ESLint правила
✅ .gitignore                # Git виключення
❌ .env                      # (відсутній - env змінні не використовуються)
```

---

## 2. 💻 ТЕХНОЛОГІЧНИЙ СТЕК

### 2.1 Основні технології
| Технологія | Версія | Призначення |
|------------|--------|-------------|
| **Next.js** | `14.0.0` | React фреймворк (App Router) |
| **React** | `18.2.0` | UI бібліотека |
| **React DOM** | `18.2.0` | React рендерінг |
| **TypeScript** | `5.1.6` | Типізація JavaScript |

### 2.2 Production Dependencies (`dependencies`)
```json
{
  "next": "14.0.0",
  "react": "18.2.0",
  "react-dom": "18.2.0"
}
```
**Примітка:** Мінімальна кількість залежностей - проєкт використовує тільки базовий Next.js стек без додаткових бібліотек.

### 2.3 Development Dependencies (`devDependencies`)
```json
{
  "autoprefixer": "10.4.14",        // PostCSS плагін
  "postcss": "8.4.24",              // CSS preprocessor
  "tailwindcss": "3.4.7",           // CSS framework
  "typescript": "5.1.6",            // TypeScript compiler
  "@types/react": "18.2.28",        // React типи
  "@types/node": "20.4.2"           // Node.js типи
}
```

### 2.4 Налаштування TypeScript
```typescript
{
  "target": "ES2022",                // Сучасний JavaScript
  "module": "ESNext",                // ESM модулі
  "moduleResolution": "Bundler",     // Next.js bundler
  "jsx": "preserve",                 // JSX для Next.js
  "strict": true,                    // Сувора перевірка типів
  "noEmit": true,                    // Без генерації JS (Next.js робить це)
  "isolatedModules": true            // Швидка компіляція
}
```

### 2.5 Налаштування Next.js
```javascript
const nextConfig = {
  reactStrictMode: true,  // Строгий режим React
}
```
**Примітка:** Базова конфігурація без додаткових налаштувань (image optimization, redirects, headers тощо).

---

## 3. 🗺️ ЛОГІКА МАРШРУТИЗАЦІЇ

### 3.1 Статичні маршрути (File-based routing)
| URL | Файл | Опис |
|-----|------|------|
| `/` | `app/page.tsx` | 🏠 Головна сторінка |
| `/documentation` | `app/documentation/page.tsx` | 📚 Каталог документів (12 карток) |
| `/documentation/faq` | `app/documentation/faq/page.tsx` | ❓ FAQ |
| `/documentation/guidelines` | `app/documentation/guidelines/page.tsx` | 📖 Загальні настанови |
| `/documentation/regulatory` | `app/documentation/regulatory/page.tsx` | 📜 Нормативні документи |
| `/registers` | `app/registers/page.tsx` | 📊 Статус реєстрів (7 iframe) |
| `/registry` | `app/registry/page.tsx` | (застаріла сторінка) |
| `/about/ehealth` | `app/about/ehealth/page.tsx` | 🏛️ Про ДП е-Здоров'я |
| `/about/helpdesk` | `app/about/helpdesk/page.tsx` | 💬 Про Helpdesk команду |
| `/test` | `app/test/page.tsx` | 🧪 Тестова сторінка |

### 3.2 Динамічні маршрути
```
/registers/[slug]  →  app/registers/[slug]/page.tsx
```

**Доступні slug:**
1. `/registers/ekopfo` - ЕКОПФО
2. `/registers/endoprosthesis` - Ендопротезування
3. `/registers/internatura` - Інтернатура
4. `/registers/vacancies` - Вакансії
5. `/registers/bpr` - Система Безперервного Розвитку
6. `/registers/ekrov` - е-Кров
7. `/registers/sen-ikp` - СЕН ІКП

**Генерація маршрутів:**
```typescript
export function generateStaticParams() {
  const items = notebooks; // з config/notebooks.json
  return items.map((n) => ({ slug: n.slug }));
}
```

### 3.3 API Routes
```
/api/registries  →  app/api/registries/route.ts
```
**Метод:** `GET`  
**Відповідь:** JSON з масивом реєстрів з `config/notebooks.json`

### 3.4 Layout структура
```
Root Layout (app/layout.tsx)
├── <Header />              # Навігація + перемикач мов
├── <main>{children}</main> # Контент сторінки
└── <Footer />              # Футер з контактами
```

**Особливості:**
- ✅ Єдиний Root Layout для всього сайту
- ✅ `lang="uk"` за замовчуванням
- ✅ Responsive design (Tailwind)
- ❌ Вкладені layout-и відсутні

---

## 4. 🔗 ІНТЕГРАЦІЇ З ЗОВНІШНІМИ РЕСУРСАМИ

### 4.1 Instatus.com (Моніторинг статусу систем)
**Призначення:** Відображення живого статусу реєстрів через iframe

**Використання:**
```typescript
// Файл: app/registers/page.tsx
<iframe src={registry.statusUrl} />

// Файл: app/registers/[slug]/page.tsx
{item.statusUrl && (
  <iframe src={item.statusUrl} />
)}
```

**Посилання на Instatus:**
| Реєстр | URL |
|--------|-----|
| ЕКОПФО | `https://ekoppho.instatus.com` |
| Ендопротезування | `https://endo.instatus.com/` |
| Інтернатура | `https://intern.instatus.com/` |
| Вакансії | `https://vacancy.instatus.com/` |
| БПР | `https://bpr-moh.instatus.com/` |
| е-Кров | `https://eblood.instatus.com/` |
| СЕН ІКП | `https://ensicp.instatus.com/` |

**Розташування в config:**
```json
// config/notebooks.json
{
  "slug": "ekopfo",
  "statusUrl": "https://ekoppho.instatus.com",
  ...
}
```

### 4.2 Atlassian Jira Service Desk (Підтримка користувачів)
**Призначення:** Посилання на портали техпідтримки кожного реєстру

**Використання:**
```typescript
// Файл: app/components/HelpdeskLink.tsx
<a href="https://e-health-ua.atlassian.net/servicedesk/customer/portals">

// Файл: app/about/helpdesk/page.tsx
<a href="https://e-health-ua.atlassian.net/servicedesk/customer/portals">

// Файл: config/notebooks.json (для кожного реєстру)
{
  "label": "Підтримка користувачів",
  "url": "https://e-health-ua.atlassian.net/servicedesk/customer/portal/32/..."
}
```

**Портали техпідтримки:**
| Реєстр | Portal ID | Група | Форма |
|--------|-----------|-------|-------|
| ЕКОПФО | `portal/32` | `group/88` | `create/296` |
| Ендопротезування | `portal/33` | `group/89` | `create/299` |
| Інтернатура | `portal/34` | - | - |
| Вакансії | `portal/27` | - | - |
| БПР | `portal/26` | - | - |
| е-Кров | `portal/30` | `group/86` | `create/287` |
| СЕН ІКП | `portal/31` | - | - |

### 4.3 Google NotebookLM (AI аналітичні модулі)
**Призначення:** Посилання на AI-асистентів для кожного реєстру

**Приклад:**
```json
{
  "label": "Аналітичний ШІ по модулю ЕКОПФО",
  "url": "https://notebooklm.google.com/notebook/5ed43304-90a2-4193-a706-daec18cc8e33"
}
```

**Розташування:** Використовується в картках на сторінках окремих реєстрів (`/registers/[slug]`)

---

## 5. 🌐 МЕХАНІЗМ ЛОКАЛІЗАЦІЇ

### 5.1 Файли локалізацій
```
locales/
├── ua.json  # Українська (основна, 357 рядків)
└── en.json  # Англійська (357 рядків)
```

### 5.2 Механізм роботи
**Бібліотека:** Власна реалізація (без i18n бібліотек)

**Серверна локалізація (`lib/i18n.ts`):**
```typescript
export async function getTranslations(locale: string) {
  const filename = locale === 'uk' ? 'ua.json' : `${locale}.json`;
  const file = path.join(process.cwd(), 'locales', filename);
  const data = fs.readFileSync(file, 'utf-8');
  return JSON.parse(data);
}
```

**Клієнтська локалізація (`lib/useTranslations.ts`):**
```typescript
export function useTranslations() {
  const [locale, setLocale] = useState('uk');
  const [t, setTranslations] = useState({});
  
  useEffect(() => {
    // Завантаження з cookies (NEXT_LOCALE)
    fetch(`/locales/${locale === 'uk' ? 'ua' : locale}.json`)
      .then(res => res.json())
      .then(setTranslations);
  }, [locale]);
  
  return { t, locale, setLocale };
}
```

**Зберігання локалі:**
- Cookie: `NEXT_LOCALE` (значення: `uk` або `en`)
- Компонент перемикача: `app/components/LanguageSwitcher.tsx`

### 5.3 Структура ключів локалізації
```json
{
  "siteTitle": "е-Здоров'я",
  "home": "Головна",
  "registries": "Реєстри",
  "documentation": "Документація",
  
  "header": { ... },          // Хедер
  "footer": { ... },          // Футер
  "registers": { ... },       // Сторінка статусу реєстрів
  "registryCards": { ... },   // Назви реєстрів (7 ключів)
  "registryDetails": { ... }, // Деталі реєстрів (7 об'єктів)
  "documentation": {
    "title": "Документація",
    "subtitle": "...",
    "fileSize": "Розмір",
    "cards": { ... }          // 12 карток документів
  },
  "ehealth": { ... },         // Сторінка про е-Здоров'я
  "helpdesk": { ... },        // Сторінка про Helpdesk
  "faq": { ... },
  "regulatory": { ... },
  "guidelines": { ... }
}
```

### 5.4 Використання на головних сторінках

**Головна сторінка (`app/page.tsx`):**
```typescript
const t = await getTranslations(locale);
<h1>{t.heroTitle}</h1>
<p>{t.heroSubtitle}</p>
```

**Сторінка реєстрів (`app/registers/page.tsx`):**
```typescript
const registryName = t.registryCards?.[registry.slug];
<h3>{registryName}</h3>
```

**Сторінка документації (`app/documentation/page.tsx`):**
```typescript
const translation = t.documentation?.cards?.[doc.key];
<h3>{translation.title}</h3>
<p>{translation.description}</p>
```

---

## 6. 📁 МЕХАНІЗМ РОБОТИ З ФАЙЛАМИ

### 6.1 Типи файлів у `public/`

#### 6.1.1 Зображення (`public/images/`)
| Тип | Формат | Призначення | Приклад |
|-----|--------|-------------|---------|
| **Hero-банери** | `.webp` | Фонові зображення | `Hero_ezdorovya.webp` |
| **Логотипи** | `.webp` | Брендинг | `Logo for Header.webp` |
| **Іконки** | `.webp` | AI-модулі, Helpdesk | `ai-ekopfo.webp`, `Helpdesk.webp` |
| **Схеми** | `.svg`, `.png` | Діаграми, моделі | `Model_1_maintrack.svg`, `EKOPFO database model.png` |

**Всього:** 15+ зображень

#### 6.1.2 Документи (`public/documents/`)
| Тип | Формат | Кількість | Розмір (приклад) |
|-----|--------|-----------|------------------|
| **PDF** | `.pdf` | 27 файлів | 0.5 - 14.8 MB |
| **DOCX** | `.docx` | 1 файл | 0.5 MB |
| **XLSX** | `.xlsx` | 1 файл | 1.2 MB |

**Всього:** 29 файлів

**Категорії PDF:**
- Інструкції користувачів (25 файлів) - українською
- Методичні матеріали (2 файли)
- Презентація (1 файл - 14.8 MB)

### 6.2 Підключення файлів у картках

#### 6.2.1 Компонент `DocumentCard.tsx`
```typescript
interface DocumentCardProps {
  title: string;
  description?: string;
  fileType: 'PDF' | 'DOCX' | 'XLSX' | 'IMG';
  filePath?: string;      // Шлях до файлу
  fileSize?: string;      // Розмір файлу
}

// Відкриття файлу в новому вікні
const handleOpenDocument = () => {
  if (filePath) {
    window.open(filePath, '_blank');
  }
};
```

#### 6.2.2 Конфігурація карток (`app/documentation/page.tsx`)
```typescript
const documents: Document[] = [
  {
    key: 'promptTechniques',
    fileType: 'PDF',
    filePath: '/docs/prompt-techniques.pdf',  // Відносний шлях
    fileSize: '2.5 MB',
  },
  {
    key: 'statusModelCase',
    fileType: 'IMG',
    filePath: '/images/Model_1_maintrack.svg',
    fileSize: '0.2 MB',
  },
  // ... інші картки
];
```

#### 6.2.3 Відображення зображень у картках
```typescript
// Для IMG типу - показ preview
{filePath && isImageType ? (
  <Image
    src={filePath}
    alt={title}
    fill
    className="object-cover"
  />
) : (
  // Для PDF/DOCX/XLSX - іконка типу файлу
  <div className="text-6xl">
    {fileType === 'PDF' && '📄'}
    {fileType === 'DOCX' && '📝'}
    {fileType === 'XLSX' && '📊'}
  </div>
)}
```

### 6.3 Кольорове кодування карток
```typescript
const getTypeColor = (type: string) => {
  switch (type) {
    case 'PDF':  return 'bg-red-500';    // Червоний
    case 'DOCX': return 'bg-green-500';  // Зелений
    case 'XLSX': return 'bg-blue-500';   // Синій
    case 'IMG':  return 'bg-yellow-400'; // Жовтий
    default:     return 'bg-gray-500';
  }
};
```

### 6.4 Динамічне завантаження конфігурацій
```typescript
// config/notebooks.json - конфігурація реєстрів
async function loadRegistries(): Promise<Registry[]> {
  const file = path.join(process.cwd(), 'config', 'notebooks.json');
  const data = fs.readFileSync(file, 'utf-8');
  return JSON.parse(data);
}
```

**Структура `notebooks.json`:**
```json
[
  {
    "slug": "ekopfo",
    "title": "ЕКОПФО",
    "description": "...",
    "statusUrl": "https://ekoppho.instatus.com",  // ← Instatus iframe
    "links": [
      {
        "label": "Аналітичний ШІ...",
        "url": "https://notebooklm.google.com/...", // ← NotebookLM
        "image": "/images/ai-ekopfo.webp"           // ← Локальне зображення
      },
      {
        "label": "Підтримка користувачів",
        "url": "https://e-health-ua.atlassian.net/...", // ← Jira
        "image": "/images/Helpdesk.webp"
      }
    ]
  }
]
```

---

## 📊 СТАТИСТИКА ПРОЄКТУ

| Метрика | Значення |
|---------|----------|
| **Сторінок (маршрутів)** | 11 статичних + 7 динамічних = **18 сторінок** |
| **React компонентів** | 7 компонентів |
| **Зображень** | 15+ файлів (SVG, PNG, WebP) |
| **Документів** | 29 файлів (PDF, DOCX, XLSX) |
| **Локалізацій** | 2 мови (UA, EN) |
| **Реєстрів** | 7 реєстрів |
| **Зовнішніх інтеграцій** | 3 сервіси (Instatus, Jira, NotebookLM) |
| **Рядків коду TypeScript** | ~2000+ рядків |
| **Конфігураційних файлів** | 6 файлів |

---

**Дата створення звіту:** 12 грудня 2025  
**Версія проєкту:** 0.1.0  
**Технологічний стек:** Next.js 14 + React 18 + TypeScript 5
