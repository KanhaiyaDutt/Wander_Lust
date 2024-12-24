const Listing = require("./models/Listing")
const expressError = require("./utils/expressError.js")
const {listingSchema,reviewSchema} = require("./schema.js")
const Review = require("./models/review.js")


module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl
        req.flash("error","You must be logged in access this!");
        return res.redirect("/login"); //!important return!
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{ // this middleware is required because once an user logs in it resets the session methods.
    if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{ // this is because to authorize through hopscotch requests
    let {id}= req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){ 
        req.flash("error","You are not the owner of this Listing!");
        return res.redirect(`/listings/${id}/show`); // return dont allow to perform operations below this if statement.
    }
    next();
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,reviewId}= req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){ 
        req.flash("error","You are not the auther of this Review!");
        return res.redirect(`/listings/${id}/show`); // return dont allow to perform operations below this if statement.
    };
    next();
}

module.exports.validateListing = (req,res,next)=>{
    // console.log(req.body.listing)
    let {error}= listingSchema.validate(req.body);
    if (error){
        // console.log(error.details)
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new expressError(400,errMsg+"!")
    }
    else{
        next()
    }

}

module.exports.validateReview = (req,res,next)=>{
    let {error}= reviewSchema.validate(req.body);
    if (error){
        // console.log(error.details)
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new expressError(400,errMsg+"!")
    }
    else{
        next()
    }

}
