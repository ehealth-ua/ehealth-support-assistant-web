# 📋 ПАСПОРТ САЙТУ
## Розділ 5: Опис реєстрів (Registry Structure)

---

## 5.4. 🔗 ВЗАЄМОЗВ'ЯЗКИ МІЖ РЕЄСТРАМИ

### 5.4.1 Характер взаємозв'язків

**Незалежність на рівні даних:**

```yaml
Data Layer: NO DEPENDENCIES
  ❌ Реєстри не пов'язані між собою в даних
  ❌ Немає спільних ідентифікаторів (foreign keys)
  ❌ Немає залежностей у бізнес-логіці
  ❌ Немає sync між реєстрами
  ❌ Кожен реєстр — окрема незалежна система

Приклад:
  - ЕКОПФО не знає про Ендопротезування
  - Інтернатура не залежить від Вакансій
  - БПР не інтегрується з е-Кров
  - СЕН ІКП існує ізольовано від інших

Причина:
  Кожен реєстр вирішує окрему медичну задачу:
  - ЕКОПФО: МСЕ та інвалідність
  - Ендопротезування: черга на операції
  - Інтернатура: розподіл випускників
  - Вакансії: працевлаштування
  - БПР: освіта лікарів
  - е-Кров: донорство
  - СЕН ІКП: косметика

  Різні домени → немає потреби в зв'язках
```

**Взаємозв'язок на рівні інтерфейсу:**

```yaml
UI Layer: STRONG COUPLING
  ✅ Однакова структура даних (NotebookItem interface)
  ✅ Спільні UI-компоненти (RegisterCard, Header)
  ✅ Уніфіковані правила відображення
  ✅ Спільна система локалізації
  ✅ Єдина система моніторингу (Instatus)
  ✅ Консистентний UX по всіх реєстрах

Результат:
  Користувач бачить єдину систему, хоча
  фактично це 7 незалежних реєстрів з
  однаковим інтерфейсом.
```

**Архітектурна модель:**

```
┌──────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│                  (Спільний інтерфейс)                        │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  config/notebooks.json (Single Source of Truth)        │  │
│  │  ├─ ЕКОПФО                                             │  │
│  │  ├─ Ендопротезування                                   │  │
│  │  ├─ Інтернатура                                        │  │
│  │  ├─ Вакансії                                           │  │
│  │  ├─ БПР                                                │  │
│  │  ├─ е-Кров                                             │  │
│  │  └─ СЕН ІКП                                            │  │
│  └────────────────────────────────────────────────────────┘  │
│         ↓                                                     │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Shared UI Components                                  │  │
│  │  ├─ RegisterCard (Home Page)                           │  │
│  │  ├─ Header (Navigation)                                │  │
│  │  ├─ Footer (Support)                                   │  │
│  │  └─ Registry Detail Page Template                      │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────────┐
│                     DATA LAYER                               │
│                 (Незалежні системи)                          │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐            │
│  │ЕКОПФО  │  │ Ендо   │  │Інтерн. │  │Вакансії│            │
│  │Backend │  │Backend │  │Backend │  │Backend │            │
│  │   ❌───┼──┼────❌──┼──┼────❌──┼──┼────❌   │            │
│  └────────┘  └────────┘  └────────┘  └────────┘            │
│                                                              │
│  ┌────────┐  ┌────────┐  ┌────────┐                        │
│  │  БПР   │  │е-Кров  │  │СЕН ІКП │                        │
│  │Backend │  │Backend │  │Backend │                        │
│  │   ❌───┼──┼────❌──┼──┼────❌   │                        │
│  └────────┘  └────────┘  └────────┘                        │
│                                                              │
│  ❌ = No data connections (жодних зв'язків між backend)     │
└──────────────────────────────────────────────────────────────┘
```

### 5.4.2 Спільні елементи на рівні інтерфейсу

#### 5.4.2.1 Однакова структура JSON

**TypeScript Interface (спільний для всіх):**

```typescript
interface NotebookItem {
  slug: string                // ✅ Всі 7 реєстрів
  title: string               // ✅ Всі 7 реєстрів
  description?: string        // ✅ Всі 7 реєстрів
  statusUrl?: string          // ✅ Всі 7 реєстрів (100% coverage)
  links?: {                   // ✅ Всі 7 реєстрів (100% coverage)
    label: string
    url: string
    image?: string
  }[]
  instructions?: string[]     // ❌ Жоден реєстр (0% coverage)
}
```

