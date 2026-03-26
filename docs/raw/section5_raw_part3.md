# 📋 ПАСПОРТ САЙТУ
## Розділ 5: Опис реєстрів (Registry Structure)

---

## 5.3. 📑 ОПИС КОЖНОГО РЕЄСТРУ

### 5.3.1 ЕКОПФО (Електронна Картка Пацієнта)

**Ідентифікація:**

```yaml
slug: ekopfo
title: ЕКОПФО
URL: /registers/ekopfo
Status: https://ekoppho.instatus.com
```

**Призначення:**

ЕКОПФО — система управління медичними справами пацієнтів для проведення медико-соціальної експертизи (МСЕ) та визначення статусу особи з інвалідністю. Система забезпечує електронний документообіг, автоматизацію процесів прийняття рішень, інтеграцію з реєстрами та платформами е-здоров'я.

**Короткий опис:**

Надані документи описують систему управління медичними справами пацієнтів, включаючи процеси створення, оцінювання та оскарження справ медико-соціальної експертизи (МСЕ) для отримання статусу особи з інвалідністю. Система забезпечує електронний документообіг, автоматизацію процесів прийняття рішень, інтеграцію з реєстрами та платформами е-здоров'я, а також механізми підтримки користувачів через штучний інтелект (NotebookLM) та службу підтримки.

**Посилання:**

```yaml
Analytics (NotebookLM):
  Label: "Аналітичний ШІ по модулю ЕКОПФО"
  URL: https://notebooklm.google.com/notebook/5ed43304-90a2-4193-a706-daec18cc8e33
  Image: /images/ai-ekopfo.webp
  Size: 384×384
  Purpose: AI-powered documentation chat for ЕКОПФО

Support (Helpdesk):
  Label: "Підтримка користувачів"
  URL: https://e-health-ua.atlassian.net/servicedesk/customer/portal/32/group/88/create/296
  Image: /images/Helpdesk.webp
  Size: 320×320
  Purpose: User support ticketing system
```

**Моніторинг статусу:**

```yaml
statusUrl: https://ekoppho.instatus.com
Provider: Instatus
Features:
  - Real-time system status
  - Uptime monitoring
  - Incident reports
  - Maintenance schedules
Display:
  - /registers: iframe height 42vh
  - /registers/ekopfo: iframe height 70vh (min 400px)
```

**Інструкції:**

```yaml
instructions: undefined
Status: Наразі не використовуються
Future: Можуть бути додані PDF/DOCX інструкції
```

**Відображення на сторінках:**

| Сторінка | Що показується | Компоненти |
|----------|----------------|------------|
| **Home Page** (`/`) | RegisterCard з назвою "ЕКОПФО" та описом системи МСЕ. Клік → перехід на /registers/ekopfo | `<RegisterCard title="ЕКОПФО" description="Надані документи описують..." slug="ekopfo" />` |
| **Registers Page** (`/registers`) | Iframe з Instatus моніторингом. Заголовок "ЕКОПФО" (перекладений). Real-time статус системи. | `<iframe src="https://ekoppho.instatus.com" height="42vh" />` |
| **Registry Detail** (`/registers/ekopfo`) | Повна сторінка:<br>• Hero banner: "ЕКОПФО"<br>• Опис системи (paragraph)<br>• 2 link cards: NotebookLM AI + Helpdesk<br>• Status iframe (70vh)<br>• Translations з locales/ua.json | Hero + Description + Links Grid (2 cards: Analytics 384×384 + Support 320×320) + Status Section |

**Детальна таблиця властивостей:**

| Властивість | Значення | Тип | Використання |
|-------------|----------|-----|--------------|
| **slug** | `"ekopfo"` | string (required) | URL routing, translation keys, array search |
| **title** | `"ЕКОПФО"` | string (required) | Card titles, hero banners, navigation |
| **description** | `"Надані документи описують систему..."` (500+ chars) | string (optional) | RegisterCard text, detail page paragraph |
| **statusUrl** | `"https://ekoppho.instatus.com"` | string (optional) | Iframe src on /registers and /registers/ekopfo |
| **links[0]** | NotebookLM (Analytics) | object | Link card з AI аналітикою, image 384×384 |
| **links[1]** | Helpdesk (Support) | object | Link card з підтримкою, image 320×320, UserSupportContent |
| **instructions** | `undefined` | array (optional) | Не використовується |

