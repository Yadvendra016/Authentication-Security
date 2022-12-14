//LEVEL 2- ENCRYPTION
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');


const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));


//mongoose connection
mongoose.connect("mongodb://127.0.0.1:27017/userDB",{useNewUrlParser: true});

// now its not a simpls js object but actually a object that is created form mongoose schema class
var userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = "Thisismysecret."; 
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

app.get('/', (req,res) =>{

    res.render("home");
});

app.get('/login', (req,res) =>{

    res.render("login");
});

app.get('/register', (req,res) =>{

    res.render("register");
});

app.post('/register',(req,res)=>{
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save((err)=>{
        if(err)
           console.log(err);
        else
           res.render("secrets");
    })
});

app.post('/login', (req,res)=>{
   const username = req.body.username;
   const password = req.body.password;

   User.findOne({email: username}, (err,foundUser)=>{
    if(err){
        console.log(err);
    } else{
        if(foundUser){
            if(foundUser.password === password){
                res.render("secrets");
            }
        }
    }
   });
});





app.listen(3000,()=>console.log("Server is running at port 3000"));
