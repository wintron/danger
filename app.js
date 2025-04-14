const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const db = new sqlite3.Database(':memory:');

app.use(express.urlencoded({ extended: true }));

// Setup example users table
db.serialize(() => {
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)");
  db.run("INSERT INTO users (username, password) VALUES ('admin', 'supersecret')");
});

// 🚨 This route is vulnerable to SQL injection
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  db.get(query, (err, row) => {
    if (err) return res.status(500).send("Server error");
    if (row) return res.send("Logged in!");
    return res.status(401).send("Unauthorized");
  });
});

app.listen(3000, () => console.log("Server started on http://localhost:3000"));
