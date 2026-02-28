# SmartCanteen - Digital Food Ordering and Token System

SmartCanteen is a web application built for campus canteens to reduce queues, digitize ordering, and improve pickup flow using token-based serving.

## 1. Problem Statement

Campus canteens face predictable problems:

- Long queues during peak breaks
- Manual order handling errors
- No visibility into order status
- Difficult coordination between students and canteen staff

## 2. Proposed Solution

SmartCanteen provides:

- Online menu browsing and ordering
- Pickup slot selection
- Automatic token generation per order
- Order status tracking
- Dedicated dashboards for Student, Hotel Admin, and Super Admin
- Demo-ready payment flow (UPI, Card, Cash)

## 3. Core Roles

- Student
- Hotel Admin
- Super Admin (ADMIN)

## 4. Key Features

### Student

- View active hotels
- View available menu items by hotel
- Select pickup slots
- Get smart pickup slot recommendation based on live load
- Place orders
- Generate and view token
- Pay via UPI/Card/Cash demo flow
- Track order status
- See live ETA, queue ahead, and hotel load
- View order history

### Hotel Admin

- Manage own menu
- Manage pickup slots
- View hotel orders
- Use full-screen Kitchen Display System (KDS) board
- View order items
- Update order status (PLACED/PREPARING/READY/COLLECTED/CANCELLED)
- One-click status movement in KDS
- New-order sound/visual alerts in KDS
- Delay reason capture for urgent/critical orders
- Validate and serve token orders

### Super Admin

- Add hotels
- Create hotel admins
- Assign hotel admins to hotels
- View all hotels and users
- Block/unblock users
- View dashboard counts
- View proof-of-impact metrics
- View peak slot heatmap (last 14 days)
- View delay reason analytics

## 5. Technology Stack

- Frontend: React (CRA), React Router, Axios, CSS
- Backend: Flask, Flask-CORS
- Database: MySQL
- Tools: Git, GitHub, Postman

## 6. Current Architecture

- Frontend app: `smartcanteen-frontend/`
- Backend API: `app.py`
- Database schema: `canteen managmentsystem.sql`
- API base URL used in frontend: `http://127.0.0.1:5000`

## 6.1 Project Structure

```text
Team-6/
|-- app.py
|-- canteen managmentsystem.sql
|-- README.md
`-- smartcanteen-frontend/
    |-- package.json
    |-- public/
    `-- src/
        |-- App.js
        |-- index.js
        |-- index.css
        |-- services/
        |   `-- api.js
        |-- components/
        |   `-- GlobalToast.js
        `-- pages/
            |-- AddHotel.css
            |-- AddHotel.js
            |-- AddMenuItem.css
            |-- AddMenuItem.js
            |-- AdminDashboard.js
            |-- AssignHotelAdmin.css
            |-- AssignHotelAdmin.js
            |-- CreateHotelAdmin.css
            |-- CreateHotelAdmin.js
            |-- HotelAdminDashboard.css
            |-- HotelAdminDashboard.js
            |-- HotelAdminValidateToken.css
            |-- HotelAdminValidateToken.js
            |-- HotelKDS.css
            |-- HotelKDS.js
            |-- HotelMenu.css
            |-- HotelMenu.js
            |-- HotelMenuManager.css
            |-- HotelMenuManager.js
            |-- HotelOrders.css
            |-- HotelOrders.js
            |-- HotelPickupSlots.css
            |-- HotelPickupSlots.js
            |-- Login.css
            |-- Login.js
            |-- MyOrders.css
            |-- MyOrders.js
            |-- PaymentPage.css
            |-- PaymentPage.js
            |-- PlaceOrder.css
            |-- PlaceOrder.js
            |-- Register.css
            |-- Register.js
            |-- StaffTokenPage.js
            |-- StudentDashboard.css
            |-- StudentDashboard.js
            |-- StudentMenu.css
            |-- StudentMenu.js
            |-- SuperAdminDashboard.css
            |-- SuperAdminDashboard.js
            |-- SuperAdminHotels.js
            |-- SuperAdminLogin.js
            |-- SuperAdminUsers.css
            |-- SuperAdminUsers.js
            |-- TokenPage.css
            |-- TokenPage.js
            |-- TokenValidate.css
            |-- TokenValidation.js
            |-- TrackOrder.css
            |-- TrackOrder.js
            |-- UpdateOrderStatus.js
            |-- ViewHotels.css
            `-- ViewHotels.js
```

## 7. Database Overview

Main tables:

- `users`
- `hotels`
- `hotel_admins`
- `menu_items`
- `pickup_slots`
- `orders`
- `order_items`
- `order_tokens`
- `payments`
- `subscriptions`
- `subscription_orders`
- `admin_actions`
- `collected_tokens`
- `order_status_events`
- `order_delay_events`

