import express from 'express';
import { pool } from './db.js';
import { hashPassword, comparePassword } from './components/hash.js';
import session from 'express-session';


const app = express();
app.use(express.json());

app.use(session({
  name: 'user-session',
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } 
}));

const PORT = 3000;

app.get('/get-list', async (req, res) => {
    try {
        const list = await pool.query('SELECT * FROM list');
        res.status(200).json({ success: true, list: list.rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/get-items', async (req, res) => {
    try {
        const items = await pool.query('SELECT * FROM items');
        if (items.rows.length === 0) {
            return res.status(200).json({
                success: false,
                message: "No items found"
            });
        }
        res.status(200).json({ success: true, items: items.rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/lists/:listId/items', async (req, res) => {
  const { listId } = req.params;
  const { description, status } = req.body;

  await pool.query(
    `INSERT INTO items (list_id, description, status)
     VALUES ($1, $2, $3)`,
    [listId, description, status]
  );

  res.status(200).json({ success: true });
});

// Add new list
app.post('/add-list', async (req, res) => {
    const { listTitle } = req.body;

    try {
        await pool.query(
            `INSERT INTO list (title, status) VALUES ($1, $2)`,
            [listTitle, "pending"]
        );

        res.status(200).json({ success: true, message: "List added successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.put('/lists/:listId/items/:itemId', async (req, res) => {
  const { listId, itemId } = req.params;
  const { description, status } = req.body;

  const result = await pool.query(
    `UPDATE items 
     SET description = $1, status = $2 
     WHERE id = $3 AND list_id = $4`,
    [description, status, itemId, listId]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ success: false, message: "Item not found in this list" });
  }

  res.json({ success: true, message: "Item updated" });
});

app.delete('/lists/:listId/items/:itemId', async (req, res) => {
  const { listId, itemId } = req.params;

  const result = await pool.query(
    `DELETE FROM items WHERE id = $1 AND list_id = $2`,
    [itemId, listId]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ success: false, message: "Item not found in this list" });
  }

  res.json({ success: true, message: "Item deleted" });
});

app.post('/register', async (req, res) => {
  try {
    const { username, password, confirm ,name} = req.body;

    if (!username || !password || !confirm|| !name) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (password !== confirm) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match"
      });
    }

    const existingUser = await pool.query(
      'SELECT * FROM user_accounts WHERE username = $1',
      [username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Username already exists"
      });
    }

    // 🔐 HASH PASSWORD
    const hashedPassword = await hashPassword(password);

    await pool.query(
      'INSERT INTO user_accounts (username, password,name) VALUES ($1, $2,$3)',
      [username, hashedPassword,name]
    );

    res.status(200).json({
      success: true,
      message: "Registered successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM user_accounts WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password"
      });
    }

    const user = result.rows[0];

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password"
      });
    }

    // Save user id and name to session
    req.session.userId = user.id;
    req.session.name = user.name;

    res.status(200).json({
      success: true,
      message: "Login successful"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/get-session', (req, res) => {
  if (req.session.userId ) {
    return res.status(200).json({
      session: true,
      userId: req.session.userId,
      name: req.session.name

    });
  } else {
    return res.status(200).json({
      session: false
    });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to log out",
        error: err.message
      });
    }

    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
