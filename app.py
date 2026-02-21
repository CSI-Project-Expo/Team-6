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


# ===============================
# PICKUP SLOTS (FIXED timedelta bug)
# ===============================
@app.route("/student/pickup-slots/<int:hotel_id>", methods=["GET"])
def view_pickup_slots(hotel_id):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM pickup_slots WHERE hotel_id=%s", (hotel_id,))
    slots = cursor.fetchall()

    # Convert time fields to string
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
    cursor.close()
    db.close()

    return jsonify({"message": "Order placed", "order_id": order_id})


# ===============================
# TOKEN
# ===============================
@app.route("/token/<int:order_id>", methods=["POST"])
def generate_token(order_id):
    db = get_db_connection()
    cursor = db.cursor()

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
# RUN
# ===============================
if __name__ == "__main__":
    app.run(debug=True)