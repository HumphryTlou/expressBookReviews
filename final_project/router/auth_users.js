const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Function to check if the username is valid
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Function to check if the username and password match the one we have in records
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Validate request body
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username exists
  if (!isValid(username)) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if the username and password match
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate a JWT token
  const accessToken = jwt.sign({ username }, 'access_secret_key', { expiresIn: '1h' });

  // Send the JWT token
  return res.status(200).json({ message: "Login successful", token: accessToken });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.query;

  // Verify that a review and token exist
  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Authentication token is required" });
  }

  // Decode the token to get the username
  let username;
  try {
    const decoded = jwt.verify(token, 'access_secret_key');
    username = decoded.username;
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }

  // Find the book by ISBN
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Add or update the review
  if (!book.reviews) {
    book.reviews = {};
  }

  book.reviews[username] = review;  // Add or modify the review

  return res.status(200).json({ message: "Review added/modified successfully" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Authentication token is required" });
  }

  // Decode the token to get the username
  let username;
  try {
    const decoded = jwt.verify(token, 'access_secret_key');
    username = decoded.username;
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }

  // Find the book by ISBN
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the user has a review for this book
  if (book.reviews && book.reviews[username]) {
    delete book.reviews[username];  // Delete the user's review
    return res.status(200).json({ message: "Review deleted successfully" });
  } else {
    return res.status(404).json({ message: "Review not found for this user" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
