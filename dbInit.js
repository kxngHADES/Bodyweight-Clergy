const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./workouts.db');

// Initialize database tables
db.serialize(() => {
  // Table for workouts with workout name, weight, reps, and date
  db.run(`
    CREATE TABLE IF NOT EXISTS workouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      workout_name TEXT,
      weight REAL,
      reps INTEGER,
      date TEXT
    )
  `);

  // Table for PRs (personal records), including best weight and best reps
  db.run(`
    CREATE TABLE IF NOT EXISTS prs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      workout_name TEXT,
      best_weight REAL,
      best_reps INTEGER,
      date TEXT
    )
  `);
});

db.close();

console.log('Database initialized.');
