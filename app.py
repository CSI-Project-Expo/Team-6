from flask import Flask, request, jsonify
import mysql.connector

app = Flask(__name__)

# ===============================
# DATABASE CONNECTION
# ===============================
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="password", 
    database="campus_food_system"
)

# ===============================
# HOME
# ===============================
@app.route("/")
def home():
    return "Smart Canteen API Running 🚀"


# =====================================================
# AUTH SECTION
# =====================================================

# REGISTER USER
@app.route("/auth/register", methods=["POST"])
def register():
    data = request.json

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "STUDENT")

    cursor = db.cursor()

    cursor.execute("""
        INSERT INTO users (name, email, password_hash, role)
        VALUES (%s, %s, %s, %s)
    """, (name, email, password, role))

    db.commit()

    return jsonify({"message": "User registered"})


# LOGIN USER
@app.route("/auth/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()

    if not user:
        return jsonify({"message": "User not found"}), 404

    if user["password_hash"] != password:
        return jsonify({"message": "Invalid password"}), 401

    return jsonify({
        "message": "Login successful",
        "user_id": user["user_id"],
        "role": user["role"]
    })


# =====================================================
# ADMIN SECTION
# =====================================================

# ADD HOTEL
@app.route("/admin/hotel", methods=["POST"])
def add_hotel():
    data = request.json

    hotel_name = data.get("hotel_name")
    location = data.get("location")

    cursor = db.cursor()

    cursor.execute("""
        INSERT INTO hotels (hotel_name, location)
        VALUES (%s, %s)
    """, (hotel_name, location))

    db.commit()

    return jsonify({
        "message": "Hotel added",
        "hotel_id": cursor.lastrowid
    })


# VIEW ALL HOTELS
@app.route("/admin/hotels", methods=["GET"])
def view_hotels():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM hotels")
    hotels = cursor.fetchall()

    return jsonify(hotels)


# =====================================================
# HOTEL ADMIN SECTION
# =====================================================

# ADD MENU ITEM
@app.route("/hotel/menu", methods=["POST"])
def add_menu_item():
    data = request.json

    hotel_id = data.get("hotel_id")
    item_name = data.get("item_name")
    price = data.get("price")

    cursor = db.cursor()

    cursor.execute("""
        INSERT INTO menu_items (hotel_id, item_name, price)
        VALUES (%s, %s, %s)
    """, (hotel_id, item_name, price))

    db.commit()

    return jsonify({"message": "Menu item added"})

#VIEW ORDERS FOR HOTEL

@app.route("/admin/orders", methods=["GET"])
def view_orders():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM orders")
    orders = cursor.fetchall()
    return jsonify(orders)

# VIEW MENU BY HOTEL
@app.route("/student/menu/<int:hotel_id>", methods=["GET"])
def get_menu(hotel_id):
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT menu_item_id, item_name, price, is_available
        FROM menu_items
        WHERE hotel_id = %s
    """, (hotel_id,))

    menu = cursor.fetchall()

    return jsonify(menu)

# ADD PICKUP SLOT
@app.route("/admin/pickup-slot", methods=["POST"])
def add_pickup_slot():
    data = request.json
    hotel_id = data.get("hotel_id")
    start_time = data.get("start_time")  # "10:00:00"
    end_time = data.get("end_time")      # "11:00:00"

    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO pickup_slots (hotel_id, start_time, end_time)
        VALUES (%s, %s, %s)
    """, (hotel_id, start_time, end_time))

    db.commit()

    return jsonify({"message": "Pickup slot added"})

#VIEW PICKUP SLOT BY HOTEL

