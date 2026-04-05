# 🌱 BudSai

**BudSai** is a privacy‑first, open‑source budgeting app that helps you grow your finances — like a bonsai, carefully and intentionally.

Track expenses, import bank CSVs, categorize spending, and set monthly budgets — all while keeping control over your data.

---

# ✨ Features

* 📥 Import transactions from bank CSV files
* 🏷️ Custom categories
* 📊 Monthly budgets per category
* 📈 Simple financial overview
* 🔐 Privacy‑first design
* 🌍 Self‑hostable
* ⚡ Fast modern UI (Next.js)

---

# 🔐 Privacy First

BudSai is designed with privacy in mind:

* Your financial data belongs to you
* Self‑host your own instance
* No data selling
* Optional end‑to‑end encryption (planned)

You can either:

* Use the hosted version (coming soon)
* Self‑host your own instance

---

# 🚀 Getting Started

## Prerequisites

* Node.js 18+
* npm / pnpm / yarn

## Installation

```bash
git clone https://github.com/yourusername/budsai.git
cd budsai
npm install
```

## 🔧 Convex Setup

BudSai uses Convex for backend and database.

### 1. Initialize Convex

```bash
npx convex dev
```

This will:

* Create a Convex project
* Set up environment variables
* Start Convex locally

### 2. Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_CONVEX_URL=your_convex_url
```

Convex will usually configure this automatically.

---

## Development

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

# ⚙️ Tech Stack

* Next.js
* Convex
* TypeScript
* Tailwind CSS

---

# 🏗️ Roadmap

* [ ] CSV Import
* [ ] Categories
* [ ] Monthly budgets
* [ ] Dashboard
* [ ] Recurring transactions
* [ ] Smart categorization
* [ ] Multi‑account support
* [ ] Household sharing
* [ ] End‑to‑end encryption

---

# 🌱 Why "BudSai"?

Like a bonsai tree, good budgeting is about:

* intentional growth
* careful pruning
* long‑term thinking

BudSai helps you grow your finances thoughtfully.

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

# 📜 License

MIT License

---

# ⭐ Support

If you like BudSai, consider:

* Starring the repository
* Sharing with others
* Contributing

---

# 💬 Feedback

Open an issue if you have suggestions, ideas, or bug reports.

---

Built with 🌱 for privacy‑conscious budgeting.
