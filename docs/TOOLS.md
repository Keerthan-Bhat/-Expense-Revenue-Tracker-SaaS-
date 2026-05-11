# FinanceTrack — Tools & Technologies Used

Complete inventory of all technologies, libraries, frameworks, and tools used in building the Expense & Revenue Tracker SaaS application.

---

## Table of Contents

1. [Core Framework & Runtime](#1-core-framework--runtime)
2. [Database & ORM](#2-database--orm)
3. [UI Framework & Styling](#3-ui-framework--styling)
4. [UI Component Libraries](#4-ui-component-libraries)
5. [Forms & Validation](#5-forms--validation)
6. [Data Fetching & State Management](#6-data-fetching--state-management)
7. [Charts & Visualization](#7-charts--visualization)
8. [Utility Libraries](#8-utility-libraries)
9. [Development Tools](#9-development-tools)
10. [Build & Optimization](#10-build--optimization)
11. [Icons & Assets](#11-icons--assets)
12. [Testing & Quality](#12-testing--quality)

---

## 1. Core Framework & Runtime

### Next.js (16.2.6)
**Type:** Full-stack React framework  
**Purpose:** Application framework with server-side rendering, API routes, and optimized bundling  
**Website:** https://nextjs.org

**Key Features Used:**
- App Router for file-based routing
- Server Components for improved performance
- API Routes for backend endpoints
- Image optimization (if needed)
- Automatic code splitting
- Fast Refresh for development
- TypeScript support out-of-the-box
- Built-in environment variable management

**Why Chosen:**
- Production-ready framework with best practices built-in
- Excellent developer experience with hot reloading
- Server-side rendering for better SEO and initial load
- API routes eliminate need for separate backend

**Alternatives Considered:**
- React + Express (more setup, less integrated)
- Remix (similar but less mature ecosystem)
- Astro (better for static sites, less for dynamic apps)

### React (19.2.4)
**Type:** UI library  
**Purpose:** Component-based user interface building  
**Website:** https://react.dev

**Key Features Used:**
- Functional components with hooks
- React Context API for state management
- React.memo for performance optimization
- JSX for declarative UI
- Synthetic event system
- Virtual DOM for efficient updates

### TypeScript (5.x)
**Type:** Programming language  
**Purpose:** Type-safe JavaScript with compile-time error checking  
**Website:** https://www.typescriptlang.org

**Configuration:**
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "strict": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Key Features Used:**
- Strict mode for maximum type safety
- Generics for reusable components
- Interfaces for API responses
- Type guards for runtime type checking
- Path aliases for clean imports

---

## 2. Database & ORM

### Prisma (7.8.0)
**Type:** ORM (Object-Relational Mapping)  
**Purpose:** Type-safe database access and schema management  
**Website:** https://www.prisma.io

**Components:**
- **@prisma/client** (7.8.0) — Runtime client for database queries
- **prisma** (7.8.0) — CLI for migrations and generation
- **@prisma/adapter-better-sqlite3** (7.8.0) — SQLite adapter for Prisma v7

**Key Features Used:**
- Schema-first development with `schema.prisma`
- Automatic migration generation
- Type-safe query builder
- Relation handling with includes
- Aggregate functions for analytics
- Transaction support
- Connection pooling
- Generated TypeScript types

**Example Query:**
```typescript
// Type-safe query with auto-completion
const transactions = await prisma.transaction.findMany({
  where: { userId, type: "expense" },
  include: { account: true, category: true },
  orderBy: { date: "desc" },
  take: 10,
});
```

**Why Chosen:**
- Best-in-class TypeScript integration
- Excellent developer experience
- Automatic migrations simplify database changes
- Intuitive query API
- Active community and documentation

**Alternatives Considered:**
- Drizzle ORM (lighter, less mature)
- Sequelize (older, less type-safe)
- TypeORM (more complex, slower)

### SQLite
**Type:** Relational database  
**Purpose:** Zero-configuration local database storage  
**Website:** https://www.sqlite.org

**Key Features Used:**
- File-based storage (no server required)
- ACID compliance
- SQL standard compliance
- Lightweight footprint
- Perfect for development and single-user scenarios

**Production Note:**
For production with multiple concurrent users, migrate to PostgreSQL or MySQL.

### Better-SQLite3 (12.9.0)
**Type:** SQLite driver  
**Purpose:** Synchronous SQLite interface for Prisma adapter  
**Website:** https://github.com/WiseLibs/better-sqlite3

**Why Chosen:**
- Required adapter for Prisma v7 with SQLite
- Synchronous API for simpler usage
- Better performance than node-sqlite3
- Native C++ bindings for speed

---

## 3. UI Framework & Styling

### Tailwind CSS (4.x)
**Type:** Utility-first CSS framework  
**Purpose:** Rapid UI development with utility classes  
**Website:** https://tailwindcss.com

**Key Features Used:**
- Utility classes for rapid styling
- Responsive design with breakpoint prefixes
- Dark mode support with class strategy
- Custom CSS variables for theming
- JIT (Just-In-Time) compilation
- Plugin system (PostCSS integration)

**Configuration:**
```css
/* src/app/globals.css */
@import "tailwindcss";

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

**Why Chosen:**
- Faster development than custom CSS
- Consistent design system
- Small bundle size (purges unused classes)
- Excellent responsive design support
- Great dark mode support

**Alternatives Considered:**
- CSS Modules (more boilerplate)
- Styled Components (runtime overhead)
- Material-UI (less flexible, heavier)

### next-themes (0.4.6)
**Type:** Theme management  
**Purpose:** Dark/light mode theming with system preference detection  
**Website:** https://github.com/pacocoursey/next-themes

**Key Features Used:**
- System preference detection
- Persistent theme selection
- No flash of unstyled content
- Class-based theming strategy

**Usage:**
```typescript
import { useTheme } from "next-themes";

const { theme, setTheme } = useTheme();
setTheme("dark");
```

---

## 4. UI Component Libraries

### Radix UI (Various)
**Type:** Headless UI component primitives  
**Purpose:** Accessible, unstyled UI components  
**Website:** https://www.radix-ui.com

**Components Used:**

#### @radix-ui/react-dialog (1.1.15)
**Purpose:** Modal dialogs and overlays  
**Features:**
- WAI-ARIA compliant
- Focus trapping
- Keyboard navigation
- Animation support

#### @radix-ui/react-dropdown-menu (2.1.16)
**Purpose:** Dropdown menus  
**Features:**
- Keyboard navigation
- Focus management
- Positioning logic
- Submenu support

#### @radix-ui/react-select (2.2.6)
**Purpose:** Select dropdowns  
**Features:**
- Custom styling
- Keyboard navigation
- Search support
- Virtualization ready

#### @radix-ui/react-tabs (1.1.13)
**Purpose:** Tab navigation  
**Features:**
- Keyboard navigation
- Automatic panel management
- ARIA attributes
- Manual/automatic activation

#### @radix-ui/react-avatar (1.1.11)
**Purpose:** User avatars  
**Features:**
- Fallback support
- Image loading states
- Customizable sizing

#### @radix-ui/react-label (2.1.8)
**Purpose:** Form labels  
**Features:**
- Accessible form labeling
- Disabled state handling

#### @radix-ui/react-popover (1.1.15)
**Purpose:** Popover components  
**Features:**
- Positioning logic
- Focus trapping
- Animation support

#### @radix-ui/react-progress (1.1.8)
**Purpose:** Progress bars  
**Features:**
- Animated transitions
- Value indicators
- Customizable styling

#### @radix-ui/react-separator (1.1.8)
**Purpose:** Visual dividers  
**Features:**
- Horizontal/vertical orientation
- Customizable thickness and color

#### @radix-ui/react-slot (1.2.4)
**Purpose:** Polymorphic components  
**Features:**
- Render-as-any-component
- Composition support
- Type-safe polymorphism

#### @radix-ui/react-switch (1.2.6)
**Purpose:** Toggle switches  
**Features:**
- Keyboard accessible
- State management
- Customizable styling

#### @radix-ui/react-toast (1.2.15)
**Purpose:** Notification toasts  
**Features:**
- Stackable toasts
- Auto-dismiss
- Custom positioning
- Animation support

#### @radix-ui/react-tooltip (1.2.8)
**Purpose:** Tooltips  
**Features:**
- Positioning logic
- Delay controls
- Accessibility support
- Custom animations

**Why Chosen:**
- Fully accessible (WAI-ARIA compliant)
- Unstyled for complete customization
- Minimal bundle size
- Composable API
- No design constraints
- Excellent TypeScript support

**Alternatives Considered:**
- shadcn/ui (built on Radix, more opinionated)
- Headless UI (similar, less components)
- React Aria (Adobe, more complex)

---

## 5. Forms & Validation

### React Hook Form (7.75.0)
**Type:** Form library  
**Purpose:** Performant form handling with minimal re-renders  
**Website:** https://react-hook-form.com

**Key Features Used:**
- Uncontrolled form state
- Validation integration
- Conditional rendering support
- Nested field support
- Array field support
- Form reset capabilities

**Why Chosen:**
- Minimal re-renders (better performance than Formik)
- Smaller bundle size
- Excellent TypeScript support
- Great validation integration

### Zod (4.4.3)
**Type:** Schema validation  
**Purpose:** Type-safe schema validation and parsing  
**Website:** https://zod.dev

**Key Features Used:**
- Schema definition with TypeScript types
- Runtime validation
- Type inference
- Custom error messages
- Composition support

**Example:**
```typescript
import { z } from "zod";

const transactionSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.number().positive("Amount must be positive"),
  type: z.enum(["expense", "revenue"]),
  date: z.string().datetime(),
});

type Transaction = z.infer<typeof transactionSchema>;
```

### @hookform/resolvers (5.2.2)
**Type:** Validation resolver  
**Purpose:** Integration between React Hook Form and Zod  
**Website:** https://github.com/react-hook-form/resolvers

**Usage:**
```typescript
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const form = useForm({
  resolver: zodResolver(transactionSchema),
});
```

---

## 6. Data Fetching & State Management

### @tanstack/react-query (5.100.9)
**Type:** Server state management  
**Purpose:** Data fetching, caching, synchronization, and updates  
**Website:** https://tanstack.com/query/latest

**Key Features Used:**
- Automatic caching with stale time
- Background refetching
- Optimistic updates
- Query invalidation
- Retry logic
- DevTools for debugging
- Infinite queries (if needed)
- Prefetching

**Configuration:**
```typescript
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,           // 1 minute
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

**Custom Hook Pattern:**
```typescript
export function useTransactions(params) {
  return useQuery({
    queryKey: ["transactions", params],
    queryFn: async () => {
      const res = await fetch(`/api/transactions?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });
}
```

**Why Chosen:**
- Eliminates boilerplate for data fetching
- Automatic caching reduces server load
- Built-in loading and error states
- Excellent TypeScript support
- Active maintenance and community

**Alternatives Considered:**
- SWR (similar, less features)
- Redux Toolkit Query (heavier, more setup)
- Apollo Client (GraphQL-specific)

### @tanstack/react-table (8.21.3)
**Type:** Data table utilities  
**Purpose:** Headless table building with sorting, filtering, pagination  
**Website:** https://tanstack.com/table/latest

**Key Features:**
- Sorting, filtering, pagination
- Row selection
- Column resizing
- Virtualization support
- Headless (no UI components)

---

## 7. Charts & Visualization

### Recharts (3.8.1)
**Type:** Charting library  
**Purpose:** Composable chart building with React  
**Website:** https://recharts.org

**Chart Types Used:**

#### BarChart
**Purpose:** Revenue vs Expenses comparison  
**Features:**
- Multiple bar series
- Rounded corners
- Custom tooltips
- Grid lines
- Axis formatting

#### PieChart
**Purpose:** Expense category breakdown  
**Features:**
- Donut chart with inner radius
- Custom cell colors
- Legend support
- Padding angle between segments

#### AreaChart
**Purpose:** Savings trend visualization  
**Features:**
- Gradient fills
- Multiple series (line + area)
- Smooth curves
- Custom tooltips

#### LineChart
**Purpose:** Trend lines and comparisons  
**Features:**
- Smooth interpolation
- Custom styling
- Data point markers

**Why Chosen:**
- Built on React (composable API)
- SVG-based (scalable, crisp rendering)
- Excellent customization
- Good performance
- Active maintenance

**Alternatives Considered:**
- Chart.js (Canvas-based, less React-friendly)
- Victory (similar, less popular)
- Nivo (D3-based, steeper learning curve)

---

## 8. Utility Libraries

### clsx (2.1.1)
**Type:** Conditional className utility  
**Purpose:** Conditionally join class names  
**Website:** https://github.com/lukeed/clsx

**Usage:**
```typescript
import clsx from "clsx";

className={clsx(
  "base-class",
  isActive && "active-class",
  isDisabled && "disabled-class"
)}
```

### tailwind-merge (3.6.0)
**Type:** Tailwind class merger  
**Purpose:** Merge Tailwind classes without conflicts  
**Website:** https://github.com/dcastil/tailwind-merge

**Why Chosen:**
- Resolves Tailwind class conflicts
- Works with clsx for conditional classes
- Essential for component libraries

### class-variance-authority (0.7.1)
**Type:** Variant-based styling  
**Purpose:** Type-safe variant management for components  
**Website:** https://cva.style

**Usage:**
```typescript
import { cva } from "class-variance-authority";

const buttonVariants = cva("base-classes", {
  variants: {
    variant: {
      default: "bg-blue-600",
      destructive: "bg-red-600",
    },
    size: {
      sm: "h-9",
      lg: "h-11",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});
```

### date-fns (4.1.0)
**Type:** Date utility library  
**Purpose:** Date manipulation and formatting  
**Website:** https://date-fns.org

**Key Features Used:**
- Modular imports (tree-shakeable)
- Immutable date operations
- Locale support
- Formatting functions

**Why Chosen:**
- Modular (import only what you need)
- Immutable (no side effects)
- Tree-shakeable
- Consistent API

**Alternatives Considered:**
- Moment.js (mutable, large bundle)
- Day.js (smaller, fewer features)
- Luxon (modern, less popular)

---

## 9. Development Tools

### Node.js (20.x)
**Type:** JavaScript runtime  
**Purpose:** Server-side JavaScript execution  
**Website:** https://nodejs.org

### npm (10.x)
**Type:** Package manager  
**Purpose:** Dependency management and script execution  
**Website:** https://www.npmjs.com

### ESLint (9.x)
**Type:** Linting tool  
**Purpose:** Code quality and style enforcement  
**Website:** https://eslint.org

**Configuration:**
```javascript
// eslint.config.js (ESLint 9 flat config)
import next from "eslint-config-next";

export default [
  next(),
  // Custom rules
];
```

### TypeScript ESLint
**Type:** TypeScript linting  
**Purpose:** TypeScript-specific linting rules  
**Website:** https://typescript-eslint.io

### Prettier (implied)
**Type:** Code formatter  
**Purpose:** Consistent code formatting  
**Note:** Should be added for production projects

---

## 10. Build & Optimization

### Turbopack
**Type:** Build tool  
**Purpose:** Next.js 16's new bundler (replacement for Webpack)  
**Features:**
- Faster builds than Webpack
- Incremental compilation
- Rust-based (high performance)
- Built-in to Next.js 16

### SWC (Speedy Web Compiler)
**Type:** JavaScript/TypeScript compiler  
**Purpose:** Fast compilation and minification  
**Features:**
- Rust-based (10-20x faster than Babel)
- Built-in to Next.js
- TypeScript support
- Minification

---

## 11. Icons & Assets

### Lucide React (1.14.0)
**Type:** Icon library  
**Purpose:** Beautiful, consistent icon set  
**Website:** https://lucide.dev

**Key Features:**
- 1000+ icons
- Customizable size and color
- Tree-shakeable
- Active maintenance
- Consistent style

**Usage:**
```typescript
import { TrendingUp, Wallet, CreditCard } from "lucide-react";

<TrendingUp className="h-6 w-6 text-green-600" />
```

**Why Chosen:**
- Beautiful, modern design
- Lightweight (tree-shakeable)
- Excellent TypeScript support
- Regular updates
- Consistent icon style

**Alternatives Considered:**
- Heroicons (smaller set)
- Feather Icons (less active)
- Font Awesome (heavier, mixed free/paid)

### Google Fonts (Geist)
**Type:** Font library  
**Purpose:** Modern, readable typography  
**Website:** https://fonts.google.com

**Fonts Used:**
- **Geist Sans** — Primary font for UI
- **Geist Mono** — Monospace font for code

**Next.js Optimization:**
```typescript
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
```

---

## 12. Testing & Quality

### Jest (Recommended, Not Installed)
**Type:** Testing framework  
**Purpose:** Unit and integration testing  
**Recommendation:** Add for production projects

### React Testing Library (Recommended)
**Type:** Testing utilities  
**Purpose:** Component testing with user-centric approach  
**Recommendation:** Add for production projects

### Playwright (Recommended)
**Type:** E2E testing  
**Purpose:** End-to-end browser testing  
**Recommendation:** Add for production projects

---

## Complete Dependency Tree

### Production Dependencies (41 packages)
```json
{
  "dependencies": {
    "@hookform/resolvers": "^5.2.2",
    "@prisma/adapter-better-sqlite3": "^7.8.0",
    "@prisma/client": "^7.8.0",
    "@radix-ui/react-avatar": "^1.1.11",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-label": "^2.1.8",
    "@radix-ui/react-popover": "^1.1.15",
    "@radix-ui/react-progress": "^1.1.8",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-separator": "^1.1.8",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-switch": "^1.2.6",
    "@radix-ui/react-tabs": "^1.1.13",
    "@radix-ui/react-toast": "^1.2.15",
    "@radix-ui/react-tooltip": "^1.2.8",
    "@tanstack/react-query": "^5.100.9",
    "@tanstack/react-table": "^8.21.3",
    "better-sqlite3": "^12.9.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "lucide-react": "^1.14.0",
    "next": "16.2.6",
    "next-themes": "^0.4.6",
    "prisma": "^7.8.0",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "react-hook-form": "^7.75.0",
    "recharts": "^3.8.1",
    "tailwind-merge": "^3.6.0",
    "zod": "^4.4.3"
  }
}
```

### Development Dependencies (6 packages)
```json
{
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.6",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

**Total:** 47 direct dependencies (with hundreds of transitive dependencies)

---

## Technology Stack Summary

### Frontend (Client-Side)
- **Framework:** Next.js 16.2.6 + React 19.2.4
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS 4.x + Radix UI components
- **Icons:** Lucide React
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod validation
- **State:** TanStack Query + React Context

### Backend (Server-Side)
- **Runtime:** Next.js API Routes
- **Database:** SQLite
- **ORM:** Prisma 7.8.0
- **Adapter:** Better-SQLite3

### Development & Build
- **Package Manager:** npm 10.x
- **Bundler:** Turbopack (Next.js 16)
- **Compiler:** SWC
- **Linter:** ESLint 9.x
- **Type Checking:** TypeScript strict mode

### Total Bundle Size (Estimated)
- **JavaScript:** ~250 KB (gzipped)
- **CSS:** ~15 KB (gzipped)
- **Fonts:** ~50 KB (gzipped)
- **Total:** ~315 KB (first load)

---

## Recommended Additions for Production

### Testing
```bash
npm install -D jest @testing-library/react @testing-library/jest-dom
npm install -D @playwright/test
```

### Code Quality
```bash
npm install -D prettier husky lint-staged
```

### Monitoring
```bash
npm install @sentry/nextjs
```

### Performance
```bash
npm install @next/bundle-analyzer
```

### Security
```bash
npm install helmet
npm install rate-limiter-flexible
```

---

## License Information

| Technology | License | Commercial Use |
|---|---|---|
| Next.js | MIT | ✅ Yes |
| React | MIT | ✅ Yes |
| TypeScript | Apache 2.0 | ✅ Yes |
| Prisma | Apache 2.0 | ✅ Yes |
| Tailwind CSS | MIT | ✅ Yes |
| Radix UI | MIT | ✅ Yes |
| Recharts | MIT | ✅ Yes |
| React Hook Form | MIT | ✅ Yes |
| Zod | MIT | ✅ Yes |
| Lucide React | ISC | ✅ Yes |
| date-fns | MIT | ✅ Yes |
| TanStack Query | MIT | ✅ Yes |
| SQLite | Public Domain | ✅ Yes |

**All technologies used are free for commercial use.**

---

## Version Compatibility Matrix

| Component | Version | Min Node.js | Notes |
|---|---|---|---|
| Next.js | 16.2.6 | 20.9+ | Requires Node 20.9+ |
| React | 19.2.4 | 18+ | React 19 features |
| Prisma | 7.8.0 | 18+ | Requires new adapter |
| TypeScript | 5.x | 14+ | ES2017 target |
| Tailwind CSS | 4.x | 18+ | New CSS engine |

---

**Last Updated:** May 2026
