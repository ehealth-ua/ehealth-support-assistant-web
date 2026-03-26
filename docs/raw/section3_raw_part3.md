# 📋 ПАСПОРТ САЙТУ
## Розділ 3: Інфраструктура та середовище виконання (Частина 3)

---

## 3.3. 🛠️ СЕРЕДОВИЩЕ РОЗРОБКИ

### 3.3.1 Інструменти розробки

#### 3.3.1.1 Visual Studio Code (Editor)

**Версія:** Latest (1.85+)  
**Призначення:** Основний редактор коду

**Встановлення:**

```bash
# Windows
winget install Microsoft.VisualStudioCode

# macOS
brew install --cask visual-studio-code

# Linux
sudo snap install code --classic
```

**Налаштування для проєкту (`.vscode/settings.json`):**

```jsonc
{
  // Search optimization
  "search.exclude": {
    "out": true,           // Exclude build output
    "dist": true,          // Exclude compiled files
    "node_modules": true,  // Exclude dependencies (default)
    ".next": true          // Exclude Next.js build
  },
  
  // Git branch protection
  "git.branchProtection": [
    "main"  // Prevent accidental commits to main
  ],
  
  // File formatting
  "files.trimTrailingWhitespace": true,  // Auto-remove spaces
  
  // TypeScript
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  
  // Editor
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  
  // Tailwind CSS
  "tailwindCSS.experimental.classRegex": [
    ["className\\s*=\\s*[\"'`]([^\"'`]*)[\"'`]", "([^\\s]+)"]
  ]
}
```

**Основні функції для проєкту:**

| Функція | Призначення | Shortcut |
|---------|-------------|----------|
| **IntelliSense** | Автодоповнення коду | `Ctrl+Space` |
| **Go to Definition** | Перехід до визначення | `F12` |
| **Find All References** | Пошук всіх використань | `Shift+F12` |
| **Rename Symbol** | Перейменування змінної/функції | `F2` |
| **Format Document** | Форматування коду | `Shift+Alt+F` |
| **Quick Fix** | Швидке виправлення помилок | `Ctrl+.` |
| **Search in Files** | Глобальний пошук | `Ctrl+Shift+F` |
| **Git Integration** | Керування Git | `Ctrl+Shift+G` |

#### 3.3.1.2 VS Code Extensions (Рекомендовані)

**Обов'язкові розширення:**

```json
{
  "recommendations": [
    // Language Support
    "dbaeumer.vscode-eslint",           // ESLint integration
    "ms-vscode.vscode-typescript-next", // TypeScript nightly
    
    // Frameworks
    "bradlc.vscode-tailwindcss",        // Tailwind CSS IntelliSense
    "unifiedjs.vscode-mdx",             // MDX support
    
    // Formatting
    "esbenp.prettier-vscode",           // Prettier formatter
    
    // Git
    "eamodio.gitlens",                  // Git supercharged
    
    // Utilities
    "formulahendry.auto-rename-tag",    // Auto rename paired HTML tags
    "christian-kohler.path-intellisense", // Path autocomplete
    "ms-vscode.vscode-json-languageservice" // JSON validation
  ]
}
```

**Детальний опис розширень:**

**1. ESLint (`dbaeumer.vscode-eslint`)**

```yaml
Purpose: Real-time linting and code quality checks
Features:
  - Underline errors/warnings in code
  - Auto-fix on save
  - Custom rule configuration
  - TypeScript support

Configuration:
  - .eslint.config.mjs → Rule definitions
  - settings.json → Auto-fix on save

Example:
  # Red underline
  const unused = 5;  // ← ESLint: 'unused' is defined but never used
  
  # Auto-fix on save
  const x=5;const y=10  // Before save
  const x = 5; const y = 10;  // After save (auto-formatted)
```

**2. Tailwind CSS IntelliSense (`bradlc.vscode-tailwindcss`)**

```yaml
Purpose: Autocomplete and validation for Tailwind classes
Features:
  - Class name autocomplete
  - CSS preview on hover
  - Unknown class warnings
  - Color preview

Example:
  <div className="bg-blue-|">
                       ↑ cursor
  # Autocomplete shows:
  # bg-blue-50
  # bg-blue-100
  # bg-blue-500  ← Preview: 🟦 #3b82f6
  # bg-blue-600
  # ...

  # Hover preview:
  <div className="bg-blue-500">
                  ↑ hover shows:
  # background-color: rgb(59, 130, 246);
