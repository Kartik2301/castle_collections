var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var methodOverride = require("method-override");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var element = require("./models/StepStones");
var flash = require("connect-flash");
var seedDB  = require("./seeds")
var User = require("./models/user")
var  Comment = require("./models/comment");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

var commentsRoute = require("./routes/comments");
var indexRoute = require("./routes/index");
var castlesRoute = require("./routes/castles")

mongoose.connect("mongodb://localhost:27017/newbase", {useNewUrlParser : true});
app.use(bodyParser.urlencoded({extened:true}));
//seedDB();

app.use(flash());

    app.use(require("express-session")({
    secret: "Ned Stark",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
})

app.use(indexRoute);
app.use(castlesRoute);
app.use(commentsRoute);


app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server has started");
});