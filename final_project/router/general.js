const express = require('express');
const axios = require('axios');
const router = express.Router();
const books = require('./booksdb.js');

// Simulate getting books from a "remote" source via Axios
const fetchBooks = () => {
  return new Promise((resolve) => {
    resolve(books);
  });
};

// 📘 Task 10: Get all books (async/await)
router.get('/', async (req, res) => {
  try {
    const response = await fetchBooks(); // simulate Axios
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch books" });
  }
});

// 📘 Task 11: Get book by ISBN (async/await)
router.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const response = await fetchBooks();
    if (response[isbn]) {
      res.status(200).json(response[isbn]);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving book by ISBN" });
  }
});

// 📘 Task 12: Get books by author (async/await)
router.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author.toLowerCase();
    const response = await fetchBooks();
    const filtered = Object.values(response).filter(
      book => book.author.toLowerCase() === author
    );
    res.status(200).json(filtered);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books by author" });
  }
});

// 📘 Task 13: Get books by title (async/await)
router.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title.toLowerCase();
    const response = await fetchBooks();
    const filtered = Object.values(response).filter(
      book => book.title.toLowerCase() === title
    );
    res.status(200).json(filtered);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books by title" });
  }
});

module.exports = router;
