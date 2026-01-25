# Flow-ERP 🚀

**Mini ERP System built with Next.js & GraphQL**

Flow-ERP is a modern, full-stack **Mini ERP application** designed to manage core business operations such as **Inventory, Sales, Purchases, Accounting, Customers, Vendors, and Reporting**.
The project is built using **Next.js** with an integrated **GraphQL API**, focusing on real-world ERP workflows and scalable architecture.

---

## ✨ Features

- 🔐 Authentication & Role-Based Access Control (Admin, Manager, Staff)
- 📊 Dashboard with sales, purchases, profit & alerts
- 📦 Inventory Management with real-time stock updates
- 🧾 Sales & POS module with invoice generation
- 🛒 Purchase & Vendor management
- 👥 Customer management with transaction history
- 💰 Accounting module (cash, capital, loans, income & expenses)
- 📈 Reports (sales, purchases, inventory valuation, P&L)
- ⚡ Optimized data fetching using GraphQL

---

## 🧑‍💼 User Roles

| Role    | Access                               |
| ------- | ------------------------------------ |
| Admin   | Full access, user & role management  |
| Manager | Inventory, sales, purchases, reports |
| Staff   | POS, sales entry, customers          |

---

## 🛠 Tech Stack

### Frontend

- **Next.js (App Router)**
- React
- Tailwind CSS + shadcn/ui
- Apollo Client

### Backend (inside Next.js)

- **GraphQL (Apollo Server / GraphQL Yoga)**
- Next.js API Routes / Route Handlers
- JWT / Session-based Authentication

### Database

- PostgreSQL
- Prisma

### Storage

- **Cloudinary** (Image Management)

---

## 🧠 Why GraphQL?

Flow-ERP uses GraphQL to:

- Fetch exactly the data needed (no over-fetching)
- Power complex dashboards with a **single query**
- Support scalable and maintainable API design
- Handle deeply related ERP data efficiently

---

## 📂 Project Structure (Simplified)

```
flow-erp/
├─ app/
│  ├─ api/graphql/      # GraphQL API
│  ├─ dashboard/        # Dashboard pages
│  ├─ auth/             # Login & auth pages
│
├─ graphql/
│  ├─ schema/           # Type definitions
│  ├─ resolvers/        # Business logic
│
├─ lib/
│  ├─ db.ts             # Database connection
│  ├─ auth.ts           # Auth utilities
│
└─ README.md
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/flow-erp.git
cd flow-erp
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Environment Variables

Create a `.env` file:

```
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
```

### 4️⃣ Run the Development Server

```bash
npm run dev
```

App will run on:
👉 `http://localhost:3000`

---

## 📌 Current Status

✅ Core ERP modules implemented
🚧 UI & reporting improvements in progress
🚀 Designed for future scalability

---

## 🔮 Future Enhancements

- GraphQL Subscriptions (real-time updates)
- Export reports (PDF / Excel)
- Multi-warehouse inventory
- Audit logs
- Multi-tenant SaaS support

---

## 🎯 Project Goal

Flow-ERP is a **portfolio-grade project** built to demonstrate:

- Real-world ERP business logic
- GraphQL-first API design
- Full-stack development with Next.js
- Scalable and maintainable architecture

---

## 📜 License

This project is for **learning and portfolio purposes**.

---

### ⭐ If you like this project, give it a star!
