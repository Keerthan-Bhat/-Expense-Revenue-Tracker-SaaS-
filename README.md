# FinanceTrack — Expense & Revenue Tracker SaaS

A full-stack **Expense & Revenue Tracking SaaS application** built with **Next.js 16**, **TypeScript**, **Tailwind CSS v4**, and **Prisma v7**. Designed with clean UI inspired by modern SaaS dashboards, it provides powerful financial insights through interactive charts, comprehensive reports, and intuitive data management.

![License](https://img.shields.io/badge/license-MIT-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Prisma](https://img.shields.io/badge/Prisma-7.8.0-green)

---

## Features

### Dashboard
- **Financial Overview Cards**: Total Balance, Monthly Revenue, Monthly Expenses, and Net Income with month-over-month percentage change indicators
- **Revenue vs Expenses Bar Chart**: 6-month comparison with Recharts
- **Expense Breakdown Pie Chart**: Category-based spending distribution
- **Recent Transactions**: Quick-view list of latest 5 transactions with type indicators
- **Account Overview**: Summary of all connected accounts with balances and transaction counts

### Transactions
- **Full CRUD Operations**: Create, read, update, and delete transactions
- **Smart Filtering**: Filter by type (All, Revenue, Expense)
- **Search Functionality**: Real-time text search across transaction descriptions
- **Pagination**: Navigate through transactions with page controls
- **Recurring Transactions**: Mark transactions as recurring (daily, weekly, monthly, yearly)
- **Rich Form Fields**: Description, amount, date, account, category, notes, and recurring settings

### Categories
- **Category Management**: Create, edit, and delete expense/revenue categories
- **Visual Organization**: Color-coded cards with icon support
- **Type Filtering**: Toggle between expense and revenue categories
- **Transaction Counts**: Display transaction counts per category
- **Color Picker**: 14 preset colors for category customization

### Accounts
- **Multi-Account Support**: Manage checking, savings, credit cards, cash, and investment accounts
- **Account Dashboard**: Total balance banner with connected account count
- **Account Cards**: Individual account cards showing balance, type, and transaction counts
- **Color-Coded Accounts**: Visual distinction between accounts
- **Account Types**: Checking, Savings, Credit Card, Cash, Investment

### Reports & Analytics
- **Key Metrics**: Revenue Change, Expense Change, Savings Rate, Net This Month
- **Period Toggle**: Switch between 3-month and 6-month views
- **Revenue vs Expenses Chart**: Bar chart comparison
- **Savings Trend**: Area chart showing cumulative savings growth
- **Expense Breakdown**: Pie chart distribution by category
- **Net Income Trend**: Bar chart showing monthly net income

### Settings
- **Profile Management**: View and edit user name and email
- **Currency Preference**: Select preferred currency for display
- **Appearance**: Dark/Light mode toggle with system preference detection
- **Account Preferences**: Notification settings and privacy controls

---

## Tech Stack

### Core Framework
| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16.2.6 | React framework with App Router, SSR, and API routes |
| **React** | 19.2.4 | UI component library |
| **TypeScript** | 5.x | Type-safe JavaScript with strict mode |

### Database & ORM
| Technology | Version | Purpose |
|---|---|---|
| **Prisma** | 7.8.0 | Type-safe ORM for database access |
| **SQLite** | — | Local relational database |
| **Prisma Adapter** | 7.8.0 | Better-SQLite3 adapter for Prisma v7 |

### UI & Styling
| Technology | Version | Purpose |
|---|---|---|
| **Tailwind CSS** | 4.x | Utility-first CSS framework |
| **Radix UI** | Various | Headless, accessible UI primitives |
| **Lucide React** | 1.14.0 | Icon library |
| **next-themes** | 0.4.6 | Dark/light mode theming |

### Radix UI Components
- `@radix-ui/react-avatar` — User avatars
- `@radix-ui/react-dialog` — Modal dialogs
- `@radix-ui/react-dropdown-menu` — Dropdown menus
- `@radix-ui/react-label` — Form labels
- `@radix-ui/react-popover` — Popover components
- `@radix-ui/react-progress` — Progress bars
- `@radix-ui/react-select` — Select dropdowns
- `@radix-ui/react-separator` — Dividers
- `@radix-ui/react-slot` — Polymorphic components
- `@radix-ui/react-switch` — Toggle switches
- `@radix-ui/react-tabs` — Tab navigation
- `@radix-ui/react-toast` — Notification toasts
- `@radix-ui/react-tooltip` — Tooltips

### Forms & Validation
| Technology | Version | Purpose |
|---|---|---|
| **React Hook Form** | 7.75.0 | Performant form handling |
| **Zod** | 4.4.3 | Schema validation |
| **@hookform/resolvers** | 5.2.2 | Zod resolver for React Hook Form |

### Data Fetching & State Management
| Technology | Version | Purpose |
|---|---|---|
| **TanStack Query** | 5.100.9 | Server state management, caching, and refetching |
| **TanStack Table** | 8.21.3 | Data table utilities |

### Charts & Visualization
| Technology | Version | Purpose |
|---|---|---|
| **Recharts** | 3.8.1 | Composable charting library (bar, pie, line, area charts) |

### Utilities
| Technology | Version | Purpose |
|---|---|---|
| **clsx** | 2.1.1 | Conditional className utilities |
| **tailwind-merge** | 3.6.0 | Merge Tailwind classes without conflicts |
| **class-variance-authority** | 0.7.1 | Variant-based component styling |
| **date-fns** | 4.1.0 | Date manipulation and formatting |

---

## Database Schema

### Models

**User**
- Stores user account information
- Fields: id, name, email, password, avatar, currency, timestamps

**Account**
- Represents financial accounts (checking, savings, credit card, cash, investment)
- Fields: id, name, type, balance, color, isDefault, timestamps
- Relation: Belongs to User

**Category**
- Transaction categories (e.g., Food & Dining, Utilities, Housing, Shopping)
- Fields: id, name, icon, color, type (expense/revenue), isDefault, timestamps
- Relation: Belongs to User

**Transaction**
- Individual income or expense entries
- Fields: id, amount, description, type, date, isRecurring, recurrence, notes, timestamps
- Relations: Links to User, Account, and Category
- Indexes: userId, date, type, accountId, categoryId

---

## Project Structure

```
expense-revenue-tracker/
├── prisma/
│   ├── schema.prisma          # Database schema definition
│   ├── dev.db                 # SQLite database file
│   └── seed.cjs               # Demo data seeding script
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── accounts/
│   │   │   ├── categories/
│   │   │   ├── dashboard/
│   │   │   └── transactions/
│   │   ├── (app)/
│   │   │   ├── layout.tsx     # Protected app layout
│   │   │   ├── dashboard/
│   │   │   ├── transactions/
│   │   │   ├── categories/
│   │   │   ├── accounts/
│   │   │   ├── reports/
│   │   │   └── settings/
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing page (auth)
│   │   ── globals.css        # Global styles
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── separator.tsx
│   │   │   └── textarea.tsx
│   │   ├── layout/
│   │   │   └── sidebar.tsx    # Navigation sidebar
│   │   └── providers.tsx      # Query client & theme providers
│   ├── lib/
│   │   ├── auth.tsx           # Authentication context
│   │   ├── hooks.ts           # TanStack Query hooks
│   │   ├── prisma.ts          # Prisma client singleton
│   │   └── utils.ts           # Utility functions
│   ── generated/
│       └── prisma/            # Prisma v7 generated client
├── public/
├── .env                       # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

---

## Getting Started

### Prerequisites
- **Node.js** 20.x or later
- **npm** 10.x or later

### Installation

1. **Clone the repository**
   ```bash
   cd expense-revenue-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   # Run Prisma migrations
   npx prisma migrate dev

   # Generate Prisma client
   npx prisma generate

   # Seed demo data
   node prisma/seed.cjs
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Credentials
- **Email:** demo@tracker.com
- **Password:** demo123

The application comes pre-seeded with demo data including:
- 3 accounts (Checking, Savings, Credit Card)
- 10+ categories (Food & Dining, Utilities, Housing, Shopping, etc.)
- 30+ sample transactions across multiple months

---

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard` | Fetch dashboard summary (revenue, expenses, accounts, recent transactions, charts data) |
| GET | `/api/transactions` | List transactions with filters (type, accountId, categoryId, date range, pagination) |
| POST | `/api/transactions` | Create new transaction |
| PUT | `/api/transactions` | Update existing transaction |
| DELETE | `/api/transactions` | Delete transaction |
| GET | `/api/categories` | List categories with filters |
| POST | `/api/categories` | Create new category |
| PUT | `/api/categories` | Update existing category |
| DELETE | `/api/categories` | Delete category |
| GET | `/api/accounts` | List all accounts |
| POST | `/api/accounts` | Create new account |
| PUT | `/api/accounts` | Update existing account |
| DELETE | `/api/accounts` | Delete account |

### Query Parameters

**Transactions API:**
- `userId` — User identifier
- `type` — Filter by type: `expense`, `revenue`, or all
- `accountId` — Filter by specific account
- `categoryId` — Filter by specific category
- `startDate` — Filter by start date
- `endDate` — Filter by end date
- `page` — Pagination page number
- `limit` — Items per page (default: 20)

---

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="file:./dev.db"
```

### Database Configuration

- **Database:** SQLite (local file)
- **Location:** `prisma/dev.db`
- **Adapter:** Better-SQLite3 via `@prisma/adapter-better-sqlite3`

---

## Architecture Highlights

### Authentication
- Client-side authentication using React Context API
- localStorage-based session persistence
- Protected routes with layout-level authentication checks
- Demo user support for instant access

### Data Fetching Strategy
- **TanStack Query** for server state management
- Automatic caching with 60-second stale time
- Optimistic updates for mutations
- Automatic query invalidation on data changes

### UI Design System
- **Component Library:** Custom UI components built on Radix UI primitives
- **Styling:** Tailwind CSS v4 with custom CSS variables
- **Theming:** Dark/light mode with next-themes
- **Icons:** Lucide React icon set
- **Responsive:** Mobile-first responsive design

### Chart Architecture
- **Bar Charts:** Revenue vs Expenses comparison
- **Pie Charts:** Expense category breakdown
- **Line Charts:** Savings trend with cumulative totals
- **Area Charts:** Visual growth representation
- **Custom Tooltips:** Formatted currency display

---

## Known Limitations

1. **Authentication:** Currently uses localStorage-based client-side auth. For production, integrate a backend authentication provider (e.g., NextAuth, Clerk, Auth0)
2. **Database:** SQLite is suitable for development and single-user scenarios. For production with concurrent users, migrate to PostgreSQL via `@prisma/adapter-pg`
3. **File Uploads:** Avatar image uploads are not yet implemented
4. **Email Integration:** No email notifications or password reset functionality
5. **Real-time Sync:** No WebSocket-based real-time updates

---

## Future Enhancements

- [ ] Multi-user authentication with NextAuth.js
- [ ] PostgreSQL database support
- [ ] Export transactions to CSV/PDF
- [ ] Budget setting and alerts
- [ ] Recurring transaction automation
- [ ] Import from bank statements (CSV, OFX)
- [ ] Multi-currency support with exchange rates
- [ ] Goal tracking and savings targets
- [ ] Email notifications for budget alerts
- [ ] Mobile PWA support
- [ ] API rate limiting
- [ ] Unit and integration tests

---

## License

MIT License — feel free to use this project for personal or commercial purposes.

---

## Acknowledgments

- **Next.js** team for the incredible React framework
- **Prisma** for the best-in-class ORM experience
- **Tailwind CSS** for the utility-first styling approach
- **Recharts** for the composable charting library
- **Lucide** for the beautiful icon set