```

**3. TypeScript Nightly (`ms-vscode.vscode-typescript-next`)**

```yaml
Purpose: Latest TypeScript features and fixes
Features:
  - Faster type checking
  - Better error messages
  - Experimental features
  - Bug fixes before stable release

Configuration:
  "typescript.tsdk": "node_modules/typescript/lib"
```

**4. GitLens (`eamodio.gitlens`)**

```yaml
Purpose: Supercharged Git integration
Features:
  - Inline blame annotations
  - File history
  - Compare branches
  - Commit graph
  - Line history

Example:
  # Inline blame (end of line)
  const x = 5;  // John Doe, 2 days ago • Initial commit
  
  # Hover on line:
  ┌──────────────────────────────────────┐
  │ John Doe committed 2 days ago        │
  │ feat: Add initial implementation     │
  │ SHA: a1b2c3d                         │
  └──────────────────────────────────────┘
```

#### 3.3.1.3 Cerebras VS Code Extension

**Назва:** `cerebras.cerebras-chat`  
**Призначення:** AI-powered coding assistant

**Особливості для проєкту:**

```yaml
Integration:
  - Works with GitHub Copilot
  - Supports multiple models (GLM 4.6, Qwen 3, Llama 3.3)
  - Ultra-fast inference (2,000+ tokens/sec)

Usage in Project:
  - Code generation
  - Refactoring suggestions
  - Documentation generation
  - Bug fixes
  - Test generation

Example workflow:
  1. Select code block
  2. Ctrl+I (inline chat)
  3. Ask: "Explain this component"
  4. Cerebras generates detailed explanation
  5. Ask: "Add TypeScript types"
  6. Cerebras adds proper types
```

#### 3.3.1.4 Git + GitHub

**Git версія:** 2.40+

**Локальна Git конфігурація:**

```bash
# User setup
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Editor
git config --global core.editor "code --wait"

# Aliases
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.cm commit

# Line endings (Windows)
git config --global core.autocrlf true

# Line endings (macOS/Linux)
git config --global core.autocrlf input
```

**GitHub CLI (опціонально):**

```bash
# Installation
winget install GitHub.cli

# Login
gh auth login

# Useful commands
gh repo clone nkfed/vscode-cerebras-chat
gh pr create --title "Feature: Add new component"
gh pr list
gh pr view 42
gh pr merge 42
```

#### 3.3.1.5 ESLint

**Версія:** 9.x (Flat Config)  
**Конфігурація:** `eslint.config.mjs`

**Повна конфігурація:**

```javascript
/**
 * ESLint configuration for the project.
 */
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

export default tseslint.config(
  {
    ignores: [
      '.vscode-test',
      'out',
      '**/*.d.ts',
      '.next/',
      'node_modules/'
    ]
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
  },
  js.configs.recommended,              // ← Base JavaScript rules
  ...tseslint.configs.recommended,     // ← TypeScript recommended
  ...tseslint.configs.stylistic,       // ← Style rules
  {
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      // Code style
      'curly': 'warn',                 // Require curly braces
      '@stylistic/semi': ['warn', 'always'],  // Require semicolons
      
      // TypeScript
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/naming-convention': [
        'warn',
        {
          'selector': 'import',
          'format': ['camelCase', 'PascalCase']
        }
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          'argsIgnorePattern': '^_'  // Allow _unused
        }
      ]
    }
  }
);
```

**Правила ESLint у проєкті:**

| Правило | Рівень | Опис |
|---------|--------|------|
| `curly` | warn | Завжди використовувати `{}` для if/for |
| `@stylistic/semi` | warn | Обов'язкові крапки з комою `;` |
| `@typescript-eslint/no-unused-vars` | error | Заборона невикористаних змінних |
| `@typescript-eslint/naming-convention` | warn | camelCase/PascalCase для імпортів |

**Запуск ESLint:**

```bash
# Manual lint check
npm run lint

