from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import uuid

app = Flask(__name__)
CORS(app)

# ===============================
# DATABASE CONNECTION
# ===============================
def get_db_connection():
    return mysql.connector.connect(
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


# ===============================
# AUTH
# ===============================
@app.route("/auth/register", methods=["POST"])
def register():
    db = get_db_connection()
    cursor = db.cursor()
    data = request.json

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "STUDENT")

    if not name or not email or not password:
        return jsonify({"message": "All fields required"}), 400

    try:
        cursor.execute("""
            INSERT INTO users (name, email, password_hash, role)
            VALUES (%s, %s, %s, %s)
        """, (name, email, password, role))

        db.commit()
        return jsonify({"message": "User registered successfully"}), 200

    except mysql.connector.IntegrityError:
        return jsonify({"message": "Email already exists"}), 400

    finally:
        cursor.close()
        db.close()


@app.route("/auth/login", methods=["POST"])
def login():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    data = request.json
    email = data.get("email")
    password = data.get("password")

    cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
    user = cursor.fetchone()

    cursor.close()
    db.close()

    if not user:
        return jsonify({"message": "User not found"}), 404

    if user["password_hash"] != password:
        return jsonify({"message": "Invalid password"}), 401

    return jsonify({
        "message": "Login successful",
        "user_id": user["user_id"],
        "role": user["role"]
    })


# ===============================
# ADMIN
# ===============================
@app.route("/admin/hotels", methods=["GET"])
def view_hotels():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM hotels")
    hotels = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify(hotels)


# ===============================
# STUDENT MENU
# ===============================
@app.route("/student/menu/<int:hotel_id>", methods=["GET"])
def get_menu(hotel_id):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT menu_item_id, item_name, price, is_available
        FROM menu_items
        WHERE hotel_id = %s
    """, (hotel_id,))

    menu = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify(menu)

@app.route("/student/orders/<int:user_id>", methods=["GET"])
def get_user_orders(user_id):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT o.order_id, o.order_date, o.total_amount, o.status,
               ot.token_code
        FROM orders o
        LEFT JOIN order_tokens ot ON o.order_id = ot.order_id
        WHERE o.user_id = %s
        ORDER BY o.order_id DESC
    """, (user_id,))

    orders = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify(orders)

# ===============================
# PICKUP SLOTS
# ===============================
@app.route("/student/pickup-slots/<int:hotel_id>", methods=["GET"])
def view_pickup_slots(hotel_id):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM pickup_slots WHERE hotel_id=%s", (hotel_id,))
    slots = cursor.fetchall()

    for slot in slots:
        slot["start_time"] = str(slot["start_time"])
        slot["end_time"] = str(slot["end_time"])

    cursor.close()
    db.close()

    return jsonify(slots)


# ===============================
# PLACE ORDER
# ===============================
@app.route("/student/order", methods=["POST"])
def place_order():
    db = get_db_connection()
    cursor = db.cursor()

    data = request.json
    user_id = data["user_id"]
    hotel_id = data["hotel_id"]
    slot_id = data["slot_id"]
    total_amount = data["total_amount"]
    items = data["items"]

    cursor.execute("""
        INSERT INTO orders (user_id, hotel_id, slot_id, order_date, total_amount, status)
        VALUES (%s, %s, %s, CURDATE(), %s, 'PLACED')
    """, (user_id, hotel_id, slot_id, total_amount))

    order_id = cursor.lastrowid

    for item in items:
        cursor.execute("""
            INSERT INTO order_items (order_id, menu_item_id, quantity, price)
            VALUES (%s, %s, %s, %s)
        """, (order_id, item["menu_item_id"], item["quantity"], item["price"]))

    db.commit()
    cursor.close()
    db.close()

    return jsonify({"message": "Order placed", "order_id": order_id})


# ===============================
# GET ORDER STATUS
# ===============================
@app.route("/student/order/<int:order_id>", methods=["GET"])
def get_order(order_id):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT order_id, total_amount, status
        FROM orders
        WHERE order_id = %s
    """, (order_id,))

    order = cursor.fetchone()

    cursor.close()
    db.close()

    if not order:
        return jsonify({"message": "Order not found"}), 404

    return jsonify(order)


# ===============================
# TOKEN GENERATION
# ===============================
@app.route("/token/<int:order_id>", methods=["GET"])
def generate_token(order_id):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT token_code FROM order_tokens WHERE order_id=%s", (order_id,))
    existing = cursor.fetchone()

    if existing:
        token_code = existing["token_code"]
    else:
        token_code = str(uuid.uuid4())[:8]
        cursor.execute("""
            INSERT INTO order_tokens (order_id, token_code)
            VALUES (%s, %s)
        """, (order_id, token_code))
        db.commit()

    cursor.close()
    db.close()
    return jsonify({"token": token_code})


# ===============================
# VALIDATE TOKEN (STAFF)
# ===============================
@app.route("/token/validate", methods=["POST"])
def validate_token():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    data = request.json
    token_code = data.get("token_code")

    cursor.execute("""
        SELECT ot.token_code, o.order_id
        FROM order_tokens ot
        JOIN orders o ON ot.order_id = o.order_id
        WHERE ot.token_code = %s
    """, (token_code,))

    token = cursor.fetchone()

    if not token:
        return jsonify({"message": "Invalid token"}), 404

    cursor.execute("SELECT * FROM collected_tokens WHERE token_code=%s", (token_code,))
    used = cursor.fetchone()

    if used:
        return jsonify({"message": "Token already used"}), 400

    cursor.execute("""
        INSERT INTO collected_tokens (token_code, collected_at)
        VALUES (%s, NOW())
    """, (token_code,))

    cursor.execute("""
        UPDATE orders SET status='COLLECTED' WHERE order_id=%s
    """, (token["order_id"],))

    db.commit()
    cursor.close()
    db.close()

    return jsonify({"message": "Token valid. Order served ✅"})


# ===============================
# RUN
# ===============================
if __name__ == "__main__":
    app.run(debug=True)