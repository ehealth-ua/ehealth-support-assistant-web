# eHealth Web-портал — Контекст для Claude

> **⚠️ Назва репозиторію `vscode-cerebras-chat` — легасі, не відображає зміст.**
> Це не VS Code розширення — це Інформаційний Web-портал eHealth.

## 🎯 Суть проекту одним реченням

Єдина точка входу для медичних адміністраторів і користувачів до 8 медичних реєстрів ДП «Електронне здоров'я» з доступом до ШІ-аналітики (NotebookLM) та підтримки (Atlassian Helpdesk).

---

## 📊 Швидкі факти

| Параметр | Значення |
|----------|----------|
| **Framework** | Next.js 14.2.35 (SSG — повністю статичний) |
| **React** | 18.2.0 |
| **TypeScript** | 5 |
| **Styling** | Tailwind CSS |
| **Deploy** | Vercel (auto-deploy on push) |
| **Branch** | `cleanup/duplicates` (default / production) |
| **Live URL** | https://vscode-cerebras-chat.vercel.app/ |
| **GitHub** | https://github.com/nkfed/vscode-cerebras-chat |

---

## 🏗️ Структура проекту

```
vscode-cerebras-chat/
├── web/                        # ← ОСНОВНА ПАПКА РОЗРОБКИ
│   ├── app/                    # Next.js app router
│   │   ├── page.tsx            # головна сторінка
│   │   ├── registers/          # сторінка каталогу реєстрів
│   │   ├── registry/           # сторінки окремих реєстрів
│   │   ├── documentation/      # документація
│   │   ├── about/              # про портал
│   │   └── components/         # UI компоненти
│   ├── config/
│   │   └── notebooks.json      # конфіг реєстрів (SSOT)
│   ├── locales/                # локалізація (ua.json, en.json)
│   └── public/                 # статичні файли
├── docs/
│   ├── technical-spec.md       # технічна специфікація
│   └── registry-addition-guide.md  # як додати новий реєстр
├── src/                        # легасі Cerebras extension (не чіпати)
├── archive/                    # архівні версії
├── project.prompt              # оригінальне ТЗ порталу
└── package.json                # легасі маніфест Cerebras
```

---

## 📋 Реєстри

| # | Slug | Назва |
|---|------|-------|
| 1 | `ekopfo` | ЕКОПФО |
| 2 | `endoprosthesis` | Ендопротезування |
| 3 | `internatura` | Інтернатура |
| 4 | `vacancies` | Вакансії |
| 5 | `bpr` | Система Безперервного Розвитку |
| 6 | `ekrov` | е-Кров |
| 7 | `sen-ikp` | СЕН ІКП |
| 8 | `lrmsd` | Ліцензійний реєстр |

Додавання нового реєстру = зміна 3 файлів. Детально: `docs/registry-addition-guide.md`.

---

## ▶️ Основні команди

```bash
cd /home/nkfed/projects/vscode-cerebras-chat/web

# Встановити залежності
npm install

# Локальний dev-сервер
npm run dev

# Продакшн білд (перевірка перед пушем)
npm run build

# Деплой → просто push
git push origin cleanup/duplicates
```

---

## 🔗 Зв'язок з іншими проектами

- **`ekopfo`** — окремий QA-бот та KB для реєстру ЕКОПФО. Портал надає фронтенд-точку входу до NotebookLM і Helpdesk, але не містить KB-логіки.
- **`notebooklm`** — картки реєстрів посилаються на відповідні NotebookLM-ноутбуки.

---

## ⚠️ Правила роботи

- **Вся розробка ведеться у `web/`** — не в кореневому `src/` (то легасі Cerebras).
- Немає `.env` — чистий статичний сайт, всі дані в JSON-конфігах.
- Конфіг реєстрів — `web/config/notebooks.json` (SSOT для всіх сторінок).
- Детальний Project Brief: `/home/nkfed/Obsidian/10_Projects/ehealth-portal/PROJECT_BRIEF.md`.


---

## 🔐 Управління секретами (сервер Jinny-S7)

> **Правило:** Будь-які API-ключі та токени зберігаються **виключно** у  
> `~/.config/jinny-secrets/jinny.env` (chmod 600) — поза всіма git-репозиторіями.  
> Ніколи не додавати ключі у project `.env`, `.md` файли або JSON-конфіги.

**Деталі:** `/home/nkfed/Documents/jinny-s7-server-docs/SECRETS_CENTRAL_STORE_2026-05-09.md`
