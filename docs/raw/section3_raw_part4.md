# 📋 ПАСПОРТ САЙТУ
## Розділ 3: Інфраструктура та середовище виконання (Частина 4)

---

## 3.4. 🔐 ЗМІННІ СЕРЕДОВИЩА (Environment Variables)

### 3.4.1 Статус використання змінних середовища

**Поточний стан проєкту:**

```yaml
Environment Variables Used: ❌ NO
Reason:
  ✅ Статичний сайт (SSG)
  ✅ Немає API keys
  ✅ Немає database connections
  ✅ Немає external services з автентифікацією
  ✅ Всі конфігурації в JSON файлах (config/notebooks.json)
  ✅ Локалізації через статичні файли (locales/*.json)
  ✅ Інтеграції через iframe/links (не потребують secrets)

Files:
  - .env.local         → ❌ Не існує
  - .env.production    → ❌ Не існує
  - .env.development   → ❌ Не існує
  - .env               → ❌ Не існує

Next.js Environment Variables:
  - NEXT_PUBLIC_* variables  → ❌ Не використовуються
  - Private variables        → ❌ Не використовуються
  - Vercel System variables  → ✅ Auto-injected (VERCEL_URL, VERCEL_ENV)
```

### 3.4.2 Vercel System Variables (Auto-Injected)

**Доступні автоматично на Vercel:**

```typescript
// Ці змінні доступні автоматично БЕЗ конфігурації
// app/api/registries/route.ts (якби використовувалися)

export async function GET() {
  // System variables (read-only, auto-injected by Vercel)
  const deploymentUrl = process.env.VERCEL_URL
  // → "ehealth-portal-git-main.vercel.app"
  
  const environment = process.env.VERCEL_ENV
  // → "production" | "preview" | "development"
  
  const region = process.env.VERCEL_REGION
  // → "iad1" (US East)
  
  const gitCommitSha = process.env.VERCEL_GIT_COMMIT_SHA
  // → "a1b2c3d4e5f6..."
  
  const gitCommitMessage = process.env.VERCEL_GIT_COMMIT_MESSAGE
  // → "feat: Add new feature"
  
  const gitRepoOwner = process.env.VERCEL_GIT_REPO_OWNER
  // → "nkfed"
  
  const gitRepoSlug = process.env.VERCEL_GIT_REPO_SLUG
  // → "vscode-cerebras-chat"
  
  const gitBranch = process.env.VERCEL_GIT_COMMIT_REF
  // → "main" | "develop" | "feature/xyz"
  
  return NextResponse.json({
    deployment: deploymentUrl,
    environment: environment,
    region: region,
    commit: gitCommitSha
  })
}
```

**Таблиця Vercel System Variables:**

| Змінна | Значення (приклад) | Доступність | Опис |
|--------|-------------------|-------------|------|
| `VERCEL_URL` | `ehealth-portal.vercel.app` | All | Deployment URL |
| `VERCEL_ENV` | `production` | All | Environment type |
| `VERCEL_REGION` | `iad1` | Serverless | Region code |
| `VERCEL_GIT_COMMIT_SHA` | `a1b2c3d...` | All | Git commit hash |
| `VERCEL_GIT_COMMIT_MESSAGE` | `feat: ...` | All | Commit message |
| `VERCEL_GIT_COMMIT_REF` | `main` | All | Branch name |
| `VERCEL_GIT_REPO_OWNER` | `nkfed` | All | Repository owner |
| `VERCEL_GIT_REPO_SLUG` | `vscode-cerebras-chat` | All | Repository name |

### 3.4.3 Потенційне використання змінних (Якби були потрібні)

#### 3.4.3.1 Приклад конфігурації (теоретичний)

**Сценарії, коли б знадобилися env variables:**

