# FinanceTrack — Architecture Diagrams

Visual diagrams of the system architecture, data flow, and component structure.

---

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Browser                          │
│  ┌──────────┐  ┌──────────  ┌──────────┐  ┌──────────┐        │
│  │ Landing  │  │Dashboard │  │Trans-    │  │ Reports  │        │
│  │ Page     │  │          │  │actions   │  │          │        │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘        │
│       └─────────────┴─────────────┴─────────────┘              │
│                        TanStack Query Cache                     │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTP/JSON
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Next.js 16 Application                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              API Routes (Edge Functions)                 │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│  │  │ /api/        │  │ /api/        │  │ /api/        │   │   │
│  │  │ dashboard    │  │ transactions │  │ categories   │   │   │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   │   │
│  │         └─────────────────┴─────────────────┘            │   │
│  │                    /api/accounts                         │   │
│  └───────────────────────────┬──────────────────────────────┘   │
│                              │                                   │
│  ┌───────────────────────────▼──────────────────────────────┐   │
│  │              Next.js API Routes Handler                  │   │
│  │  • Request validation                                    │   │
│  │  • Authentication checks                                 │   │
│  │  • Data transformation                                   │   │
│  │  • Error handling                                        │   │
│  └───────────────────────────┬──────────────────────────────┘   │
└──────────────────────────────┼──────────────────────────────────┘
                               │ Prisma v7 ORM
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                Prisma Client (Type-Safe ORM)                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  • User model operations                                 │   │
│  │  • Account model operations                              │   │
│  │  • Category model operations                             │   │
│  │  • Transaction model operations                          │   │
│  │  • Aggregate queries                                     │   │
│  │  • Relations & joins                                     │   │
│  └───────────────────────────┬──────────────────────────────┘   │
└──────────────────────────────┼──────────────────────────────────┘
                               │ Better-SQLite3 Adapter
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SQLite Database (dev.db)                    │
│  ┌──────────┐    ┌──────────┐    ┌──────────    ┌──────────┐  │
│  │  User    │    │ Account  │    │ Category │    │Trans-    │  │
│  │          │    │          │    │          │    │action    │  │
│  │ id (PK)  │    │ id (PK)  │    │ id (PK)  │    │ id (PK)  │  │
│  │ name     │    │ name     │    │ name     │    │ amount   │  │
│  │ email    │    │ type     │    │ icon     │    │ type     │  │
│  │ password │    │ balance  │    │ color    │    │ date     │  │
│  │ currency │    │ color    │    │ type     │    │ userId   │  │
│  └────┬─────┘    │ userId   │    │ userId   │    │ accountId│  │
│       │          └────┬─────┘    └────┬─────┘    │ categoryId│  │
│       │               │               │          └──────────┘  │
│       └───────────────┼───────────────┘                        │
│                       │ Foreign Keys                           │
└───────────────────────┴────────────────────────────────────────┘
```

---

## Data Flow Diagram

### Read Operation (Fetching Transactions)

```
User Action: "View Transactions"
       │
       ▼
┌──────────────────────┐
│ TransactionsPage     │
│ (React Component)    │
└──────────┬───────────┘
           │ useTransactions()
           │ hook called
           ▼
┌──────────────────────┐
│ TanStack Query       │
│ • Check cache        │
│ • If stale → fetch   │
│ • If fresh → return  │
└─────────────────────┘
           │ HTTP GET
           ▼
┌──────────────────────┐
│ /api/transactions    │
│ (Next.js API Route)  │
│ • Validate params    │
│ • Build where clause │
└─────────────────────┘
           │ Prisma Query
           ▼
┌──────────────────────┐
│ Prisma Client        │
│ • Type-safe query    │
│ • Generate SQL       │
└──────────┬───────────┘
           │ SQLite Query
           ▼
┌──────────────────────┐
│ SQLite Database      │
│ • Execute query      │
│ • Return results     │
└──────────┬───────────┘
           │ JSON Response
           ▼
┌──────────────────────┐
│ TanStack Query       │
│ • Cache response     │
│ • Update state       │
└──────────┬───────────┘
           │ Return data
           ▼
┌──────────────────────┐
│ TransactionsPage     │
│ • Render list        │
│ • Show loading/error │
└──────────────────────┘
```

### Write Operation (Creating Transaction)

```
User Action: "Add Transaction"
       │
       ▼
