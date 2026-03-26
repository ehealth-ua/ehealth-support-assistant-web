# 📋 ПАСПОРТ САЙТУ
## Розділ 5: Опис реєстрів (Registry Structure)

---

## 5.2. 🔍 ДЕТАЛЬНА СТРУКТУРА ОБ'ЄКТА РЕЄСТРУ

### 5.2.1 Поле `slug` (Унікальний ідентифікатор)

**Опис:**  
Унікальний URL-безпечний ідентифікатор реєстру, що використовується для маршрутизації та ідентифікації в коді.

**Технічні характеристики:**

```yaml
Тип даних: string
Обов'язковість: REQUIRED (обов'язкове)
Унікальність: Кожен slug має бути унікальним у межах масиву
Формат: URL-safe string (lowercase, alphanumeric, hyphens)
Мінімальна довжина: 2 символи
Максимальна довжина: 50 символів (рекомендовано)
Регулярний вираз: ^[a-z0-9]+(?:-[a-z0-9]+)*$
```

**Допустимі значення:**

```typescript
// ✅ Валідні slugs
"ekopfo"           // Lowercase letters
"endoprosthesis"   // Lowercase letters (довге слово)
"sen-ikp"          // Hyphen-separated
"bpr"              // Абревіатура (коротко)
"e-krov"           // Початок з літери + hyphen

// ❌ Невалідні slugs
"EKOPFO"           // Uppercase (не URL-safe)
"екопфо"           // Cyrillic (не URL-safe)
"sen ikp"          // Пробіл (не URL-safe)
"sen_ikp"          // Underscore (працює, але не рекомендовано)
"123abc"           // Починається з цифри (працює, але не семантично)
""                 // Порожній рядок
```

**Приклади з реальних даних:**

```json
{
  "slug": "ekopfo",              // Електронна картка пацієнта
  "slug": "endoprosthesis",      // Ендопротезування
  "slug": "internatura",         // Інтернатура
  "slug": "vacancies",           // Вакансії
  "slug": "bpr",                 // БПР (абревіатура)
  "slug": "ekrov",               // е-Кров
  "slug": "sen-ikp"              // СЕН ІКП (з дефісом)
}
```

**Використання в коді:**

```typescript
// 1. Dynamic Route Parameter (Next.js)
// File: app/registers/[slug]/page.tsx
export default async function RegisterDetail({ 
  params 
}: { 
  params: { slug: string } 
}) {
  // params.slug = "ekopfo" (from URL /registers/ekopfo)
}

// 2. Static Params Generation (SSG)
export function generateStaticParams() {
  return notebooks.map((n) => ({ slug: n.slug }))
  // Returns: [{ slug: "ekopfo" }, { slug: "endoprosthesis" }, ...]
}

// 3. URL Construction (Links)
<Link href={`/registers/${registry.slug}`}>
  {/* href="/registers/ekopfo" */}
</Link>

// 4. Array Search
const item = notebooks.find((n) => n.slug === params.slug)
// Знаходить реєстр за slug з URL

// 5. Translation Key Lookup
const translatedTitle = t.registryCards?.[item.slug]
// Використовується як ключ для перекладів
```

**Обмеження та правила:**

```yaml
URL Constraints:
  - Має бути валідним URL segment
  - Не може містити: пробіли, спецсимволи (#, ?, &, /, \)
  - Case-sensitive в URL (але рекомендовано lowercase)
  - Browser automatically encodes invalid chars

Uniqueness:
  - MUST be unique across all registries
  - Дублікат slug → перезапише попередній у find()
  - No database constraint (JSON array)

SEO Considerations:
  - Краще використовувати описові слова
  - "ekopfo" краще ніж "reg1"
  - Hyphens краще ніж underscores для SEO
  - Google treats hyphens as word separators

Backwards Compatibility:
  - Зміна slug → broken links
  - Потребує redirect setup
  - Краще ніколи не змінювати slug
```

