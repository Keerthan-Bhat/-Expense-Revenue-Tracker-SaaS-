const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "..", "dev.db"));
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

const DEMO_USER_ID = "demo-user-1";

// Check if data exists
const existing = db.prepare("SELECT id FROM User WHERE id = ?").get(DEMO_USER_ID);
if (existing) {
  console.log("Demo data already exists");
  process.exit(0);
}

// Insert user
db.prepare("INSERT INTO User (id, name, email, password, currency, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))").run(DEMO_USER_ID, "Demo User", "demo@tracker.com", "demo123", "USD");

// Insert accounts
const insertAccount = db.prepare("INSERT INTO Account (id, name, type, balance, color, isDefault, createdAt, updatedAt, userId) VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'), ?)");
insertAccount.run("acc-checking", "Checking", "checking", 5420.5, "#3b82f6", 1, DEMO_USER_ID);
insertAccount.run("acc-savings", "Savings", "savings", 12350.0, "#10b981", 0, DEMO_USER_ID);
insertAccount.run("acc-credit", "Credit Card", "credit_card", -1250.3, "#ef4444", 0, DEMO_USER_ID);

// Insert categories
const insertCategory = db.prepare("INSERT INTO Category (id, name, icon, color, type, isDefault, createdAt, updatedAt, userId) VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'), ?)");
insertCategory.run("cat-salary", "Salary", "briefcase", "#10b981", "revenue", 1, DEMO_USER_ID);
insertCategory.run("cat-freelance", "Freelance", "laptop", "#6366f1", "revenue", 0, DEMO_USER_ID);
insertCategory.run("cat-investments", "Investments", "trending-up", "#f59e0b", "revenue", 0, DEMO_USER_ID);
insertCategory.run("cat-food", "Food & Dining", "utensils", "#ef4444", "expense", 1, DEMO_USER_ID);
insertCategory.run("cat-transport", "Transportation", "car", "#f97316", "expense", 0, DEMO_USER_ID);
insertCategory.run("cat-housing", "Housing", "home", "#8b5cf6", "expense", 1, DEMO_USER_ID);
insertCategory.run("cat-utilities", "Utilities", "zap", "#eab308", "expense", 0, DEMO_USER_ID);
insertCategory.run("cat-entertainment", "Entertainment", "film", "#ec4899", "expense", 0, DEMO_USER_ID);
insertCategory.run("cat-shopping", "Shopping", "shopping-bag", "#14b8a6", "expense", 0, DEMO_USER_ID);
insertCategory.run("cat-healthcare", "Healthcare", "heart", "#f43f5e", "expense", 0, DEMO_USER_ID);

// Insert transactions
const insertTx = db.prepare("INSERT INTO \`Transaction\` (id, amount, description, type, date, isRecurring, recurrence, notes, createdAt, updatedAt, userId, accountId, categoryId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'), ?, ?, ?)");

