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
  userInfo.push({username,hash, failedAttempts : 0,lockoutUntil : null});
  res.render("home.ejs");
  return hash;
});
})

app.get("/login",(req,res) => {
    res.render("login.ejs");
})

app.post("/home",(req,res) => {
    const {username,password} = req.body;
    const user = userInfo.find(u => u.username === username);
    if(!user){
        return res.send("Invalid User Info");
    }

    const lockoutDurationMs = 2*60*1000;
    const now = Date.now();
    if (user.lockoutUntil && user.lockoutUntil > now) {
        const remainingTimeSec = Math.ceil((user.lockoutUntil - now) / 1000);
        return res.send(`LOCKED_OUT:${remainingTimeSec}`); 
    }

    bcrypt.compare(password, user.hash, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Server Error during login.");
        }
        if(result === true){
            user.failedAttempts = 0;
            user.lockoutUntil  = null;
          return   res.send("LOGIN_SUCCESS");
        }else {
            user.failedAttempts++;
            if(user.failedAttempts>=3){
                user.lockoutUntil = now + lockoutDurationMs;
                res.send("ACCOUNT_LOCKED_2MIN");
            }else{
                const remaining = 3-user.failedAttempts;
                res.send(`Invalid password. ${remaining} attempt(s) remaining.`);
            }
        }
                }
                
    )
})

 app.get("/home",(req,res) => {
    res.render("home.ejs");
    })

