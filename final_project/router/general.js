const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js"); 
const public_users = express.Router();

// Task 10: Get the list of books available in the shop using async/await
public_users.get('/', async function (req, res) {
    try {
        const booksList = await new Promise((resolve) => resolve(books));
        res.status(200).json(booksList);  
    } catch (error) {
        res.status(500).json({ message: "Error fetching books" });
    }
});

// Task 11: Get book details based on ISBN using async/await
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn; 
    try {
        const book = await new Promise((resolve) => resolve(books[isbn]));
        if (book) {
            res.status(200).json(book);  
        } else {
            res.status(404).json({ message: "Book not found" }); 
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching book details" });
    }
});

// Task 12: Get book details based on author using async/await
public_users.get('/author/:author', async function (req, res) {
    const authorName = req.params.author.toLowerCase();  
    try {
        const booksByAuthor = await new Promise((resolve) => {
            const result = Object.keys(books)
                .filter(isbn => books[isbn].author.toLowerCase() === authorName)
                .map(isbn => books[isbn]);
            resolve(result);
        });

        if (booksByAuthor.length > 0) {
            res.status(200).json(booksByAuthor);  
        } else {
            res.status(404).json({ message: "No books found by this author" }); 
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by author" });
    }
});

// Task 13: Get book details based on title using async/await
public_users.get('/title/:title', async function (req, res) {
    const bookTitle = req.params.title.toLowerCase();  
    try {
        const bookFound = await new Promise((resolve) => {
            const result = Object.keys(books).find(isbn => books[isbn].title.toLowerCase() === bookTitle);
            resolve(books[result]);
        });

        if (bookFound) {
            res.status(200).json(bookFound); 
        } else {
            res.status(404).json({ message: "Book not found by this title" }); 
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching book by title" });
    }
});

// Register a new user (this part of the code remains unchanged)
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;  // Extract username and password from request body
  
    // Check if username or password is missing
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // Check if the username already exists
    const userExists = users.some(user => user.username === username);
  
    if (userExists) {
      return res.status(409).json({ message: "Username already exists" });  // Return error if username exists
    }
  
    // Register the new user
    const newUser = {
      username: username,
      password: password
    };
  
    users.push(newUser);  // Add the new user to the users array
  
    return res.status(201).json({ message: "User registered successfully" });
  });

module.exports.general = public_users;