**Консистентність структури:**

```yaml
Обов'язкові поля (використовуються всіма):
  - slug: 7/7 (100%)
  - title: 7/7 (100%)

Опціональні поля (використовуються всіма):
  - description: 7/7 (100%)
  - statusUrl: 7/7 (100%)
  - links: 7/7 (100%, завжди 2 links)

Опціональні поля (не використовуються):
  - instructions: 0/7 (0%)

Links Pattern (стабільний):
  links[0]: Analytics (NotebookLM)
    - label: "Аналітичний ШІ по модулю {RegistryName}"
    - url: https://notebooklm.google.com/notebook/{id}
    - image: /images/ai-{slug}.webp (384×384)
  
  links[1]: Support (Helpdesk)
    - label: "Підтримка користувачів"
    - url: https://e-health-ua.atlassian.net/servicedesk/customer/portal/{id}
    - image: /images/Helpdesk.webp (320×320)

Результат:
  Всі реєстри мають ідентичну структуру даних
  → Єдиний код може обробити всі реєстри
  → Немає спеціальних випадків (no special cases)
```

#### 5.4.2.2 Однакові UI-компоненти

**Спільні компоненти для всіх реєстрів:**

```typescript
// 1. RegisterCard (Home Page)
// File: app/components/RegisterCard.tsx
// Usage: Всі 7 реєстрів використовують однаковий компонент

<RegisterCard 
  slug={registry.slug}
  title={registry.title}
  description={registry.description}
/>

// Рендериться однаково для всіх:
// - Однакові розміри картки
// - Однакові стилі
// - Однакова структура (icon + title + description + link)
// - Однакова hover анімація

// 2. Header Dropdown (Navigation)
// File: app/components/Header.tsx
// Usage: Всі реєстри в одному dropdown меню

registries.map(r => (
  <Link href={`/registers/${r.slug}`}>
    {getRegistryTitle(r)}
  </Link>
))

// Рендериться однаково:
// - Однаковий font, розмір, колір
// - Однакова hover поведінка
// - Алфавітний порядок (опціонально)

// 3. Registry Detail Page Template
// File: app/registers/[slug]/page.tsx
// Usage: Єдиний шаблон для всіх реєстрів

Structure for all:
  ├─ Hero Banner (title)
  ├─ Description (paragraph)
  ├─ Links Grid (2 cards)
  │  ├─ Analytics Card (384×384)
  │  └─ Support Card (320×320 + UserSupportContent)
  └─ Status Section (iframe 70vh)

// Відмінності тільки в контенті, не в структурі

// 4. Status Iframe (Registers Page + Detail Page)
// Всі використовують однаковий iframe компонент:

<iframe
  src={registry.statusUrl}
  title={`${title} - Status`}
  style={{ height: '42vh' }}  // /registers
  // або
  style={{ height: '70vh' }}  // /registers/[slug]
/>

// Однакові параметри, тільки URL різний
```

**Переваги спільних компонентів:**

```yaml
Code Reuse:
  - 1 компонент RegisterCard для 7 реєстрів
  - 1 шаблон Detail Page для 7 реєстрів
  - Немає дублювання коду

Consistency:
  - Всі картки виглядають однаково
  - Всі detail pages мають ідентичну структуру
  - Користувач швидко вчиться навігації

Maintainability:
  - Зміна в 1 компоненті → оновлюються всі 7 реєстрів
  - Легко додати новий реєстр (без коду)
  - Bug fix в одному місці → фіксить для всіх
```

#### 5.4.2.3 Однакові правила локалізації

**i18n Structure (спільна для всіх):**

```json
// locales/ua.json
{
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
      "description": "Система управління медичними справами...",
      "analyticsTitle": "Аналітичний ШІ по модулю ЕКОПФО",
      "analyticsCommentary": "Використовуйте для пошуку..."
    },
    // ... інші реєстри (ідентична структура)
  }
}
```

**Fallback Chain (однаковий для всіх):**

```typescript
// Для кожного реєстру:
const translatedTitle = 
  t.registryCards?.[item.slug] ||  // 1. Переклад з локалізації
  item.title                        // 2. Fallback до JSON title

const translatedDescription = 
  t.registryDetails?.[item.slug]?.description ||  // 1. Переклад
  item.description                                 // 2. Fallback

// Всі реєстри використовують ідентичну логіку
// Немає спеціальних випадків
```

**Правила локалізації:**

