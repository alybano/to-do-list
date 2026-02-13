import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// ✅ Use DATABASE_URL from .env for NeonDB
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL + "?sslmode=verify-full", // explicit sslmode
  ssl: {
    rejectUnauthorized: true, // ensures verify-full
  },
});

// ✅ Connect and log status
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Database connection error:", err.stack);
  } else {
    console.log("✅ Database connected successfully");
    release();
  }
});