# Output example:
# ✓ No ESLint warnings or errors
# 
# (або)
# 
# /web/app/page.tsx
#   5:7  warning  'unused' is assigned a value but never used  @typescript-eslint/no-unused-vars
# 
# ✖ 1 problem (0 errors, 1 warning)
```

#### 3.3.1.6 TypeScript Compiler

**Версія:** 5.1.6  
**Конфігурація:** `tsconfig.json`

**Ключові налаштування:**

```jsonc
{
  "compilerOptions": {
    "strict": true,              // ✅ Сувора типізація
    "noEmit": true,              // ✅ Не генерувати .js (робить Next.js)
    "incremental": true,         // ✅ Incremental compilation
    "isolatedModules": true,     // ✅ Кожен файл - окремий модуль
    "skipLibCheck": true,        // ✅ Пропуск перевірки .d.ts
    
    "module": "ESNext",          // ✅ ES Modules
    "moduleResolution": "Bundler", // ✅ Next.js bundler
    "resolveJsonModule": true,   // ✅ Імпорт JSON файлів
    
    "jsx": "preserve",           // ✅ Не компілювати JSX (Next.js)
    "target": "ES2022",          // ✅ Сучасний JavaScript
    
    "plugins": [
      { "name": "next" }         // ✅ Next.js TypeScript plugin
    ]
  }
}
```

**TypeScript перевірка:**

```bash
# Type checking (manual)
npx tsc --noEmit

# Output:
# (no output = success)
# 
# (або)
# 
# app/page.tsx:12:5 - error TS2322: Type 'string' is not assignable to type 'number'.
# 
# 12     const x: number = "hello";
#        ~
# 
# Found 1 error in app/page.tsx:12
```

**VS Code інтеграція:**

```yaml
Real-time type checking:
  - Red underlines for errors
  - Yellow underlines for warnings
  - Hover tooltips with types
  - Auto-import suggestions
  - Refactoring tools

Example:
  const t = await getTranslations('uk');
        ↑ hover shows:
  # const t: Translations
  # 
  # type Translations = {
  #   header: { home: string; ... }
  #   footer: { ... }
  #   ...
  # }
```

### 3.3.2 Структура гілок (Git Branching Strategy)

#### 3.3.2.1 Основні гілки

**Git Flow (спрощений):**

```
┌────────────────────────────────────────────────────────┐
│              GIT BRANCHING STRATEGY                    │
├────────────────────────────────────────────────────────┤
│                                                        │
│  main (production)                                     │
│  ━━━━━━━━●━━━━━━━━━━━━━━●━━━━━━━━━━━━━━●━━━━━━━━━━►   │
│           ▲               ▲               ▲            │
│           │               │               │            │
│           merge           merge           merge        │
│           │               │               │            │
│  develop  │               │               │            │
│  ━━━●━━━━━┴━━━●━━━━━━━━━━┴━━━●━━━━━━━━━━┴━━━━━━━►    │
│     │          │               │                       │
│     │          │               │                       │
│     │          │               └── hotfix/critical-bug │
│     │          │                   ━━━━━━━━●━━━━━━►   │
│     │          │                                       │
│     │          └── feature/new-component               │
│     │              ━━━━━━━━━━━●━━━━━━━━━━━━►          │
│     │                                                  │
│     └── feature/add-localization                      │
│         ━━━━━━━●━━━━━━●━━━━━━━►                       │
│                                                        │
│  Legend:                                               │
│  ● = Commit                                            │
│  ━ = Branch timeline                                   │
│  ▲ = Merge point                                       │
└────────────────────────────────────────────────────────┘
```

**Опис гілок:**

| Гілка | Призначення | Lifetime | Deploy |
|-------|-------------|----------|--------|
| **main** | Production код | Permanent | ✅ Auto (Vercel Production) |
| **develop** | Інтеграційна гілка | Permanent | ✅ Preview (Vercel Preview) |
| **feature/*** | Нові функції | Temporary | ✅ Preview per PR |
| **bugfix/*** | Виправлення багів | Temporary | ✅ Preview per PR |
| **hotfix/*** | Критичні виправлення | Temporary | ✅ Direct to main |

#### 3.3.2.2 Naming Convention (Іменування гілок)

**Правила іменування:**

```bash
# Features
feature/add-registration-form
feature/implement-dark-mode
feature/integrate-analytics

# Bug fixes
bugfix/fix-login-validation
bugfix/resolve-mobile-layout
bugfix/correct-translation-keys