**Поведінка системи при відсутності:**

```typescript
// TypeScript interface вимагає slug:
interface NotebookItem {
  slug: string  // Required, no '?'
}

// Якщо slug відсутній:
const item = { title: "Test" }  // ❌ TypeScript Error
// Error: Property 'slug' is missing

// Runtime behavior (без slug):
notebooks.find((n) => n.slug === "ekopfo")
// Returns: undefined (не знайде через undefined === "ekopfo")

// Page won't render:
if (!item) {
  return <NotFoundPage />  // Shows error
}
```

---

### 5.2.2 Поле `title` (Назва реєстру)

**Опис:**  
Відображувана назва реєстру, що показується користувачам у всіх частинах інтерфейсу.

**Технічні характеристики:**

```yaml
Тип даних: string
Обов'язковість: REQUIRED (обов'язкове)
Формат: Plain text (може містити кирилицю, латиницю, цифри, спецсимволи)
Мінімальна довжина: 1 символ
Максимальна довжина: 100 символів (рекомендовано для UI)
Encoding: UTF-8
```

**Допустимі значення:**

```json
// ✅ Валідні titles
"ЕКОПФО"                           // Кирилиця uppercase
"Ендопротезування"                 // Кирилиця mixed case
"СЕН ІКП"                          // Абревіатура з пробілом
"е-Кров"                           // З дефісом
"БПР"                              // Абревіатура
"Інтернатура"                      // Повне слово
"Вакансії"                         // Множина

// ⚠️ Працює, але не рекомендовано
"Registry #123"                    // Спецсимволи (не семантично)
"Very Long Registry Name That Might Not Fit UI"  // Занадто довгий

// ❌ Невалідні
""                                 // Порожній рядок (технічно працює, але не має сенсу)
```

**Приклади з реальних даних:**

```json
{
  "slug": "ekopfo",
  "title": "ЕКОПФО"
}
{
  "slug": "endoprosthesis",
  "title": "Ендопротезування"
}
{
  "slug": "sen-ikp",
  "title": "СЕН ІКП"
}
```

**Використання в коді:**

```typescript
// 1. RegisterCard Title (Home Page)
// File: app/components/RegisterCard.tsx
<h3 className="text-xl font-bold">
  {registry.title}  {/* "ЕКОПФО" */}
</h3>

// 2. Hero Banner (Registry Detail Page)
// File: app/registers/[slug]/page.tsx
<h1 className="text-5xl font-bold text-white">
  {translatedTitle}  {/* Fallback: item.title */}
</h1>

// 3. Header Dropdown
// File: app/components/Header.tsx
registries.map(r => (
  <Link href={`/registers/${r.slug}`}>
    {getRegistryTitle(r)}  {/* Uses r.title or translation */}
  </Link>
))

// 4. Document Title (SEO)
<title>{translatedTitle} - eHealth Portal</title>

// 5. Translation Fallback
const translatedTitle = 
  t.registryCards?.[item.slug] || item.title
// Якщо переклад відсутній → використовується title
```

**Обмеження та правила:**

```yaml
UI Constraints:
  - Має вміщатися в картку (RegisterCard)
  - Рекомендована довжина: 5-30 символів
  - Занадто довгі назви → text overflow
  - Mobile: ще менше місця

i18n Considerations:
  - title є fallback для перекладів
  - Краще зберігати title українською (основна мова)
  - Переклади в locales/ua.json, locales/en.json
  - title не замінюється перекладами (використовується якщо переклад відсутній)

Accessibility:
  - Має бути описовим
  - Screen readers читають title
  - Краще "ЕКОПФО" ніж "Реєстр 1"
```

**Поведінка системи при відсутності:**

