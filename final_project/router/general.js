const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

let booksArray = Object.values(books);

// Register new users
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if(!isValid(username)) {
      users.push({ username, password });
      console.log(users)
      return res.status(203).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  } 

  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {

  try {
    const booksList = await new Promise((resolve, reject) => {
      resolve(books);
    });

    res.status(200).send(JSON.stringify(booksList));
  } catch (error) {
    res.status(500).send("Error fetching Books list.")
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const bookDetails = await new Promise((resolve, reject) => {
      resolve(books[isbn]);
    });

    if(bookDetails) {
      res.status(200).send(bookDetails);
    } else {
      res.status(404).send("Book not found");
    }

  } catch (error) {
    res.status(500).send("Error fetching book details")
  }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author.trim(); // Trim whitespace
  
  try {
    const authorBooks = await new Promise((resolve, reject) => {
      const filteredBooks = booksArray.filter((book) =>
        book.author.toLowerCase() === author.toLowerCase());
      resolve(filteredBooks);
    });

    res.status(200).send(JSON.stringify(authorBooks));
  } catch (error) {
    res.status(500).send("Error fetching books by author.");
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title.trim();
  
  try {
    const titleBooks = await new Promise((resolve, reject) => {
      const filteredBooks = booksArray.filter((book) => 
        book.title.toLowerCase() === title.toLowerCase());
      resolve(filteredBooks);
    });

    res.status(200).send(JSON.stringify(titleBooks));
  } catch (error) {
    res.status(500).send("Error fetching books by title.");
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const review = books[isbn].reviews;

  res.status(200).send(JSON.stringify(review));
});

module.exports.general = public_users;