┌──────────────────────┐
│ Transaction Form     │
│ (React Component)    │
│ • Collect input      │
│ • Validate with Zod  │
└──────────┬───────────┘
           │ onSubmit()
           ▼
┌──────────────────────┐
│ useCreateTransaction │
│ (Mutation Hook)      │
│ • Optimistic update  │
└──────────┬───────────┘
           │ HTTP POST
           ▼
┌──────────────────────┐
│ /api/transactions    │
│ (Next.js API Route)  │
│ • Validate request   │
│ • Begin transaction  │
└──────────┬───────────┘
           │
           ├──────→ Update Account Balance
           │         (increment/decrement)
           │
           └──────→ Create Transaction
                     (INSERT INTO Transaction)
           │
           ▼
┌──────────────────────┐
│ Prisma Transaction   │
│ • Atomic operation   │
│ • Rollback on error  │
└──────────┬───────────┘
           ▼
┌──────────────────────┐
│ SQLite Database      │
│ • Execute queries    │
│ • Commit changes     │
└──────────┬───────────┘
           │ Success Response
           ▼
┌──────────────────────┐
│ useCreateTransaction │
│ • Invalidate cache   │
│   - transactions     │
│   - dashboard        │
│   - accounts         │
│ • Refetch queries    │
└──────────┬───────────┘
           │ Updated data
           ▼
┌──────────────────────┐
│ UI Updates           │
│ • Show success       │
│ • Refresh lists      │
│ • Update balances    │
└──────────────────────┘
```

---

## Component Architecture

### Page Component Hierarchy

```
RootLayout
├── Providers
│   ├── QueryClientProvider (TanStack Query)
│   ├── ThemeProvider (next-themes)
│   └── AuthProvider (custom auth context)
│
├── LandingPage (/)
│   ├── Hero Section
│   │   ├── Title & Description
│   │   └── CTA Buttons
│   ├── Feature Cards
│   │   ├── Feature 1: Real-time Tracking
│   │   ├── Feature 2: Smart Reports
│   │   ├── Feature 3: Multi-Account
│   │   └── Feature 4: Secure
│   └── Auth Forms
│       ├── Tabs (Sign In / Sign Up)
│       ├── Sign In Form
│       │   ├── Email Input
│       │   ├── Password Input
│       │   └── Submit Button
│       └── Sign Up Form
│           ├── Name Input
│           ├── Email Input
│           ├── Password Input
│           └── Submit Button
│
└── AppLayout (/(app))
    ├── Sidebar
    │   ├── Logo & Brand
    │   ├── Navigation Links
    │   │   ├── Dashboard
    │   │   ├── Transactions
    │   │   ├── Categories
    │   │   ├── Accounts
    │   │   ├── Reports
    │   │   └── Settings
    │   ├── Theme Toggle
    │   └── User Menu
    │       ├── User Avatar
    │       ├── User Name
    │       └── Sign Out Button
    │
    ├── DashboardPage
    │   ├── Summary Cards (4 cards)
    │   │   ├── Total Balance Card
    │   │   ├── Monthly Revenue Card
    │   │   ├── Monthly Expenses Card
    │   │   └── Net Income Card
    │   ├── Charts Row
    │   │   ├── Revenue vs Expenses (BarChart)
    │   │   └── Expense Breakdown (PieChart)
    │   └── Bottom Row
    │       ├── Recent Transactions List
    │       └── Accounts Overview
    │
    ├── TransactionsPage
    │   ├── Header (Title + Add Button)
    │   ├── Filters
    │   │   ├── Search Input
    │   │   └── Type Tabs (All/Revenue/Expense)
    │   ├── Transaction List
    │   │   └── Transaction Items (N items)
    │   │       ├── Icon
    │   │       ├── Description
    │   │       ├── Category & Account
    │   │       ├── Amount
    │   │       ├── Date
    │   │       ├── Edit Button
    │   │       └── Delete Button
    │   ├── Pagination
    │   │   ├── Previous Button
    │   │   ├── Page Number
    │   │   └── Next Button
    │   └── Create/Edit Dialog
    │       ├── Type Tabs
    │       ├── Description Input
    │       ├── Amount Input
    │       ├── Date Input
    │       ├── Account Select
    │       ├── Category Select
    │       ├── Recurring Toggle
    │       ├── Notes Textarea
    │       └── Submit Button
    │
    ├── CategoriesPage
    │   ├── Header (Title + Add Button)
    │   ├── Type Tabs (Expense/Revenue)
    │   └── Category Grid
    │       └── Category Cards (N cards)
    │           ├── Icon & Color
    │           ├── Name
    │           ├── Type Badge
    │           ├── Transaction Count
    │           ├── Edit Button
    │           └── Delete Button
    │
    ├── AccountsPage
    │   ├── Header (Title + Add Button)
    │   ├── Total Balance Banner
    │   └── Account Grid
    │       └── Account Cards (N cards)
    │           ├── Icon & Color
    │           ├── Name & Type
    │           ├── Balance
    │           ├── Transaction Count
    │           ├── Edit Button
    │           └── Delete Button
    │
    ├── ReportsPage
    │   ├── Header (Title + Period Toggle)
    │   ├── Quick Stats (4 metrics)
    │   │   ├── Revenue Change
    │   │   ├── Expense Change
    │   │   ├── Savings Rate
    │   │   └── Net This Month
    │   └── Chart Grid (4 charts)
    │       ├── Revenue vs Expenses (BarChart)
    │       ├── Savings Trend (AreaChart)
    │       ├── Expense Breakdown (PieChart)
    │       └── Net Income Trend (BarChart)
    │
    └── SettingsPage
        ├── Header (Title)
        ├── Profile Card
        │   ├── Avatar
        │   ├── Name Input
        │   ├── Email Input
        │   └── Save Button
        ├── Appearance Card
        │   └── Theme Toggle
        ├── Currency Card
        │   └── Currency Select
        ├── Notifications Card
        │   └── Notification Toggles
        └── Security Card
            └── Password Change