```typescript
// TypeScript interface вимагає title:
interface NotebookItem {
  title: string  // Required, no '?'
}

// Якщо title відсутній:
const item = { slug: "test" }  // ❌ TypeScript Error

// Runtime з порожнім title:
<h3>{registry.title}</h3>  
// Renders: <h3></h3> (порожній заголовок)

// Translation fallback не допоможе:
const translatedTitle = t.registryCards?.["ekopfo"] || item.title
// Якщо item.title = "" → translatedTitle = "" (порожній рядок falsy)
```

---

### 5.2.3 Поле `description` (Опис реєстру)

**Опис:**  
Детальний текстовий опис призначення та функціоналу реєстру.

**Технічні характеристики:**

```yaml
Тип даних: string | undefined
Обов'язковість: OPTIONAL (необов'язкове)
Формат: Plain text, може містити багато речень
Мінімальна довжина: 10 символів (якщо є)
Максимальна довжина: 500 символів (рекомендовано)
Encoding: UTF-8
```

**Приклади з реальних даних:**

```json
{
  "slug": "ekopfo",
  "title": "ЕКОПФО",
  "description": "Надані документи описують систему управління медичними справами пацієнтів, включаючи процеси створення, оцінювання та оскарження справ медико-соціальної експертизи (МСЕ) для отримання статусу особи з інвалідністю."
}

{
  "slug": "endoprosthesis",
  "title": "Ендопротезування",
  "description": "Надані документи описують електронну систему для управління чергою на ендопротезування в Україні, включаючи процеси реєстрації пацієнтів, формування черги, призначення операцій та моніторинг стану черги."
}

{
  "slug": "vacancies",
  "title": "Вакансії",
  "description": undefined  // Може бути відсутнє
}
```

**Використання в коді:**

```typescript
// 1. RegisterCard Description (Home Page)
// File: app/components/RegisterCard.tsx
{description && (
  <p className="text-gray-600 mb-4">
    {description}
  </p>
)}

// 2. Registry Detail Page (Main Description)
// File: app/registers/[slug]/page.tsx
{translatedDescription && (
  <p style={{ marginBottom: 24, fontSize: '1.1rem' }}>
    {translatedDescription}
  </p>
)}

// 3. Translation with Fallback
const registryDetails = t.registryDetails?.[item.slug]
const translatedDescription = 
  registryDetails?.description || item.description
// Priority: translation > JSON description

// 4. Meta Description (SEO)
<meta 
  name="description" 
  content={translatedDescription || `Інформація про ${translatedTitle}`}
/>
```

**Обмеження та правила:**

```yaml
Content Guidelines:
  - Має бути інформативним (не просто повторювати title)
  - Пояснювати призначення системи
  - Згадувати ключові функції
  - Уникати технічного жаргону (для користувачів)

Length Recommendations:
  - RegisterCard: 100-150 символів (обрізається текстом)
  - Registry Detail: 200-500 символів (повний опис)
  - Занадто короткий: не інформативний
  - Занадто довгий: користувач не читає

i18n:
  - Переклади в t.registryDetails.[slug].description
  - description JSON є fallback
  - Краще мати повний переклад в locales/
```

**Поведінка системи при відсутності:**

```typescript
// description є optional:
interface NotebookItem {
  description?: string  // Optional (з '?')
}

// Валідний об'єкт без description:
{
  "slug": "vacancies",
  "title": "Вакансії"
  // No description field ✅
}

// Conditional rendering:
{description && <p>{description}</p>}
// Якщо description = undefined → <p> не рендериться ✅

// Translation fallback:
const translatedDescription = 
  registryDetails?.description || item.description
// Якщо обидва undefined → translatedDescription = undefined

// Final conditional:
{translatedDescription && <p>{translatedDescription}</p>}
// Не рендериться якщо undefined ✅

// Result:
// - Registry Detail Page: секція опису відсутня
// - RegisterCard: тільки title (без опису)
// - Все працює коректно без description
```

---

### 5.2.4 Поле `statusUrl` (URL статус-моніторингу)

**Опис:**  
URL сторінки Instatus для відображення real-time статусу системи реєстру.

