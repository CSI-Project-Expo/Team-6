# 🍽️ SmartCanteen - Digital Food Ordering & Token Management System

SmartCanteen is a role-based web application designed for campus canteens to digitize food ordering, reduce queues, and improve pickup flow using a token-based serving system.

It provides separate dashboards for Students, Hotel Admins, and Super Admins, enabling transparent, efficient, and organized canteen operations.

## 📌 Problem Statement

Most campus canteens still rely on manual food ordering and token systems. This results in:

- Long queues during peak hours
- Order handling errors
- No real-time order status visibility
- Poor coordination between students and canteen staff
- Time wastage and operational inefficiency

There is a need for a digital platform that manages ordering, pickup, and monitoring in a structured and transparent way.

## 💡 Solution Overview

SmartCanteen provides a complete digital food ordering and token-based pickup system with:

- Online menu browsing and ordering
- Smart pickup slot selection based on live load
- Automatic token generation
- Real-time order status tracking
- Dedicated dashboards for different roles
- Demo-ready payment flow (UPI, Card, Cash)
- Mobile-responsive and user-friendly UI

## 👥 Core Roles

- Student - Places orders and tracks tokens
- Hotel Admin - Manages menu and prepares orders
- Super Admin - Controls and monitors the entire system

## ✨ Key Features

### Student

- View available hotels and menus
- Get smart pickup slot recommendations
- Place orders and generate digital token
- Demo payment via UPI, Card, or Cash
- Track order status and ETA
- View order history

### Hotel Admin

- Manage menu items and pickup slots
- View and process live orders
- Kitchen Display System (KDS) for real-time workflow
- Update order status (Placed -> Preparing -> Ready -> Collected)
- Validate tokens at pickup

### Super Admin

- Add hotels and create hotel admins
- Assign hotel admins to hotels
- Manage users (block/unblock)
- View system dashboards and metrics
- Monitor peak hours and delays

## 🔄 System Workflow (Demo Flow)

1. Student logs in and selects a hotel
2. Student places an order and receives a token
3. Student completes payment
4. Hotel Admin receives order in Orders/KDS view
5. Hotel Admin updates order status to Ready
6. Student tracks order and collects food using token
7. Super Admin monitors system activity and metrics

This demonstrates a complete end-to-end digital ordering flow.

## 🛠️ Technology Stack

Frontend:

- React.js
- CSS
- Axios

Backend:

- Python Flask (REST APIs)

Database:

- MySQL

Tools:

- Git & GitHub
- Postman

## 🗂️ Project Structure

```text
Team-6/
|-- app.py
|-- canteen_management_system.sql
|-- README.md
`-- smartcanteen-frontend/
    |-- public/
    `-- src/
        |-- components/
        |-- services/
        `-- pages/
            |-- Student pages
            |-- Hotel Admin pages
            |-- Super Admin pages
            `-- Order, Payment & Token pages
```

## 🗄️ Database Overview

Main tables used:

- users
- hotels
- menu_items
- pickup_slots
- orders
- order_items
- order_tokens
- payments

## 🚀 Installation & Setup

### Prerequisites

- Python 3.10+
- Node.js 18+ and npm
- MySQL Server

### Backend Setup

1. Create database and tables using:
   - `canteen_management_system.sql`
2. Update database credentials in `app.py`.
3. Install dependencies:

```bash
pip install flask flask-cors mysql-connector-python
```

4. Run backend:

```bash
python app.py
```

Backend runs at:

`http://127.0.0.1:5000`

### Frontend Setup

1. Navigate to frontend folder:

```bash
cd smartcanteen-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Run frontend:

```bash
npm start
```

Frontend runs at:

`http://localhost:3000`

## 🌍 Real-World Impact

SmartCanteen helps institutions by:

- Reducing physical queue length
- Saving student time between classes
- Improving canteen efficiency during rush hours
- Providing transparency in order handling
- Digitizing operations for better accountability

It can be applied in:

- Colleges
- Office cafeterias
- Hostels
- Food courts

## 🔮 Future Scope

Planned enhancements include:

- Real payment gateway integration (UPI/Card)
- QR-based token scanning
- Push notifications for order updates
- AI-based rush prediction and smart slot recommendations
- Inventory management system
- Analytics dashboards for peak hours and sales
- Multi-campus deployment with cloud hosting
- Enhanced security with JWT and encrypted passwords

## 📌 Demo Tip

For project demonstration:

- Start with Student flow (place order -> token -> payment -> track order)
- Switch to Hotel Admin to update order status and validate token
- Show Super Admin dashboard for system monitoring

## 🏁 Conclusion

SmartCanteen is a complete digital food ordering and token management system that makes campus food service:

Faster, smarter, and more organized.