```yaml
Scenario 1: Підключення до Headless CMS
  Variables:
    - CONTENTFUL_SPACE_ID
    - CONTENTFUL_ACCESS_TOKEN
    - CONTENTFUL_PREVIEW_TOKEN

Scenario 2: Analytics Integration
  Variables:
    - NEXT_PUBLIC_GA_TRACKING_ID    # Google Analytics
    - NEXT_PUBLIC_HOTJAR_ID         # Hotjar
    - NEXT_PUBLIC_SENTRY_DSN        # Error tracking

Scenario 3: API Integration
  Variables:
    - API_BASE_URL
    - API_KEY
    - API_SECRET

Scenario 4: Database Connection
  Variables:
    - DATABASE_URL
    - DATABASE_POOL_SIZE

Scenario 5: Email Service
  Variables:
    - SMTP_HOST
    - SMTP_PORT
    - SMTP_USER
    - SMTP_PASSWORD

Scenario 6: Feature Flags
  Variables:
    - NEXT_PUBLIC_ENABLE_ANALYTICS=true
    - NEXT_PUBLIC_ENABLE_DARK_MODE=false
    - NEXT_PUBLIC_ENABLE_BETA_FEATURES=false
```

#### 3.4.3.2 Приклад `.env.local` (Development)

**Якби використовувався:**

```bash
# .env.local
# Local development environment variables
# This file is NOT committed to Git (.gitignore)

# ============================================
# PUBLIC VARIABLES (Available in browser)
# ============================================

# Site Configuration
NEXT_PUBLIC_SITE_NAME="eHealth Portal"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Analytics (Google Analytics)
NEXT_PUBLIC_GA_TRACKING_ID="G-XXXXXXXXXX"

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DEBUG_MODE=true
NEXT_PUBLIC_ENABLE_PREVIEW_BANNER=true

# API Endpoints
NEXT_PUBLIC_API_BASE_URL="http://localhost:8000/api"

# ============================================
# PRIVATE VARIABLES (Server-side only)
# ============================================

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ehealth_db"
DATABASE_POOL_SIZE=10

# External APIs
CONTENTFUL_SPACE_ID="abc123xyz"
CONTENTFUL_ACCESS_TOKEN="secret_token_here"
CONTENTFUL_PREVIEW_TOKEN="preview_token_here"

# Email Service (SendGrid)
SENDGRID_API_KEY="SG.xxxxxxxxxxxxx"
SENDGRID_FROM_EMAIL="noreply@ehealth.gov.ua"

# Authentication (NextAuth.js)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="development_secret_key_change_in_production"

# OAuth Providers
GOOGLE_CLIENT_ID="123456789.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="secret_client_secret"

# Encryption Keys
ENCRYPTION_KEY="32_character_encryption_key_"
JWT_SECRET="jwt_secret_key_for_tokens"

# Third-party Services
SENTRY_DSN="https://xxx@sentry.io/project"
STRIPE_SECRET_KEY="sk_test_xxxxxxxxxxxx"

# ============================================
# DEVELOPMENT TOOLS
# ============================================

# Logging
LOG_LEVEL="debug"
LOG_FILE_PATH="./logs/development.log"

# Debug
DEBUG="*"
NODE_ENV="development"
```

#### 3.4.3.3 Приклад `.env.production` (Production)

**Якби використовувався (на Vercel):**

```bash
# .env.production
# Production environment variables
# Configured in Vercel Dashboard → Settings → Environment Variables

# ============================================
# PUBLIC VARIABLES
# ============================================

NEXT_PUBLIC_SITE_NAME="eHealth Portal"
NEXT_PUBLIC_SITE_URL="https://portal.ehealth.gov.ua"

NEXT_PUBLIC_GA_TRACKING_ID="G-PRODUCTION_ID"

NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_DEBUG_MODE=false
NEXT_PUBLIC_ENABLE_PREVIEW_BANNER=false

NEXT_PUBLIC_API_BASE_URL="https://api.ehealth.gov.ua/v1"

# ============================================
# PRIVATE VARIABLES (Server-side)
# ============================================

DATABASE_URL="postgresql://prod_user:prod_password@db.ehealth.gov.ua:5432/ehealth_prod"
DATABASE_POOL_SIZE=50

CONTENTFUL_SPACE_ID="prod_space_id"
CONTENTFUL_ACCESS_TOKEN="prod_access_token"

SENDGRID_API_KEY="SG.production_key"
SENDGRID_FROM_EMAIL="noreply@ehealth.gov.ua"

NEXTAUTH_URL="https://portal.ehealth.gov.ua"
NEXTAUTH_SECRET="production_secret_key_very_secure"

GOOGLE_CLIENT_ID="prod_client_id"
GOOGLE_CLIENT_SECRET="prod_client_secret"

ENCRYPTION_KEY="production_32_char_key_secure"
JWT_SECRET="production_jwt_secret_secure"

SENTRY_DSN="https://production@sentry.io/project"
STRIPE_SECRET_KEY="sk_live_production_key"

LOG_LEVEL="error"
NODE_ENV="production"
```