```yaml
Translation Keys Pattern:
  registryCards.{slug}: Коротка назва для карток
  registryDetails.{slug}.description: Детальний опис
  registryDetails.{slug}.analyticsTitle: Назва Analytics
  registryDetails.{slug}.analyticsCommentary: Опис Analytics

Consistency Rules:
  ✅ Всі реєстри мають однакові ключі структури
  ✅ Всі fallback до JSON якщо переклад відсутній
  ✅ Всі підтримують UA + EN (двомовність)
  ✅ Немає hardcoded тексту в компонентах

Benefits:
  - Легко додати нову мову (весь текст в locales/)
  - Всі реєстри автоматично перекладаються
  - Консистентна термінологія
```

#### 5.4.2.4 Однакові правила рендерингу карток

**RegisterCard Rendering Rules (спільні):**

```typescript
// Всі реєстри використовують ідентичні правила:

// 1. Grid Layout
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
  {registries.map(r => <RegisterCard {...r} />)}
</div>

// Responsive:
// - Mobile (1 col): всі картки в стовпчик
// - Tablet (2 cols): 2 картки в ряд
// - Desktop (3 cols): 3 картки в ряд

// 2. Card Structure (однакова для всіх)
<div className="bg-white rounded-lg shadow-md p-6">
  <div className="w-16 h-16 bg-blue-100 rounded-full mb-4">
    <Icon />  {/* Однакова іконка для всіх */}
  </div>
  <h3 className="text-xl font-bold mb-2">
    {title}  {/* Різний контент, однакові стилі */}
  </h3>
  {description && (
    <p className="text-gray-600 mb-4">
      {description}
    </p>
  )}
  <Link href={`/registers/${slug}`}>
    <button className="text-blue-600 hover:text-blue-800">
      Детальніше →
    </button>
  </Link>
</div>

// 3. Card States (однакові для всіх)
// - Default: bg-white, shadow-md
// - Hover: shadow-lg, scale-105
// - Active: border-blue-500
// - Focus: ring-2 ring-blue-500

// 4. Icon (однакова для всіх реєстрів)
// Наразі всі використовують стандартну іконку
// Можна додати кастомні іконки без змін структури
```

#### 5.4.2.5 Однаковий підхід до статусів (Instatus)

**Instatus Integration Pattern:**

```yaml
All Registries Use:
  Provider: Instatus (https://instatus.com)
  URL Pattern: https://{subdomain}.instatus.com
  Display Method: <iframe> embedding
  Features:
    - Real-time status updates
    - Uptime percentage
    - Incident history
    - Maintenance schedules

Subdomain Convention:
  ekopfo: ekoppho (подвійна 'п')
  endoprosthesis: endo
  internatura: intern
  vacancies: vacancy
  bpr: bpr-moh (єдиний з суфіксом)
  ekrov: eblood
  sen-ikp: ensicp

Iframe Configuration (спільна):
  // /registers page
  <iframe
    src={statusUrl}
    title={`${title} - Status`}
    style={{
      width: '100%',
      height: '42vh',
      minHeight: '300px',
      border: 'none'
    }}
  />

  // /registers/[slug] page
  <iframe
    src={statusUrl}
    style={{
      width: '100%',
      height: '70vh',
      minHeight: '400px',
      border: 'none'
    }}
  />

Benefits:
  ✅ Єдиний провайдер для всіх
  ✅ Консистентний UI статусів
  ✅ Однакові метрики (uptime, latency)
  ✅ Централізований моніторинг
```

### 5.4.3 ASCII-схема взаємозв'язків

**Повна схема взаємодій:**

