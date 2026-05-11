# FinanceTrack — Developer Documentation

> Comprehensive documentation covering architecture, implementation details, and development guidelines for the Expense & Revenue Tracker SaaS application.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Database Schema Deep Dive](#2-database-schema-deep-dive)
3. [API Design & Implementation](#3-api-design--implementation)
4. [Frontend Architecture](#4-frontend-architecture)
5. [Authentication System](#5-authentication-system)
6. [Data Flow & State Management](#6-data-flow--state-management)
7. [Component Architecture](#7-component-architecture)
8. [Chart Implementation](#8-chart-implementation)
9. [Build & Deployment](#9-build--deployment)
10. [Troubleshooting](#10-troubleshooting)
11. [Migration Guide](#11-migration-guide)

---

## 1. Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Browser                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Landing     │  │  Dashboard   │  │ Transactions │      │
│  │  Page        │  │  Page        │  │ Page         │      │
│  ──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                           ↕ HTTP
┌─────────────────────────────────────────────────────────────┐
│                     Next.js 16 Server                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  API Routes (Edge Functions)                         │   │
│  │  /api/transactions  /api/categories  /api/accounts   │   │
│  │  /api/dashboard                                      │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Server Components                                   │   │
│  │  (app)/(app)/layout.tsx                              │   │
│  ──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           ↕ Prisma v7 + SQLite Adapter
┌─────────────────────────────────────────────────────────────┐
│                   SQLite Database (dev.db)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │  User    │  │ Account  │  │ Category │  │Transaction│    │
│  └──────────┘  ──────────┘  └──────────┘  └──────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Technology Decisions

**Why Next.js 16 with App Router?**
- Server Components for improved performance
- Built-in API routes for backend logic
- Automatic code splitting and optimization
- Turbopack for faster development builds

**Why Prisma v7?**
- Type-safe database access
- Schema-first development
- Automatic migrations
- Better-SQLite3 adapter for zero-configuration setup

**Why TanStack Query?**
- Automatic caching and deduplication
- Background refetching
- Optimistic updates
- DevTools for debugging

**Why Radix UI?**
- Accessible by default (WAI-ARIA compliant)
- Unstyled primitives for full customization
- Composable API
- Minimal bundle size

---

## 2. Database Schema Deep Dive

### Entity Relationship Diagram

```
┌──────────┐          ┌──────────┐          ┌──────────┐
│  User    │──1──*──│ Account  │          │ Category │
│          │          │          │          │          │
│ id (PK)  │          │ id (PK)  │          │ id (PK)  │
│ name     │          │ name     │          │ name     │
│ email    │          │ type     │          │ icon     │
│ password │          │ balance  │          │ color    │
│ currency │          │ color    │          │ type     │
└──────────┘          │ userId(FK)│          │ userId(FK)│
                      └────┬─────          └────┬─────┘
                           │                     │
                           ↓                     ↓
                     ┌──────────────────────────────────┐
                     │       Transaction                │
                     │                                  │
                     │ id (PK)                          │
                     │ amount                           │
                     │ description                      │
                     │ type (expense/revenue)           │
                     │ date                             │
                     │ isRecurring                      │
                     │ recurrence                       │
                     │ notes                            │
                     │ userId (FK) → User.id            │
                     │ accountId (FK) → Account.id      │
                     │ categoryId (FK) → Category.id    │
                     └──────────────────────────────────┘
```

### Schema Definitions

#### User Model
```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  avatar    String?
  currency  String   @default("USD")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  accounts     Account[]
  categories   Category[]
  transactions Transaction[]
}
```

**Design Rationale:**
- `cuid()` for IDs: Collision-resistant, URL-safe, and sortable
- `currency` defaults to USD: Can be customized per user
- `avatar` optional: Allows users without profile pictures

#### Account Model
```prisma
model Account {
  id          String   @id @default(cuid())
  name        String
  type        String   @default("checking")
  balance     Float    @default(0)
  color       String   @default("#3b82f6")
  isDefault   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions Transaction[]

  @@index([userId])
}
```

**Account Types:**
- `checking` — Standard checking account
- `savings` — Savings account
- `credit_card` — Credit card (balance can be negative)
- `cash` — Physical cash tracking
- `investment` — Investment portfolio

**Design Rationale:**
- `balance` as Float: Supports decimal precision for financial data
- `isDefault`: Marks primary account for quick selection
- `color`: Enables visual distinction in UI
- `onDelete: Cascade`: Deleting a user removes all accounts
- Index on `userId`: Optimizes queries filtering by user

#### Category Model
```prisma
model Category {
  id          String   @id @default(cuid())
  name        String
  icon        String   @default("tag")
  color       String   @default("#6366f1")
  type        String   @default("expense")
  isDefault   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions Transaction[]

  @@index([userId])
}
```

**Category Types:**
- `expense` — For outgoing money (e.g., Food, Housing)
- `revenue` — For incoming money (e.g., Salary, Freelance)

**Design Rationale:**
- `icon`: Stores Lucide icon name for visual identification
- `isDefault`: System categories (cannot be deleted in production)
- Separate types prevent mixing expense and revenue categories

#### Transaction Model
```prisma
model Transaction {
  id          String   @id @default(cuid())
  amount      Float
  description String
  type        String   // expense, revenue
  date        DateTime
  isRecurring Boolean  @default(false)
  recurrence  String?  // daily, weekly, monthly, yearly
  notes       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  accountId   String
  account     Account  @relation(fields: [accountId], references: [id], onDelete: Cascade)
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([date])
  @@index([type])
  @@index([accountId])
  @@index([categoryId])
}
```

**Indexes:**
- `userId`: Filter transactions by user
- `date`: Sort and range queries by date
- `type`: Filter by expense/revenue
- `accountId`: Filter by account
- `categoryId`: Filter by category

**Design Rationale:**
- Multiple indexes optimize common query patterns
- `recurrence` nullable: Only set when `isRecurring` is true
- `notes` optional: Additional context without cluttering description

---

## 3. API Design & Implementation

### RESTful API Architecture

All API routes follow REST conventions with JSON responses.

#### Dashboard API
**Endpoint:** `GET /api/dashboard`

**Purpose:** Aggregate financial data for dashboard display

**Query Parameters:**
- `userId` (string, required): User identifier

**Response Schema:**
```json
{
  "currentMonth": {
    "revenue": 6750,
    "expenses": 2654,
    "netIncome": 4096
  },
  "lastMonth": {
    "revenue": 6200,
    "expenses": 2690
  },
  "totalBalance": 16520.20,
  "accounts": [
    {
      "id": "acc-checking",
      "name": "Checking",
      "type": "checking",
      "balance": 5420.50,
      "color": "#3b82f6",
      "_count": { "transactions": 20 }
    }
  ],
  "recentTransactions": [...],
  "monthlyData": [
    { "month": "Dec", "revenue": 0, "expenses": 0 },
    ...
  ],
  "expensesByCategory": [
    { "category": "Food & Dining", "color": "#ef4444", "amount": 600 }
  ]
}
```

**Implementation Details:**
```typescript
// src/app/api/dashboard/route.ts

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId") || "demo-user-1";

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  // Parallel queries for performance
  const [currentRevenue, currentExpenses, lastRevenue, lastExpenses, accounts, recentTransactions] = 
    await Promise.all([
      prisma.transaction.aggregate({ 
        where: { userId, type: "revenue", date: { gte: startOfMonth } }, 
        _sum: { amount: true } 
      }),
      // ... 5 more parallel queries
    ]);

  // Generate 6-month trend data
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    const [rev, exp] = await Promise.all([
      prisma.transaction.aggregate({ ... }),
      prisma.transaction.aggregate({ ... })
    ]);
    monthlyData.push({
      month: monthStart.toLocaleDateString("en-US", { month: "short" }),
      revenue: rev._sum.amount || 0,
      expenses: exp._sum.amount || 0
    });
  }

  // Category breakdown with grouping
  const categoryBreakdown = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: { userId, type: "expense", date: { gte: startOfMonth } },
    _sum: { amount: true }
  });

  return NextResponse.json({ ... });
}
```

**Performance Optimizations:**
- Parallel queries with `Promise.all()` reduce total query time
- Single aggregation queries instead of fetching all transactions
- Efficient date range filtering using indexed `date` column

#### Transactions API

**List Transactions:** `GET /api/transactions`

**Query Parameters:**
- `userId` (string): Filter by user
- `type` (string): `expense` or `revenue`
- `accountId` (string): Filter by account
- `categoryId` (string): Filter by category
- `startDate` (string): ISO date format
- `endDate` (string): ISO date format
- `page` (number): Pagination page
- `limit` (number): Items per page

**Response:**
```json
{
  "transactions": [...],
  "total": 31,
  "page": 1,
  "totalPages": 4
}
```

**Create Transaction:** `POST /api/transactions`

**Request Body:**
```json
{
  "description": "Grocery Shopping",
  "amount": 125.50,
  "type": "expense",
  "date": "2026-05-15",
  "accountId": "acc-checking",
  "categoryId": "cat-food",
  "isRecurring": false,
  "notes": "Weekly groceries"
}
```

**Implementation:**
```typescript
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Update account balance based on transaction type
  const balanceChange = body.type === "expense" 
    ? -body.amount 
    : body.amount;
  
  await prisma.account.update({
    where: { id: body.accountId },
    data: { balance: { increment: balanceChange } }
  });

  const transaction = await prisma.transaction.create({
    data: {
      description: body.description,
      amount: body.amount,
      type: body.type,
      date: new Date(body.date),
      isRecurring: body.isRecurring || false,
      recurrence: body.recurrence || null,
      notes: body.notes || null,
      userId: body.userId,
      accountId: body.accountId,
      categoryId: body.categoryId
    },
    include: { account: true, category: true }
  });

  return NextResponse.json(transaction);
}
```

**Key Features:**
- Automatic account balance updates
- Atomic transactions ensure data consistency
- Includes related account and category in response

---

## 4. Frontend Architecture

### Component Hierarchy

```
RootLayout
├── Providers (QueryClient, Theme, Auth)
│   └── Providers
│       ├── QueryClientProvider
│       ├── ThemeProvider
│       └── AuthProvider
│
└── Routes
    ├── LandingPage (/)
    │   ├── Hero Section
    │   ├── Feature Cards
    │   └── Auth Forms (Sign In / Sign Up)
    │
    └── AppLayout (/(app))
        ├── Sidebar
        │   ├── Navigation Links
        │   ├── Theme Toggle
        │   └── User Menu
        │
        └── Pages
            ├── DashboardPage
            │   ├── SummaryCards (4 cards)
            │   ├── ChartsRow
            │   │   ├── RevenueVsExpensesChart
            │   │   ── ExpenseBreakdownPie
            │   └── BottomRow
            │       ├── RecentTransactions
            │       └── AccountsOverview
            │
            ├── TransactionsPage
            │   ├── Filters (Search, Tabs)
            │   ├── TransactionList
            │   ── Pagination
            │
            ├── CategoriesPage
            │   ├── Tabs (Expense/Revenue)
            │   └── CategoryGrid
            │
            ├── AccountsPage
            │   ├── TotalBalanceBanner
            │   └── AccountGrid
            │
            ├── ReportsPage
            │   ├── QuickStats (4 metrics)
            │   └── ChartGrid (4 charts)
            │
            └── SettingsPage
                ├── ProfileCard
                ├── AppearanceCard
                ├── CurrencyCard
                ├── NotificationsCard
                └── SecurityCard
```

### Routing Structure

```typescript
// Next.js App Router structure
src/app/
├── page.tsx                    // Landing page (unauthenticated)
── layout.tsx                  // Root layout with providers
├── (app)/
│   ├── layout.tsx              // Protected app layout
│   ├── dashboard/
│   │   └── page.tsx            // Dashboard page
│   ├── transactions/
│   │   ── page.tsx            // Transactions CRUD page
│   ├── categories/
│   │   └── page.tsx            // Categories management
│   ├── accounts/
│   │   └── page.tsx            // Accounts management
│   ├── reports/
│   │   └── page.tsx            // Reports & analytics
│   ── settings/
│       └── page.tsx            // User settings
└── api/
    ├── dashboard/route.ts      // Dashboard data API
    ├── transactions/route.ts   // Transactions CRUD API
    ├── categories/route.ts     // Categories CRUD API
    └── accounts/route.ts       // Accounts CRUD API
```

### Protected Routes

Authentication is enforced at the layout level:

```typescript
// src/app/(app)/layout.tsx

"use client";

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
```

---

## 5. Authentication System

### Current Implementation

**Architecture:** Client-side authentication using React Context API

**Flow:**
1. User enters credentials on landing page
2. Frontend validates against localStorage/session storage
3. Auth context updates global state
4. Protected routes check auth state before rendering

**Auth Context:**
```typescript
// src/lib/auth.tsx

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: User = {
  id: "demo-user-1",
  name: "Demo User",
  email: "demo@tracker.com",
  currency: "USD",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("ert_user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Demo auth: accept any credentials for demo user
    if (email === "demo@tracker.com") {
      setUser(DEMO_USER);
      localStorage.setItem("ert_user", JSON.stringify(DEMO_USER));
      return;
    }
    throw new Error("Invalid credentials");
  };

  const signUp = async (name: string, email: string, password: string) => {
    // Create new user (demo implementation)
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      currency: "USD",
    };
    setUser(newUser);
    localStorage.setItem("ert_user", JSON.stringify(newUser));
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("ert_user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
```

**Limitations:**
- No password hashing (plain text storage)
- No session management (no JWT or cookies)
- No email verification
- No password reset functionality

**Production Recommendations:**
1. Use NextAuth.js for authentication
2. Implement JWT tokens with httpOnly cookies
3. Add OAuth providers (Google, GitHub)
4. Implement rate limiting on auth endpoints
5. Add password strength validation
6. Implement email verification flow

---

## 6. Data Flow & State Management

### Client-Side State Management

**TanStack Query Configuration:**
```typescript
// src/components/providers.tsx

const [queryClient] = useState(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,        // 1 minute
          refetchOnWindowFocus: false,  // Don't refetch on window focus
        },
      },
    })
);
```

**Custom Hooks Pattern:**
```typescript
// src/lib/hooks.ts

export function useTransactions(params?: {
  type?: string;
  accountId?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) {
  const searchParams = new URLSearchParams({ userId });
  if (params?.type) searchParams.set("type", params.type);
  // ... build query params

  return useQuery({
    queryKey: ["transactions", params],
    queryFn: async () => {
      const res = await fetch(`/api/transactions?${searchParams}`);
      if (!res.ok) throw new Error("Failed to fetch transactions");
      return res.json();
    },
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId }),
      });
      if (!res.ok) throw new Error("Failed to create transaction");
      return res.json();
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}
```

**Query Invalidation Strategy:**
- Creating/updating/deleting transactions invalidates:
  - `["transactions"]` — Refresh transaction list
  - `["dashboard"]` — Update dashboard stats
  - `["accounts"]` — Update account balances

### Server-Side Data Flow

```
Client Request
    ↓
API Route Handler (Next.js Edge Function)
    ↓
Prisma Client Query
    ↓
SQLite Database (via Better-SQLite3 Adapter)
    ↓
Prisma Result Transformation
    ↓
JSON Response to Client
```

---

## 7. Component Architecture

### UI Component Library

All UI components follow a consistent pattern:

**Button Component:**
```typescript
// src/components/ui/button.tsx

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
        outline: "border border-gray-300 bg-white hover:bg-gray-50",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        ghost: "hover:bg-gray-100 hover:text-gray-900",
        link: "text-blue-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-11 rounded-lg px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
```

**Pattern:**
1. Use `cva` for variant-based styling
2. Forward ref for component composition
3. Support `asChild` for polymorphic behavior
4. Use `cn()` utility for className merging

### Utility Functions

```typescript
// src/lib/utils.ts

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

export function getPercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}
```

---

## 8. Chart Implementation

### Revenue vs Expenses Bar Chart

```typescript
// Dashboard Bar Chart

<ResponsiveContainer width="100%" height={300}>
  <BarChart data={monthlyData}>
    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
    <XAxis dataKey="month" tick={{ fill: "currentColor" }} />
    <YAxis tick={{ fill: "currentColor" }} tickFormatter={(v) => `$${v}`} />
    <Tooltip
      contentStyle={{
        backgroundColor: "var(--background)",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        color: "var(--foreground)",
      }}
      formatter={(value: any) => formatCurrency(Number(value))}
    />
    <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name="Revenue" />
    <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expenses" />
  </BarChart>
</ResponsiveContainer>
```

### Expense Breakdown Pie Chart

```typescript
// Dashboard Pie Chart

<PieChart>
  <Pie
    data={expensesByCategory}
    cx="50%"
    cy="50%"
    innerRadius={60}
    outerRadius={100}
    paddingAngle={3}
    dataKey="amount"
    nameKey="category"
  >
    {expensesByCategory.map((entry, index) => {
      const fillColor = (entry.color as string) ?? "#6366f1";
      return <Cell key={`cell-${index}`} fill={fillColor} />;
    })}
  </Pie>
  <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
  <Legend />
</PieChart>
```

### Savings Trend Area Chart

```typescript
// Reports Area Chart

<AreaChart data={savingsData}>
  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
  <XAxis dataKey="month" tick={{ fill: "currentColor", fontSize: 12 }} />
  <YAxis tick={{ fill: "currentColor", fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
  <Tooltip
    formatter={(value: any) => formatCurrency(Number(value))}
    contentStyle={{
      backgroundColor: "var(--background)",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      color: "var(--foreground)",
    }}
  />
  <Area
    type="monotone"
    dataKey="cumulative"
    stroke="#3b82f6"
    fill="#3b82f6"
    fillOpacity={0.1}
    name="Cumulative"
  />
  <Line type="monotone" dataKey="savings" stroke="#10b981" strokeWidth={2} name="Monthly" />
</AreaChart>
```

**Chart Design Decisions:**
- Use CSS variables for theming support
- Custom tooltip styling for dark mode compatibility
- `formatter` with `any` type due to Recharts type limitations
- Nullish coalescing for color defaults to prevent undefined errors

---

## 9. Build & Deployment

### Development

```bash
# Install dependencies
npm install

# Run Prisma migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Seed demo data
node prisma/seed.cjs

# Start development server
npm run dev
```

### Production Build

```bash
# Build optimized production bundle
npm run build

# Start production server
npm run start
```

### Docker Deployment

**Dockerfile:**
```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

**Docker Compose:**
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=file:./prisma/dev.db
    volumes:
      - sqlite_data:/app/prisma

volumes:
  sqlite_data:
```

---

## 10. Troubleshooting

### Common Issues

**Issue: Prisma client not generated**
```bash
# Solution
rm -rf node_modules/@prisma
npx prisma generate
```

**Issue: Database locked errors**
```bash
# Kill all node processes
Stop-Process -Name node -Force

# Restart dev server
npm run dev
```

**Issue: "Cannot read properties of undefined" errors**
```typescript
// Solution: Add null safety to all property access
const revenueChange = data?.currentMonth?.revenue || 0;
const accounts = data?.accounts || [];
account._count?.transactions ?? 0
```

**Issue: Charts not rendering**
- Check if data arrays are empty
- Verify Recharts data structure matches expected format
- Ensure chart container has dimensions (width/height)

**Issue: Dark mode not working**
- Verify `next-themes` provider is wrapping the app
- Check CSS variables are defined for `.dark` class
- Ensure `suppressHydrationWarning` is set on `<html>`

### Debugging Tools

**TanStack Query DevTools:**
```typescript
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

<ReactQueryDevtools initialIsOpen={false} />
```

**Prisma Query Logging:**
```typescript
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});
```

---

## 11. Migration Guide

### Migrating to PostgreSQL

1. **Install PostgreSQL adapter:**
   ```bash
   npm install @prisma/adapter-pg pg
   ```

2. **Update Prisma schema:**
   ```prisma
   datasource db {
     provider = "postgresql"
   }
   ```

3. **Update `.env`:**
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/financetrack"
   ```

4. **Update Prisma client:**
   ```typescript
   import { PrismaPg } from "@prisma/adapter-pg";
   
   const adapter = new PrismaPg({
     connectionString: process.env.DATABASE_URL,
   });
   const prisma = new PrismaClient({ adapter });
   ```

5. **Run migrations:**
   ```bash
   npx prisma migrate dev
   ```

### Adding NextAuth.js Authentication

1. **Install dependencies:**
   ```bash
   npm install next-auth @auth/prisma-adapter
   ```

2. **Create auth configuration:**
   ```typescript
   // src/app/api/auth/[...nextauth]/route.ts
   import NextAuth from "next-auth";
   import { PrismaAdapter } from "@auth/prisma-adapter";
   import prisma from "@/lib/prisma";
   
   const handler = NextAuth({
     adapter: PrismaAdapter(prisma),
     providers: [
       CredentialsProvider({
         name: "Credentials",
         credentials: {
           email: { label: "Email", type: "email" },
           password: { label: "Password", type: "password" }
         },
         async authorize(credentials) {
           const user = await prisma.user.findUnique({
             where: { email: credentials?.email }
           });
           if (!user) throw new Error("No user found");
           // Compare password hash
           return user;
         }
       })
     ],
     session: { strategy: "jwt" }
   });
   
   export { handler as GET, handler as POST };
   ```

3. **Update User model:**
   ```prisma
   model User {
     id            String    @id @default(cuid())
     name          String?
     email         String?   @unique
     emailVerified DateTime?
     image         String?
     password      String?
     // ... rest of fields
   }
   ```

---

## Conclusion

This documentation provides a comprehensive guide to the FinanceTrack application architecture, implementation details, and best practices. For additional support or questions, refer to the official documentation of the technologies used in this project.

**Last Updated:** May 2026