# Hotfixes (critical production bugs)
hotfix/security-patch
hotfix/critical-crash-fix

# Refactoring
refactor/restructure-components
refactor/optimize-build-process

# Documentation
docs/update-readme
docs/add-api-documentation

# Chores (maintenance)
chore/update-dependencies
chore/cleanup-unused-files
```

#### 3.3.2.3 Workflow гілок

**Typical workflow:**

```bash
# 1. Update develop branch
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/add-new-page

# 3. Work on feature (multiple commits)
git add app/new-page/page.tsx
git commit -m "feat: Add new page structure"

git add app/new-page/components/
git commit -m "feat: Add page components"

git add locales/ua.json locales/en.json
git commit -m "feat: Add translations for new page"

# 4. Push to remote
git push origin feature/add-new-page

# 5. Create Pull Request (GitHub UI or CLI)
gh pr create --base develop --head feature/add-new-page \
  --title "Feature: Add new page" \
  --body "Implements new page with translations and components"

# 6. Code review → Approve → Merge to develop

# 7. Delete feature branch
git branch -d feature/add-new-page
git push origin --delete feature/add-new-page

# 8. When ready for production
git checkout main
git merge develop
git push origin main
```

### 3.3.3 Форматування та лінтинг

#### 3.3.3.1 Автоматичне форматування (Prettier - опціонально)

**Статус:** Не використовується явно в проєкті

**Якби використовувався:**

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "avoid"
}
```

**Format on save (VS Code):**

```jsonc
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

#### 3.3.3.2 Linting процес

**Manual linting:**

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npx eslint --fix .

# Specific file
npx eslint app/page.tsx
```

**Automatic linting (VS Code):**

```yaml
On Type:
  - Red/Yellow underlines appear instantly
  - Hover for error details
  - Ctrl+. for quick fixes

On Save:
  - Auto-fix enabled issues (if configured)
  - Re-run linting automatically

Example:
  const x=5  // ← Warning: Missing semicolon
  
  # After save:
  const x = 5;  // ✅ Auto-fixed
```

#### 3.3.3.3 Pre-commit hooks (опціонально)

**Husky + lint-staged (якби використовувалися):**

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "git add"
    ]
  }
}
```

**Git commit workflow з hooks:**

```bash
git commit -m "feat: Add new component"
    ↓
husky pre-commit hook
    ↓
lint-staged (ESLint на змінених файлах)
    ↓
✅ Pass → Commit created
❌ Fail → Commit rejected (fix errors first)
```

### 3.3.4 Автогенерація типів

#### 3.3.4.1 Next.js Auto-Generated Types

**Розташування:** `.next/types/`

**Що генерується:**

```typescript
// .next/types/app/layout.ts
// Auto-generated by Next.js

export type RootLayoutProps = {
  children: React.ReactNode
}

export default function RootLayout(props: RootLayoutProps): JSX.Element