**Технічні характеристики:**

```yaml
Тип даних: string | undefined
Обов'язковість: OPTIONAL (необов'язкове)
Формат: Valid URL (HTTP/HTTPS)
Pattern: ^https?://[a-z0-9.-]+\.instatus\.com/?$
Протокол: https:// (рекомендовано) або http://
Domain: *.instatus.com (Instatus monitoring service)
```

**Приклади з реальних даних:**

```json
{
  "slug": "ekopfo",
  "statusUrl": "https://ekoppho.instatus.com"
}

{
  "slug": "endoprosthesis",
  "statusUrl": "https://endo.instatus.com/"
  // Trailing slash (обидва варіанти валідні)
}

{
  "slug": "internatura",
  "statusUrl": "https://intern.instatus.com/"
}

{
  "slug": "vacancies",
  "statusUrl": undefined  // Може бути відсутнє
}
```

**Використання в коді:**

```typescript
// 1. Registers Page - Status Dashboard
// File: app/registers/page.tsx
const withStatus = registries.filter(r => r.statusUrl)
// Фільтрує тільки реєстри з statusUrl

withStatus.map((r, idx) => (
  <div className="w-full h-[42vh]">
    <iframe 
      src={r.statusUrl}
      title={`${translatedTitle} - Status`}
    />
  </div>
))

// 2. Registry Detail Page - Large Status Section
// File: app/registers/[slug]/page.tsx
{item.statusUrl && (
  <section style={{ marginTop: 32 }}>
    <h2>Статус системи</h2>
    <iframe 
      src={item.statusUrl}
      style={{ height: '70vh', minHeight: '400px' }}
    />
  </section>
)}

// 3. URL Validation (implicit)
<iframe src={item.statusUrl} />
// Browser validates URL automatically
// Invalid URL → iframe shows error page
```

**Обмеження та правила:**

```yaml
URL Format:
  ✅ Valid:
    - https://ekoppho.instatus.com
    - https://endo.instatus.com/
    - http://test.instatus.com (працює, але не рекомендовано)
  
  ❌ Invalid:
    - "instatus.com" (без протоколу)
    - "https://example.com" (не Instatus)
    - "/status" (відносний URL)
    - "" (порожній рядок)

Instatus Service:
  - Кожен реєстр має свій Instatus subdomain
  - Pattern: https://{registry}.instatus.com
  - Instatus надає iframe-friendly widget
  - Показує: uptime, incidents, maintenance

Security:
  - HTTPS рекомендовано (захищене з'єднання)
  - Iframe sandbox автоматично (браузер)
  - No CORS issues (Instatus дозволяє iframe)
  - X-Frame-Options: ALLOWALL
```

**Поведінка системи при відсутності:**

```typescript
// statusUrl є optional:
interface NotebookItem {
  statusUrl?: string  // Optional
}

// Валідний об'єкт без statusUrl:
{
  "slug": "vacancies",
  "title": "Вакансії"
  // No statusUrl ✅
}

// Registers Page - Filter
const withStatus = registries.filter(r => r.statusUrl)
// Якщо statusUrl = undefined → виключається з масиву ✅
// На /registers не показується iframe для цього реєстру

// Registry Detail Page - Conditional
{item.statusUrl && (
  <section>
    <iframe src={item.statusUrl} />
  </section>
)}
// Якщо statusUrl = undefined → секція не рендериться ✅

// Result:
// - /registers: показує тільки реєстри з statusUrl (6 з 7)
// - /registers/vacancies: секція статусу відсутня
// - Все працює коректно без statusUrl
```

---

### 5.2.5 Поле `links` (Зовнішні посилання)

**Опис:**  
Масив об'єктів з посиланнями на зовнішні ресурси (NotebookLM, Helpdesk, документація).

**Технічні характеристики:**

```yaml
Тип даних: Array<LinkObject> | undefined
Обов'язковість: OPTIONAL (необов'язкове)
Формат: JSON Array of Objects
Мінімальна кількість: 0 (якщо є)
Максимальна кількість: Необмежено (типово 2-3)
```

