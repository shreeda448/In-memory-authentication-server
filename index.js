const express = require("express");

const app = express();

const port = 8080;

const bcrypt = require('bcrypt');

const saltRounds = 10; 

app.use(express.json());

app.use(express.urlencoded({extended:true}));

app.set("view engine","ejs");

app.listen(port,() => {
    console.log(`Server is running on port ${port}`);
})

const userInfo = [];

app.get("/",(req,res) => {
     res.redirect("/signup");
})

app.get("/signup",(req,res) => {
    res.render("signup.ejs");
})

app.post("/signup",(req,res) => {
   const  {username,password} = req.body; 
   bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) throw err;
  userInfo.push({username,hash});
  return hash;
});
   res.render("home.ejs");
})

app.get("/login",(req,res) => {
    res.render("login.ejs");
})

app.post("/home",(req,res) => {
    const {username,password} = req.body;
    const user = userInfo.find(u => u.username === username);
    if(!user){
        res.send("Invalid User Info");
    }
    bcrypt.compare(password, user.hash, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Server Error during login.");
        }
        if(result === true){
            res.render("home.ejs", { username: user.username });
        }else {
            res.send("Invalid User Info");
        }
                }
    )
})

 app.get("/home",(req,res) => {
    res.render("home.ejs");
    })

