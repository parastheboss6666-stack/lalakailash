const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// SQLite setup
const db = new sqlite3.Database("./orders.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user TEXT,
        email TEXT,
        phone TEXT,
        address TEXT,
        cart TEXT,
        total REAL,
        status TEXT,
        payment_id TEXT
      )
    `);
  }
});

// Test API route
app.get("/api/test", (req, res) => {
  res.json({ message: "API test successful" });
});

// Handle order submission
app.post("/api/orders", (req, res) => {
  const { customer, cart, total, payment_id } = req.body;

  if (!customer || !cart) {
    return res.status(400).json({ error: "Missing order details" });
  }

  db.run(
    `INSERT INTO orders (user, email, phone, address, cart, total, status, payment_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      customer.name || "",
      customer.email || "",
      customer.phone || "",
      customer.address || "",
      JSON.stringify(cart),
      total || 0,
      "Received",
      payment_id || "",
    ],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true, orderId: this.lastID });
    }
  );
});

// Serve static frontend (optional if you want backend + frontend together)
// Uncomment and adjust if needed:
// app.use(express.static(path.join(__dirname, "../frontend/public")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/public/index.html"));
// });

// Render-required port listener
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
