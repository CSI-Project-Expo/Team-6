from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import uuid
from functools import wraps

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
# ROLE CHECK DECORATOR
# ===============================
def check_role(required_role):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            role = request.headers.get("role")
            print("ROLE FROM HEADER:", role)   # 👈 DEBUG LINE

            if role != required_role:
                return jsonify({"message": "Unauthorized"}), 403

            return func(*args, **kwargs)
        return wrapper
    return decorator


# ===============================
# HOME
# ===============================
@app.route("/")
def home():
    return "Smart Canteen API Running 🚀"


# ===============================
# AUTH REGISTER (STUDENT ONLY)
# ===============================
@app.route("/auth/register", methods=["POST"])
def register():
    db = get_db_connection()
    cursor = db.cursor()

    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"message": "All fields required"}), 400

    try:
        cursor.execute("""
            INSERT INTO users (name, email, password_hash, role)
            VALUES (%s, %s, %s, 'STUDENT')
        """, (name, email, password))
        db.commit()
        return jsonify({"message": "Student registered successfully"})

    except mysql.connector.IntegrityError:
        return jsonify({"message": "Email already exists"}), 400

    finally:
        cursor.close()
        db.close()


# ===============================
# LOGIN
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

    if not user:
        return jsonify({"message": "User not found"}), 404

    if user["status"] == "BLOCKED":
        return jsonify({"message": "User is blocked"}), 403

    if user["password_hash"] != password:
        return jsonify({"message": "Invalid password"}), 401

    return jsonify({
        "message": "Login successful",
        "user_id": user["user_id"],
        "role": user["role"]
    })


@app.route("/auth/logout", methods=["POST"])
def logout():
    return jsonify({"message": "Logged out successfully"})


# ===============================
# SUPER ADMIN
# ===============================
@app.route("/superadmin/add-hotel", methods=["POST"])
@check_role("ADMIN")
def add_hotel():
    db = get_db_connection()
    cursor = db.cursor()
    data = request.json

    cursor.execute("""
        INSERT INTO hotels (hotel_name, location, is_active)
        VALUES (%s, %s, TRUE)
    """, (data["hotel_name"], data["location"]))

    db.commit()
    cursor.close()
    db.close()
    return jsonify({"message": "Hotel added successfully"})


@app.route("/superadmin/create-hotel-admin", methods=["POST"])
def create_hotel_admin():

    role = request.headers.get("role")
    if role != "ADMIN":
        return jsonify({"message": "Forbidden"}), 403

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

@app.route("/superadmin/assign-hotel-admin", methods=["POST"])
@check_role("ADMIN")
def assign_hotel_admin():
    db = get_db_connection()
    cursor = db.cursor()
    data = request.json

    cursor.execute("""
        INSERT INTO hotel_admins (user_id, hotel_id)
        VALUES (%s,%s)
    """, (data["user_id"], data["hotel_id"]))

    db.commit()
    cursor.close()
    db.close()

    return jsonify({"message": "Assigned successfully"})

@app.route("/superadmin/hotel-admins", methods=["GET"])
@check_role("ADMIN")
def get_hotel_admins():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT user_id, name, email 
        FROM users 
        WHERE role='HOTEL_ADMIN'
    """)

    admins = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify(admins)

@app.route("/superadmin/hotels")
@check_role("ADMIN")
def view_hotels():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT h.hotel_id, h.hotel_name, h.location, h.is_active, u.name AS admin_name
        FROM hotels h
        LEFT JOIN hotel_admins ha ON h.hotel_id = ha.hotel_id
        LEFT JOIN users u ON ha.user_id = u.user_id
    """)

    data = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(data)


@app.route("/superadmin/block-user/<int:user_id>", methods=["PUT"])
@check_role("ADMIN")
def block_user(user_id):
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("UPDATE users SET status='BLOCKED' WHERE user_id=%s", (user_id,))
    db.commit()
    cursor.close()
    db.close()
    return jsonify({"message": "User blocked"})


@app.route("/superadmin/unblock-user/<int:user_id>", methods=["PUT"])
def unblock_user(user_id):
    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute("""
        UPDATE users SET status='ACTIVE'
        WHERE user_id=%s
    """, (user_id,))

    db.commit()
    cursor.close()
    db.close()

    return jsonify({"message": "User unblocked"})

@app.route("/superadmin/dashboard")
@check_role("ADMIN")
def dashboard():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT COUNT(*) as users FROM users")
    users = cursor.fetchone()

    cursor.execute("SELECT COUNT(*) as orders FROM orders")
    orders = cursor.fetchone()

    cursor.execute("SELECT COUNT(*) as hotels FROM hotels")
    hotels = cursor.fetchone()

    cursor.close()
    db.close()

    return jsonify({
        "total_users": users["users"],
        "total_orders": orders["orders"],
        "total_hotels": hotels["hotels"]
    })


@app.route("/superadmin/users", methods=["GET"])
def get_all_users():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT user_id, name, email, role, status, created_at
        FROM users
        ORDER BY created_at DESC
    """)
    users = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify(users)

# ===============================
# STUDENT
# ===============================
@app.route("/student/menu/<int:hotel_id>")
def get_menu(hotel_id):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT menu_item_id, item_name, price, is_available
        FROM menu_items WHERE hotel_id=%s
    """, (hotel_id,))

    data = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(data)


@app.route("/student/pickup-slots/<int:hotel_id>")
def pickup_slots(hotel_id):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM pickup_slots WHERE hotel_id=%s", (hotel_id,))
    slots = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(slots)