**Link Object Structure:**

```typescript
interface LinkObject {
  label: string       // Назва посилання (REQUIRED)
  url: string         // URL посилання (REQUIRED)
  image?: string      // Шлях до зображення (OPTIONAL)
}
```

**Приклади з реальних даних:**

```json
{
  "slug": "ekopfo",
  "links": [
    {
      "label": "Аналітичний ШІ по модулю ЕКОПФО",
      "url": "https://notebooklm.google.com/notebook/5ed43304-90a2-4193-a706-daec18cc8e33",
      "image": "/images/ai-ekopfo.webp"
    },
    {
      "label": "Підтримка користувачів",
      "url": "https://e-health-ua.atlassian.net/servicedesk/customer/portal/32/group/88/create/296",
      "image": "/images/Helpdesk.webp"
    }
  ]
}

{
  "slug": "endoprosthesis",
  "links": [
    {
      "label": "Аналітичний ШІ по модулю Ендопротезування",
      "url": "https://notebooklm.google.com/notebook/2ba648ae-a69d-4912-959f-cb04d3d7e383",
      "image": "/images/ai-endoprosthesis.webp"
    },
    {
      "label": "Підтримка користувачів",
      "url": "https://e-health-ua.atlassian.net/servicedesk/customer/portal/33/group/89/create/299",
      "image": "/images/Helpdesk.webp"
    }
  ]
}
```

**Типові link patterns:**

```yaml
Analytics Link (NotebookLM):
  label: "Аналітичний ШІ по модулю {RegistryName}"
  url: "https://notebooklm.google.com/notebook/{notebook-id}"
  image: "/images/ai-{slug}.webp"
  Purpose: AI-powered documentation chat

Support Link (Helpdesk):
  label: "Підтримка користувачів"
  url: "https://e-health-ua.atlassian.net/servicedesk/..."
  image: "/images/Helpdesk.webp"
  Purpose: User support ticketing system

Documentation Link (rare):
  label: "Документація"
  url: "https://docs.example.com/..."
  image: "/images/docs.webp"
  Purpose: External documentation
```

**Використання в коді:**

```typescript
// 1. Registry Detail Page - Link Cards
// File: app/registers/[slug]/page.tsx
<section style={{ display: "grid", gridTemplateColumns: "..." }}>
  {(item.links || []).map((link, index) => {
    const isSupport = link.label === 'Підтримка користувачів'
    const isAnalytics = index === 0 && !isSupport
    const imgSize = isSupport ? 320 : 384
    
    return (
      <div key={link.url}>
        <a href={link.url} target="_blank">
          <span>{translatedLabel}</span>
        </a>
        {link.image && (
          <Image
            src={link.image}
            width={imgSize}
            height={imgSize}
          />
        )}
        {isAnalytics && <p>{translatedCommentary}</p>}
        {isSupport && <UserSupportContent {...} />}
      </div>
    )
  })}
</section>

// 2. Link Type Detection
const isSupport = link.label === 'Підтримка користувачів'
// Визначає тип картки за label

// 3. Translation
const translatedLabel = isSupport 
  ? t.registryPage?.userSupport 
  : (isAnalytics && translatedAnalyticsTitle) || link.label
```

**Обмеження та правила:**

```yaml
Array Rules:
  - Порожній масив [] валідний (але марний)
  - undefined означає відсутність links
  - Типово 2 елементи (Analytics + Support)
  - Порядок важливий: [0] = Analytics, [1] = Support

Link Object Validation:
  label:
    - REQUIRED (не може бути undefined)
    - String (не порожній)
    - Рекомендована довжина: 10-80 символів
  
  url:
    - REQUIRED (не може бути undefined)
    - Valid URL (http:// або https://)
    - External URL (відкривається в новій вкладці)
  
  image:
    - OPTIONAL (може бути undefined)
    - Path від /public (e.g., "/images/ai-ekopfo.webp")
    - Формати: .webp, .png, .jpg, .svg
    - Розміри: 320×320 або 384×384

URL Patterns:
  NotebookLM: https://notebooklm.google.com/notebook/{id}
  Atlassian: https://e-health-ua.atlassian.net/servicedesk/...
  Custom: будь-який валідний URL
```

