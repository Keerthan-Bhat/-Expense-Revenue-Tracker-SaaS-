# Getting Started with FinanceTrack

Quick reference guide for setting up, running, and working with the Expense & Revenue Tracker.

---

## Prerequisites Checklist

- [ ] Node.js 20.x or later installed
- [ ] npm 10.x or later installed
- [ ] Git installed (for version control)
- [ ] Code editor (VS Code recommended)

---

## Quick Start (5 minutes)

### 1. Navigate to Project
```bash
cd "c:\Users\User\SaaS Based Project\expense-revenue-tracker"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Database
```bash
# Run migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Seed demo data
node prisma/seed.cjs
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Open Application
Navigate to: **http://localhost:3000**

### 6. Login
- **Email:** demo@tracker.com
- **Password:** demo123

---

## Project Structure Overview

```
expense-revenue-tracker/
├── prisma/
│   ├── schema.prisma          ← Database schema
│   ├── dev.db                 ← SQLite database
│   └── seed.cjs               ← Demo data seeder
├── src/
│   ├── app/                   ← Next.js App Router
│   │   ├── api/               ← API routes
│   │   └── (app)/             ← Protected pages
│   ├── components/            ← React components
│   │   ├── ui/                ← UI primitives
│   │   └── layout/            ← Layout components
│   └── lib/                   ← Utilities & hooks
├── public/                    ← Static assets
├── .env                       ← Environment variables
├── package.json               ← Dependencies
├── tsconfig.json              ← TypeScript config
├── README.md                  ← Project overview
└── docs/
    └── DEVELOPER.md           ← Detailed docs
```

---

## Key Commands