function d(y, m, day) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}T00:00:00.000Z`;
}

const now = new Date();
const y = now.getFullYear();
const m = now.getMonth();

const transactions = [
  // This month
  ["tx01", 5200, "Monthly Salary", "revenue", d(y, m, 1), 1, "monthly", null, DEMO_USER_ID, "acc-checking", "cat-salary"],
  ["tx02", 1200, "Freelance Project - Web App", "revenue", d(y, m, 5), 0, null, null, DEMO_USER_ID, "acc-checking", "cat-freelance"],
  ["tx03", 350, "Stock Dividends", "revenue", d(y, m, 10), 0, null, null, DEMO_USER_ID, "acc-savings", "cat-investments"],
  ["tx04", 1500, "Rent Payment", "expense", d(y, m, 1), 1, "monthly", null, DEMO_USER_ID, "acc-checking", "cat-housing"],
  ["tx05", 120, "Electric Bill", "expense", d(y, m, 3), 1, "monthly", null, DEMO_USER_ID, "acc-checking", "cat-utilities"],
  ["tx06", 85, "Internet Bill", "expense", d(y, m, 3), 1, "monthly", null, DEMO_USER_ID, "acc-checking", "cat-utilities"],
  ["tx07", 320, "Grocery Shopping", "expense", d(y, m, 4), 0, null, null, DEMO_USER_ID, "acc-checking", "cat-food"],
  ["tx08", 45, "Gas Station", "expense", d(y, m, 6), 0, null, null, DEMO_USER_ID, "acc-credit", "cat-transport"],
  ["tx09", 150, "Concert Tickets", "expense", d(y, m, 8), 0, null, null, DEMO_USER_ID, "acc-credit", "cat-entertainment"],
  ["tx10", 89, "New Headphones", "expense", d(y, m, 9), 0, null, null, DEMO_USER_ID, "acc-credit", "cat-shopping"],
  ["tx11", 65, "Doctor Visit Copay", "expense", d(y, m, 11), 0, null, null, DEMO_USER_ID, "acc-checking", "cat-healthcare"],
  ["tx12", 280, "Restaurant Dinners", "expense", d(y, m, 12), 0, null, null, DEMO_USER_ID, "acc-credit", "cat-food"],
  // Last month
  ["tx13", 5200, "Monthly Salary", "revenue", d(y, m - 1, 1), 1, "monthly", null, DEMO_USER_ID, "acc-checking", "cat-salary"],
  ["tx14", 800, "Freelance - Logo Design", "revenue", d(y, m - 1, 15), 0, null, null, DEMO_USER_ID, "acc-checking", "cat-freelance"],
  ["tx15", 200, "Bond Interest", "revenue", d(y, m - 1, 20), 0, null, null, DEMO_USER_ID, "acc-savings", "cat-investments"],
  ["tx16", 1500, "Rent Payment", "expense", d(y, m - 1, 1), 1, "monthly", null, DEMO_USER_ID, "acc-checking", "cat-housing"],
  ["tx17", 115, "Electric Bill", "expense", d(y, m - 1, 3), 0, null, null, DEMO_USER_ID, "acc-checking", "cat-utilities"],
  ["tx18", 85, "Internet Bill", "expense", d(y, m - 1, 3), 0, null, null, DEMO_USER_ID, "acc-checking", "cat-utilities"],
  ["tx19", 410, "Grocery Shopping", "expense", d(y, m - 1, 7), 0, null, null, DEMO_USER_ID, "acc-checking", "cat-food"],
  ["tx20", 55, "Uber Rides", "expense", d(y, m - 1, 10), 0, null, null, DEMO_USER_ID, "acc-credit", "cat-transport"],
  ["tx21", 200, "Online Courses", "expense", d(y, m - 1, 12), 0, null, null, DEMO_USER_ID, "acc-credit", "cat-entertainment"],
  ["tx22", 175, "Clothing", "expense", d(y, m - 1, 18), 0, null, null, DEMO_USER_ID, "acc-credit", "cat-shopping"],
  ["tx23", 150, "Movie Nights & Streaming", "expense", d(y, m - 1, 22), 0, null, null, DEMO_USER_ID, "acc-credit", "cat-entertainment"],
  // Two months ago
  ["tx24", 5200, "Monthly Salary", "revenue", d(y, m - 2, 1), 1, "monthly", null, DEMO_USER_ID, "acc-checking", "cat-salary"],
  ["tx25", 1500, "Freelance - Full Stack Project", "revenue", d(y, m - 2, 10), 0, null, null, DEMO_USER_ID, "acc-checking", "cat-freelance"],
  ["tx26", 1500, "Rent Payment", "expense", d(y, m - 2, 1), 1, "monthly", null, DEMO_USER_ID, "acc-checking", "cat-housing"],
  ["tx27", 130, "Electric Bill", "expense", d(y, m - 2, 3), 0, null, null, DEMO_USER_ID, "acc-checking", "cat-utilities"],
  ["tx28", 350, "Grocery Shopping", "expense", d(y, m - 2, 5), 0, null, null, DEMO_USER_ID, "acc-checking", "cat-food"],
  ["tx29", 60, "Bus Pass", "expense", d(y, m - 2, 1), 1, "monthly", null, DEMO_USER_ID, "acc-checking", "cat-transport"],
  ["tx30", 250, "New Monitor", "expense", d(y, m - 2, 14), 0, null, null, DEMO_USER_ID, "acc-credit", "cat-shopping"],
  ["tx31", 95, "Dentist Visit", "expense", d(y, m - 2, 20), 0, null, null, DEMO_USER_ID, "acc-checking", "cat-healthcare"],
];

const insertMany = db.transaction((txs) => {
  for (const tx of txs) insertTx.run(...tx);
});
insertMany(transactions);

console.log("Demo data seeded successfully!");
db.close();
