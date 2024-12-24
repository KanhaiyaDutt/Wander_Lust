const express = require("express");
const router = express.Router({mergeParams:true}); //to use the params of parent in child routes
const wrapAsync = require("../utils/wrapAsync.js")
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js")

// Reviews Post Route 
router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview)
)

//  Delete Reviews Route
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview)
)

module.exports = router;