---

### 5.3.2 Ендопротезування (Endoprosthesis Queue Management)

**Ідентифікація:**

```yaml
slug: endoprosthesis
title: Ендопротезування
URL: /registers/endoprosthesis
Status: https://endo.instatus.com/
```

**Призначення:**

Електронна система для управління чергою на ендопротезування суглобів в Україні. Забезпечує реєстрацію пацієнтів, формування черги за критеріями пріоритетності, призначення операцій та моніторинг стану черги в режимі реального часу.

**Короткий опис:**

Надані документи описують електронну систему для управління чергою на ендопротезування в Україні, включаючи процеси реєстрації пацієнтів, формування черги, призначення операцій та моніторинг стану черги. Система інтегрується з медичними інформаційними системами (МІС) та забезпечує прозорість розподілу квот на операції.

**Посилання:**

```yaml
Analytics (NotebookLM):
  Label: "Аналітичний ШІ по модулю Ендопротезування"
  URL: https://notebooklm.google.com/notebook/2ba648ae-a69d-4912-959f-cb04d3d7e383
  Image: /images/ai-endoprosthesis.webp
  Purpose: AI documentation assistant for queue management

Support (Helpdesk):
  Label: "Підтримка користувачів"
  URL: https://e-health-ua.atlassian.net/servicedesk/customer/portal/33/group/89/create/299
  Image: /images/Helpdesk.webp
  Purpose: Technical support for healthcare providers
```

**Моніторинг статусу:**

```yaml
statusUrl: https://endo.instatus.com/
Provider: Instatus
Note: URL має trailing slash (обидва варіанти валідні)
```

**Інструкції:**

```yaml
instructions: undefined
Status: Не використовуються
```

**Відображення на сторінках:**

