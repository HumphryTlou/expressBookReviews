const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Register a new user
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
  
// Get the book list available in the shop
public_users.get('/',function (req, res) {
    // Convert the books object to a neatly formatted JSON string
    const bookList = JSON.stringify(books, null, 4);
    
    // Send the response with the book list
    res.status(200).send(bookList);
  });
  

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;  // Retrieve ISBN from request parameters
  const book = books[isbn];  // Find the book by ISBN

  if (book) {
    res.status(200).json(book);  // Return the book details if found
  } else {
    res.status(404).json({message: "Book not found"});  // Return an error message if not found
  }
});

  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const authorName = req.params.author; // Get the author from the request parameters
    const booksByAuthor = [];
  
    // Iterate over the 'books' object and find books by the specified author
    Object.keys(books).forEach(isbn => {
      if (books[isbn].author.toLowerCase() === authorName.toLowerCase()) {
        booksByAuthor.push(books[isbn]); // Add the book to the result list if the author matches
      }
    });
  
    if (booksByAuthor.length > 0) {
      res.status(200).json(booksByAuthor);  // Return the list of books by the author
    } else {
      res.status(404).json({ message: "No books found by this author" });  // Return error if no books found
    }
  });
  

// Get book details based on title
public_users.get('/title/:title', function (req, res) {
    const bookTitle = req.params.title.toLowerCase();  // Get the title from the request parameters and convert to lowercase for case-insensitive matching
    let bookFound = null;
  
    // Iterate over the 'books' object and find a book with the specified title
    Object.keys(books).forEach(isbn => {
      if (books[isbn].title.toLowerCase() === bookTitle) {
        bookFound = books[isbn];  // If title matches, store the book details
      }
    });
  
    if (bookFound) {
      res.status(200).json(bookFound);  // Return the book details if found
    } else {
      res.status(404).json({ message: "Book not found by this title" });  // Return error if no book found
    }
  });
  

// Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;  // Get the ISBN from the request parameters
    const book = books[isbn];  // Find the book by ISBN
  
    if (book) {
      if (book.reviews) {
        res.status(200).json(book.reviews);  // Return the book reviews if they exist
      } else {
        res.status(404).json({ message: "No reviews available for this book" });  // Return message if no reviews found
      }
    } else {
      res.status(404).json({ message: "Book not found" });  // Return error if book not found
    }
  });
  

module.exports.general = public_users;
