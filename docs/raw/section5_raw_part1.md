# 📋 ПАСПОРТ САЙТУ
## Розділ 5: Опис реєстрів (Registry Structure)

---

## 5.1. 📊 ЗАГАЛЬНА СТРУКТУРА РЕЄСТРІВ

### 5.1.1 Загальний підхід до побудови реєстрів

**Концепція централізованого сховища:**

Всі реєстри в системі побудовані за єдиним уніфікованим підходом, що забезпечує консистентність даних та спрощує їх підтримку. Замість розподілу інформації про реєстри по різних файлах або базах даних, використовується **централізований JSON-файл**, який слугує єдиним джерелом правди (Single Source of Truth) для всієї системи.

**Ключові принципи архітектури:**

```yaml
Централізація:
  - Один файл для всіх реєстрів: config/notebooks.json
  - Єдина точка редагування та оновлення даних
  - Версіонування через Git (історія змін)
  - Простота аудиту та відстеження модифікацій

Уніфікація:
  - Всі реєстри мають однакову структуру полів
  - Стандартизовані назви властивостей
  - Передбачувана поведінка системи
  - Легкість додавання нових реєстрів

Масштабованість:
  - Додати новий реєстр = додати об'єкт у масив
  - Не потрібні зміни коду компонентів
  - Автоматична генерація сторінок (SSG)
  - Без обмежень на кількість реєстрів

Type Safety:
  - TypeScript interface для валідації
  - Компіляційна перевірка типів
  - IDE автодоповнення
  - Захист від помилок на етапі розробки
```

**Місце в архітектурі проєкту:**

```
web/
├─ app/
│  ├─ page.tsx                    ← Використовує notebooks.json
│  ├─ registers/
│  │  ├─ page.tsx                 ← Використовує notebooks.json
│  │  └─ [slug]/
│  │     └─ page.tsx              ← Використовує notebooks.json
│  └─ components/
│     ├─ RegisterCard.tsx         ← Рендерить дані реєстру
│     └─ Header.tsx               ← Показує список реєстрів
│
├─ config/
│  └─ notebooks.json              ← ⭐ ЄДИНЕ ДЖЕРЕЛО ДАНИХ ⭐
│                                    (Single Source of Truth)
└─ locales/
   ├─ ua.json                     ← Переклади назв реєстрів
   └─ en.json                     ← English translations
```

### 5.1.2 Файл config/notebooks.json

**Розташування та призначення:**

```
Файл: web/config/notebooks.json
Тип: JSON Array
Формат: UTF-8
Кодування: JSON (RFC 8259)

Призначення:
├─ Зберігання метаданих про всі реєстри
├─ Конфігурація посилань (NotebookLM, Helpdesk, Instatus)
├─ Налаштування маршрутизації (slugs)
└─ Джерело для генерації статичних сторінок
```

**Структура файлу:**

```json
[
  {
    "slug": "ekopfo",
    "title": "ЕКОПФО",
    "description": "Надані документи описують систему управління...",
    "statusUrl": "https://ekoppho.instatus.com",
    "links": [
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
  },
  {
    "slug": "endoprosthesis",
    "title": "Ендопротезування",
    // ... аналогічна структура
  },
  // ... інші реєстри (загалом 7)
]
```

**Характеристики файлу:**

```yaml
Кількість реєстрів: 7
  - ekopfo (ЕКОПФО)
  - endoprosthesis (Ендопротезування)
  - internatura (Інтернатура)
  - vacancies (Вакансії)
  - bpr (БПР)
  - ekrov (е-Кров)
  - sen-ikp (СЕН ІКП)

Розмір: ~4 KB (мінімальний footprint)
Формат: Pretty-printed JSON (читабельний)
Валідація: TypeScript interface NotebookItem
Версіонування: Git history (всі зміни відстежуються)
```

**Переваги JSON-файлу над базою даних:**