| Сторінка | Що показується | Компоненти |
|----------|----------------|------------|
| **Home Page** | RegisterCard з назвою "Ендопротезування" та описом системи черги. | `<RegisterCard title="Ендопротезування" description="Надані документи..." slug="endoprosthesis" />` |
| **Registers Page** | Iframe з Instatus (https://endo.instatus.com/). Моніторинг системи черги. | `<iframe src="https://endo.instatus.com/" />` |
| **Registry Detail** | Hero: "Ендопротезування"<br>Опис черги<br>2 links: AI Analytics + Support<br>Status iframe | Full page з всіма секціями |

**Детальна таблиця властивостей:**

| Властивість | Значення | Особливості |
|-------------|----------|-------------|
| **slug** | `"endoprosthesis"` | Довге слово (15 chars), lowercase, no hyphens |
| **title** | `"Ендопротезування"` | Кирилиця, 16 символів |
| **description** | Опис системи черги (~300 chars) | Згадує: реєстрація, черга, операції, моніторинг |
| **statusUrl** | `"https://endo.instatus.com/"` | З trailing slash |
| **links** | 2 objects (Analytics + Support) | Стандартна структура |
| **instructions** | `undefined` | Відсутні |

---

### 5.3.3 Інтернатура (Medical Internship System)

**Ідентифікація:**

```yaml
slug: internatura
title: Інтернатура
URL: /registers/internatura
Status: https://intern.instatus.com/
```

**Призначення:**

Система рейтингового розподілу випускників медичних та фармацевтичних вищих навчальних закладів на місця інтернатури. Забезпечує прозорий та автоматизований процес розподілу інтернів за спеціальностями та медичними закладами.

**Короткий опис:**

Надані документи стосуються української системи інтернатури для медичних і фармацевтичних спеціалістів, яка є обов'язковим етапом після закінчення вищого навчального закладу. Система використовує рейтинговий підхід для справедливого розподілу випускників на інтернатуру за спеціальностями та базами практики по всій країні.

**Посилання:**

```yaml
Analytics (NotebookLM):
  Label: "Аналітичний ШІ по модулю рейтингового розподілу в Інтернатуру"
  URL: https://notebooklm.google.com/notebook/fc75d28d-509b-47e4-a3c0-8cff2a589ce7
  Image: /images/ai-internatura.webp
  Note: Найдовша назва (68 символів)

Support (Helpdesk):
  Label: "Підтримка користувачів"
  URL: https://e-health-ua.atlassian.net/servicedesk/customer/portal/34
  Image: /images/Helpdesk.webp
  Note: Portal ID 34 (різні портали для різних систем)
```

**Моніторинг статусу:**

```yaml
statusUrl: https://intern.instatus.com/
Subdomain: intern (скорочена форма від internatura)
```

**Інструкції:**

```yaml
instructions: undefined
```

**Відображення на сторінках:**

| Сторінка | Що показується | Особливості |
|----------|----------------|-------------|
| **Home Page** | RegisterCard "Інтернатура" з описом рейтингового розподілу | Опис згадує: випускники, рейтинг, спеціальності |
| **Registers Page** | Status iframe для моніторингу системи інтернатури | Показує статус під час періоду розподілу |
| **Registry Detail** | Повна сторінка з Hero "Інтернатура", описом системи, 2 link cards, status iframe | Analytics link має найдовшу назву серед усіх реєстрів |

**Детальна таблиця властивостей:**

| Властивість | Значення | Примітки |
|-------------|----------|----------|
| **slug** | `"internatura"` | 10 chars, кирилиця транслітерована |
| **title** | `"Інтернатура"` | 11 символів кирилиці |
| **description** | Опис рейтингової системи (~280 chars) | Ключові слова: випускники, спеціальності, бази практики |
| **statusUrl** | `"https://intern.instatus.com/"` | Subdomain: intern |
| **links[0].label** | "Аналітичний ШІ по модулю рейтингового розподілу в Інтернатуру" | 68 символів (найдовший label) |
| **links** | 2 links | Portal ID 34 для Helpdesk |

---

### 5.3.4 Вакансії (Medical Job Vacancies Portal)

**Ідентифікація:**

```yaml
slug: vacancies
title: Вакансії
URL: /registers/vacancies
Status: https://vacancy.instatus.com/
```

**Призначення:**

Єдиний веб-портал вакантних посад у медичних закладах України. Забезпечує централізований доступ до інформації про вільні робочі місця в системі охорони здоров'я, спрощує процес пошуку роботи для медичних працівників та набору персоналу для закладів.

**Короткий опис:**

Надані документи надають огляд Єдиного веб-порталу вакантних посад у медичних закладах, який створений для полегшення процесу працевлаштування медичних працівників та пошуку кадрів закладами охорони здоров'я. Портал інтегрується з Електронною системою охорони здоров'я та забезпечує прозорість інформації про доступні посади.

**Посилання:**

```yaml
Analytics (NotebookLM):
  Label: "Аналітичний ШІ по модулю Вакансій в медичних закладах"
  URL: https://notebooklm.google.com/notebook/e4ec4760-68d9-4ca2-a564-df02e0484ccf
  Image: /images/ai-vacancies.webp

Support (Helpdesk):
  Label: "Підтримка користувачів"
  URL: https://e-health-ua.atlassian.net/servicedesk/customer/portal/27
  Image: /images/Helpdesk.webp
  Portal: 27
```

**Моніторинг статусу:**

```yaml
statusUrl: https://vacancy.instatus.com/
Subdomain: vacancy (singular form)
```

**Інструкції:**

```yaml
instructions: undefined
```

**Відображення на сторінках:**

| Сторінка | Що показується | Особливості |
|----------|----------------|-------------|
| **Home Page** | RegisterCard "Вакансії" з описом порталу вакансій | Коротка назва (8 символів) |
| **Registers Page** | Status iframe vacancy portal | Моніторинг доступності порталу вакансій |
| **Registry Detail** | Hero "Вакансії", опис порталу, 2 links, status | Найкоротший title серед усіх реєстрів |

**Детальна таблиця властивостей:**

| Властивість | Значення | Особливості |
|-------------|----------|-------------|
| **slug** | `"vacancies"` | 9 chars, множина (англійською) |
| **title** | `"Вакансії"` | 8 символів (найкоротший title) |
| **description** | Опис порталу вакансій (~250 chars) | Згадує: працевлаштування, кадри, ЗОЗ |
| **statusUrl** | `"https://vacancy.instatus.com/"` | Subdomain: vacancy (singular) |
| **links** | 2 links | Portal 27 |
| **instructions** | `undefined` | Відсутні |

---

### 5.3.5 БПР (Безперервний Професійний Розвиток)

**Ідентифікація:**

```yaml
slug: bpr
title: Система Безперервного Розвитку
URL: /registers/bpr
Status: https://bpr-moh.instatus.com/
```

**Призначення:**

Система обліку та управління безперервним професійним розвитком (БПР) медичних працівників. Забезпечує реєстрацію освітніх заходів, облік балів БПР, моніторинг виконання вимог щодо підвищення кваліфікації лікарями.

**Короткий опис:**

Надані джерела надають огляд системи безперервного професійного розвитку (БПР) для медичних працівників в Україні, яка є обов'язковою вимогою для підтримання професійної ліцензії. Система відстежує освітні активності, нараховує бали та забезпечує прозорість процесу підвищення кваліфікації медичних спеціалістів.

**Посилання:**

```yaml
Analytics (NotebookLM):
  Label: "Аналітичний ШІ по модулю Безперервного Розвитку лікарів"
  URL: https://notebooklm.google.com/notebook/7e2d73f0-ec55-4e20-926d-0e532db34a07
  Image: /images/ai-bpr.webp

Support (Helpdesk):
  Label: "Підтримка користувачів"
  URL: https://e-health-ua.atlassian.net/servicedesk/customer/portal/26
  Image: /images/Helpdesk.webp
  Portal: 26
```

**Моніторинг статусу:**

```yaml
statusUrl: https://bpr-moh.instatus.com/
Subdomain: bpr-moh (БПР + МОЗ - Міністерство Охорони Здоров'я)
Note: Єдиний subdomain з дефісом та суфіксом департаменту
```

**Інструкції:**

```yaml
instructions: undefined
```

**Відображення на сторінках:**

| Сторінка | Що показується | Особливості |
|----------|----------------|-------------|
| **Home Page** | RegisterCard з title "Система Безперервного Розвитку" та описом БПР | Найдовший title (31 символ) |
| **Registers Page** | Status iframe БПР системи | Subdomain: bpr-moh |
| **Registry Detail** | Hero з повною назвою, опис системи балів, 2 links, status | Title довший ніж у всіх інших реєстрів |

**Детальна таблиця властивостей:**

| Властивість | Значення | Особливості |
|-------------|----------|-------------|
| **slug** | `"bpr"` | 3 chars (найкоротший slug, абревіатура) |
| **title** | `"Система Безперервного Розвитку"` | 31 символ (найдовший title) |
| **description** | Опис системи БПР (~230 chars) | Ключові слова: бали, ліцензія, освіта |
| **statusUrl** | `"https://bpr-moh.instatus.com/"` | Унікальний формат з -moh суфіксом |
| **links** | 2 links | Portal 26 |
| **instructions** | `undefined` | Відсутні |
| **Note** | Найкоротший slug + найдовший title | Контраст між slug та title |

---

### 5.3.6 е-Кров (Electronic Blood Donation System)

**Ідентифікація:**

```yaml
slug: ekrov
title: е-Кров
URL: /registers/ekrov
Status: https://eblood.instatus.com/
```

**Призначення:**

Інформаційно-комунікаційна система донорства крові та її компонентів. Забезпечує облік донорів, реєстрацію донацій, управління запасами крові, координацію між центрами крові та лікувальними закладами по всій Україні.

**Короткий опис:**

Надані джерела надають огляд реалізації інформаційно-комунікаційної системи донорства крові та її компонентів в Україні. Система підтримує повний цикл роботи з кров'ю: від реєстрації донорів та здачі крові до обліку компонентів крові, їх зберігання, тестування та розподілу між медичними закладами.

**Посилання:**

```yaml
Analytics (NotebookLM):
  Label: "Аналітичний ШІ по модулю е-Кров"
  URL: https://notebooklm.google.com/notebook/76d8e964-6d04-4a87-8515-187b66e3e3c2
  Image: /images/ai-ekrov.webp
  Note: Найкоротша Analytics label (32 символи)

Support (Helpdesk):
  Label: "Підтримка користувачів"
  URL: https://e-health-ua.atlassian.net/servicedesk/customer/portal/30/group/86/create/287
  Image: /images/Helpdesk.webp
  Portal: 30
  Note: Має додаткові параметри: group/86/create/287
```

**Моніторинг статусу:**

```yaml
statusUrl: https://eblood.instatus.com/
Subdomain: eblood (англійська назва, e-prefix)
```

**Інструкції:**

```yaml
instructions: undefined
```

**Відображення на сторінках:**

| Сторінка | Що показується | Особливості |
|----------|----------------|-------------|
| **Home Page** | RegisterCard "е-Кров" з описом системи донорства | Title з дефісом та e-prefix |
| **Registers Page** | Status iframe системи е-Кров | Subdomain: eblood (англійською) |
| **Registry Detail** | Hero "е-Кров", опис донорства, 2 links, status | Єдиний title з латинською "е" + дефіс |

**Детальна таблиця властивостей:**

| Властивість | Значення | Особливості |
|-------------|----------|-------------|
| **slug** | `"ekrov"` | 5 chars, транслітерація "е-Кров" без дефіса |
| **title** | `"е-Кров"` | Латинська "е" + дефіс + кирилиця "Кров" |
| **description** | Опис системи донорства (~240 chars) | Згадує: донори, компоненти, центри крові |
| **statusUrl** | `"https://eblood.instatus.com/"` | Subdomain: eblood (англійський переклад) |
| **links[0].label** | "Аналітичний ШІ по модулю е-Кров" | 32 символи (найкоротша Analytics label) |
| **links[1].url** | Portal 30 + /group/86/create/287 | Найдетальніший Helpdesk URL |
| **instructions** | `undefined` | Відсутні |

---

### 5.3.7 СЕН ІКП (Електронна Нотифікація Косметичної Продукції)

**Ідентифікація:**

```yaml
slug: sen-ikp
title: СЕН ІКП
URL: /registers/sen-ikp
Status: https://ensicp.instatus.com/
```

**Призначення:**

Система Електронної Нотифікації про Інформацію щодо Косметичної Продукції (СЕН ІКП). Забезпечує електронну реєстрацію та облік косметичної продукції, що ввозиться або виробляється в Україні, для забезпечення безпеки споживачів та відповідності нормативним вимогам.

**Короткий опис:**

Надані джерела надають інструкції користувача для Кабінету отримувача послуг системи СЕН ІКП, яка призначена для електронної нотифікації (повідомлення) про косметичну продукцію. Система дозволяє виробникам та імпортерам реєструвати інформацію про косметичні засоби, їх склад, призначення та безпеку використання відповідно до вимог законодавства.

**Посилання:**

```yaml
Analytics (NotebookLM):
  Label: "Аналітичний ШІ по модулю системи Електронної нотифікації інформації про косметичну продукцію"
  URL: https://notebooklm.google.com/notebook/70c4d740-9fc0-4dfe-af5e-4a65a721b26b
  Image: /images/ai-senikp.webp
  Note: Найдовша Analytics label (100 символів)

Support (Helpdesk):
  Label: "Підтримка користувачів"
  URL: https://e-health-ua.atlassian.net/servicedesk/customer/portal/31
  Image: /images/Helpdesk.webp
  Portal: 31
```

**Моніторинг статусу:**

```yaml
statusUrl: https://ensicp.instatus.com/
Subdomain: ensicp (скорочення з EN - Electronic Notification, SICP)
```

**Інструкції:**

```yaml
instructions: undefined
```

**Відображення на сторінках:**

| Сторінка | Що показується | Особливості |
|----------|----------------|-------------|
| **Home Page** | RegisterCard "СЕН ІКП" з описом електронної нотифікації | Абревіатура з пробілами |
| **Registers Page** | Status iframe СЕН ІКП системи | Subdomain: ensicp |
| **Registry Detail** | Hero "СЕН ІКП", опис нотифікації косметики, 2 links, status | Найдовша Analytics label серед усіх реєстрів |

**Детальна таблиця властивостей:**

| Властивість | Значення | Особливості |
|-------------|----------|-------------|
| **slug** | `"sen-ikp"` | 7 chars, єдиний slug з дефісом |
| **title** | `"СЕН ІКП"` | 8 символів з пробілом (абревіатура) |
| **description** | Опис електронної нотифікації (~270 chars) | Ключові слова: косметика, нотифікація, виробники |
| **statusUrl** | `"https://ensicp.instatus.com/"` | Subdomain: ensicp (acronym expansion) |
| **links[0].label** | "Аналітичний ШІ по модулю системи Електронної нотифікації..." | 100 символів (найдовша label) |
| **links** | 2 links | Portal 31 |
| **instructions** | `undefined` | Відсутні |
| **Унікальність** | Єдиний slug з дефісом + найдовша Analytics label | Виділяється серед інших реєстрів |

---

### 5.3.8 Зведена порівняльна таблиця всіх реєстрів

| Реєстр | slug | title (довжина) | statusUrl subdomain | Links count | Helpdesk Portal | Особливості |
|--------|------|-----------------|---------------------|-------------|-----------------|-------------|
| **ЕКОПФО** | `ekopfo` (6) | `ЕКОПФО` (6) | ekoppho | 2 | 32 | Подвійна "п" у subdomain |
| **Ендопротезування** | `endoprosthesis` (15) | `Ендопротезування` (16) | endo | 2 | 33 | Найдовший slug |
| **Інтернатура** | `internatura` (10) | `Інтернатура` (11) | intern | 2 | 34 | Найдовша Analytics label (68 chars) |
| **Вакансії** | `vacancies` (9) | `Вакансії` (8) | vacancy | 2 | 27 | Найкоротший title |
| **БПР** | `bpr` (3) | `Система Безперервного Розвитку` (31) | bpr-moh | 2 | 26 | Найкоротший slug + найдовший title |
| **е-Кров** | `ekrov` (5) | `е-Кров` (6) | eblood | 2 | 30 | Латинська "е" в title, найкоротша Analytics label (32 chars) |
| **СЕН ІКП** | `sen-ikp` (7) | `СЕН ІКП` (8) | ensicp | 2 | 31 | Єдиний slug з дефісом, найдовша Analytics label (100 chars) |

**Статистика:**

```yaml
Загальна кількість реєстрів: 7

Slug характеристики:
  Найкоротший: "bpr" (3 символи)
  Найдовший: "endoprosthesis" (15 символів)
  Середня довжина: 7.86 символів
  З дефісом: 1 ("sen-ikp")

Title характеристики:
  Найкоротший: "Вакансії" (8 символів)
  Найдовший: "Система Безперервного Розвитку" (31 символ)
  Середня довжина: 12.3 символів
  З дефісом: 1 ("е-Кров")

StatusUrl характеристики:
  Всі мають statusUrl: 7/7 (100%)
  Унікальні subdomains: 7
  З дефісом: 1 ("bpr-moh")
  Pattern: {subdomain}.instatus.com

Links характеристики:
  Всі мають links: 7/7 (100%)
  Кількість links на реєстр: 2 (стабільно)
  Analytics label (найкоротша): "Аналітичний ШІ по модулю е-Кров" (32 chars)
  Analytics label (найдовша): "Аналітичний ШІ по модулю системи Електронної нотифікації..." (100 chars)
  Support label: "Підтримка користувачів" (стабільно для всіх)

Helpdesk Portal IDs:
  Range: 26-34
  Унікальні: всі різні (кожен реєстр має свій portal)

Instructions:
  Всі мають instructions: 0/7 (0%)
  Поле не використовується жодним реєстром
```

---

**Дата створення:** 13 грудня 2025  
**Кількість реєстрів:** 7  
**Джерело даних:** `web/config/notebooks.json`  
**Статус:** Всі реєстри мають повну конфігурацію (slug, title, description, statusUrl, links)  
**Незаповнені поля:** instructions (0/7 реєстрів використовують)
