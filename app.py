from flask import Flask, request, jsonify
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash
import random
import string
from datetime import date

app = Flask(__name__)

# =========================
# DB CONNECTION
# =========================
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="password",
    database="campus_food_system"
)

cursor = db.cursor(dictionary=True)

# =========================
# HOME
# =========================
@app.route("/")
def home():
    return "SmartCanteen API Running 🚀"

# =========================
# REGISTER USER
# =========================
@app.route("/auth/register", methods=["POST"])
def register():
    data = request.json

    name = data["name"]
    email = data["email"]
    password = generate_password_hash(data["password"])
    role = data.get("role", "STUDENT")

    query = """
    INSERT INTO users (name, email, password_hash, role)
    VALUES (%s, %s, %s, %s)
    """

    cursor.execute(query, (name, email, password, role))
    db.commit()

    return jsonify({"message": "User registered successfully"})

# =========================
# LOGIN USER
# =========================
@app.route("/auth/login", methods=["POST"])
def login():
    data = request.json

    email = data["email"]
    password = data["password"]

    cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
    user = cursor.fetchone()

    if user and check_password_hash(user["password_hash"], password):
        return jsonify({
            "message": "Login successful",
            "user_id": user["user_id"],
            "role": user["role"]
        })

    return jsonify({"message": "Invalid credentials"}), 401

# =========================
# ADD HOTEL (ADMIN)
# =========================
@app.route("/admin/hotel/add", methods=["POST"])
def add_hotel():
    data = request.json

    query = """
    INSERT INTO hotels (hotel_name, location, is_active)
    VALUES (%s, %s, %s)
    """

    cursor.execute(query, (
        data["hotel_name"],
        data["location"],
        True
    ))

    db.commit()
    return jsonify({"message": "Hotel added successfully"})

# =========================
# ADD MENU ITEM (ADMIN)
# =========================
@app.route("/admin/menu/add", methods=["POST"])
def add_menu():
    data = request.json

    query = """
    INSERT INTO menu_items (hotel_id, item_name, price, is_available)
    VALUES (%s, %s, %s, %s)
    """

    cursor.execute(query, (
        data["hotel_id"],
        data["item_name"],
        data["price"],
        True
    ))

    db.commit()
    return jsonify({"message": "Menu item added"})

# =========================
# VIEW MENU (STUDENT)
# =========================
@app.route("/student/menu/<int:hotel_id>", methods=["GET"])
def get_menu(hotel_id):
    query = """
    SELECT menu_item_id, item_name, price, is_available
    FROM menu_items
    WHERE hotel_id = %s AND is_available = TRUE
    """

    cursor.execute(query, (hotel_id,))
    menu = cursor.fetchall()

    return jsonify(menu)

# =========================
# PLACE ORDER
# =========================
@app.route("/student/order", methods=["POST"])
def place_order():
    data = request.json

    user_id = data["user_id"]
    hotel_id = data["hotel_id"]
    slot_id = data["slot_id"]
    items = data["items"]  # list of items

    total_amount = 0

    # Calculate total
    for item in items:
        total_amount += item["price"] * item["quantity"]

    # Insert order
    order_query = """
    INSERT INTO orders (user_id, hotel_id, slot_id, order_date, total_amount)
    VALUES (%s, %s, %s, %s, %s)
    """

    cursor.execute(order_query, (
        user_id,
        hotel_id,
        slot_id,
        date.today(),
        total_amount
    ))

    order_id = cursor.lastrowid

    # Insert order items
    for item in items:
        item_query = """
        INSERT INTO order_items (order_id, menu_item_id, quantity, price)
        VALUES (%s, %s, %s, %s)
        """

        cursor.execute(item_query, (
            order_id,
            item["menu_item_id"],
            item["quantity"],
            item["price"]
        ))

    # Generate token
    token_code = "T" + ''.join(random.choices(string.digits, k=4))

    token_query = """
    INSERT INTO order_tokens (order_id, token_code)
    VALUES (%s, %s)
    """

    cursor.execute(token_query, (order_id, token_code))

    db.commit()

    return jsonify({
        "message": "Order placed successfully",
        "order_id": order_id,
        "token": token_code,
        "total_amount": total_amount
    })

# =========================
# TRACK ORDER STATUS
# =========================
@app.route("/student/order/<int:order_id>", methods=["GET"])
def track_order(order_id):
    query = """
    SELECT o.order_id, o.status, t.token_code
    FROM orders o
    JOIN order_tokens t ON o.order_id = t.order_id
    WHERE o.order_id = %s
    """

    cursor.execute(query, (order_id,))
    order = cursor.fetchone()

    if order:
        return jsonify(order)

    return jsonify({"message": "Order not found"}), 404

# =========================
# RUN SERVER
# =========================
if __name__ == "__main__":
    app.run(debug=True)
