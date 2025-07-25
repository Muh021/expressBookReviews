const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// 🔒 Helper: Check if username exists
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// 🔒 Helper: Check if username and password match
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// ✅ Register new user
regd_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing username or password" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User created successfully" });
});

// ✅ Login route
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing username or password" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(403).json({ message: "Invalid credentials" });
  }

  const accessToken = jwt.sign({ data: username }, 'access', { expiresIn: 60 * 60 });

  req.session.authorization = {
    accessToken,
    username,
  };

  return res.status(200).json({ message: "User logged in successfully" });
});

// ✅ Add or update book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const user = req.session.authorization?.username;
  const isbn = req.params.isbn;
  const review = req.body.review;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  books[isbn].reviews[user] = review;

  return res.status(201).json({ message: "Review added/updated successfully" });
});

// ✅ Delete book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const user = req.session.authorization?.username;
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbn].reviews[user]) {
    return res.status(404).json({ message: "Review by user not found" });
  }

  delete books[isbn].reviews[user];

  return res.status(200).json({ message: "Review deleted successfully" });
});

// ✅ Export
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
