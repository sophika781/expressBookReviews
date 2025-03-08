const express = require('express');
const axios= require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username= req.body.username;
  const password= req.body.password;

  if(!username || !password){
    return res.status(400).json({message: "Please provide username and/or password!"});
  }
  else if(!isValid(username)){
    users.push(...[{"username": username, "password": password}]);
    return res.status(200).json({message: "User successfully added!"});
  }
  else{
    res.send("User already exists!");
  }
});

async function getAllBooks(){
    return JSON.stringify(books, null, 4);
}

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    let response= await getAllBooks();
    return res.status(200).send(response);
});

async function getBookByISBN (isbn) {
    if(books[isbn]){
        return JSON.stringify(books[isbn], null, 4);
    }
    else{
        throw new Error("Book does not exist!");
    }
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    let isbn= req.params.isbn;
    try{
        let response= await getBookByISBN(isbn);
        return res.status(200).send(response);
    }
    catch(error){
        return res.status(400).json({message: error.message});
    }
    
 });
 
async function getBookByAuthor(author) {
    let keys= Object.keys(books);
    let book_list= []
    for(let i=0; i<keys.length; i++){
      if(books[i+1].author === author){
          book_list.push(...[books[i+1]])
      }
    }
    if(book_list.length === 0)
      throw new Error("Book does not exist!");
    else
      return book_list;
} 

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    let author= req.params.author;
    try{
        let response= await getBookByAuthor(author);
        return res.status(200).send(response);
    }
    catch(error){
        return res.status(400).json({message: error.message});
    }
});

async function getBookByTitle(title){
    let keys= Object.keys(books);
    let book_list= []
    for(let i=0; i<keys.length; i++){
      if(books[i+1].title === title){
          book_list.push(...[books[i+1]])
      }
    }
    if(book_list.length === 0)
      throw new Error("No books were found!");
    else
      return book_list;
}


// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  let title= req.params.title;
    try{
        let response= await getBookByTitle(title);
        return res.status(200).send(response);
    }
    catch(error){
        return res.status(400).json({message: error.message});
    }   
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn= req.params.isbn;
    if(books[isbn])
        return res.status(200).send(books[isbn].reviews);
    else
        return res.status(400).json({message: "Book does not exist!"});
});

module.exports.general = public_users;