// .next/types/app/page.ts
export type HomePageProps = {
  params: {}
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function HomePage(props: HomePageProps): JSX.Element


// .next/types/app/registers/[slug]/page.ts
export type RegisterDetailProps = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export function generateStaticParams(): Promise<Array<{ slug: string }>>
export default function RegisterDetail(props: RegisterDetailProps): JSX.Element
```

**Використання auto-generated types:**

```typescript
// app/registers/[slug]/page.tsx
// TypeScript автоматично підбирає тип з .next/types/

export default async function RegisterDetail({ params }: { params: { slug: string } }) {
  //                                             ↑ Type inference from Next.js
  const slug = params.slug  // ← Type: string ✅
  
  return <div>{slug}</div>
}
```

#### 3.3.4.2 TypeScript Declaration Files

**Локалізації (auto-inferred):**

```typescript
// lib/useTranslations.ts
import uaTranslations from '../locales/ua.json'

type Translations = typeof uaTranslations  // ← Auto-generated type

export function useTranslations() {
  const [t, setTranslations] = useState<Translations>(uaTranslations)
  return { t, locale, setLocale }
}

// VS Code autocomplete:
const { t } = useTranslations()
t.header.home         // ✅ Type: string
t.header.invalid      // ❌ Error: Property does not exist
```

**JSON конфіги:**

```typescript
// config/notebooks.json → auto-typed
import notebooks from '../config/notebooks.json'

// TypeScript infers:
type Registry = {
  slug: string
  title: string
  description?: string
  statusUrl?: string
  links?: Array<{
    label: string
    url: string
    image?: string
  }>
}

const items: Registry[] = notebooks  // ✅ Type-safe
```

### 3.3.5 Hot Reload (Fast Refresh)

#### 3.3.5.1 Механізм Fast Refresh

**Архітектура:**

```
┌───────────────────────────────────────────────────────┐
│           FAST REFRESH MECHANISM                      │
├───────────────────────────────────────────────────────┤
│                                                       │
│  1. File Change Detection                             │
│     └─ Chokidar (File Watcher)                       │
│        Detects: *.tsx, *.ts, *.css, *.json           │
│                                                       │
│  2. Incremental Compilation                           │
│     ├─ Changed file only (not full rebuild)          │
│     ├─ TypeScript compilation (~50-200ms)            │
│     └─ Webpack HMR plugin                            │
│                                                       │
│  3. Module Replacement                                │
│     ├─ WebSocket connection to browser               │
│     ├─ Send updated module code                      │
│     └─ Browser receives HMR update                   │
│                                                       │
│  4. React Reconciliation                              │
│     ├─ Preserve component state                      │
│     ├─ Re-render affected components                 │
│     └─ Update DOM (minimal changes)                  │
│                                                       │
│  5. Result                                            │
│     └─ UI updated without full page reload ✅        │
│                                                       │
│  Performance:                                         │
│  ├─ File save → Browser update: ~100-300ms           │
│  ├─ State preserved: ✅                               │
│  └─ No page reload: ✅                                │
└───────────────────────────────────────────────────────┘
```

#### 3.3.5.2 Fast Refresh Scenarios

**Scenario 1: Editing component logic**

```typescript
// app/components/Header.tsx
"use client"
export default function Header() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <p>Hello World</p>  {/* ← Change this text */}
    </div>
  )
}

// User clicks +++ → count = 3
// Developer changes "Hello World" → "Goodbye World"
// Fast Refresh triggers
// Result: Text updates, count STILL = 3 ✅ (state preserved)
```

**Scenario 2: Adding new component**

```typescript
// Create new file: app/components/NewComponent.tsx
"use client"
export default function NewComponent() {
  return <div>New!</div>
}

// Import in existing file
import NewComponent from './NewComponent'

export default function Page() {
  return (
    <div>
      <NewComponent />  {/* ← Add this line */}
    </div>
  )
}

// Fast Refresh triggers
// Result: NewComponent appears instantly ✅
```

**Scenario 3: CSS changes**

```css
/* app/globals.css */
.container {
  max-width: 1024px;  /* Change to 1280px */
}

/* Fast Refresh triggers */
/* Result: Layout adjusts instantly, no reload ✅ */
```

**Scenario 4: Full reload required**

```typescript
// Cases that FORCE full page reload:

// 1. Server Component changes
export default async function ServerPage() {
  // ← Any change here → full reload
  const data = await getData()
  return <div>{data}</div>
}

// 2. Root layout changes
// app/layout.tsx
export default function RootLayout({ children }) {
  // ← Any change here → full reload
  return <html>...</html>
}

// 3. Environment variables
// .env.local changes → restart dev server required
```

### 3.3.6 Інтеграція з GitHub

#### 3.3.6.1 Pull Requests (PR) Workflow

**Створення PR:**

```bash
# Method 1: GitHub CLI
gh pr create \
  --base develop \
  --head feature/add-new-page \
  --title "Feature: Add new page" \
  --body "## Description
  
  Adds new documentation page with:
  - Responsive layout
  - Localization (UA/EN)
  - Mobile-friendly design
  
  ## Screenshots
  [Add screenshots]
  
  ## Checklist
  - [x] Tested locally
  - [x] Added translations
  - [x] Responsive design
  - [ ] Code review requested"

# Method 2: Git push + GitHub UI
git push origin feature/add-new-page
# Then: https://github.com/nkfed/vscode-cerebras-chat/compare
```

**PR Template (створити `.github/pull_request_template.md`):**

```markdown
## Description
<!-- Brief description of changes -->

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Refactoring
- [ ] Documentation update

## Screenshots (if applicable)
<!-- Add screenshots for UI changes -->

