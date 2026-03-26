# ShopMAD - E-Commerce Application

A modern, full-stack e-commerce web application built with Next.js 14, MongoDB, and Tailwind CSS. Features a Shopify-inspired design with WhatsApp ordering integration.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS v3
- **Database:** MongoDB with Mongoose ODM
- **State Management:** Zustand (cart with localStorage persistence)
- **Language:** TypeScript
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB instance (local or Atlas)

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Create a `.env.local` file in the root directory with the following variables:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/ecommerce
NEXT_PUBLIC_WHATSAPP_NUMBER=212600000000
```

### Environment Variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string (required) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp phone number for order buttons (country code + number, no + sign) |

### Seed the Database

Populate the database with 6 demo products:

```bash
npm run seed
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
app/                    → Next.js App Router pages and API routes
  api/products/         → REST API for products (CRUD)
  products/[id]/        → Product detail page
  cart/                 → Shopping cart page
  admin/                → Admin dashboard (product management)
components/             → Reusable React components
  admin/                → Admin-specific components
lib/                    → Database connection and utility functions
models/                 → Mongoose schemas
store/                  → Zustand state management
types/                  → TypeScript interfaces
scripts/                → Database seed script
```

## Features

- Responsive product grid with modern card design
- Product detail pages with quantity selector
- Shopping cart with localStorage persistence
- WhatsApp ordering (single product or full cart)
- Admin dashboard for product CRUD operations
- Mobile-first responsive design
- Server-side rendering for SEO

## Deployment to Vercel

1. Push your code to a Git repository
2. Import the project in [Vercel](https://vercel.com)
3. Add the environment variables (`MONGODB_URI`, `NEXT_PUBLIC_WHATSAPP_NUMBER`)
4. Deploy

The project is pre-configured for Vercel with Next.js App Router conventions.
