# Керівництво з додавання нового реєстру

> Огляд архітектури та покроковий план для додання 8-го (та кожного наступного) медичного реєстру до сайту.

---

## Огляд архітектури проекту

Сайт — це Next.js 14 додаток (папка `web/`). Усі 7 реєстрів описані в **одному конфіг-файлі** та двох **JSON-файлах локалізації**. Нові маршрути (`/registers/[slug]`) генеруються автоматично через `generateStaticParams()` — окремих сторінок для кожного реєстру **створювати не потрібно**.

### Існуючі 7 реєстрів

| # | `slug` | Назва | Analytics Image |
|---|--------|-------|-----------------|
| 1 | `ekopfo` | ЕКОПФО | `/images/ai-ekopfo.webp` |
| 2 | `endoprosthesis` | Ендопротезування | `/images/ai-endoprosthesis.webp` |
| 3 | `internatura` | Інтернатура | `/images/ai-internatura.webp` |
| 4 | `vacancies` | Вакансії | `/images/ai-vacancies.webp` |
| 5 | `bpr` | Система Безперервного Розвитку | `/images/ai-bpr.webp` |
| 6 | `ekrov` | е-Кров | `/images/ai-ekrov.webp` |
| 7 | `sen-ikp` | СЕН ІКП | `/images/ai-senikp.webp` |

---

## Перелік дій для додання нового реєстру

### Що робить розробник (технічні зміни у коді):

| # | Дія | Файл |
|---|-----|------|
| 1 | Додати новий об'єкт реєстру | `web/config/notebooks.json` |
| 2 | Додати переклад картки та деталей (UA) | `web/locales/ua.json` — секції `registryCards` та `registryDetails` |
| 3 | Додати переклад картки та деталей (EN) | `web/locales/en.json` — секції `registryCards` та `registryDetails` |

Більше нічого не потрібно — маршрутизація, навігація в Header, сторінка статусів і головна сторінка підхоплять новий реєстр автоматично.

---

## Матеріали, які потрібно підготувати для кожного нового реєстру

### 1. Зображення для картки аналітики

| Параметр | Значення |
|----------|----------|
| **Місце розташування** | `web/public/images/` |
| **Назва файлу** | `ai-[ваш-slug].webp` (приклад: `ai-medregistry.webp`) |
| **Формат** | `.webp` (як у всіх 7 існуючих) |
| **Рекомендований розмір** | ~800×450 px, оптимізований WebP |
| **Вміст** | Тематичне зображення, що візуально представляє реєстр (використовується на головній сторінці та на сторінці деталей реєстру) |
| **Приклади наявних** | `ai-ekopfo.webp`, `ai-ekrov.webp`, `ai-bpr.webp` тощо |

> Зображення `Helpdesk.webp` для картки підтримки вже є — нового не потрібно.

---

### 2. Технічні посилання

| # | Матеріал | Опис |
|---|----------|------|
| 2.1 | **Slug (URL-ідентифікатор)** | Латиниця, цифри, дефіси. Без кирилиці. Унікальний. Приклад: `med-registry`, `erehab`, `transplant` |
| 2.2 | **NotebookLM URL** | Посилання на AI-аналітичний блокнот Google NotebookLM для цього реєстру. Формат: `https://notebooklm.google.com/notebook/XXXXXXXXX` |
| 2.3 | **instatus.com URL** | Сторінка моніторингу статусу сервісу. Формат: `https://your-registry.instatus.com/`. Якщо немає — можна залишити порожнім (блок статусу просто не відобразиться) |
| 2.4 | **Jira ServiceDesk URL** | Посилання на портал технічної підтримки. Формат: `https://e-health-ua.atlassian.net/servicedesk/customer/portal/XX/...` |

---

### 3. Текстовий контент (двома мовами)