## Checklist
- [ ] Code compiles without errors
- [ ] ESLint passes (`npm run lint`)
- [ ] TypeScript type checking passes
- [ ] Tested in development (`npm run dev`)
- [ ] Tested production build (`npm run build`)
- [ ] Translations added (if applicable)
- [ ] Documentation updated (if applicable)

## Related Issues
Closes #123
```

#### 3.3.6.2 Code Review Process

**Review checklist:**

```yaml
Code Quality:
  ✅ Code follows project conventions
  ✅ No TypeScript errors
  ✅ ESLint passes
  ✅ No console.log() in production code
  ✅ Proper error handling

Performance:
  ✅ No unnecessary re-renders
  ✅ Images optimized (WebP, proper sizes)
  ✅ Bundle size acceptable
  ✅ No performance regressions

Security:
  ✅ No secrets in code
  ✅ Input validation
  ✅ XSS prevention
  ✅ Proper authentication/authorization

Testing:
  ✅ Manually tested in dev
  ✅ Production build tested
  ✅ Mobile responsive
  ✅ Cross-browser compatible

Documentation:
  ✅ Code comments (where needed)
  ✅ README updated (if applicable)
  ✅ API docs updated (if applicable)
```

**GitHub Review UI:**

```
┌──────────────────────────────────────────────────────┐
│  Pull Request #42: Feature: Add new page            │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Files changed (5)                                   │
│  ┌─ app/new-page/page.tsx         (+120 -0)         │
│  ┌─ locales/ua.json                (+15 -0)         │
│  ┌─ locales/en.json                (+15 -0)         │
│  └─ config/notebooks.json          (+8 -0)          │
│                                                      │
│  Review Comments:                                    │
│  ┌────────────────────────────────────────────────┐ │
│  │ @reviewer: Add error boundary for this page    │ │
│  │ app/new-page/page.tsx:12                       │ │
│  │                                                │ │
│  │ @author: Good point, will add in next commit  │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  [Approve] [Request Changes] [Comment]              │
└──────────────────────────────────────────────────────┘
```

#### 3.3.6.3 CI/CD Pipeline (Vercel Integration)

**Automatic deployments:**

```yaml
Trigger: Push to any branch
  ↓
Vercel Build:
  1. Clone repository
  2. Install dependencies (npm ci)
  3. Run build (npm run build)
  4. Deploy to preview URL
  ↓
Status Check on GitHub:
  ✅ Build successful
  ✅ Deployment ready
  📎 Preview URL: https://...vercel.app
  ↓
Merge Conditions:
  - ✅ Build passes
  - ✅ Code review approved
  - ✅ No merge conflicts
  ↓