```

---

## Database Relationships

### Entity Relationship Diagram

```
┌──────────────────┐
│      User        │
│──────────────────│
│ id (PK)          │
│ name             │
│ email (unique)   │
│ password         │
│ avatar           │
│ currency         │
│ createdAt        │
│ updatedAt        │
└─────────────────┘
         │
         │ 1
         │
         │ *
         ▼
┌──────────────────┐         ┌──────────────────┐
│    Account       │◄────────│   Transaction    │
│──────────────────│         │──────────────────│
│ id (PK)          │    *    │ id (PK)          │
│ name             │◄────────│ amount           │
│ type             │         │ description      │
│ balance          │         │ type             │
│ color            │         │ date             │
│ isDefault        │         │ isRecurring      │
│ createdAt        │         │ recurrence       │
│ updatedAt        │         │ notes            │
│ userId (FK) ─────────────▶│ userId (FK)      │
└──────────────────┘         │ accountId (FK) ──┼──┐
                             │ categoryId (FK) ─┼──┼──┐
                             ──────────────────┘  │  │
                                                   │  │
                                                   │  │
                             ┌──────────────────┐  │  │
                             │    Category      │  │  │
                             │──────────────────│  │  │
                             │ id (PK)          │  │  │
                             │ name             │  │  │
                             │ icon             │  │  │
                             │ color            │  │  │
                             │ type             │  │  │
                             │ isDefault        │  │  │
                             │ createdAt        │  │  │
                             │ updatedAt        │  │  │
                             │ userId (FK) ─────┼──┘  │
                             └──────────────────┘     │
                                                       │
                    Relationships:                     │
                    • User 1──* Account                │
                    • User 1──* Category               │
                    • User 1──* Transaction            │
                    • Account 1──* Transaction ────────┘
                    • Category 1──* Transaction ───────
```

---

## Authentication Flow

### Sign-In Flow

```
┌──────────────┐
│ User enters  │
│ credentials  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Auth Context │
│ signIn()     │
│ function     │
└─────────────┘
       │
       ▼
┌──────────────┐      No       ┌──────────────┐
│ Validate     │──────────────►│ Throw Error  │
│ credentials  │               │              │
└──────┬───────┘               └──────────────┘
       │ Yes
       ▼
