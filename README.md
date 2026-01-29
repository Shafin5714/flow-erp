# Flow-ERP

A modern, full-stack Mini ERP application with separate client and server architecture.

## Tech Stack

- **Frontend (Client):** Next.js 16, React 19, Tailwind CSS, shadcn/ui, Apollo Client
- **Backend (Server):** Express.js, Apollo Server, GraphQL
- **Database:** PostgreSQL with Prisma ORM
- **Storage:** Cloudinary
- **Auth:** JWT-based authentication

## Project Structure

```
flow-erp/
├── client/          # Next.js frontend application
│   ├── app/         # Next.js app router pages
│   ├── components/  # React components
│   ├── lib/         # Utilities and Apollo Client setup
│   └── public/      # Static assets
│
├── server/          # Express + GraphQL backend
│   ├── src/         # Server source code
│   │   ├── graphql/ # GraphQL schema and resolvers
│   │   └── lib/     # Server utilities
│   └── prisma/      # Database schema and migrations
│
└── docs/            # Documentation
```

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (or Neon Cloud)

### Installation

1. Clone the repository
2. Install all dependencies:

```bash
npm run install:all
```

3. Configure environment variables:

**Server (`server/.env`):**

```env
DATABASE_URL=postgresql://user:password@localhost:5432/flow_erp
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
PORT=4000
CLIENT_URL=http://localhost:3000
```

**Client (`client/.env.local`):**

```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Set up the database:

```bash
npm run db:generate
npm run db:migrate
```

5. Start development:

```bash
npm run dev
```

This will start:

- **Server:** http://localhost:4000/graphql (GraphQL Playground)
- **Client:** http://localhost:3000

## Development Scripts

| Script                | Description                                      |
| --------------------- | ------------------------------------------------ |
| `npm run dev`         | Start both client and server in development mode |
| `npm run dev:server`  | Start only the server                            |
| `npm run dev:client`  | Start only the client                            |
| `npm run build`       | Build both client and server                     |
| `npm run db:generate` | Generate Prisma client                           |
| `npm run db:migrate`  | Run database migrations                          |
| `npm run db:push`     | Push schema changes to database                  |
| `npm run db:studio`   | Open Prisma Studio                               |

## Features

- **Inventory Management** - Product and category CRUD operations
- **Sales & POS** - Point of sale with automatic stock deduction
- **Purchase Management** - Track purchases and vendor payments
- **Customer & Vendor Management** - Manage business relationships
- **Accounting** - Track accounts and transactions
- **Dashboard** - Real-time business statistics
- **Reports** - Sales, purchase, and inventory reports

## API Documentation

Access the GraphQL Playground at `http://localhost:4000/graphql` to explore the API.

### Available Queries

- `me` - Current user info
- `users` - List users (Admin only)
- `products` - List products with filtering
- `categories` - List categories
- `customers` - List customers
- `vendors` - List vendors
- `sales` - List sales
- `purchases` - List purchases
- `accounts` - List accounts
- `dashboardStats` - Dashboard statistics

### Available Mutations

- `login` / `register` - Authentication
- CRUD operations for products, categories, customers, vendors
- `createSale` / `createPurchase` - Create transactions
- `createTransaction` - Create accounting entries

## License

Private - All rights reserved
