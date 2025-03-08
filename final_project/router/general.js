const express = require('express');
const axios= require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


async function getAllBooks(){
    try{
        let response = await axios.get("https://sophika171g-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/");
        console.log(response.data);
    }
    catch(error){
        console.log(error.message);
    }
}

async function getBookByISBN (isbn) {
    try{
        let response = await axios.get(`https://sophika171g-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/${isbn}`);
        console.log(response.data);
    }
    catch(error){
        console.log(error.message);
    }
}

async function getBookByAuthor(author) {
    try{
        let response= await axios.get(`https://sophika171g-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/author/${author}`);
        console.log(response.data);
    }
    catch(error){
        console.log(error.message);
    }
}

async function getBookByTitle(title){
    try{
        let response= await axios.get(`https://sophika171g-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/title/${title}`);
        console.log(response.data);
    }
    catch(error){
        console.log(error.message);
    }
}

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

// Get the book list available in the shop
public_users.get('/',function (req, res) {
   return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn= req.params.isbn;
  if(books[isbn]){
    return res.status(200).send(JSON.stringify(books[isbn], null, 4));
  }
  else
    return res.status(400).json({message: "Book does not exist!"});
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
    return res.status(400).json({message: "No books were found!"});
  else
    return res.status(200).send(book_list);
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
    return res.status(400).json({message: "No books were found!"});
  else
    return res.status(200).send(book_list);
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