### 3.4.4 Налаштування змінних на Vercel

#### 3.4.4.1 Vercel Dashboard Configuration

**Де налаштовувати:**

```
┌─────────────────────────────────────────────────────────┐
│         VERCEL DASHBOARD NAVIGATION                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Login to Vercel                                     │
│     https://vercel.com/login                            │
│                                                         │
│  2. Select Project                                      │
│     Projects → ehealth-portal                           │
│                                                         │
│  3. Open Settings                                       │
│     Project → Settings (top navigation)                 │
│                                                         │
│  4. Navigate to Environment Variables                   │
│     Settings → Environment Variables (sidebar)          │
│                                                         │
│  5. Add New Variable                                    │
│     ┌─────────────────────────────────────────────┐    │
│     │  Add New Environment Variable               │    │
│     ├─────────────────────────────────────────────┤    │
│     │                                             │    │
│     │  Name: NEXT_PUBLIC_GA_TRACKING_ID           │    │
│     │  Value: G-XXXXXXXXXX                        │    │
│     │                                             │    │
│     │  Environments:                              │    │
│     │  ☑ Production                               │    │
│     │  ☑ Preview                                  │    │
│     │  ☐ Development                              │    │
│     │                                             │    │
│     │  [Add]  [Cancel]                            │    │
│     └─────────────────────────────────────────────┘    │
│                                                         │
│  6. Redeploy Required                                   │
│     New variables apply on next deployment              │
│                                                         │
│     [Redeploy]                                          │
└─────────────────────────────────────────────────────────┘
```

**Environment Types на Vercel:**

| Type | Branch | URL Pattern | Use Case |
|------|--------|-------------|----------|
| **Production** | `main` | `ehealth-portal.vercel.app` | Production site |
| **Preview** | `feature/*`, PRs | `ehealth-portal-git-*.vercel.app` | Testing before merge |
| **Development** | Local | `localhost:3000` | Local development |

#### 3.4.4.2 Vercel CLI для змінних

**Команди Vercel CLI:**

```bash
# Login to Vercel
vercel login

# Link project
cd web/
vercel link

# List environment variables
vercel env ls

# Output:
# Environment Variables for ehealth-portal:
# 
# Production:
#   NEXT_PUBLIC_GA_TRACKING_ID=G-***
#   DATABASE_URL=postgresql://***
# 
# Preview:
#   NEXT_PUBLIC_GA_TRACKING_ID=G-***
#   DATABASE_URL=postgresql://***

# Add environment variable
vercel env add NEXT_PUBLIC_API_URL

# Interactive prompts:
# What's the value of NEXT_PUBLIC_API_URL?
# > https://api.ehealth.gov.ua
# 
# Add NEXT_PUBLIC_API_URL to which environments?
# ☑ Production
# ☑ Preview
# ☐ Development
# 
# ✅ Added environment variable

# Pull environment variables to local
vercel env pull .env.local

# Result: Creates .env.local with Vercel variables

# Remove environment variable
vercel env rm NEXT_PUBLIC_API_URL production
```

### 3.4.5 Next.js робота з Environment Variables

#### 3.4.5.1 Типи змінних у Next.js

**Public vs Private variables:**

