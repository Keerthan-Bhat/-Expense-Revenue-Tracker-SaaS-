import { PrismaClient } from "../src/generated/prisma/client/index.js";

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL || "",
});

const DEMO_USER_ID = "demo-user-1";

async function main() {
  console.log("🌱 Seeding database...");

  // Check if data exists
  const existing = await prisma.user.findUnique({
    where: { id: DEMO_USER_ID },
  });

  if (existing) {
    console.log("✅ Demo data already exists");
    process.exit(0);
  }

  // Insert user
  await prisma.user.create({
    data: {
      id: DEMO_USER_ID,
      name: "Demo User",
      email: "demo@tracker.com",
      password: "demo123",
      currency: "USD",
    },
  });

  console.log("✅ Created demo user");

  // Insert accounts
  await Promise.all([
    prisma.account.create({
      data: {
        id: "acc-checking",
        name: "Checking",
        type: "checking",
        balance: 5420.5,
        color: "#3b82f6",
        isDefault: true,
        userId: DEMO_USER_ID,
      },
    }),
    prisma.account.create({
      data: {
        id: "acc-savings",
        name: "Savings",
        type: "savings",
        balance: 12350.0,
        color: "#10b981",
        isDefault: false,
        userId: DEMO_USER_ID,
      },
    }),
    prisma.account.create({
      data: {
        id: "acc-credit",
        name: "Credit Card",
        type: "credit_card",
        balance: -1250.3,
        color: "#ef4444",
        isDefault: false,
        userId: DEMO_USER_ID,
      },
    }),
  ]);

  console.log("✅ Created 3 accounts");

  // Insert categories
  await prisma.category.createMany({
    data: [
      { id: "cat-salary", name: "Salary", icon: "briefcase", color: "#10b981", type: "revenue", isDefault: true, userId: DEMO_USER_ID },
      { id: "cat-freelance", name: "Freelance", icon: "laptop", color: "#6366f1", type: "revenue", isDefault: false, userId: DEMO_USER_ID },
      { id: "cat-investments", name: "Investments", icon: "trending-up", color: "#f59e0b", type: "revenue", isDefault: false, userId: DEMO_USER_ID },
      { id: "cat-food", name: "Food & Dining", icon: "utensils", color: "#ef4444", type: "expense", isDefault: true, userId: DEMO_USER_ID },
      { id: "cat-transport", name: "Transportation", icon: "car", color: "#f97316", type: "expense", isDefault: false, userId: DEMO_USER_ID },
      { id: "cat-housing", name: "Housing", icon: "home", color: "#8b5cf6", type: "expense", isDefault: true, userId: DEMO_USER_ID },
      { id: "cat-utilities", name: "Utilities", icon: "zap", color: "#eab308", type: "expense", isDefault: false, userId: DEMO_USER_ID },
      { id: "cat-entertainment", name: "Entertainment", icon: "film", color: "#ec4899", type: "expense", isDefault: false, userId: DEMO_USER_ID },
      { id: "cat-shopping", name: "Shopping", icon: "shopping-bag", color: "#14b8a6", type: "expense", isDefault: false, userId: DEMO_USER_ID },
      { id: "cat-healthcare", name: "Healthcare", icon: "heart", color: "#f43f5e", type: "expense", isDefault: false, userId: DEMO_USER_ID },
    ],
  });

  console.log("✅ Created 10 categories");

  // Insert transactions
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  function d(year: number, month: number, day: number) {
    return new Date(year, month, day);
  }

  const transactions = [
    // Revenue
    { amount: 5200.00, description: "Monthly Salary", type: "revenue", date: d(y, m, 1), accountId: "acc-checking", categoryId: "cat-salary" },
    { amount: 1500.00, description: "Freelance Project", type: "revenue", date: d(y, m, 5), accountId: "acc-checking", categoryId: "cat-freelance" },
    { amount: 800.00, description: "Investment Returns", type: "revenue", date: d(y, m, 10), accountId: "acc-savings", categoryId: "cat-investments" },
    { amount: 250.00, description: "Side Hustle", type: "revenue", date: d(y, m, 15), accountId: "acc-checking", categoryId: "cat-freelance" },
    
    // Expenses - Food
    { amount: 45.50, description: "Grocery Shopping", type: "expense", date: d(y, m, 2), accountId: "acc-checking", categoryId: "cat-food" },
    { amount: 32.00, description: "Restaurant Dinner", type: "expense", date: d(y, m, 4), accountId: "acc-credit", categoryId: "cat-food" },
    { amount: 15.75, description: "Coffee & Snacks", type: "expense", date: d(y, m, 7), accountId: "acc-checking", categoryId: "cat-food" },
    { amount: 67.80, description: "Weekly Groceries", type: "expense", date: d(y, m, 9), accountId: "acc-checking", categoryId: "cat-food" },
    
    // Expenses - Transport
    { amount: 50.00, description: "Gas", type: "expense", date: d(y, m, 3), accountId: "acc-credit", categoryId: "cat-transport" },
    { amount: 25.00, description: "Uber Rides", type: "expense", date: d(y, m, 8), accountId: "acc-checking", categoryId: "cat-transport" },
    { amount: 120.00, description: "Car Maintenance", type: "expense", date: d(y, m, 12), accountId: "acc-credit", categoryId: "cat-transport" },
    
    // Expenses - Housing
    { amount: 1200.00, description: "Rent Payment", type: "expense", date: d(y, m, 1), accountId: "acc-checking", categoryId: "cat-housing", isRecurring: true, recurrence: "monthly" },
    { amount: 85.00, description: "Internet Bill", type: "expense", date: d(y, m, 5), accountId: "acc-checking", categoryId: "cat-utilities", isRecurring: true, recurrence: "monthly" },
    { amount: 120.00, description: "Electricity Bill", type: "expense", date: d(y, m, 5), accountId: "acc-checking", categoryId: "cat-utilities", isRecurring: true, recurrence: "monthly" },
    
    // Expenses - Entertainment & Shopping
    { amount: 45.00, description: "Movie Tickets", type: "expense", date: d(y, m, 6), accountId: "acc-credit", categoryId: "cat-entertainment" },
    { amount: 89.99, description: "New Shoes", type: "expense", date: d(y, m, 11), accountId: "acc-credit", categoryId: "cat-shopping" },
    { amount: 29.99, description: "Netflix Subscription", type: "expense", date: d(y, m, 1), accountId: "acc-checking", categoryId: "cat-entertainment", isRecurring: true, recurrence: "monthly" },
    { amount: 150.00, description: "Groceries", type: "expense", date: d(y, m, 14), accountId: "acc-checking", categoryId: "cat-food" },
  ];

  // Add previous month transactions
  const prevM = m === 0 ? 11 : m - 1;
  const prevY = m === 0 ? y - 1 : y;

  transactions.push(
    { amount: 5200.00, description: "Monthly Salary", type: "revenue", date: d(prevY, prevM, 1), accountId: "acc-checking", categoryId: "cat-salary" },
    { amount: 1200.00, description: "Rent Payment", type: "expense", date: d(prevY, prevM, 1), accountId: "acc-checking", categoryId: "cat-housing" },
    { amount: 234.50, description: "Groceries", type: "expense", date: d(prevY, prevM, 3), accountId: "acc-checking", categoryId: "cat-food" },
    { amount: 75.00, description: "Gas", type: "expense", date: d(prevY, prevM, 7), accountId: "acc-credit", categoryId: "cat-transport" },
    { amount: 65.00, description: "Utilities", type: "expense", date: d(prevY, prevM, 5), accountId: "acc-checking", categoryId: "cat-utilities" },
  );

  // Insert all transactions
  for (const tx of transactions) {
    await prisma.transaction.create({
      data: {
        ...tx,
        userId: DEMO_USER_ID,
        notes: "",
      },
    });
  }

  console.log(`✅ Created ${transactions.length} transactions`);
  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