```
┌────────────────────────────────────────────────────────────────────────────┐
│                         REGISTRY ECOSYSTEM                                 │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │                    DATA SOURCE LAYER                                 │ │
│  │  ┌────────────────────────────────────────────────────────────────┐  │ │
│  │  │  config/notebooks.json (Single Source of Truth)                │  │ │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │  │ │
│  │  │  │ ЕКОПФО   │ │   Ендо   │ │ Інтерн.  │ │ Вакансії │          │  │ │
│  │  │  │ (object) │ │ (object) │ │ (object) │ │ (object) │          │  │ │
│  │  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │  │ │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐                       │  │ │
│  │  │  │   БПР    │ │  е-Кров  │ │ СЕН ІКП  │                       │  │ │
│  │  │  │ (object) │ │ (object) │ │ (object) │                       │  │ │
│  │  │  └──────────┘ └──────────┘ └──────────┘                       │  │ │
│  │  │  ↑ All have identical structure (NotebookItem interface)      │  │ │
│  │  └────────────────────────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                              ↓                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │                   SHARED COMPONENTS LAYER                            │ │
│  │  ┌────────────────────────────────────────────────────────────────┐  │ │
│  │  │  TypeScript Interface (NotebookItem)                           │  │ │
│  │  │  • Type safety for all registries                              │  │ │
│  │  │  • Compile-time validation                                     │  │ │
│  │  │  • IDE autocomplete                                            │  │ │
│  │  └────────────────────────────────────────────────────────────────┘  │ │
│  │  ┌────────────────────────────────────────────────────────────────┐  │ │
│  │  │  UI Components                                                 │  │ │
│  │  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │  │ │
│  │  │  │ RegisterCard │  │    Header    │  │    Footer    │        │  │ │
│  │  │  │  (reusable)  │  │  (dropdown)  │  │  (support)   │        │  │ │
│  │  │  └──────────────┘  └──────────────┘  └──────────────┘        │  │ │
│  │  │  Used by ALL 7 registries (100% sharing)                      │  │ │
│  │  └────────────────────────────────────────────────────────────────┘  │ │
│  │  ┌────────────────────────────────────────────────────────────────┐  │ │
│  │  │  Localization System (i18n)                                    │  │ │
│  │  │  ┌──────────────┐  ┌──────────────┐                           │  │ │
│  │  │  │ locales/ua   │  │ locales/en   │                           │  │ │
│  │  │  │    .json     │  │    .json     │                           │  │ │
│  │  │  └──────────────┘  └──────────────┘                           │  │ │
│  │  │  Identical structure for all registries                        │  │ │
│  │  └────────────────────────────────────────────────────────────────┘  │ │
│  │  ┌────────────────────────────────────────────────────────────────┐  │ │
│  │  │  Monitoring System (Instatus)                                  │  │ │
│  │  │  All use: <iframe src="{statusUrl}" />                         │  │ │
│  │  │  Consistent integration pattern                                │  │ │
│  │  └────────────────────────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                              ↓                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │                        PAGES LAYER                                   │ │
│  │  ┌────────────────────────────────────────────────────────────────┐  │ │
│  │  │  Home Page (/)                                                 │  │ │
│  │  │  Grid of RegisterCards for ALL 7 registries                   │  │ │
│  │  └────────────────────────────────────────────────────────────────┘  │ │
│  │  ┌────────────────────────────────────────────────────────────────┐  │ │
│  │  │  Registers Status Page (/registers)                           │  │ │
│  │  │  Grid of status iframes for ALL 7 registries                  │  │ │
│  │  └────────────────────────────────────────────────────────────────┘  │ │
│  │  ┌────────────────────────────────────────────────────────────────┐  │ │
│  │  │  Registry Detail Pages (/registers/[slug])                    │  │ │
│  │  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐│  │ │
│  │  │  │ekopfo│ │ endo │ │intern│ │vacan.│ │ bpr  │ │ekrov │ │senikp││  │ │
│  │  │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘│  │ │
│  │  │  All use SAME template (Hero + Desc + Links + Status)         │  │ │
│  │  └────────────────────────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                              ↓                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │                    BACKEND SYSTEMS LAYER                             │ │
│  │                    (NO CONNECTIONS ❌)                               │ │
│  │  ┌────────┐    ┌────────┐    ┌────────┐    ┌────────┐              │ │
│  │  │ЕКОПФО  │ ❌ │  Ендо  │ ❌ │ Інтерн.│ ❌ │Вакансії│              │ │
│  │  │Backend │    │Backend │    │Backend │    │Backend │              │ │
│  │  │(МСЕ)   │    │(Черга) │    │(Рейтинг│    │(Портал)│              │ │
│  │  └────────┘    └────────┘    └────────┘    └────────┘              │ │
│  │  ┌────────┐    ┌────────┐    ┌────────┐                            │ │
│  │  │  БПР   │ ❌ │ е-Кров │ ❌ │СЕН ІКП │                            │ │
│  │  │Backend │    │Backend │    │Backend │                            │ │
│  │  │(Освіта)│    │(Донори)│    │(Космет)│                            │ │
│  │  └────────┘    └────────┘    └────────┘                            │ │
│  │                                                                      │ │
│  │  Independent systems with separate:                                 │ │
│  │  • Databases                                                        │ │
│  │  • APIs                                                             │ │
│  │  • Business logic                                                   │ │
│  │  • User management                                                  │ │
│  │  • No shared data                                                   │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  LEGEND:                                                                   │
│  ─────  Shared/Connected (UI layer)                                       │
│  ❌     Not connected (Data layer)                                        │
└────────────────────────────────────────────────────────────────────────────┘
```