```
┌────────────────────────────────────────────────────────────┐
│        NEXT.JS ENVIRONMENT VARIABLES TYPES                 │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  1. PUBLIC VARIABLES (Browser + Server)                    │
│     ┌──────────────────────────────────────────────────┐  │
│     │ Prefix: NEXT_PUBLIC_*                            │  │
│     │                                                  │  │
│     │ Example:                                         │  │
│     │   NEXT_PUBLIC_API_URL=https://api.example.com    │  │
│     │                                                  │  │
│     │ Usage (Client Component):                        │  │
│     │   "use client"                                   │  │
│     │   const apiUrl = process.env.NEXT_PUBLIC_API_URL │  │
│     │   // ✅ Works in browser                         │  │
│     │                                                  │  │
│     │ Bundle Impact:                                   │  │
│     │   ⚠️ Included in JavaScript bundle               │  │
│     │   ⚠️ Visible in browser DevTools                 │  │
│     │   ⚠️ DO NOT use for secrets!                     │  │
│     └──────────────────────────────────────────────────┘  │
│                                                            │
│  2. PRIVATE VARIABLES (Server-only)                        │
│     ┌──────────────────────────────────────────────────┐  │
│     │ Prefix: No prefix (or custom)                    │  │
│     │                                                  │  │
│     │ Example:                                         │  │
│     │   DATABASE_URL=postgresql://...                  │  │
│     │   API_SECRET_KEY=secret123                       │  │
│     │                                                  │  │
│     │ Usage (Server Component):                        │  │
│     │   export default async function Page() {         │  │
│     │     const db = process.env.DATABASE_URL          │  │
│     │     // ✅ Works on server                        │  │
│     │   }                                              │  │
│     │                                                  │  │
│     │ Usage (API Route):                               │  │
│     │   export async function GET() {                  │  │
│     │     const secret = process.env.API_SECRET_KEY    │  │
│     │     // ✅ Works on server                        │  │
│     │   }                                              │  │
│     │                                                  │  │
│     │ Bundle Impact:                                   │  │
│     │   ✅ NOT included in browser bundle              │  │
│     │   ✅ Secure (server-side only)                   │  │
│     └──────────────────────────────────────────────────┘  │
│                                                            │
│  3. BUILT-IN NEXT.JS VARIABLES                             │
│     ┌──────────────────────────────────────────────────┐  │
│     │ NODE_ENV                                         │  │
│     │   → "development" | "production" | "test"        │  │
│     │                                                  │  │
│     │ Usage:                                           │  │
│     │   if (process.env.NODE_ENV === 'development') { │  │
│     │     console.log('Debug mode')                    │  │
│     │   }                                              │  │
│     └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

#### 3.4.5.2 Load Order (Пріоритет завантаження)

**Порядок завантаження env files:**

```yaml
Priority (highest to lowest):
  1. process.env                    # System environment variables
  2. .env.$(NODE_ENV).local         # .env.production.local, .env.development.local
  3. .env.local                     # Loaded for all environments EXCEPT test
  4. .env.$(NODE_ENV)               # .env.production, .env.development, .env.test
  5. .env                           # Default fallback

Example (development):
  Load order:
    1. .env.development.local  (highest priority)
    2. .env.local
    3. .env.development
    4. .env                    (lowest priority)

Example (production):
  Load order:
    1. .env.production.local
    2. .env.local
    3. .env.production
    4. .env

Note:
  - If same variable in multiple files, higher priority wins
  - .local files are gitignored by default
```

#### 3.4.5.3 Build-time vs Runtime

**Коли доступні змінні:**

```typescript
// BUILD-TIME (Static Generation)
// app/page.tsx
export default function HomePage() {
  // ✅ NEXT_PUBLIC_* available at build time
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  // Value is INLINED into JavaScript during build
  
  return <div>API: {apiUrl}</div>
  // Compiled to: <div>API: https://api.example.com</div>
}

// RUNTIME (Server Components)
// app/page.tsx
export default async function HomePage() {
  // ✅ Private variables available at runtime
  const dbUrl = process.env.DATABASE_URL
  
  const data = await fetchFromDB(dbUrl)
  return <div>{data}</div>
}

// RUNTIME (API Routes)
// app/api/data/route.ts
export async function GET() {
  // ✅ All variables available (public + private)
  const apiKey = process.env.API_SECRET_KEY
  
  return NextResponse.json({ data: '...' })
}