**Поведінка системи при відсутності:**

```typescript
// links є optional:
interface NotebookItem {
  links?: { label: string; url: string; image?: string }[]
}

// Валідний об'єкт без links:
{
  "slug": "test",
  "title": "Test Registry"
  // No links ✅
}

// Safe access з fallback:
{(item.links || []).map((link, index) => (...))}
//              ↑ Fallback до [] якщо links = undefined

// Результат:
// - Якщо links = undefined → map через [] → 0 ітерацій
// - Grid залишається порожнім (0 карток)
// - Registry Detail Page показує тільки Hero + Description + Status
// - Секція links не рендериться

// Порожній масив:
{
  "links": []  // Valid, але марний
}
// map через [] → 0 ітерацій → те саме що undefined
```

---

### 5.2.6 Поле `instructions` (Інструкції)

**Опис:**  
Масив URL-адрес інструкцій або документації для реєстру.

**Технічні характеристики:**

```yaml
Тип даних: string[] | undefined
Обов'язковість: OPTIONAL (необов'язкове)
Формат: JSON Array of URL strings
Мінімальна кількість: 0 (якщо є)
Максимальна кількість: Необмежено (рекомендовано 5-10)
```

**Приклади (гіпотетичні, наразі не використовується):**

```json
{
  "slug": "ekopfo",
  "instructions": [
    "https://docs.e-health.gov.ua/ekopfo/user-guide.pdf",
    "https://docs.e-health.gov.ua/ekopfo/admin-manual.pdf",
    "https://docs.e-health.gov.ua/ekopfo/api-reference.pdf"
  ]
}

{
  "slug": "endoprosthesis",
  "instructions": undefined  // Не використовується
}
```

**Використання в коді:**

```typescript
// File: app/registers/[slug]/page.tsx
{item.instructions && item.instructions.length > 0 && (
  <section style={{ marginTop: 24 }}>
    <h2>{t.registryPage?.instructions || 'Інструкції'}</h2>
    <ul>
      {item.instructions.map((href) => (
        <li key={href}>
          <a href={href} target="_blank" rel="noopener noreferrer">
            {href}
          </a>
        </li>
      ))}
    </ul>
  </section>
)}

// Умова рендерингу:
// 1. item.instructions exists (not undefined)
// 2. item.instructions.length > 0 (not empty array)
```

**Обмеження та правила:**

```yaml
Array Validation:
  - Кожен елемент має бути валідним URL
  - Рекомендовано HTTPS
  - Можуть бути PDF, DOCX, або веб-сторінки
  - Порожній масив [] не має сенсу (краще undefined)

URL Format:
  - Абсолютні URL (https://...)
  - Зовнішні або внутрішні ресурси
  - Відкриваються в новій вкладці (_blank)

Current Usage:
  ⚠️ НАРАЗІ НЕ ВИКОРИСТОВУЄТЬСЯ
  - Жоден реєстр не має instructions
  - Код підготовлений для майбутнього використання
  - Готовий до додавання без змін коду
```

**Поведінка системи при відсутності:**

```typescript
// instructions є optional:
interface NotebookItem {
  instructions?: string[]
}

// Валідний об'єкт без instructions:
{
  "slug": "ekopfo",
  "title": "ЕКОПФО"
  // No instructions (typical) ✅
}

// Double conditional check:
{item.instructions && item.instructions.length > 0 && (
  <section>...</section>
)}

// Scenarios:
// 1. instructions = undefined
//    → First condition fails → section not rendered ✅

// 2. instructions = []
//    → First condition passes
//    → Second condition (length > 0) fails → section not rendered ✅

// 3. instructions = ["url1", "url2"]
//    → Both conditions pass → section rendered with links ✅

// Result: Instructions секція не показується для всіх реєстрів (поки що)
```