@app.route("/student/order", methods=["POST"])
def place_order():
    db = get_db_connection()
    cursor = db.cursor()
    data = request.json

    cursor.execute("""
        INSERT INTO orders (user_id, hotel_id, slot_id, order_date, total_amount, status)
        VALUES (%s,%s,%s,CURDATE(),%s,'PLACED')
    """, (data["user_id"], data["hotel_id"], data["slot_id"], data["total_amount"]))

    order_id = cursor.lastrowid

    for item in data["items"]:
        cursor.execute("""
            INSERT INTO order_items (order_id, menu_item_id, quantity, price)
            VALUES (%s,%s,%s,%s)
        """, (order_id, item["menu_item_id"], item["quantity"], item["price"]))

    db.commit()
    cursor.close()
    db.close()
    return jsonify({"order_id": order_id})


@app.route("/student/orders/<int:user_id>")
def my_orders(user_id):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT o.*, ot.token_code
        FROM orders o
        LEFT JOIN order_tokens ot ON o.order_id=ot.order_id
        WHERE o.user_id=%s
    """, (user_id,))

    data = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(data)


# ===============================
# TOKEN
# ===============================
@app.route("/token/<int:order_id>")
def token(order_id):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT token_code FROM order_tokens WHERE order_id=%s", (order_id,))
    token = cursor.fetchone()

    if token:
        return jsonify(token)

    token_code = str(uuid.uuid4())[:8]
    cursor.execute("INSERT INTO order_tokens(order_id, token_code) VALUES(%s,%s)", (order_id, token_code))
    db.commit()
    cursor.close()
    db.close()
    return jsonify({"token": token_code})


@app.route("/token/validate", methods=["POST"])
def validate_token():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    data = request.json

    cursor.execute("""
        SELECT ot.token_code, o.order_id FROM order_tokens ot
        JOIN orders o ON ot.order_id=o.order_id
        WHERE ot.token_code=%s
    """, (data["token_code"],))

    token = cursor.fetchone()
    if not token:
        return jsonify({"message": "Invalid token"}), 404

    cursor.execute("UPDATE orders SET status='COLLECTED' WHERE order_id=%s", (token["order_id"],))
    db.commit()
    cursor.close()
    db.close()
    return jsonify({"message": "Order served"})


# ===============================
# PAYMENT
# ===============================
@app.route("/payment", methods=["POST"])
def payment():
    db = get_db_connection()
    cursor = db.cursor()
    data = request.json

    cursor.execute("""
        INSERT INTO payments(order_id, amount, payment_mode)
        VALUES(%s,%s,%s)
    """, (data["order_id"], data["amount"], data["payment_mode"]))

    db.commit()
    cursor.close()
    db.close()
    return jsonify({"message": "Payment successful"})


# ===============================
# HOTEL ADMIN
# ===============================
@app.route("/hoteladmin/menu/<int:hotel_id>")
def hotel_menu(hotel_id):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM menu_items WHERE hotel_id=%s", (hotel_id,))
    data = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(data)


@app.route("/hoteladmin/menu", methods=["POST"])
def add_menu():
    db = get_db_connection()
    cursor = db.cursor()
    data = request.json

    cursor.execute("""
        INSERT INTO menu_items(hotel_id,item_name,price)
        VALUES(%s,%s,%s)
    """, (data["hotel_id"], data["item_name"], data["price"]))

    db.commit()
    cursor.close()
    db.close()
    return jsonify({"message": "Menu item added"})


@app.route("/hoteladmin/orders/<int:hotel_id>")
def hotel_orders(hotel_id):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT o.order_id,u.name,o.total_amount,o.status,o.order_date
        FROM orders o JOIN users u ON o.user_id=u.user_id
        WHERE o.hotel_id=%s
    """, (hotel_id,))

    data = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(data)


@app.route("/hoteladmin/order-items/<int:order_id>")
def order_items(order_id):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT m.item_name, oi.quantity, oi.price
        FROM order_items oi JOIN menu_items m
        ON oi.menu_item_id=m.menu_item_id
        WHERE oi.order_id=%s
    """, (order_id,))

    data = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(data)


@app.route("/hoteladmin/update-order", methods=["PUT"])
def update_order():
    db = get_db_connection()
    cursor = db.cursor()
    data = request.json

    cursor.execute("UPDATE orders SET status=%s WHERE order_id=%s", (data["status"], data["order_id"]))
    db.commit()
    cursor.close()
    db.close()
    return jsonify({"message": "Order updated"})

@app.route("/hoteladmin/menu", methods=["PUT"])
def update_menu_item():
    db = get_db_connection()
    cursor = db.cursor()

    data = request.json
    menu_item_id = data["menu_item_id"]
    is_available = data["is_available"]

    cursor.execute("""
        UPDATE menu_items
        SET is_available=%s
        WHERE menu_item_id=%s
    """, (is_available, menu_item_id))

    db.commit()
    cursor.close()
    db.close()

    return jsonify({"message": "Menu updated"})

@app.route("/hoteladmin/menu/<int:menu_item_id>", methods=["DELETE"])
def delete_menu_item(menu_item_id):
    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute("DELETE FROM menu_items WHERE menu_item_id=%s", (menu_item_id,))
    db.commit()

    cursor.close()
    db.close()

    return jsonify({"message": "Menu item deleted"})  
# ===============================
# RUN
# ===============================
if __name__ == "__main__":
    app.run(debug=True)