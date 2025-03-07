const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let names = users.filter((user) => user.username === username);
    if(names.length > 0)
        return true;
    return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let foundUsers= users.filter((user) => user.username=== username && user.password===password);
    if (foundUsers.length > 0){
        return true;
    }
    return false;
 }

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username= req.body.username;
  const password= req.body.password;

  if(!authenticatedUser(username, password)){
    return res.status(400).json({message: "Please login with proper credentials!"});
  }
  else{
    // Generate JWT access token
    let accessToken = jwt.sign({
        data: password
    }, 'access', { expiresIn: 60 * 60 });
    
    // Store access token and username in session
    req.session.authorization = {
        accessToken, username
    }
    return res.status(200).json({message: `User successfully logged in!`});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn= req.params.isbn;
  let review= req.query.review;
  if(!review){
    return res.status(400).json({message: "Write a valid review!"});
  }
  else{
    books[isbn].reviews[req.session.authorization.username]= review;
    return res.status(200).json({message: `Review by ${req.session.authorization.username} successfully edited/added`});
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn= req.params.isbn;
    let reviews= books[isbn].reviews;
    if(!reviews[req.session.authorization.username])
        return res.status(400).json({message: "You have not posted a review for this book!"});
    else{
        delete reviews[req.session.authorization.username];
        return res.status(200).json({message: "Review has been successfully deleted!"});
    }
    

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
