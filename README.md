# 📦 StockFlow WMS — Full-Stack Warehouse Management System

> A production-grade, real-time, database-driven Warehouse Management System (WMS) built with Python FastAPI, SQLAlchemy, React 18, TypeScript, Vite, Tailwind CSS, and Recharts.

![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss)
![SQLite/PostgreSQL](https://img.shields.io/badge/Database-SQLite%2FPostgreSQL-003B57?style=for-the-badge&logo=sqlite)

---

## 📋 Table of Contents
- [Core Concept & Architectural Principles](#-core-concept--architectural-principles)
- [Key Features & Modules](#-key-features--modules)
- [Technology Stack](#-technology-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Demo Credentials](#-demo-credentials)
- [Getting Started](#-getting-started)
- [API Reference](#-api-reference)
- [Database Schema & Seed Data](#-database-schema--seed-data)

---

## 🎯 Core Concept & Architectural Principles

**StockFlow WMS** solves central warehouse inventory control by enforcing **Inventory as the Single Source of Truth**. Every inventory modification—restocking, order placement, inspection verification, replacement issuance, or shipment—happens inside ACID database transactions with automatic stock reservation calculations.

### Key Rules
- **Available Quantity Formula**: 
  $$\text{available\_quantity} = \max(0, \text{total\_quantity} - \text{reserved\_quantity})$$
- **Stock Status Automation**:
  - `IN STOCK`: $\text{available\_quantity} > 10$ (or product custom threshold)
  - `LOW STOCK`: $1 \le \text{available\_quantity} \le 10$
  - `OUT OF STOCK`: $\text{available\_quantity} = 0$
- **Zero Placeholder Policy**: All statistics, notifications, order priorities, and Recharts analytics are computed dynamically from real database records.

---

## ✨ Key Features & Modules

### 1. 🔒 Authentication & Protected Session
- JWT Bearer token authentication with bcrypt password hashing.
- Demo Account quick-fill helpers on the login page for rapid hackathon testing.
- Protected client-side routing preventing unauthorized module access.

### 2. 📊 Executive Warehouse Dashboard
- Live database metric cards: Total Products, Total Units, Low Stock Items, Out of Stock Items, Pending Orders, Orders Ready for Processing, Shipped Orders, and Damaged/Missing Items.
- Quick Action bar for rapid navigation.
- Live Audit Feed displaying real-time warehouse transaction logs.

### 3. 📦 Central Inventory Module
- Filterable by 8 core product categories: **Groceries**, **Electronics**, **Furniture**, **Toys**, **Fashion**, **Home Appliances**, **Mobiles**, and **Sports**.
- Fast search by Product Name, Code (e.g. `ELE-001`), or Description.
- Visual product cards displaying image, available units, category, and status badges.

### 4. 🔄 Restocking Module
- Product search bar with quick search match pills.
- Current stock vs restock quantity input with preset increment buttons (`+10`, `+25`, `+50`, `+100`).
- Atomic transaction execution: updates central inventory, recalculates stock status badges, and logs transaction history to `restock_transactions`.

### 5. 🛒 Order Placement Module
- Visual product grid sorted by category with quantity selectors (`[-] Qty [+]`).
- Validates that requested quantity does not exceed available unreserved stock.
- Placing an order creates a `PENDING` order and atomically reserves inventory (`product.reserved_quantity += quantity_ordered`), preventing overselling.

### 6. 📋 Orders & Prioritization Engine
- Availability-based order sorting algorithm:
  $$\text{fulfillment\_ratio} = \min\left(1.0, \frac{\text{available\_quantity}}{\text{requested\_quantity}}\right)$$
- Ranks orders to maximize fulfillment rates and avoid stock stalls.
- One-click `ACCEPT ORDER` action transitions status from `PENDING` to `ACCEPTED`.

### 7. 🚚 Order Placement & Tracking Module
- Product Inspection Matrix enforcing verification rule:
  $$\text{good\_quantity} + \text{damaged\_quantity} + \text{missing\_quantity} = \text{expected\_quantity}$$
- **Stock Replacement**: Deducts replacement stock from central unreserved inventory without allowing negative stock.
- **Shipment Finalization**: Clicking `ORDER SHIPPED` generates a unique tracking number (e.g., `TRK-98765432`), finalizes inventory deductions, and moves order to shipment history.

### 8. ⚠️ Damaged & Missing Products Module
- Aggregate metric boxes: Total Damaged, Total Missing, Total Affected Items.
- Detailed historical table tracking product code, anomaly type, quantity, related order, status (`REPORTED` vs `REPLACED`), and report timestamp.

### 9. 🔔 Low & Out of Stock Alert Center
- Dual-tab views for **LOW STOCK** ($1 \le \text{qty} \le 10$) and **OUT OF STOCK** ($\text{qty} = 0$).
- Direct 1-click **RESTOCK THIS PRODUCT** shortcuts linking straight to the restocking workflow.

### 10. 📈 Analytics Dashboard (Recharts)
- Live statistical reporting computed directly from central database transactions:
  1. *Products & Units by Category* (Bar Chart)
  2. *Stock Status Distribution* (Donut Chart)
  3. *Orders Breakdown by Status* (Donut Chart)
  4. *Most Ordered Products* (Horizontal Bar Chart)
  5. *Damaged vs Missing Items by Category* (Stacked Bar Chart)
  6. *Restocking Activity by Product* (Bar Chart)

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS v4, Lucide React Icons, Recharts |
| **Backend** | Python 3.13, FastAPI, SQLAlchemy ORM, Pydantic v2, PyJWT, Bcrypt |
| **Database** | SQLite (Zero-config local setup) / PostgreSQL ready |
| **Testing** | Pytest, FastAPI TestClient, Vite Build Pipeline |

---

## 📂 Project Directory Structure

```
warehouse-management-system/
├── backend/
│   ├── app/
│   │   ├── api/             # REST API routers (auth, products, restocks, orders, tracking, analytics, etc.)
│   │   ├── auth/            # JWT authentication & bcrypt password security
│   │   ├── models/          # SQLAlchemy database models
│   │   ├── schemas/         # Pydantic validation schemas
│   │   ├── services/        # Audit logging & business rules
│   │   ├── config.py        # Environment settings & constants
│   │   ├── database.py      # SQLAlchemy session connection
│   │   ├── main.py          # FastAPI application entry point
│   │   └── seed.py          # Demo database seeder script
│   └── tests/               # Pytest automated test suites
├── frontend/
│   ├── src/
│   │   ├── components/      # Sidebar, Header, ProductCard, StockBadge, StatCard, ActivityFeed
│   │   ├── context/         # AuthContext & NotificationContext
│   │   ├── pages/           # Login, Dashboard, Inventory, Restocking, OrderPlacement, Orders, Tracking, etc.
│   │   ├── services/        # API client & fetch utilities
│   │   ├── types/           # TypeScript data interfaces
│   │   ├── App.tsx          # Client-side router & protected layout
│   │   ├── main.tsx         # React root entry
│   │   └── index.css        # Tailwind CSS & global styles
│   ├── vite.config.ts
│   └── package.json
├── stockflow.db             # SQLite database file
├── README.md
└── implementation_plan.md
```

---

## 🔑 Demo Credentials

| Role | Username | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin / Manager** | `admin` | `admin123` | Full access to all warehouse operations & analytics |
| **Warehouse Staff** | `warehouse` | `warehouse123` | Operational access to restocking, ordering, & verification |

---

## ⚙️ Getting Started

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create & activate Python virtual environment
python -m venv ../venv
# On Windows:
..\venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Seed the database with demo products and initial transactions
python -m app.seed

# Start FastAPI dev server
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```
Backend API will run at: `http://127.0.0.1:8000/api`  
Interactive API Docs: `http://127.0.0.1:8000/api/docs`

### 2. Frontend Setup
```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite development server
npm run dev
```
Frontend Web App will run at: `http://localhost:3000`

---

## 🔌 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token |
| `GET` | `/api/auth/me` | Retrieve authenticated user profile |
| `GET` | `/api/categories` | List all product categories |
| `GET` | `/api/products` | Query products (supports search, category, status filters) |
| `POST` | `/api/products` | Create a new product entry |
| `POST` | `/api/restocks` | Issue restocking quantity (Atomic DB transaction) |
| `GET` | `/api/restocks` | Fetch restocking audit history |
| `POST` | `/api/orders` | Place order & reserve inventory |
| `GET` | `/api/orders` | Fetch orders sorted by fulfillment priority |
| `POST` | `/api/orders/{id}/accept` | Accept pending order |
| `POST` | `/api/orders/{id}/verify` | Submit product inspection matrix |
| `POST` | `/api/orders/{id}/replace` | Deduct stock & issue replacement for damaged/missing items |
| `POST` | `/api/orders/{id}/ship` | Finalize shipment & generate tracking code |
| `GET` | `/api/damaged-missing` | Get aggregate damage/missing statistics & records |
| `GET` | `/api/inventory/low-stock` | Get products with $1 \le \text{stock} \le 10$ |
| `GET` | `/api/inventory/out-of-stock` | Get products with $\text{stock} = 0$ |
| `GET` | `/api/analytics` | Get real-time Recharts analytics data |
| `GET` | `/api/activity` | Stream recent audit log entries |
| `GET` | `/api/health` | Service health status |

---

## 🧪 Testing & Verification

Run backend automated tests:
```bash
cd backend
python -m pytest
```

Build production frontend bundle:
```bash
cd frontend
npm run build
```
