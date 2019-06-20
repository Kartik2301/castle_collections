var mongoose = require("mongoose");
var Campground = require("./models/StepStones");
var Comment   = require("./models/comment");

var data = [
    {
        name: "Winterfell", 
        image: "https://vignette.wikia.nocookie.net/gameofthrones/images/1/1f/801_Winterfell_Overview.png/revision/latest/scale-to-width-down/350?cb=20190415031728",
        description: "Fortress of the Starks"
    },
    {
        name: "The Eyrie", 
        image: "https://vignette.wikia.nocookie.net/gameofthrones/images/5/59/The_Eyrie.jpg/revision/latest/scale-to-width-down/350?cb=20110615190250",
        description: "The imregnable castle of house Arryn"
    },
    {
        name: "Riverrun", 
        image: "https://vignette.wikia.nocookie.net/gameofthrones/images/6/66/Riverrun._battlements.png/revision/latest/scale-to-width-down/350?cb=20160606102912",
        description: "Stronghold of Tullys"
    }
]

function seedDB(){
   //Remove all campgrounds
   Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
         //add a few campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a campground");
                    //create a comment
                    Comment.create(
                        {
                            text: "This place is great, but I wish there was internet",
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created new comment");
                            }
                        });
                }
            });
        });
    }); 
    //add a few comments
}

module.exports = seedDB;