---

### 5.2.7 Приклад повного JSON-об'єкта реєстру

**ЕКОПФО (найбільш повний приклад):**

```json
{
  "slug": "ekopfo",
  "title": "ЕКОПФО",
  "description": "Надані документи описують систему управління медичними справами пацієнтів, включаючи процеси створення, оцінювання та оскарження справ медико-соціальної експертизи (МСЕ) для отримання статусу особи з інвалідністю. Система забезпечує електронний документообіг, автоматизацію процесів прийняття рішень, інтеграцію з реєстрами та платформами е-здоров'я, а також механізми підтримки користувачів через штучний інтелект (NotebookLM) та службу підтримки.",
  "statusUrl": "https://ekoppho.instatus.com",
  "links": [
    {
      "label": "Аналітичний ШІ по модулю ЕКОПФО",
      "url": "https://notebooklm.google.com/notebook/5ed43304-90a2-4193-a706-daec18cc8e33",
      "image": "/images/ai-ekopfo.webp"
    },
    {
      "label": "Підтримка користувачів",
      "url": "https://e-health-ua.atlassian.net/servicedesk/customer/portal/32/group/88/create/296",
      "image": "/images/Helpdesk.webp"
    }
  ]
}
```

**Мінімальний валідний об'єкт:**

```json
{
  "slug": "example",
  "title": "Приклад Реєстру"
}
```

**Анотований приклад з коментарями:**

```javascript
{
  // ═══════════════════════════════════════════════════════════
  // REQUIRED FIELDS (обов'язкові)
  // ═══════════════════════════════════════════════════════════
  
  "slug": "ekopfo",
  // Type: string (REQUIRED)
  // Usage: URL routing (/registers/ekopfo)
  // Rules: lowercase, alphanumeric, hyphens only
  // Unique: YES (must be unique across all registries)
  
  "title": "ЕКОПФО",
  // Type: string (REQUIRED)
  // Usage: Display name in UI (cards, headers, titles)
  // Rules: Any text (Cyrillic, Latin, symbols)
  // i18n: Falls back to this if translation missing
  
  // ═══════════════════════════════════════════════════════════
  // OPTIONAL FIELDS (необов'язкові)
  // ═══════════════════════════════════════════════════════════
  
  "description": "Надані документи описують систему...",
  // Type: string | undefined (OPTIONAL)
  // Usage: Detail page description, RegisterCard text
  // Rules: 100-500 chars recommended
  // i18n: Can be translated in locales/
  
  "statusUrl": "https://ekoppho.instatus.com",
  // Type: string | undefined (OPTIONAL)
  // Usage: Iframe src for status monitoring
  // Rules: Valid HTTPS URL, *.instatus.com domain
  // Behavior: If missing → no status section
  
  "links": [
    // Type: Array<LinkObject> | undefined (OPTIONAL)
    // Usage: External resource cards on detail page
    // Typical: 2 links (Analytics + Support)
    
    {
      "label": "Аналітичний ШІ по модулю ЕКОПФО",
      // Type: string (REQUIRED in link object)
      // Usage: Link card title
      
      "url": "https://notebooklm.google.com/notebook/...",
      // Type: string (REQUIRED in link object)
      // Usage: Click destination (opens in new tab)
      
      "image": "/images/ai-ekopfo.webp"
      // Type: string | undefined (OPTIONAL in link object)
      // Usage: Card preview image (384×384 or 320×320)
    },
    {
      "label": "Підтримка користувачів",
      "url": "https://e-health-ua.atlassian.net/...",
      "image": "/images/Helpdesk.webp"
    }
  ],
  
  "instructions": undefined
  // Type: string[] | undefined (OPTIONAL)
  // Usage: List of instruction URLs (not currently used)
  // Future: PDF/DOCX links in separate section
}
```

