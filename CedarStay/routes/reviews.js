const express = require('express');
const router = express.Router({mergeParams: true});   //now all of the params from app.js are also going to be merged alongside the params in this file.

const Hotel = require("../models/hotel");
const Review = require('../models/review');

const reviews = require('../controllers/reviews');

const ExpressError = require('../Errors/ExpressError');
const catchAsync = require('../Errors/catchAsync');

const { reviewSchema } = require('../schemas.js');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware.js');


router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;