| # | Поле | Мова | Де використовується | Обсяг |
|---|------|------|---------------------|-------|
| 3.1 | **Назва картки** | 🇺🇦 UA | Головна сторінка, меню, сторінка статусів | 1–5 слів |
| 3.2 | **Назва картки** | 🇬🇧 EN | Те ж саме, при EN-локалі | 1–5 слів |
| 3.3 | **Заголовок аналітики** | 🇺🇦 UA | Сторінка деталей реєстру, над посиланням на NotebookLM | 5–8 слів. Приклад: `"Аналітичний модуль е-Кров"` |
| 3.4 | **Заголовок аналітики** | 🇬🇧 EN | Те ж саме при EN-локалі | 5–8 слів |
| 3.5 | **Опис (description)** | 🇺🇦 UA | Сторінка деталей, під заголовком | 1–2 речення, що пояснюють суть реєстру |
| 3.6 | **Опис (description)** | 🇬🇧 EN | Те ж саме при EN-локалі | 1–2 речення |
| 3.7 | **Коментар (commentary)** | 🇺🇦 UA | Сторінка деталей, розгорнутий опис | 3–6 речень, що описують охоплені документи/процеси |
| 3.8 | **Коментар (commentary)** | 🇬🇧 EN | Те ж саме при EN-локалі | 3–6 речень |

> Поля 3.3–3.8 відображаються на сторінці `/registers/[slug]` в картці AI-аналітики.

---

### 4. Необов'язковий розширений блок підтримки (`userSupportText`)

Наразі **лише ЕКОПФО** має розширений блок підтримки у `registryDetails`. Структура включає:

- `intro` — вступний текст
- `chatsLabel` — підпис перед списком чатів
- `links` — масив посилань на Viber-чати `{ label, href }`
- `orText` — роздільник "або"
- `formText` — масив сегментів тексту `{ text, href? }` з посиланням на Jira-заявку
- `faqIntro` — вступ до FAQ
- `faqItems` — масив рядків FAQ, кожен є масивом сегментів `{ text, href? }`
- `instructionsText` — масив сегментів з посиланням на `/documentation/guidelines`

Для нового реєстру цей блок **не є обов'язковим** — без нього відобразиться стандартна картка підтримки з кнопкою Jira.

---

## Підсумкова схема файлів

```
web/
├── config/
│   └── notebooks.json          ← додати 1 об'єкт у масив
├── locales/
│   ├── ua.json                 ← додати 2 записи (registryCards + registryDetails)
│   └── en.json                 ← додати 2 записи (registryCards + registryDetails)
└── public/
    └── images/
        └── ai-[ваш-slug].webp  ← завантажити нове зображення
```

---

## Шаблон запису в `notebooks.json`

```json
{
  "slug": "your-new-slug",
  "title": "Назва Реєстру",
  "description": "Короткий опис реєстру українською мовою.",
  "statusUrl": "https://your-registry.instatus.com/",
  "links": [
    {
      "label": "Аналітичний ШІ по модулю [Назва]",
      "url": "https://notebooklm.google.com/notebook/XXXXXXXXX",
      "image": "/images/ai-your-new-slug.webp"
    },
    {
      "label": "Підтримка користувачів",
      "url": "https://e-health-ua.atlassian.net/servicedesk/customer/portal/XX/...",
      "image": "/images/Helpdesk.webp"
    }
  ]
}
```

## Шаблон запису в `ua.json`

```json
"registryCards": {
  "your-new-slug": "Назва Реєстру"
},
"registryDetails": {
  "your-new-slug": {
    "analyticsTitle": "Аналітичний модуль [Назва]",
    "description": "1–2 речення про що система.",
    "commentary": "3–6 речень, що описують охоплені документи, ролі та процеси."
  }
}
```

## Шаблон запису в `en.json`

```json
"registryCards": {
  "your-new-slug": "Registry Name"
},
"registryDetails": {
  "your-new-slug": {
    "analyticsTitle": "[Name] Analytics Module",
    "description": "1–2 sentences about what the system does.",
    "commentary": "3–6 sentences describing covered documents, roles and processes."
  }
}
```
