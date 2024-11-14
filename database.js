const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./workoutTracker.db');

// Initialize the database tables if they do not exist
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS workouts (id INTEGER PRIMARY KEY, user_id TEXT, workout_name TEXT, weight REAL, reps INTEGER, distance REAL, date TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS personal_records (user_id TEXT, workout_name TEXT, weight REAL, reps INTEGER, distance REAL, date TEXT, PRIMARY KEY (user_id, workout_name))");
});

// Function to add a workout
function addWorkout(userId, workoutName, weight, reps, distance) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO workouts (user_id, workout_name, weight, reps, distance, date) VALUES (?, ?, ?, ?, ?, datetime('now'))`,
      [userId, workoutName, weight, reps, distance],
      (err) => {
        if (err) return reject(err);
        resolve('Workout added successfully!');
      }
    );
  });
}

// Function to get workout PRs
function getPR(userId, workoutName) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM personal_records WHERE user_id = ? AND workout_name = ?', [userId, workoutName], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

// Function to update PRs
function updatePR(userId, workoutName, weightOrDistance, reps) {
  return new Promise((resolve, reject) => {
    if (workoutName === 'pushups') {
      db.get('SELECT * FROM personal_records WHERE user_id = ? AND workout_name = ?', [userId, workoutName], (err, row) => {
        if (err) return reject(err);

        if (!row || reps > row.reps) {
          db.run('INSERT OR REPLACE INTO personal_records (user_id, workout_name, weight, reps, distance, date) VALUES (?, ?, ?, ?, ?, datetime("now", "localtime"))',
            [userId, workoutName, null, reps, null],
            (err) => {
              if (err) return reject(err);
              resolve(`New PR for pushups: ${reps} reps!`);
            });
        } else {
          resolve(`Your current PR for pushups remains at ${row.reps} reps.`);
        }
      });
    } else {
      // For other workouts (weight or distance-based)
      db.get('SELECT * FROM personal_records WHERE user_id = ? AND workout_name = ?', [userId, workoutName], (err, row) => {
        if (err) return reject(err);

        if (!row || (weightOrDistance && weightOrDistance > row.weight) || (reps && reps > row.reps) || (workoutName === 'running' || workoutName === 'cycling') && weightOrDistance > row.distance) {
          db.run('INSERT OR REPLACE INTO personal_records (user_id, workout_name, weight, reps, distance, date) VALUES (?, ?, ?, ?, ?, datetime("now", "localtime"))',
            [userId, workoutName, weightOrDistance, reps, workoutName === 'running' || workoutName === 'cycling' ? weightOrDistance : null],
            (err) => {
              if (err) return reject(err);
              resolve(`New PR for ${workoutName}: ${weightOrDistance} ${workoutName === 'running' || workoutName === 'cycling' ? 'km' : 'kg'}!`);
            });
        } else {
          resolve(`Your current PR for ${workoutName} remains at ${row.reps || row.weight || row.distance}`);
        }
      });
    }
  });
}

// Function to get the workout history
function getWorkoutHistory(userId) {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM workouts WHERE user_id = ?', [userId], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

// Exporting functions to be used in the index.js file
module.exports = {
  addWorkout,
  getPR,
  updatePR,
  getWorkoutHistory
};