**Спрощена схема зв'язків:**

```
      DATA LAYER (JSON)
            ↓
    ┌───────────────┐
    │ notebooks.json│
    │  (7 objects)  │
    └───────────────┘
            ↓
    ┌───────────────┐
    │ SHARED LAYER  │ ← TypeScript, Components, i18n, Instatus
    └───────────────┘
      ↓     ↓     ↓
   ┌────┐ ┌────┐ ┌────┐
   │Home│ │Stat│ │Det │ ← Pages
   │Page│ │Page│ │Page│
   └────┘ └────┘ └────┘
      ↓     ↓     ↓
   ┌────────────────┐
   │  USER SEES     │ ← Consistent UX
   │  7 REGISTRIES  │
   │  Same UI/UX    │
   └────────────────┘
            ↑
    (No backend connections between registries)
```

### 5.4.4 Таблиця «Що спільне / що унікальне»

| Аспект | Що спільне (100% sharing) | Що унікальне (registry-specific) |
|--------|---------------------------|-----------------------------------|
| **Структура даних** | • Interface NotebookItem<br>• Поля: slug, title, description, statusUrl, links, instructions<br>• JSON формат<br>• Розташування: config/notebooks.json | • Значення slug (7 унікальних)<br>• Значення title (7 унікальних)<br>• Контент description<br>• Instatus subdomain<br>• NotebookLM notebook ID<br>• Helpdesk portal ID |
| **UI Components** | • RegisterCard компонент<br>• Header dropdown<br>• Footer<br>• Registry Detail template<br>• Iframe для Instatus<br>• Стилі (Tailwind classes)<br>• Hover/focus states | • Контент карток (title, description)<br>• URL для переходів (slug-based)<br>• Зображення (/images/ai-{slug}.webp)<br>• Analytics notebook URL<br>• Support portal URL |
| **Локалізація** | • Структура ключів (registryCards, registryDetails)<br>• Fallback логіка (translation → JSON)<br>• Підтримувані мови (UA, EN)<br>• Translation hooks (useTranslations)<br>• Placeholder текст | • Перекладені назви<br>• Перекладені описи<br>• Analytics titles<br>• Commentary тексти<br>• Support descriptions |
| **Рендеринг** | • Grid layout (1→2→3 cols responsive)<br>• Card структура (icon + title + desc + link)<br>• Link cards (Analytics + Support)<br>• Card sizes (Analytics 384×384, Support 320×320)<br>• Iframe heights (42vh, 70vh)<br>• Typography (font sizes, weights, colors) | • Контент всередині карток<br>• Кількість символів у title/description<br>• Довжина Analytics label (32-100 chars)<br>• Наявність trailing slash в statusUrl |
| **Моніторинг** | • Provideр: Instatus<br>• URL pattern: {subdomain}.instatus.com<br>• Integration: iframe embedding<br>• Display rules (width 100%, heights 42vh/70vh)<br>• Features: uptime, incidents, maintenance | • Subdomain (ekoppho, endo, intern...)<br>• Trailing slash (деякі мають, деякі ні)<br>• Суфікси (bpr-moh унікальний)<br>• Статус системи (кожна має свій uptime) |
| **Маршрутизація** | • Pattern: /registers/[slug]<br>• Dynamic routes (Next.js)<br>• generateStaticParams()<br>• SSG (Static Site Generation)<br>• 404 handling (notFound()) | • slug values (7 унікальних URL)<br>• SEO titles (різні для кожної)<br>• Meta descriptions (різні)<br>• Canonical URLs |
| **Зовнішні посилання** | • Кількість links: 2 (стабільно)<br>• Порядок: [Analytics, Support]<br>• Label pattern: "Аналітичний ШІ..."<br>• Support label: "Підтримка користувачів"<br>• Image paths pattern: /images/ai-{slug}.webp | • NotebookLM notebook IDs (7 унікальних)<br>• Atlassian portal IDs (26-34, всі різні)<br>• Analytics label довжина (32-100 chars)<br>• Додаткові URL параметри (group/create) |
| **TypeScript** | • NotebookItem interface<br>• Type safety (compile-time checks)<br>• Required fields: slug, title<br>• Optional fields: description, statusUrl, links, instructions<br>• IDE autocomplete | • Значення properties (контент різний)<br>• Validation rules (slug format, URL format)<br>• Конкретні типи даних в runtime |