```yaml
Простота:
  ✅ Не потрібен сервер БД
  ✅ Не потрібні міграції
  ✅ Легко редагувати вручну
  ✅ Версіонування через Git

Performance:
  ✅ Завантажується на етапі збірки
  ✅ Не потрібні runtime запити до БД
  ✅ Статична генерація сторінок
  ✅ Instant page loads

Portability:
  ✅ Працює на будь-якому хостингу
  ✅ Легко клонувати проєкт
  ✅ Не залежить від зовнішніх сервісів
  ✅ Офлайн-доступ для розробки

Обмеження:
  ⚠️ Не підходить для великих обсягів даних (>1000 items)
  ⚠️ Не підходить для частих оновлень (потребує rebuild)
  ⚠️ Всі дані публічні (в клієнтському коді)
  
Наш випадок:
  ✅ Мало реєстрів (7)
  ✅ Рідкі оновлення (нові реєстри раз на місяць)
  ✅ Публічна інформація (немає секретів)
  → JSON-файл ідеально підходить
```

### 5.1.3 Базова структура об'єкта реєстру

**TypeScript Interface:**

```typescript
interface NotebookItem {
  slug: string              // Унікальний ідентифікатор для URL
  title: string             // Назва реєстру (відображувана)
  description?: string      // Опис реєстру (необов'язковий)
  statusUrl?: string        // URL для Instatus iframe (необов'язковий)
  links?: {                 // Масив зовнішніх посилань (необов'язковий)
    label: string           // Назва посилання
    url: string             // URL посилання
    image?: string          // Зображення картки (необов'язковий)
  }[]
  instructions?: string[]   // Масив URL інструкцій (необов'язковий)
}
```

**ASCII-схема структури:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    REGISTRY OBJECT                              │
│                    (NotebookItem)                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  slug: "ekopfo"                                           │ │
│  │  ↑ REQUIRED                                               │ │
│  │  ↑ Unique identifier for URL                              │ │
│  │  ↑ Examples: "ekopfo", "endoprosthesis", "internatura"    │ │
│  │  ↑ Used in: /registers/ekopfo                             │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  title: "ЕКОПФО"                                          │ │
│  │  ↑ REQUIRED                                               │ │
│  │  ↑ Display name of the registry                           │ │
│  │  ↑ Shown in: Cards, Headers, Titles                       │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  description: "Надані документи описують систему..."      │ │
│  │  ↑ OPTIONAL                                               │ │
│  │  ↑ Full description of the registry                       │ │
│  │  ↑ Shown in: Registry detail pages                        │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  statusUrl: "https://ekoppho.instatus.com"                │ │
│  │  ↑ OPTIONAL                                               │ │
│  │  ↑ Instatus monitoring page URL                           │ │
│  │  ↑ Used in: Iframe on /registers + /registers/ekopfo      │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  links: [                                                 │ │
│  │    {                                                      │ │
│  │      label: "Аналітичний ШІ по модулю ЕКОПФО",           │ │
│  │      url: "https://notebooklm.google.com/...",           │ │
│  │      image: "/images/ai-ekopfo.webp"                     │ │
│  │    },                                                     │ │
│  │    {                                                      │ │
│  │      label: "Підтримка користувачів",                    │ │
│  │      url: "https://e-health-ua.atlassian.net/...",       │ │
│  │      image: "/images/Helpdesk.webp"                      │ │
│  │    }                                                      │ │
│  │  ]                                                        │ │
│  │  ↑ OPTIONAL (array of external links)                     │ │
│  │  ↑ Used in: Registry detail page cards                    │ │
│  │  ↑ Typical: 2 links (NotebookLM + Helpdesk)              │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  instructions: [                                          │ │
│  │    "https://docs.example.com/guide.pdf",                 │ │
│  │    "https://docs.example.com/manual.pdf"                 │ │
│  │  ]                                                        │ │
│  │  ↑ OPTIONAL (array of instruction URLs)                   │ │
│  │  ↑ Used in: Registry detail page (if present)             │ │
│  │  ↑ Currently: Not used in any registry                    │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.1.4 Опис полів реєстру

**Детальна таблиця полів:**

