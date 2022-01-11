//require("dotenv").config()

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}))

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home");
});

app.route("/login")
.get(function(req, res){
    res.render("login");
})
.post(function(req, res){
    User.findOne({email: req.body.username}, function(err, foundUser){  // desencriptografa automaticamente
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                bcrypt.compare(req.body.password, foundUser.password, function(err, result){
                    if (result) {
                        res.render("secrets");
                    }
                });
            }
        }
    });
});

app.route("/register")
.get(function(req, res){
    res.render("register");
})
.post(function(req, res){
    bcrypt.hash(req.body.password, saltRounds, function(err, hash){
        const newUser = new User ({
            email: req.body.username,
            password: hash
        });
        newUser.save(function(err){ // salva a senha encriptografada automaticamente
            if (err) {
                console.log(err);
            } else {
                res.render("secrets");
            }
        });
    });
});

app.listen(3000, function(){
    console.log("Server started on port 3000.");
});