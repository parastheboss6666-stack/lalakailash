import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./orders.db', (err) => {
  if (err) console.error('DB opening:', err);
});

db.run(`CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  cart TEXT,
  total REAL,
  status TEXT,
  payment_id TEXT
)`);

app.post('/api/orders', (req, res) => {
  const { customer, cart, total, payment_id } = req.body;

  db.run(`INSERT INTO orders (user, email, phone, address, cart, total, status, payment_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      customer.name || "", customer.email || "",
      customer.phone || "", customer.address || "",
      JSON.stringify(cart), total || 0, "Received", payment_id || ""
    ],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, orderId: this.lastID });
    });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
