# 👗 அகத்தியர் Store - Complete Project

## 📁 Project Structure
```
agathiyar-store/
├── backend/          ← Python Flask API
│   ├── app.py
│   └── requirements.txt
└── frontend/         ← React App
    ├── package.json
    ├── public/
    └── src/
```

---

## 🚀 Setup & Run (Step by Step)

### Step 1: Python Backend Start பண்ணுங்க

VS Code-ல் Terminal திறங்க (Ctrl + ` )

```bash
# backend folder-க்கு போங்க
cd agathiyar-store/backend

# Required packages install பண்ணுங்க
pip install -r requirements.txt

# Server start பண்ணுங்க
python app.py
```

✅ Backend: http://localhost:5000 ல் run ஆகும்

---

### Step 2: React Frontend Start பண்ணுங்க

New Terminal திறங்க (+ button)

```bash
# frontend folder-க்கு போங்க
cd agathியார-store/frontend

# Packages install பண்ணுங்க (first time மட்டும்)
npm install

# App start பண்ணுங்க
npm start
```

✅ Frontend: http://localhost:3000 ல் open ஆகும்

---

## 🌐 Pages

| Page | URL |
|------|-----|
| 🏪 Shop (Public) | http://localhost:3000 |
| 🔐 Admin Login | http://localhost:3000/admin/login |
| 📊 Admin Dashboard | http://localhost:3000/admin |

---

## 🔑 Default Admin Login

- **Username:** admin
- **Password:** admin123

> ⚠️ Settings-ல் WhatsApp number add பண்ணுங்க!

---

## ✨ Features

### 🏪 Shop Page (Public)
- Home - Shop info & hours
- Products - Dress list
- Reviews - Customer reviews + Write review
- About - Address & contact

### 🔐 Admin Panel
- 📊 Dashboard - Today's stats
- 👗 Products - Add/Edit/Delete dress + Stock
- 🧾 Billing - Customer bill + PDF + WhatsApp send
- 👨‍💼 Staff - Add/Delete staff
- ⭐ Reviews - Approve/Delete reviews
- 📈 Reports - Excel export
- ⚙️ Settings - Shop details + WhatsApp number

---

## 💡 Tips

1. **WhatsApp Bill Send:**
   Settings → WhatsApp number போடுங்க
   Bill create பண்ணும்போது → "WhatsApp-ல் Send பண்ணு" button வரும்
   Click பண்ணி → Customer-க்கு forward பண்ணுங்க

2. **PDF Download:**
   Billing → History → PDF button

3. **Stock Update:**
   Bill create ஆகும்போது automatically stock குறையும்

4. **Refresh பண்ணாலும் Admin-உள்ளேயே இருப்பீங்க** ✅
   JWT Token browser-ல் save ஆகும்

---

## 🛠️ Tech Stack
- **Frontend:** React.js + React Router
- **Backend:** Python Flask
- **Database:** SQLite (automatic create ஆகும்)
- **PDF:** ReportLab
- **Excel:** OpenPyXL
- **Auth:** JWT Tokens