**Додаткова статистика спільності:**

```yaml
Data Structure:
  Спільні поля: 6/6 (100%)
  Спільний формат: JSON (100%)
  Спільний interface: NotebookItem (100%)

UI Components:
  Спільні компоненти: 4/4 (100%)
    - RegisterCard
    - Header
    - Footer
    - Detail template
  
Localization:
  Спільна система: useTranslations (100%)
  Спільні ключі: registryCards, registryDetails (100%)
  Підтримувані мови: 2 (UA, EN) для всіх

Rendering:
  Спільний grid: responsive 1→2→3 (100%)
  Спільна структура карток: icon+title+desc+link (100%)
  Спільні розміри: 384×384, 320×320 (100%)

Monitoring:
  Спільний провайдер: Instatus (100%)
  Спільна інтеграція: iframe (100%)
  
Routing:
  Спільний pattern: /registers/[slug] (100%)
  Спільна технологія: Next.js Dynamic Routes (100%)

External Links:
  Спільна кількість: 2 links (100%)
  Спільний порядок: [Analytics, Support] (100%)
  Спільний provider Analytics: NotebookLM (100%)
  Спільний provider Support: Atlassian (100%)

Result:
  Interface Level Sharing: ~95%
  Data Content Uniqueness: 100%
  Backend Connections: 0%
```

### 5.4.5 Підсумок взаємозв'язків

**Ключові висновки:**

```yaml
1. Architectural Pattern: Shared UI, Independent Data
   - Frontend: Максимальна уніфікація (95%+ код sharing)
   - Backend: Повна незалежність (0% зв'язків між системами)

2. Benefits of Shared UI:
   ✅ Консистентний UX для всіх реєстрів
   ✅ Легкість додавання нових реєстрів (JSON + переклади)
   ✅ Централізоване оновлення дизайну
   ✅ Менше коду для підтримки
   ✅ Type safety для всіх реєстрів

3. Benefits of Independent Data:
   ✅ Кожен реєстр може розвиватися незалежно
   ✅ Немає ризику cascade failures
   ✅ Різні команди можуть працювати паралельно
   ✅ Масштабування кожної системи окремо
   ✅ Простіша архітектура (no complex integrations)

4. Trade-offs:
   ⚠️ Неможливі cross-registry queries (by design)
   ⚠️ Немає спільних dashboards з даними (тільки статуси)
   ⚠️ Користувач повинен переходити між системами
   
   But acceptable because:
   ✅ Різні бізнес-домени (МСЕ ≠ Донорство)
   ✅ Різні користувачі (лікарі МСЕ ≠ донори крові)
   ✅ Простіша підтримка переважає можливі інтеграції

5. Future Extensibility:
   - Легко додати 8-й, 9-й, 10-й реєстр
   - Додати поле в NotebookItem → всі отримують автоматично
   - Змінити дизайн компонента → оновлюються всі реєстри
   - Додати нову мову → перекладаються всі реєстри
   - Все без breaking changes
```

**Архітектурний патерн:**

```
┌─────────────────────────────────────────────┐
│    PRESENTATION LAYER (Shared/Unified)      │
│  • Single UI codebase                       │
│  • Consistent UX                            │
│  • Shared components                        │
│  • Unified i18n                             │
│  • Same monitoring approach                 │
└─────────────────────────────────────────────┘
                    ↕
        (notebooks.json bridge)
                    ↕
┌─────────────────────────────────────────────┐
│     DATA LAYER (Independent/Isolated)       │
│  • 7 separate backend systems               │
│  • No shared databases                      │
│  • No API integrations                      │
│  • Independent scaling                      │
│  • Isolated failures                        │
└─────────────────────────────────────────────┘

Pattern Name: "Unified Portal for Isolated Systems"
```

---

**Дата створення:** 13 грудня 2025  
**Кількість реєстрів:** 7  
**Спільних компонентів:** 4 (RegisterCard, Header, Footer, Detail template)  
**UI Code Sharing:** ~95%  
**Backend Connections:** 0 (повна незалежність)  
**Extensibility:** Високий (легко додати нові реєстри)