## 8. API Highlights

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`

### Student

- `GET /student/hotels`
- `GET /student/menu/<hotel_id>`
- `GET /student/pickup-slots/<hotel_id>`
- `GET /student/queue/<hotel_id>`
- `GET /student/slot-recommendation/<hotel_id>`
- `POST /student/order`
- `GET /student/order/<order_id>`
- `GET /student/orders/<user_id>`

### Token and Payment

- `GET /token/<order_id>`
- `POST /token/validate`
- `POST /payment`

### Super Admin

- `POST /superadmin/add-hotel`
- `POST /superadmin/create-hotel-admin`
- `POST /superadmin/assign-hotel-admin`
- `GET /superadmin/hotel-admins`
- `GET /superadmin/hotels`
- `PUT /superadmin/block-user/<user_id>`
- `PUT /superadmin/unblock-user/<user_id>`
- `GET /superadmin/dashboard`
- `GET /superadmin/impact-metrics`
- `GET /superadmin/users`

### Hotel Admin

- `GET /hoteladmin/menu/my`
- `GET /hoteladmin/menu/<hotel_id>`
- `POST /hoteladmin/menu`
- `PUT /hoteladmin/menu`
- `DELETE /hoteladmin/menu/<menu_item_id>`
- `GET /hoteladmin/orders/<hotel_id>`
- `GET /hoteladmin/kds/my`
- `GET /hoteladmin/order-items/<order_id>`
- `PUT /hoteladmin/update-order`
- `GET /hoteladmin/pickup-slots/my`
- `POST /hoteladmin/pickup-slots`
- `DELETE /hoteladmin/pickup-slots/<slot_id>`

## 9. Payment Flow (Demo-Ready)

SmartCanteen supports three demo payment modes:

- UPI: QR display + UPI reference entry
- Card: client-side card input validation + last 4 digits sent
- Cash: pay-at-counter confirmation

Backend validates mode-specific payloads and prevents duplicate paid records per order (idempotent handling for repeated clicks).

## 10. Validation and UX Improvements Implemented

- Email format validation on backend registration/admin creation
- Frontend email validation and normalization
- Payment mode validation (`UPI`, `CARD`, `CASH`)
- Global non-blocking toast notifications replacing intrusive browser popups
- Improved payment page header/footer and responsive styling
- Smart queue meter and ETA estimates in student flow
- KDS alerting and delay-reason capture
- 14-day date-wise peak heatmap with slot-based columns
- Automatic hourly fallback when no pickup slots exist

## 11. Project Workflow

1. Student logs in
2. Student selects hotel and sees smart slot recommendation + queue load
3. Student places order
4. Token is generated
5. Student makes payment
6. Hotel admin prepares and updates order status using orders view or KDS
7. Student tracks status and collects food using token
8. Super admin monitors impact metrics and delay analytics

## 12. Installation and Setup

## Prerequisites

- Python 3.10+
- Node.js 18+ and npm
- MySQL Server

## Backend Setup

1. Open project root and create database/tables using:
   - `canteen managmentsystem.sql`
2. Update DB credentials in `app.py` inside `get_db_connection()`.
3. Install dependencies:

```bash
pip install flask flask-cors mysql-connector-python
```

4. Run backend:

```bash
python app.py
```

Backend runs at `http://127.0.0.1:5000`.

## Frontend Setup

1. Go to frontend folder:

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

Frontend runs at `http://localhost:3000`.

## 13. Real-World Impact and Usefulness

SmartCanteen can deliver immediate operational value in colleges and office cafeterias:

- Reduces physical queue length and crowding during peak hours
- Saves student time between classes
- Improves order accuracy and accountability through digital records
- Makes kitchen workload predictable using pickup-slot based planning
- Enables management visibility with dashboard-level metrics
- Improves service experience and perceived canteen quality

## 14. Future Scope

Potential production-grade enhancements:

- Real payment gateway integration (Razorpay/Stripe)
- UPI webhook-based auto-verification instead of manual UTR entry
- Subscription meal plans and recurring billing
- Inventory tracking with auto-disable for out-of-stock menu items
- Estimated prep-time prediction and intelligent slot recommendations
- Push notifications (order accepted/ready)
- QR/token scanning support for staff app
- Multi-campus and multi-canteen tenancy
- Role-based audit logs and stronger security (JWT, hashed passwords)
- Analytics dashboards for demand forecasting and menu optimization

## 15. Team

- Tanisha Suhas Rao
- Shreya G Amin
- Varalaxmi N U

---

If you are evaluating this project for demo: start from Student flow (place order -> token -> payment -> track), then switch to Hotel Admin to update order status and validate token.