| Поле | Тип | Обов'язковість | Призначення | Приклад значення |
|------|-----|----------------|-------------|------------------|
| **slug** | `string` | **Обов'язкове** | Унікальний ідентифікатор для URL маршрутизації. Використовується в динамічному маршруті `/registers/[slug]`. Має бути URL-safe (без пробілів, тільки `a-z`, `0-9`, `-`). | `"ekopfo"`, `"endoprosthesis"`, `"sen-ikp"` |
| **title** | `string` | **Обов'язкове** | Назва реєстру, що відображається користувачу. Використовується в картках, заголовках, навігації. Може містити кириличні символи та спецсимволи. | `"ЕКОПФО"`, `"Ендопротезування"`, `"СЕН ІКП"` |
| **description** | `string \| undefined` | Необов'язкове | Детальний опис призначення та функціоналу реєстру. Відображається на сторінці деталей реєстру під заголовком. Може містити кілька речень. | `"Надані документи описують систему управління медичними справами пацієнтів..."` |
| **statusUrl** | `string \| undefined` | Необов'язкове | URL сторінки моніторингу Instatus. Якщо присутній, на сторінках `/registers` та `/registers/[slug]` відображається iframe з real-time статусом системи. | `"https://ekoppho.instatus.com"`, `"https://endo.instatus.com/"` |
| **links** | `array \| undefined` | Необов'язкове | Масив об'єктів з зовнішніми посиланнями. Кожне посилання містить: `label` (назва), `url` (адреса), `image` (опціональне зображення). Типово 2 посилання: NotebookLM (AI аналітика) + Helpdesk (підтримка). | `[{label: "Аналітичний ШІ...", url: "https://...", image: "/images/ai-ekopfo.webp"}, ...]` |
| **instructions** | `string[] \| undefined` | Необов'язкове | Масив URL-адрес інструкцій або документації. Якщо присутній, відображається секція з переліком посилань на документи. Наразі не використовується жодним реєстром. | `["https://docs.example.com/guide.pdf"]` |

**Обов'язкові vs необов'язкові поля:**

```typescript
// Мінімальний валідний об'єкт реєстру:
{
  "slug": "example",
  "title": "Приклад Реєстру"
}
// Цього достатньо для відображення на Home page

// Повнофункціональний об'єкт реєстру:
{
  "slug": "ekopfo",
  "title": "ЕКОПФО",
  "description": "Детальний опис...",
  "statusUrl": "https://ekoppho.instatus.com",
  "links": [
    { "label": "AI Analytics", "url": "...", "image": "..." },
    { "label": "Support", "url": "...", "image": "..." }
  ],
  "instructions": ["https://docs.example.com/guide.pdf"]
}
// Використовує всі можливості системи
```

### 5.1.5 Використання даних реєстрів на різних сторінках

**Сторінка 1: Home Page (`app/page.tsx`)**

```yaml
Використовувані поля:
  - slug: для генерації URL (/registers/ekopfo)
  - title: заголовок картки реєстру
  - description: опис на картці (якщо є)

Компонент: RegisterCard
Кількість карток: 7 (всі реєстри)

Flow:
  1. Завантажити notebooks.json
  2. Map через всі реєстри
  3. Рендерити RegisterCard для кожного
  4. При кліку → перехід на /registers/[slug]

Приклад:
  slug: "ekopfo" → href="/registers/ekopfo"
  title: "ЕКОПФО" → показується в картці
```

**Сторінка 2: Registers Page (`app/registers/page.tsx`)**

```yaml
Використовувані поля:
  - slug: фільтрація (тільки з statusUrl)
  - title: заголовок iframe (переклад через registryCards)
  - statusUrl: URL для iframe

Компонент: <iframe> (вбудований Instatus widget)
Кількість iframes: 7 (всі з statusUrl)

Flow:
  1. Завантажити notebooks.json
  2. Відфільтрувати: registries.filter(r => r.statusUrl)
  3. Рендерити grid з iframe для кожного
  4. Кожен iframe показує real-time статус

Приклад:
  statusUrl: "https://ekoppho.instatus.com"
    → <iframe src="https://ekoppho.instatus.com" />
```

**Сторінка 3: Registry Detail Page (`app/registers/[slug]/page.tsx`)**

```yaml
Використовувані поля:
  - slug: пошук реєстру в масиві
  - title: заголовок сторінки (Hero banner)
  - description: опис під заголовком
  - statusUrl: великий iframe (70vh) знизу
  - links: картки з посиланнями (NotebookLM, Helpdesk)
  - instructions: секція з інструкціями (якщо є)

Компонент: Повна сторінка з кількома секціями
Кількість: 1 сторінка на кожен slug

Flow:
  1. Отримати slug з URL params
  2. Знайти: item = notebooks.find(n => n.slug === params.slug)
  3. Якщо не знайдено → показати 404
  4. Рендерити всі секції з даними item

Приклад (ЕКОПФО):
  slug: "ekopfo" → пошук в масиві
  title: "ЕКОПФО" → Hero h1
  description: "Надані документи..." → paragraph
  statusUrl: "https://ekoppho.instatus.com" → iframe
  links[0]: NotebookLM → Analytics card
  links[1]: Helpdesk → Support card
```

