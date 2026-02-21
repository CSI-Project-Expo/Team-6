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
    return jsonify({"message": "Login successful"})


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


# =====================================================
# STUDENT ORDER SECTION
# =====================================================

# PLACE ORDER
@app.route("/student/order", methods=["POST"])
def place_order():
    data = request.json

    user_id = data.get("user_id")
    hotel_id = data.get("hotel_id")
    slot_id = data.get("slot_id")
    total_amount = data.get("total_amount")

    cursor = db.cursor()

    cursor.execute("""
        INSERT INTO orders (user_id, hotel_id, slot_id, order_date, total_amount)
        VALUES (%s, %s, %s, CURDATE(), %s)
    """, (user_id, hotel_id, slot_id, total_amount))

    order_id = cursor.lastrowid

    db.commit()

    return jsonify({
        "message": "Order placed",
        "order_id": order_id
    })


# =====================================================
# TOKEN SYSTEM
# =====================================================

# GENERATE TOKEN FOR ORDER
@app.route("/token/<int:order_id>", methods=["POST"])
def generate_token(order_id):
    cursor = db.cursor()

    token_code = f"TOKEN-{order_id}"

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


# =====================================================
# RUN SERVER
# =====================================================

if __name__ == "__main__":
    app.run(debug=True)