### Development
```bash
npm run dev       # Start dev server (http://localhost:3000)
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

### Database
```bash
npx prisma migrate dev         # Apply migrations
npx prisma generate            # Generate Prisma client
npx prisma studio              # Open Prisma Studio (DB GUI)
npx prisma migrate reset       # Reset database (DESTRUCTIVE)
node prisma/seed.cjs           # Seed demo data
```

---

## Adding New Features

### 1. Add New Database Model
**Step 1:** Edit `prisma/schema.prisma`
```prisma
model Budget {
  id        String   @id @default(cuid())
  amount    Float
  category  String
  month     DateTime
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([month])
}
```

**Step 2:** Run migration
```bash
npx prisma migrate dev --name add_budget_model
npx prisma generate
```

**Step 3:** Create API route
```typescript
// src/app/api/budgets/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  const budgets = await prisma.budget.findMany({ where: { userId } });
  return NextResponse.json(budgets);
}
```

**Step 4:** Create TanStack Query hook
```typescript
// src/lib/hooks.ts
export function useBudgets() {
  return useQuery({
    queryKey: ["budgets"],
    queryFn: async () => {
      const res = await fetch(`/api/budgets?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch budgets");
      return res.json();
    },
  });
}
```

**Step 5:** Create page component
```typescript
// src/app/(app)/budgets/page.tsx
"use client";

import { useBudgets } from "@/lib/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BudgetsPage() {
  const { data: budgets, isLoading } = useBudgets();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Budgets</h1>
      <div className="grid gap-4">
        {budgets?.map((budget) => (
          <Card key={budget.id}>
            <CardContent className="p-6">
              <p className="text-lg font-semibold">{budget.category}</p>
              <p className="text-2xl font-bold">${budget.amount}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

---

## Adding New UI Components

### 1. Create Component File
```typescript
// src/components/ui/avatar.tsx
import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

const Avatar = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

export { Avatar };
```

### 2. Use Component
```typescript
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

<Avatar>
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

---

## Working with Data

### Fetching Data
```typescript
import { useTransactions } from "@/lib/hooks";

const { data, isLoading, error } = useTransactions({
  type: "expense",
  page: 1,
  limit: 10,
});

if (isLoading) return <div>Loading...</div>;
if (error) return <div>Error: {error.message}</div>;

return (
  <div>
    {data.transactions.map(tx => (
      <div key={tx.id}>{tx.description}</div>
    ))}
  </div>
);
```

### Mutating Data
```typescript
import { useCreateTransaction } from "@/lib/hooks";

const createMutation = useCreateTransaction();

const handleSubmit = async (formData) => {
  await createMutation.mutateAsync({
    description: formData.description,
    amount: formData.amount,
    type: "expense",
    date: new Date(),
    accountId: "acc-checking",
    categoryId: "cat-food",
  });
};
```

---

## Styling with Tailwind CSS

### Basic Styling
```typescript
<div className="flex items-center justify-between p-6 bg-white rounded-lg shadow">
  <h2 className="text-xl font-bold text-gray-900">Total Balance</h2>
  <span className="text-2xl font-semibold text-green-600">$16,520.20</span>
</div>
```

### Responsive Design
```typescript
<div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  {/* Cards automatically stack on mobile, 2 cols on tablet, 4 cols on desktop */}
</div>
```

### Dark Mode Support
```typescript
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  Content
</div>
```

---

## Common Patterns

### Loading States
```typescript
if (isLoading) {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-20 bg-gray-200 animate-pulse rounded-lg" />
      ))}
    </div>
  );
}
```

### Empty States
```typescript
if (transactions?.length === 0) {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500">No transactions found</p>
      <Button onClick={openCreateDialog}>Add Transaction</Button>
    </div>
  );
}
```

### Error Handling
```typescript
if (error) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <p className="text-red-600">Failed to load data</p>
      <p className="text-sm text-red-500">{error.message}</p>
    </div>
  );
}
```

---

## Debugging Tips

### 1. Check API Responses
```bash
curl http://localhost:3000/api/dashboard?userId=demo-user-1
```

### 2. Use Browser DevTools
- **Network tab:** Inspect API requests/responses
- **Console:** View errors and logs
- **React DevTools:** Inspect component tree and state

### 3. Enable Prisma Query Logging
```typescript
// src/lib/prisma.ts
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});
```

### 4. Open Prisma Studio
```bash
npx prisma studio
```
Opens database GUI at http://localhost:5555

---

## Performance Tips

### 1. Use React.memo for Expensive Components
```typescript
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* render logic */}</div>;
});
```

### 2. Optimize TanStack Query
```typescript
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,           // Cache for 1 minute
      refetchOnWindowFocus: false,    // Don't refetch on focus
      retry: 1,                       // Retry failed requests once
    },
  },
});
```

### 3. Lazy Load Heavy Components
```typescript
import dynamic from "next/dynamic";

const HeavyChart = dynamic(() => import("./heavy-chart"), {
  loading: () => <div>Loading chart...</div>,
});
```

---

## Testing

### Manual Testing Checklist
- [ ] Landing page loads correctly
- [ ] Sign in with demo credentials works
- [ ] Dashboard displays all cards and charts
- [ ] Transactions CRUD operations work
- [ ] Category management works
- [ ] Account management works
- [ ] Reports charts render correctly
- [ ] Settings page loads
- [ ] Dark mode toggle works
- [ ] Responsive design works on mobile

---

## Troubleshooting Quick Reference

| Issue | Solution |
|---|---|
| "Module not found" | Run `npm install` |
| "Prisma client not generated" | Run `npx prisma generate` |
| "Database locked" | Kill node processes, restart |
| "Port 3000 already in use" | Stop other processes or change port |
| Charts not rendering | Check data arrays, verify dimensions |
| Dark mode not working | Check `next-themes` provider setup |
| Type errors | Run `npm run build` for accurate errors |

---

## Next Steps

1. **Explore the app:** Navigate through all pages
2. **Read full docs:** Check `docs/DEVELOPER.md` for detailed architecture
3. **Customize:** Modify colors, add features, change layout
4. **Deploy:** Follow deployment guide in README
5. **Contribute:** Submit PRs for improvements

---

## Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Radix UI:** https://www.radix-ui.com/docs
- **TanStack Query:** https://tanstack.com/query/latest
- **Recharts:** https://recharts.org/en-US

---

## Support

For issues or questions:
1. Check this guide
2. Review `docs/DEVELOPER.md`
3. Check official documentation links above
4. Review source code in `src/` directory

**Happy Coding!** 🚀
