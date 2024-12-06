const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password) {
    return res.status(400).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)){
    let accessToken = jwt.sign({ username: username }, "fingerprint_customer", { expiresIn: 60 * 60 });
    
    req.session.authorization = { accessToken, username };
    console.log(req.session.authorization);

    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(401).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let review = req.body.review;
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  
  if(!books[isbn]) {
    return res.status(404).send("Book not found");
  }

  if(!books[isbn].reviews) {
    books[isbn.reviews] = {};
  }

  if(username in books[isbn].reviews) {
    books[isbn].reviews[username] = review;
    res.send(`${username} has updated their review: ${review}`)
    console.log(books[isbn]);
  } else {
    books[isbn].reviews[username] = review;
    res.send(`${username} has submitted the following review: ${review}`);
    console.log(books[isbn]);
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username;
  const isbn = req.params.isbn;

  if(!books[isbn] || !books[isbn].reviews) {
    return res.status(404).send("Book not found or no reviews available");
  };

  if(username in books[isbn].reviews) {
    
    delete books[isbn].reviews[username];
    return res.send(`${username} has deleted their review for ${books[isbn].title}`);
  } else {
    return res.status(404).send(`${username} has no review for this book to delete.`);
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;