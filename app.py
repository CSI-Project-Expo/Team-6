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
# AUTH - REGISTER
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


# ===============================
# STUDENT LOGIN
# ===============================
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
# SUPER ADMIN LOGIN
# ===============================
@app.route("/superadmin/login", methods=["POST"])
def superadmin_login():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    data = request.json
    email = data.get("email")
    password = data.get("password")

    cursor.execute("""
        SELECT * FROM users 
        WHERE email=%s AND password_hash=%s AND role='SUPER_ADMIN'
    """, (email, password))

    user = cursor.fetchone()

    cursor.close()
    db.close()

    if user:
        return jsonify({
            "message": "Super Admin login successful",
            "user_id": user["user_id"],
            "role": user["role"]
        })
    else:
        return jsonify({"message": "Invalid credentials"}), 401

# Hotel Adminn user

@app.route("/superadmin/create-hotel-admin", methods=["POST"])
def create_hotel_admin():
    db = get_db_connection()
    cursor = db.cursor()

    data = request.json
    name = data["name"]
    email = data["email"]
    password = data["password"]

    cursor.execute("""
        INSERT INTO users (name, email, password_hash, role)
        VALUES (%s, %s, %s, 'HOTEL_ADMIN')
    """, (name, email, password))

    db.commit()
    cursor.close()
    db.close()

    return jsonify({"message": "Hotel Admin created successfully"})

#Assign Hotel Admin to Hotel

@app.route("/superadmin/assign-hotel-admin", methods=["POST"])
def assign_hotel_admin():
    db = get_db_connection()
    cursor = db.cursor()

    data = request.json
    user_id = data["user_id"]
    hotel_id = data["hotel_id"]

    cursor.execute("""
        INSERT INTO hotel_admins (user_id, hotel_id)
        VALUES (%s, %s)
    """, (user_id, hotel_id))

    db.commit()
    cursor.close()
    db.close()

    return jsonify({"message": "Hotel Admin assigned to hotel"})

# Super Admin -- Add Hotel
@app.route("/superadmin/add-hotel", methods=["POST"])
def add_hotel():
    db = get_db_connection()
    cursor = db.cursor()

    data = request.json
    hotel_name = data.get("hotel_name")
    location = data.get("location")

    cursor.execute("""
        INSERT INTO hotels (hotel_name, location, is_active)
        VALUES (%s, %s, TRUE)
    """, (hotel_name, location))

    db.commit()
    cursor.close()
    db.close()

    return jsonify({"message": "Hotel added successfully"})

#View All Hotels - Super Admin
@app.route("/superadmin/hotels", methods=["GET"])
def view_hotels():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT h.hotel_id, h.hotel_name, h.location, h.is_active,
               u.name AS admin_name
        FROM hotels h
        LEFT JOIN hotel_admins ha ON h.hotel_id = ha.hotel_id
        LEFT JOIN users u ON ha.user_id = u.user_id
    """)

    hotels = cursor.fetchall()
    cursor.close()
    db.close()

    return jsonify(hotels)

#Get all the hotels assigned to a Hotel Admin
@app.route("/superadmin/hotel-admins", methods=["GET"])
def get_hotel_admins():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT user_id, name, email 
        FROM users 
        WHERE role = 'HOTEL_ADMIN'
    """)

    admins = cursor.fetchall()
    cursor.close()
    db.close()

    return jsonify(admins)

#Block /Unblock Users (status column)
@app.route("/superadmin/block-user/<int:user_id>", methods=["PUT"])
def block_user(user_id):
    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute("""
        UPDATE users SET status='BLOCKED'
        WHERE user_id=%s
    """, (user_id,))

    db.commit()
    cursor.close()
    db.close()

    return jsonify({"message": "User blocked"})

#Admin Action Log

def log_admin_action(admin_id, action):
    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute("""
        INSERT INTO admin_actions (admin_id, action_description)
        VALUES (%s, %s)
    """, (admin_id, action))

    db.commit()
    cursor.close()
    db.close()

# ===============================
# ADMIN - VIEW HOTELS
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
# STUDENT ORDERS
# ===============================
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
    user_id = data.get("user_id")
    hotel_id = data.get("hotel_id")
    slot_id = data.get("slot_id")
    total_amount = data.get("total_amount")
    items = data.get("items")

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
# VALIDATE TOKEN
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
# PAYMENT
# ===============================
@app.route("/payment", methods=["POST"])
def make_payment():
    db = get_db_connection()
    cursor = db.cursor()

    data = request.json
    order_id = data.get("order_id")
    amount = data.get("amount")
    payment_mode = data.get("payment_mode")

    cursor.execute("""
        INSERT INTO payments (order_id, amount, payment_mode)
        VALUES (%s, %s, %s)
    """, (order_id, amount, payment_mode))

    db.commit()
    cursor.close()
    db.close()

    return jsonify({"message": "Payment successful"})


# ===============================
# RUN
# ===============================
if __name__ == "__main__":
    app.run(debug=True)