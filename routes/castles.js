var express = require("express");
var router  = express.Router({mergeParams: true});
var element = require("../models/StepStones");
var middleware = require("../middleware");

var Castles =[
        {name:"Winterfell", image: "https://vignette.wikia.nocookie.net/gameofthrones/images/5/59/The_Eyrie.jpg/revision/latest/scale-to-width-down/350?cb=20110615190250"}
        ];
        
router.get("/castles",function(req,res){
    element.find({},function(err,allCastles){
        if(err){
            console.log(err);
        }
        else{
            res.render("castle_collc/CASTLES.ejs",{Castles:allCastles});
        }
    });
});

router.post("/castles",middleware.isLoggedIn,function(req,res){
   var name = req.body.name;
   var image = req.body.image;
   var price = req.body.price;
   var desc = req.body.description;
   var author = {
       id:req.user._id,
       username : req.user.username
   }
   var newCastle = {name:name, image:image, description:desc,author:author,price:price};
   element.create(newCastle,function(err,newlyCreated){
       if(err){
           console.log(err);
       }
       else{
           res.redirect("/castles");
       }
   });
});

router.get("/castles/new",middleware.isLoggedIn,function(req, res) {
    res.render("castle_collc/new.ejs");
});

router.get("/castles/:id", function(req, res){
    element.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground)
            res.render("castle_collc/show.ejs", {castle:foundCampground});
        }
    });
});


// EDIT ROUTE
router.get("/castles/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    element.findById(req.params.id, function(err, foundBlog){
            res.render("castle_collc/edit.ejs", {castle: foundBlog});
    });
});


// UPDATE ROUTE
router.put("/castles/:id",middleware.checkCampgroundOwnership, function(req, res){
   element.findByIdAndUpdate(req.params.id, req.body.castle, function(err, updatedBlog){
      if(err){
          res.redirect("/castles");
      }  else {
          res.redirect("/castles/" + req.params.id);
      }
   });
});

//DELETE ROUTE
router.delete("/catles/:id",middleware.checkCampgroundOwnership,function(req,res){
   element.findByIdAndDelete(req.params.id,function(err,toDelete){
       if(err){
           console.log(err);
       }else{
           res.redirect("/castles");
       }
   }) 
});


module.exports = router;