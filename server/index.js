import express from "express";
import session from "express-session";
import connectRedis from "connect-redis";
import Redis from "redis";
import helmet from "helmet";
import cors from "cors";

import { pool } from "./db.js";
import { hashPassword, comparePassword } from "./components/hash.js";

const app = express();
const PORT = process.env.PORT || 3000;

/* =======================
   SECURITY MIDDLEWARE
======================= */
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:"],
      },
    },
  })
);

// Middleware
app.use(express.json());

/* =======================
   CORS MIDDLEWARE
======================= */
const allowedOrigins = [
  "https://to-do-list-one-black-96.vercel.app",
  "http://localhost:5173",
];

// Dynamic CORS check (kept intact)
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Also allow static origins (as before)
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* =======================
   SESSION MIDDLEWARE (Redis)
======================= */
const RedisStore = connectRedis(session);
const redisClient = Redis.createClient({ url: process.env.REDIS_URL });
redisClient.connect().catch(console.error);

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    name: "user-session",
    secret:
      "eeb1776a97822c4a1abbb47a677f6b415100a2f0ef3effb2d4c4523dec57d468",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "lax",
    },
  })
);

/* =======================
   ROUTES
======================= */
app.get("/", (req, res) => {
  res.send("Welcome to the To-Do List!");
});

// Favicon fix
app.get("/favicon.ico", (req, res) => res.status(204).end());

/* =======================
   LISTS ROUTES
======================= */
// ... all your list routes remain unchanged ...
// Get all lists
app.get("/get-list", async (req, res) => {
  try {
    const list = await pool.query("SELECT * FROM list");
    res.status(200).json({ success: true, list: list.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single list by ID
app.get("/get-list/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT id, title FROM list WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false });
    }

    res.json({ success: true, list: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add list
app.post("/add-list", async (req, res) => {
  const { listTitle } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO list (title, status) VALUES ($1, $2) RETURNING *",
      [listTitle, "pending"]
    );
    res.status(200).json({ success: true, list: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update list
app.put("/update-list/:listId", async (req, res) => {
  const { listId } = req.params;
  const { title } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ success: false, message: "Title required" });
  }

  try {
    const result = await pool.query(
      "UPDATE list SET title = $1 WHERE id = $2 RETURNING *",
      [title, listId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false });
    }

    res.json({ success: true, list: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete list
app.delete("/delete-list/:listId", async (req, res) => {
  const { listId } = req.params;
  try {
    await pool.query("DELETE FROM items WHERE list_id = $1", [listId]);
    const result = await pool.query(
      "DELETE FROM list WHERE id = $1 RETURNING id",
      [listId]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ success: false });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
/* =======================
   ITEMS ROUTES
======================= */

app.get("/get-items", async (req, res) => {
  try {
    const items = await pool.query("SELECT * FROM items");
    res.status(200).json({ success: true, items: items.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/get-items/:listId", async (req, res) => {
  const { listId } = req.params;
  try {
    const items = await pool.query(
      "SELECT * FROM items WHERE list_id = $1",
      [listId]
    );
    res.status(200).json({ success: true, items: items.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/lists/:listId/items", async (req, res) => {
  const { listId } = req.params;
  const { description } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO items (list_id, description, status) VALUES ($1, $2, $3) RETURNING *",
      [listId, description, "pending"]
    );
    res.json({ success: true, item: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put("/lists/:listId/items/:itemId", async (req, res) => {
  const { listId, itemId } = req.params;
  const { description, status } = req.body;
  try {
    const result = await pool.query(
      "UPDATE items SET description = $1, status = $2 WHERE id = $3 AND list_id = $4 RETURNING *",
      [description, status, itemId, listId]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ success: false });
    res.json({ success: true, item: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete("/lists/:listId/items/:itemId", async (req, res) => {
  const { listId, itemId } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM items WHERE id = $1 AND list_id = $2 RETURNING id",
      [itemId, listId]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ success: false });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* =======================
   AUTH ROUTES
======================= */
app.post("/register", async (req, res) => {
  const { name, username, password, confirm } = req.body;

  try {
    if (!name || !username || !password || !confirm)
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });

    if (password !== confirm)
      return res
        .status(400)
        .json({ success: false, message: "Passwords don't match" });

    const exists = await pool.query(
      "SELECT 1 FROM user_accounts WHERE username = $1",
      [username]
    );
    if (exists.rows.length > 0)
      return res
        .status(400)
        .json({ success: false, message: "Username exists" });

    const hashed = await hashPassword(password);

    const result = await pool.query(
      "INSERT INTO user_accounts (name, username, password) VALUES ($1, $2, $3) RETURNING id, name, username",
      [name, username, hashed]
    );

    req.session.userId = result.rows[0].id;
    req.session.username = result.rows[0].username;

    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password)
      return res
        .status(400)
        .json({ success: false, message: "Username and password required" });

    const result = await pool.query(
      "SELECT * FROM user_accounts WHERE username = $1",
      [username]
    );
    if (result.rows.length === 0)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const user = result.rows[0];
    const match = await comparePassword(password, user.password);
    if (!match)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    req.session.userId = user.id;
    req.session.username = user.username;

    res.json({
      success: true,
      user: { id: user.id, username: user.username },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/get-session", (req, res) => {
  if (req.session.userId) {
    return res.json({
      session: true,
      userId: req.session.userId,
      username: req.session.username,
    });
  }
  res.json({ session: false });
});

app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ success: true });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});