┌──────────────┐
│ Set user     │
│ in state     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Store in     │
│ localStorage │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Redirect to  │
│ /dashboard   │
└──────────────┘
```

### Route Protection Flow

```
┌──────────────┐
│ User navigates│
│ to /dashboard │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ AppLayout    │
│ component    │
│ loads        │
└──────┬───────┘
       │
       ▼
┌──────────────┐      false    ┌──────────────┐
│ Check auth   │──────────────►│ Redirect to  │
│ state        │               │ / (landing)  │
└──────┬───────┘               └──────────────┘
       │ true
       ▼
┌──────────────┐
│ Render       │
│ Sidebar +    │
│ Page Content │
└──────────────┘
```

---

## State Management Flow

### Client-Side State Architecture

```
┌─────────────────────────────────────────────────┐
│              React Components                   │
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────      │
│  │ Dashboard│  │Transactions│ │ Reports │      │
│  │          │  │          │  │         │      │
│  └────┬─────┘  └────┬─────  └────┬────┘      │
│       └─────────────┴─────────────┘            │
│                     │                           │
└─────────────────────┼───────────────────────────┘
                      │
        ┌─────────────▼─────────────┐
        │    TanStack Query Cache   │
        │                           │
        │  • Query results cached   │
        │  • Auto refetch on stale  │
        │  • Optimistic updates     │
        │  • Background refetching  │
        └─────────────┬─────────────┘
                      │
        ┌─────────────▼─────────────┐
        │    Custom Hooks Layer     │
        │                           │
        │  • useDashboard()         │
        │  • useTransactions()      │
        │  • useCategories()        │
        │  • useAccounts()          │
        │  • useCreateTransaction() │
        │  • etc.                   │
        └─────────────┬─────────────┘
                      │ HTTP
        ┌─────────────▼─────────────┐
        │    Next.js API Routes     │
        │                           │
        │  • /api/dashboard         │
        │  • /api/transactions      │
        │  • /api/categories        │
        │  • /api/accounts          │
        └───────────────────────────┘
```

### Server-Side State Flow

```
┌─────────────────────────────────────────────────┐
│             API Route Handler                   │
│                                                 │
│  1. Extract query params                        │
│  2. Validate input                              │
│  3. Check authentication (future)               │
│  4. Execute Prisma query                        │
│  5. Transform data                              │
│  6. Return JSON response                        │
└─────────────────────┬───────────────────────────┘
                      │
        ┌─────────────▼─────────────┐
        │      Prisma Client        │
        │                           │
        │  • Type-safe queries      │
        │  • SQL generation         │
        │  • Result transformation  │
        │  • Error handling         │
        └─────────────┬─────────────┘
                      │
        ┌─────────────▼─────────────┐
        │    SQLite Database        │
        │                           │
        │  • Data storage           │
        │  • Index optimization     │
        │  • Transaction support    │
        │  • ACID compliance        │
        └───────────────────────────┘
```

---

## Build Pipeline

### Development Build

```
┌──────────────┐
│ Source Code  │
│ (.ts/.tsx)   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Turbopack    │
│ (Bundler)    │
│ • Incremental│
│ • Hot reload │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ SWC          │
│ (Compiler)   │
│ • TypeScript │
│ • JSX/TSX    │
│ • Minify     │
└─────────────┘
       │
       ▼
┌──────────────┐
│ Browser      │
│ • Fast       │
│   refresh    │
│ • Source maps│
└──────────────┘
```

### Production Build

```
┌──────────────┐
│ Source Code  │
│ (.ts/.tsx)   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ npm run build│
│              │
│ 1. TypeScript│
│    check     │
│ 2. Compile   │
│ 3. Optimize  │
│ 4. Generate  │
│    static    │
│    pages     │
└──────┬───────┘
       │
       ├──→ Static Pages (SSG)
       │   • Pre-rendered HTML
       │   • Cached indefinitely
       │
       ├──→ Server Components
       │   • Rendered on server
       │   • Sent as HTML
       │
       └──→ Client Components
           • Hydrated in browser
           • Interactive
