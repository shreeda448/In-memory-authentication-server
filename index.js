const express = require("express");
const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.set("view engine","ejs");

app.listen(port,() => {
    console.log(`Server is running on port ${port}`);
})

const userInfo = [];

    app.get("/",(req,res) => {
        res.redirect("/signup");
        console.log(" call reached signup page")
    })

    app.get("/signup",(req,res) => {
        res.render("signup.ejs");
        console.log("Opened signup page.");
    })

app.post("/signup",(req,res) => {
   const  {username,password} = req.body; 
   userInfo.push({username,password});
   res.render("home.ejs",{username,password});
   console.log(userInfo);
   console.log("Post Reached home");
})
console.log(userInfo);

app.get("/login",(req,res) => {
    res.render("login.ejs");
    console.log("opened login page");
})

app.post("/home",(req,res) => {
    let count =0;
    console.log(req.body);
    const {username,password} = req.body;
    for(let i=0;i<userInfo.length;i++){
        if((req.body.username == userInfo[i].username)&&(req.body.password == userInfo[i].password)){
            count++;
            console.log(count);
            console.log(userInfo[i].username);
            break;
            }
    }
    
    console.log(count);
    if(count == 0){
        res.send("Invalid User Info");
    }else{
        res.render("home.ejs",{username,password});
    }

})

 app.get("/home",(req,res) => {
    res.render("home.ejs");
    console.log("Rendering home page.");
    })

