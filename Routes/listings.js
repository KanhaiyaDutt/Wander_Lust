const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer")
const {storage}= require("../cloudConfig.js");

const upload = multer({storage})

router.route("/")
.get(wrapAsync(listingController.index))
.post(
    isLoggedIn,
    upload.single('listing[image]'),
validateListing,
wrapAsync(listingController.createNewListing)
)

router.get("/new",isLoggedIn,listingController.renderNewForm); // '/new' should be above /:id so that browser doesnt interprest new as id

router.route("/:id")
.put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing)
)
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))

router.get(
    "/:id/show",
    wrapAsync(listingController.showListings)
);


router.get(

    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
);

module.exports = router;