# DevStudio — Software Development Services Website

Сучасний, SEO-оптимізований сайт-візитка для надання послуг з розробки ПЗ.  
Побудовано на **Next.js 14 (App Router)** + **PostgreSQL** + **Prisma** + **Telegram Bot**.

---

## Технологічний стек

| Шар | Технологія |
|-----|-----------|
| Фреймворк | Next.js 14 (App Router, SSR) |
| Стилізація | Tailwind CSS |
| БД | PostgreSQL (Neon.tech / Supabase) |
| ORM | Prisma |
| i18n | next-intl (uk, en, pl, lt) |
| Авторизація | NextAuth.js (Credentials) |
| Сповіщення | Telegram Bot API |
| Хостинг | Render.com |

---

## Структура проекту

```
CatHouse_site/
├── messages/                      # Переклади (i18n)
│   ├── en.json
│   ├── uk.json
│   ├── pl.json
│   └── lt.json
├── prisma/
│   ├── schema.prisma              # Схема БД
│   └── seed.ts                    # Початкові дані
├── src/
│   ├── app/
│   │   ├── [locale]/              # Публічна багатомовна частина
│   │   │   ├── layout.tsx         # Root layout: SEO, JSON-LD, шрифти
│   │   │   ├── page.tsx           # Головна сторінка (Hero, CTA)
│   │   │   ├── services/
│   │   │   │   └── page.tsx       # Перелік послуг
│   │   │   ├── pricing/
│   │   │   │   └── page.tsx       # Прайс-лист
│   │   │   └── contact/
│   │   │       └── page.tsx       # Форма замовлення
│   │   ├── admin/                 # Захищена адмін-панель
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx           # Редирект → /admin/orders
│   │   │   ├── SessionProvider.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx       # Логін в адмінку
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx       # Список замовлень (server)
│   │   │   │   └── OrdersClient.tsx # Таблиця зі зміною статусів
│   │   │   └── services/
│   │   │       └── page.tsx       # Управління послугами
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/
│   │   │   │   └── route.ts       # NextAuth handler
│   │   │   └── orders/
│   │   │       └── route.ts       # POST/GET/PATCH замовлень
│   │   ├── sitemap.ts             # Авто-генерація sitemap.xml
│   │   └── robots.ts              # robots.txt
│   ├── components/
│   │   ├── Header.tsx             # Навігація + перемикач мови
│   │   ├── Footer.tsx
│   │   ├── LocaleSwitcher.tsx     # uk / en / pl / lt
│   │   ├── OrderForm.tsx          # Форма замовлення (client)
│   │   ├── ServiceCard.tsx
│   │   ├── PricingCard.tsx
│   │   └── JsonLd.tsx             # Schema.org JSON-LD разметка
│   ├── lib/
│   │   ├── prisma.ts              # Singleton PrismaClient
│   │   ├── telegram.ts            # sendOrderNotification()
│   │   └── auth.ts                # NextAuth config + bcryptjs
│   ├── types/
│   │   └── index.ts               # Спільні TypeScript типи
│   ├── i18n.ts                    # next-intl конфіг
│   └── globals.css                # Tailwind directives + CSS змінні
├── middleware.ts                  # i18n роутинг (пропускає /admin, /api)
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── .env.example                   # Шаблон змінних середовища
```

---

## Локальний запуск

### 1. Клонування та встановлення залежностей

```bash
git clone https://github.com/kotr228/cathouse_site.git
cd cathouse_site
npm install
```

### 2. Змінні середовища

```bash
cp .env.example .env.local
```

Відкрий `.env.local` і заповни:

```env
# PostgreSQL (Neon.tech або Supabase — безкоштовний тариф)
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# Telegram (отримай токен від @BotFather, chat_id від @userinfobot)
TELEGRAM_BOT_TOKEN="1234567890:ABCdefGHIjklMNOpqrSTUvwxYZ"
TELEGRAM_CHAT_ID="123456789"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="згенеруй: openssl rand -base64 32"

# Адмін (для seed-скрипту)
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="your-strong-password"

# Публічні змінні
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_NAME="DevStudio"
```

### 3. Ініціалізація бази даних

```bash
# Застосувати схему до БД
npm run db:push

# Заповнити початковими даними (послуги, ціни, адмін-користувач)
npx ts-node prisma/seed.ts
```

### 4. Запуск dev-сервера

```bash
npm run dev
```

Сайт доступний на **http://localhost:3000**

Автоматичний редирект: `http://localhost:3000` → `http://localhost:3000/uk`

### 5. Адмін-панель (локально)

```
URL:      http://localhost:3000/admin/login
Email:    значення ADMIN_EMAIL з .env.local
Password: значення ADMIN_PASSWORD з .env.local
```

---

## Доступні команди

```bash
npm run dev          # Dev-сервер з hot reload
npm run build        # Production build (prisma generate + next build)
npm run start        # Запуск production build
npm run lint         # ESLint перевірка
npm run db:push      # Синхронізація schema.prisma → БД (без міграцій)
npm run db:studio    # Prisma Studio — GUI для БД (http://localhost:5555)
```

---

## Деплой на Render.com

### 1. Створи новий **Web Service** на Render

| Параметр | Значення |
|----------|---------|
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |
| Node Version | 20 |

### 2. Environment Variables на Render

Додай ті самі змінні, що й у `.env.local`, але змінивши:

```env
NEXTAUTH_URL=https://your-app.onrender.com
NEXT_PUBLIC_SITE_URL=https://your-app.onrender.com
```

### 3. Після першого деплою — ініціалізуй БД

В розділі **Shell** на Render виконай:

```bash
npx prisma db push
npx ts-node prisma/seed.ts
```

---

## SEO-функціонал

- **Динамічні метатеги** — `generateMetadata()` на кожній сторінці для всіх 4 мов
- **Open Graph + Twitter Cards** — для коректного шерингу в соцмережах
- **sitemap.xml** — автоматично генерується для всіх мов і сторінок (`/sitemap.xml`)
- **robots.txt** — закриває `/admin` і `/api` від індексації (`/robots.txt`)
- **Schema.org JSON-LD** — розмітка `LocalBusiness` + `ProfessionalService` у `<head>`
- **Семантичний HTML** — `<header>`, `<main>`, `<footer>`, `<article>`, `<section>`

---

## Флоу обробки замовлення

```
Клієнт заповнює форму
        ↓
POST /api/orders
        ↓
Валідація даних
        ↓
Збереження в PostgreSQL (статус: NEW)
        ↓
Telegram-сповіщення → твій особистий чат
        ↓
Адмін бачить замовлення в /admin/orders
        ↓
Зміна статусу: NEW → IN_PROGRESS → COMPLETED
```

---

## Підтримувані мови

| Код | Мова | URL-префікс |
|-----|------|-------------|
| `uk` | Українська (default) | `/uk/` |
| `en` | English | `/en/` |
| `pl` | Polski | `/pl/` |
| `lt` | Lietuvių | `/lt/` |