// CLIENT COMPONENT (Browser)
// app/components/Client.tsx
"use client"
export default function Client() {
  // ✅ NEXT_PUBLIC_* available
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  
  // ❌ Private variables NOT available (undefined)
  const secret = process.env.API_SECRET_KEY  // undefined in browser
  
  return <div>API: {apiUrl}</div>
}
```

### 3.4.6 Критичні змінні для роботи сайту

**Поточний проєкт (статус):**

```yaml
Critical Variables: ❌ NONE

Reason:
  - Сайт працює без env variables
  - Всі конфігурації статичні (JSON files)
  - Немає залежностей від зовнішніх API
  - Немає database connections
  - Немає authentication/authorization

Site Functionality:
  ✅ Works without any environment variables
  ✅ All features operational
  ✅ No runtime dependencies on env
```

**Якби використовувалися (теоретично критичні):**

```yaml
Tier 1: CRITICAL (Site won't work without)
  - DATABASE_URL                    # Database connection
  - NEXTAUTH_SECRET                 # Authentication
  - ENCRYPTION_KEY                  # Data encryption

Tier 2: IMPORTANT (Features degraded)
  - NEXT_PUBLIC_API_URL             # API endpoint
  - CONTENTFUL_ACCESS_TOKEN         # CMS content
  - SENDGRID_API_KEY                # Email notifications

Tier 3: OPTIONAL (Nice to have)
  - NEXT_PUBLIC_GA_TRACKING_ID      # Analytics
  - SENTRY_DSN                      # Error tracking
  - NEXT_PUBLIC_ENABLE_DARK_MODE    # Feature flag
```

### 3.4.7 Security Best Practices

**Захист змінних середовища:**

```yaml
1. Never Commit Secrets to Git:
   ✅ Add to .gitignore:
      .env.local
      .env.*.local
      .env.production
   
   ❌ Never commit:
      - API keys
      - Database passwords
      - OAuth secrets
      - Encryption keys

2. Use Vercel Environment Variables:
   ✅ Store in Vercel Dashboard
   ✅ Encrypted at rest
   ✅ Different values per environment
   ✅ Access control (team permissions)

3. Rotate Secrets Regularly:
   ✅ Change API keys quarterly
   ✅ Update database passwords
   ✅ Regenerate JWT secrets

4. Use NEXT_PUBLIC_ Carefully:
   ⚠️ Only for non-sensitive data
   ⚠️ Visible in browser DevTools
   ⚠️ Included in JavaScript bundle
   
   ✅ Good: NEXT_PUBLIC_API_URL
   ❌ Bad: NEXT_PUBLIC_API_KEY

5. Validate Environment Variables:
   ✅ Check required vars at startup
   ✅ Type validation (numbers, URLs)
   ✅ Fail fast if missing critical vars

6. Use .env.example:
   ✅ Document required variables
   ✅ Provide example values (non-sensitive)
   ✅ Commit to Git for team reference
```

### 3.4.8 Приклад `.env.example` (Template)

**Файл для документації:**

```bash
# .env.example
# Environment Variables Template
# Copy this file to .env.local and fill in your values

# ============================================
# SITE CONFIGURATION
# ============================================

# Site URL (change for production)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Site Name
NEXT_PUBLIC_SITE_NAME="eHealth Portal"

# ============================================
# ANALYTICS (Optional)
# ============================================

# Google Analytics Tracking ID
# Get from: https://analytics.google.com
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX

# Hotjar Site ID
# Get from: https://www.hotjar.com
NEXT_PUBLIC_HOTJAR_ID=1234567

# ============================================
# API CONFIGURATION
# ============================================

# API Base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api

# API Key (Server-side only)
API_KEY=your_api_key_here

# ============================================
# DATABASE (Required for dynamic features)
# ============================================

# PostgreSQL Connection String
# Format: postgresql://user:password@host:port/database
DATABASE_URL=postgresql://postgres:password@localhost:5432/ehealth

# Database Pool Size
DATABASE_POOL_SIZE=10

# ============================================
# CONTENTFUL CMS (Optional)
# ============================================

# Contentful Space ID
CONTENTFUL_SPACE_ID=your_space_id

# Contentful Access Token
CONTENTFUL_ACCESS_TOKEN=your_access_token

# Contentful Preview Token (for draft content)
CONTENTFUL_PREVIEW_TOKEN=your_preview_token

# ============================================
# AUTHENTICATION (NextAuth.js)
# ============================================

# NextAuth URL
NEXTAUTH_URL=http://localhost:3000

# NextAuth Secret (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET=your_random_secret_key

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret

# ============================================
# EMAIL SERVICE (SendGrid)
# ============================================

# SendGrid API Key
SENDGRID_API_KEY=SG.your_api_key

# From Email Address
SENDGRID_FROM_EMAIL=noreply@example.com

# ============================================
# ERROR TRACKING (Sentry)
# ============================================

# Sentry DSN
SENTRY_DSN=https://your_key@sentry.io/project_id

# ============================================
# FEATURE FLAGS
# ============================================

# Enable/Disable Analytics
NEXT_PUBLIC_ENABLE_ANALYTICS=false

# Enable/Disable Debug Mode
NEXT_PUBLIC_ENABLE_DEBUG_MODE=true

# Enable/Disable Beta Features
NEXT_PUBLIC_ENABLE_BETA_FEATURES=false

# ============================================
# DEVELOPMENT SETTINGS
# ============================================

# Node Environment
NODE_ENV=development

# Log Level (debug, info, warn, error)
LOG_LEVEL=debug
```

### 3.4.9 ASCII схема взаємодії Environment Variables

```
┌────────────────────────────────────────────────────────────────────────┐
│          ENVIRONMENT VARIABLES FLOW DIAGRAM                            │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │                    DEVELOPMENT (Local)                           │ │
│  │                                                                  │ │
│  │  .env.local (gitignored)                                         │ │
│  │  ┌────────────────────────────────────────────────────────────┐ │ │
│  │  │ NEXT_PUBLIC_API_URL=http://localhost:8000                  │ │ │
│  │  │ DATABASE_URL=postgresql://localhost:5432/dev_db            │ │ │
│  │  │ API_KEY=dev_api_key                                        │ │ │
│  │  └────────────────────────────────────────────────────────────┘ │ │
│  │                           ↓                                      │ │
│  │  ┌────────────────────────────────────────────────────────────┐ │ │
│  │  │          Next.js Dev Server (npm run dev)                  │ │ │
│  │  │                                                            │ │ │
│  │  │  process.env.NEXT_PUBLIC_API_URL                           │ │ │
│  │  │  process.env.DATABASE_URL                                  │ │ │
│  │  │  process.env.API_KEY                                       │ │ │
│  │  └────────────────────────────────────────────────────────────┘ │ │
│  │                           ↓                                      │ │
│  │  ┌─────────────────────────┬────────────────────────────────┐  │ │
│  │  │  Server Components      │  Client Components             │  │ │
│  │  │  API Routes             │  (Browser)                     │  │ │
│  │  │                         │                                │  │ │
│  │  │  ✅ All variables       │  ✅ NEXT_PUBLIC_* only         │  │ │
│  │  │  ✅ DATABASE_URL        │  ❌ DATABASE_URL (undefined)   │  │ │
│  │  │  ✅ API_KEY             │  ❌ API_KEY (undefined)        │  │ │
│  │  └─────────────────────────┴────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │                    PRODUCTION (Vercel)                           │ │
│  │                                                                  │ │
│  │  Vercel Dashboard → Environment Variables                        │ │
│  │  ┌────────────────────────────────────────────────────────────┐ │ │
│  │  │ Name: NEXT_PUBLIC_API_URL                                  │ │ │
│  │  │ Value: https://api.ehealth.gov.ua                          │ │ │
│  │  │ Env: ☑ Production ☑ Preview                               │ │ │
│  │  ├────────────────────────────────────────────────────────────┤ │ │
│  │  │ Name: DATABASE_URL                                         │ │ │
│  │  │ Value: postgresql://prod.db:5432/prod_db                   │ │ │
│  │  │ Env: ☑ Production ☐ Preview                               │ │ │
│  │  ├────────────────────────────────────────────────────────────┤ │ │
│  │  │ Name: API_KEY                                              │ │ │
│  │  │ Value: prod_api_key_secret                                 │ │ │
│  │  │ Env: ☑ Production ☐ Preview                               │ │ │
│  │  └────────────────────────────────────────────────────────────┘ │ │
│  │                           ↓                                      │ │
│  │  ┌────────────────────────────────────────────────────────────┐ │ │
│  │  │          Vercel Build Process (npm run build)              │ │ │
│  │  │                                                            │ │ │
│  │  │  INLINE at build time:                                     │ │ │
│  │  │  ├─ NEXT_PUBLIC_API_URL → Bundled into JS                  │ │ │
│  │  │  │  Result: const apiUrl = "https://api.ehealth.gov.ua"    │ │ │
│  │  │                                                            │ │ │
│  │  │  RUNTIME access:                                           │ │ │
│  │  │  ├─ DATABASE_URL → Available in serverless functions       │ │ │
│  │  │  └─ API_KEY → Available in serverless functions            │ │ │
│  │  └────────────────────────────────────────────────────────────┘ │ │
│  │                           ↓                                      │ │
│  │  ┌────────────────────────────────────────────────────────────┐ │ │
│  │  │          Vercel Edge Network (Production)                  │ │ │
│  │  │                                                            │ │ │
│  │  │  Static Pages (SSG):                                       │ │ │
│  │  │  ├─ HTML generated at build time                           │ │ │
│  │  │  ├─ NEXT_PUBLIC_* inlined in HTML                          │ │ │
│  │  │  └─ Served from CDN (instant)                              │ │ │
│  │  │                                                            │ │ │
│  │  │  Serverless Functions (API Routes):                        │ │ │
│  │  │  ├─ Executed on-demand                                     │ │ │
│  │  │  ├─ Access to all env variables                            │ │ │
│  │  │  └─ DATABASE_URL, API_KEY available                        │ │ │
│  │  └────────────────────────────────────────────────────────────┘ │ │
│  │                           ↓                                      │ │
│  │  ┌─────────────────────────┬────────────────────────────────┐  │ │
│  │  │  Browser (End User)     │  Vercel Serverless             │  │ │
│  │  │                         │                                │  │ │
│  │  │  HTML + JavaScript      │  Node.js Runtime               │  │ │
│  │  │  ├─ NEXT_PUBLIC_API_URL │  ├─ All variables available    │  │ │
│  │  │  │  (visible in source) │  ├─ DATABASE_URL ✅            │  │ │
│  │  │  └─ No secrets 🔒       │  └─ API_KEY ✅                │  │ │
│  │  └─────────────────────────┴────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │                    SYSTEM VARIABLES (Auto-injected)              │ │
│  │                                                                  │ │
│  │  Available on Vercel (no configuration needed):                  │ │
│  │  ┌────────────────────────────────────────────────────────────┐ │ │
│  │  │ VERCEL_URL=ehealth-portal.vercel.app                       │ │ │
│  │  │ VERCEL_ENV=production                                      │ │ │
│  │  │ VERCEL_REGION=iad1                                         │ │ │
│  │  │ VERCEL_GIT_COMMIT_SHA=a1b2c3d...                           │ │ │
│  │  │ VERCEL_GIT_COMMIT_REF=main                                 │ │ │
│  │  └────────────────────────────────────────────────────────────┘ │ │
│  │                           ↓                                      │ │
│  │  Accessible in:                                                  │ │
│  │  ✅ Server Components                                            │ │
│  │  ✅ API Routes                                                   │ │
│  │  ❌ Client Components (undefined)                                │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │                    SECURITY LAYERS                               │ │
│  │                                                                  │ │
│  │  Layer 1: Git (.gitignore)                                       │ │
│  │  ├─ .env.local ❌ Not committed                                  │ │
│  │  ├─ .env.production ❌ Not committed                             │ │
│  │  └─ .env.example ✅ Committed (template)                         │ │
│  │                                                                  │ │
│  │  Layer 2: Vercel Dashboard                                       │ │
│  │  ├─ Encrypted at rest 🔒                                         │ │
│  │  ├─ Access control (team permissions) 🔐                         │ │
│  │  └─ Audit logs (who changed what) 📋                             │ │
│  │                                                                  │ │
│  │  Layer 3: Runtime Isolation                                      │ │
│  │  ├─ Server variables → Server-side only                          │ │
│  │  ├─ NEXT_PUBLIC_* → Browser (use carefully)                      │ │
│  │  └─ No secrets in client bundle 🚫                               │ │
│  └──────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

### 3.4.10 Troubleshooting Environment Variables

**Типові проблеми та рішення:**

```yaml
Problem 1: Variable is undefined
  Symptom:
    console.log(process.env.MY_VAR) // undefined
  
  Solutions:
    ✅ Check spelling (case-sensitive)
    ✅ Restart dev server (npm run dev)
    ✅ Check .env.local exists
    ✅ Use NEXT_PUBLIC_ for client-side
    ✅ Verify not in .gitignore accidentally

Problem 2: Variable not updating
  Symptom:
    Changed value but old value still used
  
  Solutions:
    ✅ Restart dev server (required!)
    ✅ Clear .next/cache/
    ✅ Check load order (.env.local overrides .env)

Problem 3: Variable works locally but not on Vercel
  Symptom:
    Works: npm run dev
    Fails: Vercel deployment
  
  Solutions:
    ✅ Add to Vercel Dashboard
    ✅ Redeploy after adding
    ✅ Check environment (Production/Preview)
    ✅ Verify capitalization

Problem 4: Secret exposed in browser
  Symptom:
    API key visible in DevTools Network tab
  
  Solutions:
    ❌ NEVER use NEXT_PUBLIC_ for secrets
    ✅ Move to server-side code
    ✅ Use API Route as proxy
    ✅ Rotate compromised keys

Problem 5: Build fails with missing variable
  Symptom:
    Error: NEXT_PUBLIC_API_URL is not defined
  
  Solutions:
    ✅ Add to .env.production
    ✅ Add to Vercel Dashboard
    ✅ Make variable optional (with fallback)
    ✅ Use environment-specific defaults
```

### 3.4.11 Migration Guide (Якщо додавати env variables)

**Поетапне впровадження:**

```yaml
Phase 1: Planning
  1. Identify which configs need to be dynamic
  2. Decide which variables need to be public vs private
  3. Document all required variables
  4. Create .env.example template

Phase 2: Local Setup
  1. Create .env.local file
  2. Add variables:
     NEXT_PUBLIC_API_URL=http://localhost:8000
     DATABASE_URL=postgresql://localhost:5432/dev
  3. Update .gitignore:
     .env.local
     .env*.local
  4. Test locally (npm run dev)

Phase 3: Code Changes
  1. Replace hardcoded values:
     // Before:
     const apiUrl = "https://api.example.com"
     
     // After:
     const apiUrl = process.env.NEXT_PUBLIC_API_URL
  
  2. Add TypeScript types:
     declare global {
       namespace NodeJS {
         interface ProcessEnv {
           NEXT_PUBLIC_API_URL: string
           DATABASE_URL: string
           API_KEY: string
         }
       }
     }
  
  3. Add validation:
     if (!process.env.DATABASE_URL) {
       throw new Error('DATABASE_URL is required')
     }

Phase 4: Vercel Configuration
  1. Login to Vercel Dashboard
  2. Navigate to Environment Variables
  3. Add production variables
  4. Add preview variables (if different)
  5. Trigger redeploy

Phase 5: Testing
  1. Test local development
  2. Test Vercel preview deployment
  3. Test production deployment
  4. Verify no secrets in browser
  5. Check all features work

Phase 6: Documentation
  1. Update README.md
  2. Document required variables
  3. Provide .env.example
  4. Add troubleshooting guide
```

---

**Дата створення:** 12 грудня 2025  
**Версія проєкту:** 0.1.0  
**Environment Variables Used:** ❌ NO (Static site)  
**Vercel System Variables:** ✅ Auto-injected (VERCEL_URL, VERCEL_ENV, etc.)