Auto-deploy to production (if merged to main)
```

**Vercel deployment comments:**

```
GitHub PR Comment (автоматичний):
┌──────────────────────────────────────────────────┐
│ ✅ Vercel Bot commented 2 minutes ago            │
├──────────────────────────────────────────────────┤
│                                                  │
│ The latest updates on your projects:            │
│                                                  │
│ ✅ ehealth-portal – Build successful             │
│    📎 Preview: https://ehealth-portal-git-       │
│       feature-add-new-page.vercel.app            │
│                                                  │
│ Build Stats:                                     │
│ • Duration: 1m 32s                               │
│ • Bundle Size: 260 KB (gzip)                     │
│ • Pages: 19 static                               │
│                                                  │
│ [Visit Preview] [View Build Logs]                │
└──────────────────────────────────────────────────┘
```

### 3.3.7 Developer Workflow (Повний цикл)

**ASCII схема робочого циклу розробника:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    DEVELOPER WORKFLOW CYCLE                             │
│                   (Daily Development Process)                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. MORNING SYNC                                                        │
│     ┌──────────────────────────────────────────────────────────────┐   │
│     │ $ git checkout develop                                       │   │
│     │ $ git pull origin develop                                    │   │
│     │ $ cd web && npm install  # (якщо package.json змінився)     │   │
│     └──────────────────────────────────────────────────────────────┘   │
│                            ↓                                            │
│  2. CREATE FEATURE BRANCH                                               │
│     ┌──────────────────────────────────────────────────────────────┐   │
│     │ $ git checkout -b feature/add-analytics                      │   │
│     │ Switched to a new branch 'feature/add-analytics'             │   │
│     └──────────────────────────────────────────────────────────────┘   │
│                            ↓                                            │
│  3. START DEV SERVER                                                    │
│     ┌──────────────────────────────────────────────────────────────┐   │
│     │ $ npm run dev                                                │   │
│     │                                                              │   │
│     │ ▲ Next.js 14.0.0                                             │   │
│     │ - Local:    http://localhost:3000                            │   │
│     │ ✓ Ready in 2.3s                                              │   │
│     └──────────────────────────────────────────────────────────────┘   │
│                            ↓                                            │
│  4. OPEN VS CODE                                                        │
│     ┌──────────────────────────────────────────────────────────────┐   │
│     │ $ code .                                                     │   │
│     │                                                              │   │
│     │ Extensions active:                                           │   │
│     │ ✅ ESLint                                                    │   │
│     │ ✅ TypeScript                                                │   │
│     │ ✅ Tailwind CSS IntelliSense                                 │   │
│     │ ✅ GitLens                                                   │   │
│     │ ✅ Cerebras Chat                                             │   │
│     └──────────────────────────────────────────────────────────────┘   │
│                            ↓                                            │
│  5. DEVELOPMENT CYCLE (repeat)                                          │
│     ┌──────────────────────────────────────────────────────────────┐   │
│     │ ┌─────────────────────────────────────────────────────────┐ │   │
│     │ │ 5.1 Edit code                                           │ │   │
│     │ │     ├─ app/analytics/page.tsx                           │ │   │
│     │ │     ├─ locales/ua.json                                  │ │   │
│     │ │     └─ locales/en.json                                  │ │   │
│     │ └─────────────────────────────────────────────────────────┘ │   │
│     │                         ↓                                    │   │
│     │ ┌─────────────────────────────────────────────────────────┐ │   │
│     │ │ 5.2 Save (Ctrl+S)                                       │ │   │
│     │ │     ├─ ESLint auto-fix                                  │ │   │
│     │ │     ├─ TypeScript check                                 │ │   │
│     │ │     └─ Fast Refresh (~150ms)                            │ │   │
│     │ └─────────────────────────────────────────────────────────┘ │   │
│     │                         ↓                                    │   │
│     │ ┌─────────────────────────────────────────────────────────┐ │   │
│     │ │ 5.3 Test in browser                                     │ │   │
│     │ │     ├─ http://localhost:3000/analytics                  │ │   │
│     │ │     ├─ Check UI                                         │ │   │
│     │ │     ├─ Test interactions                                │ │   │
│     │ │     └─ Chrome DevTools (React DevTools)                 │ │   │
│     │ └─────────────────────────────────────────────────────────┘ │   │
│     │                         ↓                                    │   │
│     │ ┌─────────────────────────────────────────────────────────┐ │   │
│     │ │ 5.4 Fix issues / refine                                 │ │   │
│     │ │     └─ Go to 5.1 (repeat)                               │ │   │
│     │ └─────────────────────────────────────────────────────────┘ │   │
│     └──────────────────────────────────────────────────────────────┘   │
│                            ↓                                            │
│  6. COMMIT CHANGES (atomic commits)                                     │
│     ┌──────────────────────────────────────────────────────────────┐   │
│     │ $ git add app/analytics/page.tsx                             │   │
│     │ $ git commit -m "feat: Add analytics page structure"        │   │
│     │                                                              │   │
│     │ $ git add locales/ua.json locales/en.json                   │   │
│     │ $ git commit -m "feat: Add analytics translations"          │   │
│     │                                                              │   │
│     │ $ git add config/notebooks.json                             │   │
│     │ $ git commit -m "feat: Add analytics to menu"               │   │
│     └──────────────────────────────────────────────────────────────┘   │
│                            ↓                                            │
│  7. LOCAL BUILD TEST (before push)                                      │
│     ┌──────────────────────────────────────────────────────────────┐   │
│     │ $ npm run build                                              │   │
│     │                                                              │   │
│     │ ✓ Creating an optimized production build                    │   │
│     │ ✓ Compiled successfully                                     │   │
│     │ ✓ Generating static pages (19/19)                           │   │
│     │ ✓ Finalizing page optimization                              │   │
│     │                                                              │   │
│     │ Build completed in 1m 32s                                    │   │
│     │                                                              │   │
│     │ $ npm start  # Test production build                        │   │
│     │ ✓ Ready on http://localhost:3000                            │   │
│     └──────────────────────────────────────────────────────────────┘   │
│                            ↓                                            │
│  8. PUSH TO REMOTE                                                      │
│     ┌──────────────────────────────────────────────────────────────┐   │
│     │ $ git push origin feature/add-analytics                      │   │
│     │                                                              │   │
│     │ Enumerating objects: 12, done.                               │   │
│     │ Counting objects: 100% (12/12), done.                        │   │
│     │ Writing objects: 100% (7/7), 2.5 KiB | 2.5 MiB/s, done.     │   │
│     │                                                              │   │
│     │ To github.com:nkfed/vscode-cerebras-chat.git                 │   │
│     │  * [new branch]  feature/add-analytics -> feature/add-...   │   │
│     └──────────────────────────────────────────────────────────────┘   │
│                            ↓                                            │
│  9. CREATE PULL REQUEST                                                 │
│     ┌──────────────────────────────────────────────────────────────┐   │
│     │ $ gh pr create --base develop \                              │   │
│     │   --title "Feature: Add analytics page" \                    │   │
│     │   --body "Adds new analytics page with translations"         │   │
│     │                                                              │   │
│     │ https://github.com/.../pull/42                               │   │
│     │ ✅ Pull request created                                      │   │
│     └──────────────────────────────────────────────────────────────┘   │
│                            ↓                                            │
│  10. VERCEL AUTO-DEPLOY                                                 │
│      ┌─────────────────────────────────────────────────────────────┐   │
│      │ Vercel Bot commented:                                       │   │
│      │                                                             │   │
│      │ ✅ Build successful                                         │   │
│      │ 📎 Preview: https://ehealth-portal-git-feature-add-        │   │
│      │    analytics.vercel.app                                     │   │
│      │                                                             │   │
│      │ [Visit Preview] [View Logs]                                │   │
│      └─────────────────────────────────────────────────────────────┘   │
│                            ↓                                            │
│  11. CODE REVIEW                                                        │
│      ┌─────────────────────────────────────────────────────────────┐   │
│      │ Reviewer comments:                                          │   │
│      │ ✅ "LGTM! Looks good to merge"                              │   │
│      │                                                             │   │
│      │ Approved by: @team-lead                                     │   │
│      │ Status: ✅ All checks passed                                │   │
│      └─────────────────────────────────────────────────────────────┘   │
│                            ↓                                            │
│  12. MERGE TO DEVELOP                                                   │
│      ┌─────────────────────────────────────────────────────────────┐   │
│      │ $ gh pr merge 42 --squash                                   │   │
│      │                                                             │   │
│      │ ✅ Merged into develop                                      │   │
│      │ ✅ Branch deleted                                           │   │
│      │ ✅ Auto-deployed to preview environment                     │   │
│      └─────────────────────────────────────────────────────────────┘   │
│                            ↓                                            │
│  13. CLEANUP LOCAL                                                      │
│      ┌─────────────────────────────────────────────────────────────┐   │
│      │ $ git checkout develop                                      │   │
│      │ $ git pull origin develop                                   │   │
│      │ $ git branch -d feature/add-analytics                       │   │
│      │                                                             │   │
│      │ ✅ Ready for next feature!                                  │   │
│      └─────────────────────────────────────────────────────────────┘   │
│                            ↓                                            │
│  14. RELEASE TO PRODUCTION (when ready)                                 │
│      ┌─────────────────────────────────────────────────────────────┐   │
│      │ $ git checkout main                                         │   │
│      │ $ git merge develop                                         │   │
│      │ $ git push origin main                                      │   │
│      │                                                             │   │
│      │ → Triggers production deployment on Vercel                  │   │
│      │ ✅ Live at: https://ehealth-portal.vercel.app               │   │
│      └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘

Total cycle time: 2-4 hours (for medium feature)
Commits: 3-5 atomic commits
Reviews: 1-2 reviewers
Deployment: Automatic (Vercel)
```

---

**Дата створення:** 12 грудня 2025  
**Версія проєкту:** 0.1.0  
**Команда розробки:** 1-3 developers  
**Git Flow:** Feature branching + PR reviews
