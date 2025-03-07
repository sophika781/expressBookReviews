const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username= req.body.username;
  const password= req.body.password;

  if(!username || !password){
    res.send("Please provide username and/or password!");
  }
  else if(!isValid(username)){
    users.push(...[{"username": username, "password": password}]);
    return res.status(200).json({message: "User successfully added!"});
  }
  else{
    res.send("User already exists!");
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
   res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn= req.params.isbn;
  if(books[isbn]){
    res.send(JSON.stringify(books[isbn], null, 4));
  }
  else
    res.send("Book does not exist!");
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author= req.params.author;
  let keys= Object.keys(books);
  let book_list= []
  for(let i=0; i<keys.length; i++){
    if(books[i+1].author === author){
        book_list.push(...[books[i+1]])
    }
  }
  if(book_list.length === 0)
    res.send("No books were found!");
  else
    res.send(book_list);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title= req.params.title;
  let keys= Object.keys(books);
  let book_list= []
  for(let i=0; i<keys.length; i++){
    if(books[i+1].title === title){
        book_list.push(...[books[i+1]])
    }
  }
  if(book_list.length === 0)
    res.send("No books were found!");
  else
    res.send(book_list);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn= req.params.isbn;
    if(books[isbn])
        res.send(books[isbn].reviews);
    else
        res.send("Book does not exist!");
});

module.exports.general = public_users;
