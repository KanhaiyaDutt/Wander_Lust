const Listing = require("../models/Listing")
var geocoder = require('google-geocoder');
const {getCoords} = require('../utils/location.js')

var geo = geocoder({
  key: 'your API key from google'
});
 
geo.find('223 Edenbridge Dr, Toronto', function(err, res){
 
  // process response object
 
});


module.exports.index =  async (req,res)=>{
    let {category,country} = req.query;
    const allListings = await Listing.find({});
    let newListings=[];
    let countryExists = true;
    if((typeof country)!="undefined"){
        newListings = await Listing.find({country:country});
        if(newListings.length ==0){
            countryExists=false;
        }
    }
    let countListing= [];
    
    res.locals.notExists= req.flash("notExists");
req.flash("notExists","Destinaion in this country is not available! (or try typing country name with captital Letter starting! e.g. india=India)")

    for (l of allListings){
        if (l.category.includes(category)){
            newListings.push(l);
        }
    }
    res.render("listings/index.ejs",{allListings,newListings,countListing,countryExists})
    
};

module.exports.renderNewForm = (req,res)=>{
    // console.log(req.user) // if user is authenticated then req.user is defined and contains user info
    // middle ware is there to authenticate.
    res.render("listings/new.ejs");
}

module.exports.createNewListing = async (req,res,next)=>{
    // if(!req.body){ // for req sent by hopscotch
    //     throw new expressError(400,"send Valid data for listing.")
    // } // alternative and more efficient is validateListing middleware.
    let url = req.file.path;
    let filename= req.file.filename;
    req.flash("success","New Listing Added Successfuly!")    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; // assign the newly created listing to current user
    newListing.image = {url,filename};
    newListing.category.push(req.body.listing.category)
    await newListing.save();
    res.redirect("/listings");
}

module.exports.showListings = async (req,res,next)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}) // nested populating to access author of the review
    .populate("owner");
    
    // console.log(listing.owner.username)
    const coordinates = await getCoords(listing.location);
    if(!listing){
        req.flash("error","Listing you requested for doesnot exists!")
        res.redirect("/listings")
    }
    let maps_api = process.env.G_MAPS_API
    res.render("listings/show.ejs",{listing,maps_api,coordinates})
}

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    if(!listing){
        req.flash("error","Listing you requested for doesnot exists!")
        res.redirect("/listings")
    }
        
    res.render("listings/edit.ejs",{listing,originalImageUrl})
}

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename= req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    req.flash("success","Listing Updated Successfully!")
    res.redirect(`/listings/${id}/show`);
}

module.exports.destroyListing =  async (req,res)=>{
    let {id} = req.params;
    req.flash("success","Listing Deleted Successfully!")
    await Listing.findByIdAndDelete(id,{...req.body});
    res.redirect("/listings");
}