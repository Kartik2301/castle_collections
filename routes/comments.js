var express = require("express");
var  Comment = require("../models/comment");
var element = require("../models/StepStones");
var router  = express.Router({mergeParams: true});
var middleware = require("../middleware");



router.get("/castles/:id/comments/new",middleware.isLoggedIn,function(req, res) {
    element.findById(req.params.id,function(err,castle){
        if(err){
           console.log(err);
        }
        else{
            res.render("comment_collc/new.ejs",{castle:castle});
        }
    });
});


//Comments Create
router.post("/castles/:id/comments",middleware.isLoggedIn,function(req, res){
   element.findById(req.params.id, function(err, castle){
       if(err){
           console.log(err);
           res.redirect("/castles");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               req.flash("error","Something went wrong");
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               castle.comments.push(comment);
               castle.save();
               console.log(comment);
               req.flash("success","Successfully added comment")
               res.redirect('/castles/' + castle._id);
           }
        });
       }
   });
});

// COMMENT EDIT ROUTE
router.get("/castles/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
        res.render("comment_collc/edit.ejs", {castle_id: req.params.id, comment: foundComment});
      }
   });
});

// COMMENT UPDATE
router.put("/castles/:id/comments/:comment_id",middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/castles/" + req.params.id );
      }
   });
});

// COMMENT DESTROY ROUTE
router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success","Successfully deleted comment");
           res.redirect("/castles/" + req.params.id);
       }
    });
});

module.exports = router;