```

---

## Deployment Architecture

### Local Development

```
┌──────────────┐
│ Developer    │
│ Machine      │
│              │
│  ┌────────┐  │
│  │ Node.js│  │
│  │ 20.x   │  │
│  └───┬────┘  │
│      │       │
│  ┌───▼────┐  │
│  │ npm    │  │
│  │ run    │  │
│  │ dev    │  │
│  └───┬────┘  │
│      │       │
│  ┌───▼────┐  │
│  │ Next.js│  │
│  │ Dev    │  │
│  │ Server │  │
│  │ :3000  │  │
│  └───┬────┘  │
│      │       │
│  ┌───▼────┐  │
│  │SQLite  │  │
│  │dev.db  │  │
│  └────────┘  │
└──────────────┘
```

### Production Deployment (Future)

```
┌─────────────────────────────────────────┐
│           Cloud Provider                │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  Load Balancer / CDN              │  │
│  └───────────────┬───────────────────┘  │
│                  │                       │
│  ┌───────────────▼───────────────────┐  │
│  │  Next.js App Server (Vercel)      │  │
│  │  • Edge Functions                 │  │
│  │  • Serverless Functions           │  │
│  │  • Static Assets                  │  │
│  └───────────────┬───────────────────┘  │
│                  │                       │
│  ┌───────────────▼───────────────────┐  │
│  │  Database (PostgreSQL)            │  │
│  │  • Managed instance               │  │
│  │  • Connection pooling             │  │
│  │  • Backups                        │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## Performance Characteristics

### Page Load Performance

```
┌──────────────────────────────────────────────┐
│  First Contentful Paint (FCP)                │
│  Target: < 1.5s                              │
│  ┌──────────────────────────────────────┐    │
│  │ ████████████░░░░░░░░░░░░ 60%        │    │
│  └──────────────────────────────────────┘    │
├──────────────────────────────────────────────┤
│  Largest Contentful Paint (LCP)              │
│  Target: < 2.5s                              │
│  ┌──────────────────────────────────────┐    │
│  │ ██████████████████░░░░░░ 75%        │    │
│  └──────────────────────────────────────┘    │
├──────────────────────────────────────────────┤
│  Time to Interactive (TTI)                   │
│  Target: < 3.8s                              │
│  ┌──────────────────────────────────────┐    │
│  │ ████████████████░░░░░░░░ 67%        │    │
│  └──────────────────────────────────────┘    │
├──────────────────────────────────────────────┤
│  Cumulative Layout Shift (CLS)               │
│  Target: < 0.1                               │
│  ┌──────────────────────────────────────┐    │
│  │ ████████████████████████████░░░░ 83% │    │
│  └──────────────────────────────────────┘    │
└──────────────────────────────────────────────┘
```

### API Response Times

```
Dashboard API:     50-100ms  ██████░░░░░░░░░░░░░░ 30%
Transactions API:  100-200ms ████████████░░░░░░░░ 60%
Categories API:    30-60ms   ███░░░░░░░░░░░░░░░░░ 15%
Accounts API:      20-50ms   ██░░░░░░░░░░░░░░░░░░ 10%
```

---

## Security Architecture

```
┌─────────────────────────────────────────────┐
│         Security Layers                     │
│                                             │
│  Layer 1: Transport Security               │
│  ┌───────────────────────────────────────┐  │
│  │ • HTTPS/TLS encryption                │  │
│  │ • HSTS headers                        │  │
│  │ • Secure cookies (future)             │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  Layer 2: Authentication (Future)           │
│  ┌───────────────────────────────────────┐  │
│  │ • NextAuth.js                         │  │
│  │ • JWT tokens                          │  │
│  │ • httpOnly cookies                    │  │
│  │ • OAuth providers                     │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  Layer 3: Authorization (Future)            │
│  ┌───────────────────────────────────────┐  │
│  │ • Role-based access control           │  │
│  │ • Resource ownership checks           │  │
│  │ • API middleware validation           │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  Layer 4: Data Protection                   │
│  ┌───────────────────────────────────────┐  │
│  │ • Password hashing (bcrypt)           │  │
│  │ • Input validation (Zod)              │  │
│  │ • SQL injection prevention (Prisma)   │  │
│  │ • XSS prevention (React)              │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  Layer 5: Rate Limiting (Future)            │
│  ┌───────────────────────────────────────┐  │
│  │ • API rate limiting                   │  │
│  │ • DDoS protection                     │  │
│  │ • Brute force prevention              │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

---

**These diagrams provide a comprehensive visual guide to the FinanceTrack architecture.**

*Last Updated: May 2026*
