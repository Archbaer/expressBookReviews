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
public_users.get('/',function (req, res) {

  res.status(200).send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  res.send(books[isbn]);
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author.trim(); // Trim whitespace
  const autorEsc = booksArray.filter((book) =>
    book.author.toLowerCase() === author.toLowerCase());

  res.status(200).send(JSON.stringify(autorEsc));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title.trim();
  const titleEsc = booksArray.filter((book) => 
    book.title.toLowerCase() === title.toLowerCase());

  res.status(200).send(JSON.stringify(titleEsc));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const review = books[isbn].reviews;

  res.status(200).send(JSON.stringify(review));
});

module.exports.general = public_users;