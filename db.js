const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file stored in the project root
const dbPath = path.resolve(__dirname, 'visitors.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to open database:', err.message);
  } else {
    console.log('Connected to SQLite database at', dbPath);
  }
});

// Initialize the visitors table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS visitors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL UNIQUE
    )
  `);
});

module.exports = {
  addVisitor: (name, phone) => {
    return new Promise((resolve, reject) => {
      const stmt = db.prepare('INSERT INTO visitors (name, phone) VALUES (?, ?)');
      stmt.run(name, phone, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID); // the assigned sequential number
        }
      });
      stmt.finalize();
    });
  },
  findVisitorByPhone: (phone) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM visitors WHERE phone = ?', [phone], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },
  getAllVisitors: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT id, name, phone FROM visitors ORDER BY id ASC', [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },
  getVisitorCount: () => {
    return new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM visitors', [], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row.count);
        }
      });
    });
  }
};