**Візуальна схема використання:**

```
┌─────────────────────────────────────────────────────────────────┐
│                     notebooks.json                              │
│                     (7 registries)                              │
└──────────────┬──────────────────────────────────────────────────┘
               │
               ├─────────────────┬─────────────────┬──────────────┐
               ↓                 ↓                 ↓              ↓
         ┌──────────┐      ┌──────────┐     ┌──────────┐   ┌──────────┐
         │   Home   │      │Registers │     │ Registry │   │  Header  │
         │   Page   │      │   Page   │     │  Detail  │   │ Dropdown │
         └──────────┘      └──────────┘     └──────────┘   └──────────┘
              │                  │                │              │
         Uses: slug          Uses: slug      Uses: ALL      Uses: slug
               title               statusUrl       fields         title
               description         title
              │                  │                │              │
         ┌──────────┐      ┌──────────┐     ┌──────────┐   ┌──────────┐
         │ Register │      │  Iframe  │     │   Hero   │   │   Link   │
         │  Cards   │      │  Grid    │     │  Banner  │   │   Items  │
         │  (7x)    │      │  (7x)    │     │  +       │   │  (7x)    │
         │          │      │          │     │ Content  │   │          │
         └──────────┘      └──────────┘     └──────────┘   └──────────┘
```

**Залежності між сторінками:**

```
Home Page
   ↓ (click on RegisterCard)
Registry Detail Page (/registers/ekopfo)
   ↓ (can navigate to)
Registers Status Page (/registers)
   ↓ (same data source)
notebooks.json ← Single Source of Truth
```

### 5.1.6 Переваги уніфікованої структури

**Консистентність:**

```yaml
Всі реєстри виглядають однаково:
  ✅ Однакові картки на Home Page
  ✅ Однакові iframe на Registers Page
  ✅ Однакова структура Registry Detail Page
  ✅ Передбачувана навігація для користувачів

Результат:
  - Користувачі швидко вчаться працювати з системою
  - Немає сюрпризів у навігації
  - Професійний вигляд сайту
```

**Простота підтримки:**

```yaml
Додати новий реєстр:
  1. Відкрити config/notebooks.json
  2. Додати новий об'єкт у масив
  3. Заповнити поля (мінімум: slug + title)
  4. npm run build
  5. Деплой
  
Змінити дані існуючого реєстру:
  1. Відкрити config/notebooks.json
  2. Знайти потрібний об'єкт за slug
  3. Змінити поля
  4. npm run build
  5. Деплой

Не потрібно:
  ❌ Змінювати код компонентів
  ❌ Створювати нові файли
  ❌ Писати міграції БД
  ❌ Налаштовувати нові маршрути
```

**Масштабованість:**

```yaml
Поточний стан:
  - 7 реєстрів
  - 3 типи сторінок
  - 1 джерело даних

Майбутнє (легко масштабувати):
  - 20+ реєстрів → просто додати об'єкти
  - Нові типи посилань → додати поле links
  - Додаткові секції → нове опціональне поле
  - Все без breaking changes
```

**Type Safety:**

```typescript
// TypeScript перевіряє структуру на етапі компіляції
const notebooks = require('./config/notebooks.json') as NotebookItem[]

// IDE автодоповнення:
notebooks[0].slug        // ✅ autocomplete
notebooks[0].title       // ✅ autocomplete
notebooks[0].unknown     // ❌ Error: Property 'unknown' does not exist

// Захист від помилок:
const item = notebooks.find(n => n.slug === 'ekopfo')
if (item) {
  console.log(item.title)  // ✅ Safe access
}
```

---

**Дата створення:** 13 грудня 2025  
**Файл джерела:** `web/config/notebooks.json`  
**Кількість реєстрів:** 7  
**Interface:** NotebookItem (TypeScript)  
**Обов'язкові поля:** slug, title  
**Необов'язкові поля:** description, statusUrl, links, instructions  
**Використання:** Home Page, Registers Page, Registry Detail Pages, Header