@app.route("/student/pickup-slots/<int:hotel_id>", methods=["GET"])
def view_pickup_slots(hotel_id):
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT * FROM pickup_slots WHERE hotel_id = %s
    """, (hotel_id,))
    slots = cursor.fetchall()
    return jsonify(slots)




# =====================================================
# STUDENT ORDER SECTION
# =====================================================

# PLACE ORDER
@app.route("/student/order", methods=["POST"])
def place_order():
    data = request.json

    user_id = data["user_id"]
    hotel_id = data["hotel_id"]
    slot_id = data["slot_id"]
    total_amount = data["total_amount"]
    items = data["items"]

    cursor = db.cursor()

    cursor.execute("""
        INSERT INTO orders (user_id, hotel_id, slot_id, order_date, total_amount)
        VALUES (%s, %s, %s, CURDATE(), %s)
    """, (user_id, hotel_id, slot_id, total_amount))

    order_id = cursor.lastrowid

    for item in items:
        cursor.execute("""
            INSERT INTO order_items (order_id, menu_item_id, quantity, price)
            VALUES (%s, %s, %s, %s)
        """, (order_id, item["menu_item_id"], item["quantity"], item["price"]))

    db.commit()

    return jsonify({
        "message": "Order placed successfully",
        "order_id": order_id
    })

# =====================================================
# TOKEN SYSTEM
# =====================================================

# GENERATE TOKEN FOR ORDER
import uuid

@app.route("/token/<int:order_id>", methods=["POST"])
def generate_token(order_id):
    cursor = db.cursor()

    token_code = str(uuid.uuid4())[:8]

    cursor.execute("""
        INSERT INTO order_tokens (order_id, token_code)
        VALUES (%s, %s)
    """, (order_id, token_code))

    db.commit()

    return jsonify({
        "message": "Token generated",
        "token": token_code
    })


# =====================================================
# ORDER TRACKING
# =====================================================

# TRACK ORDER STATUS
@app.route("/student/order/<int:order_id>", methods=["GET"])
def track_order(order_id):
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT order_id, status, total_amount
        FROM orders
        WHERE order_id = %s
    """, (order_id,))

    order = cursor.fetchone()

    return jsonify(order)


# =====================================================
# ADMIN — UPDATE ORDER STATUS
# =====================================================

@app.route("/admin/order/<int:order_id>", methods=["PUT"])
def update_status(order_id):
    data = request.json
    status = data.get("status")

    cursor = db.cursor()

    cursor.execute("""
        UPDATE orders
        SET status = %s
        WHERE order_id = %s
    """, (status, order_id))

    db.commit()

    return jsonify({"message": "Status updated"})


#MAKE PAYMENT FOR ORDER

@app.route("/payment", methods=["POST"])
def make_payment():
    data = request.json

    order_id = data.get("order_id")
    amount = data.get("amount")
    payment_mode = data.get("payment_mode")

    cursor = db.cursor()

    cursor.execute("""
        INSERT INTO payments (order_id, amount, payment_mode)
        VALUES (%s, %s, %s)
    """, (order_id, amount, payment_mode))

    db.commit()

    return jsonify({"message": "Payment successful"})

#VIEW PAYMENT BY ORDER

@app.route("/payment/<int:order_id>", methods=["GET"])
def get_payment(order_id):
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT * FROM payments WHERE order_id = %s
    """, (order_id,))
    payment = cursor.fetchone()
    return jsonify(payment)

#CREATE SUBSCRIPTION 
@app.route("/subscription", methods=["POST"])
def create_subscription():
    data = request.json

    user_id = data.get("user_id")
    hotel_id = data.get("hotel_id")
    start_date = data.get("start_date")  # "2026-02-20"
    end_date = data.get("end_date")
    total_amount = data.get("total_amount")

    cursor = db.cursor()

    cursor.execute("""
        INSERT INTO subscriptions (user_id, hotel_id, start_date, end_date, total_amount)
        VALUES (%s, %s, %s, %s, %s)
    """, (user_id, hotel_id, start_date, end_date, total_amount))

    subscription_id = cursor.lastrowid
    db.commit()

    return jsonify({
        "message": "Subscription created",
        "subscription_id": subscription_id
    })

#MAP SUBSCRIPTION TO ORDERS
@app.route("/subscription/order", methods=["POST"])
def map_subscription_order():
    data = request.json

    subscription_id = data.get("subscription_id")
    order_id = data.get("order_id")

    cursor = db.cursor()

    cursor.execute("""
        INSERT INTO subscription_orders (subscription_id, order_id)
        VALUES (%s, %s)
    """, (subscription_id, order_id))

    db.commit()

    return jsonify({"message": "Subscription order mapped"})

#SUBSCRIPTION BY USER
@app.route("/subscription/user/<int:user_id>", methods=["GET"])
def view_user_subscriptions(user_id):
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT * FROM subscriptions
        WHERE user_id = %s
    """, (user_id,))

    subs = cursor.fetchall()
    return jsonify(subs)


# =====================================================
# RUN SERVER
# =====================================================

if __name__ == "__main__":
    app.run(debug=True)
