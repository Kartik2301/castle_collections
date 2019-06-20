var element = require("../models/StepStones");
var express = require("express");

var router  = express.Router();
var User = require("../models/user")
var passport = require("passport");

router.get("/", function(req, res){
    res.render("landing.ejs");
});

router.get("/register",function(req, res) {
    res.render("register.ejs");
});

router.post("/register",function(req,res){
    User.register(new User({username:req.body.username}),req.body.password,function(err,user){
        if(err){
            req.flash("error",err.message);
            console.log(err);
        }else{
            passport.authenticate("local")(req,res,function(){
                req.flash("success","Welcome to this website "+ user.username);
                res.redirect("/castles");
            })
        }
    });
});

//Login route

router.get("/login",function(req, res) {
    res.render("login.ejs");
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/castles",
        failureRedirect: "/login"
    }), function(req, res){
});

//logout route

router.get("/logout",function(req, res) {
    req.logout();
    req.flash("success","Logged you out");
    res.redirect("/castles");
});



module.exports = router;