---

### 5.2.8 Матриця поведінки системи при відсутності полів

**Таблиця впливу відсутніх полів:**

| Поле | Обов'язковість | Відсутнє значення | Вплив на Home Page | Вплив на /registers | Вплив на /registers/[slug] |
|------|----------------|-------------------|-------------------|---------------------|---------------------------|
| **slug** | REQUIRED | ❌ TypeScript Error | Не рендериться | Не рендериться | 404 Not Found |
| **title** | REQUIRED | ❌ TypeScript Error | Порожній заголовок | Порожній title iframe | Порожній h1 |
| **description** | OPTIONAL | ✅ undefined | Картка без опису | N/A | Секція опису відсутня |
| **statusUrl** | OPTIONAL | ✅ undefined | N/A | Реєстр не показується | Секція статусу відсутня |
| **links** | OPTIONAL | ✅ undefined або [] | N/A | N/A | Grid порожній (0 карток) |
| **instructions** | OPTIONAL | ✅ undefined або [] | N/A | N/A | Секція інструкцій відсутня |

**Детальні сценарії:**

```typescript
// ═══════════════════════════════════════════════════════════
// Scenario 1: Мінімальний валідний об'єкт
// ═══════════════════════════════════════════════════════════
{
  "slug": "minimal",
  "title": "Мінімальний Реєстр"
}

// Home Page: ✅ Показує картку з title
// /registers: ❌ Не показує (немає statusUrl)
// /registers/minimal: ✅ Показує тільки Hero banner (title)
//   - description: відсутня
//   - links: 0 карток
//   - statusUrl: секція відсутня
//   - instructions: секція відсутня

// ═══════════════════════════════════════════════════════════
// Scenario 2: Тільки для моніторингу
// ═══════════════════════════════════════════════════════════
{
  "slug": "monitoring",
  "title": "Система Моніторингу",
  "statusUrl": "https://monitoring.instatus.com"
}

// Home Page: ✅ Показує картку
// /registers: ✅ Показує iframe
// /registers/monitoring: ✅ Показує Hero + Status iframe
//   - description: відсутня
//   - links: 0 карток

// ═══════════════════════════════════════════════════════════
// Scenario 3: Повний об'єкт (всі поля)
// ═══════════════════════════════════════════════════════════
{
  "slug": "full",
  "title": "Повний Реєстр",
  "description": "Детальний опис...",
  "statusUrl": "https://full.instatus.com",
  "links": [...],
  "instructions": ["https://docs.example.com/guide.pdf"]
}

// Home Page: ✅ Картка з описом
// /registers: ✅ Iframe зі статусом
// /registers/full: ✅ Всі секції присутні
//   - Hero banner
//   - Description paragraph
//   - Links grid (2 cards)
//   - Status iframe
//   - Instructions list

// ═══════════════════════════════════════════════════════════
// Scenario 4: Broken Data (invalid)
// ═══════════════════════════════════════════════════════════
{
  "slug": "",              // ❌ Empty slug
  "title": "Invalid"
}
// Result: generateStaticParams() returns { slug: "" }
//         Next.js creates route: /registers/ (invalid)
//         URL /registers/invalid won't match

{
  "title": "No Slug"      // ❌ Missing slug
}
// Result: TypeScript Error at build time
//         Build fails ❌
```

---

**Дата створення:** 13 грудня 2025  
**Файл джерела:** `web/config/notebooks.json`  
**TypeScript Interface:** NotebookItem  
**Обов'язкові поля:** slug, title (2 з 6)  
**Необов'язкові поля:** description, statusUrl, links, instructions (4 з 6)  
**Поточний стан:** Всі 7 реєстрів мають slug, title, statusUrl, links  
**Не використовується:** instructions (0 з 7 реєстрів)
