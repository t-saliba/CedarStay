const Hotel = require("../models/hotel");
const Review = require('../models/review');

/*This route handler creates a new review for a hotel,
 validates the data, saves the review, and redirects to the hotel's details page. */
module.exports.createReview = async (req, res) => {
    const hotel = await Hotel.findById(req.params.id);
    const review = new Review(req.body.review); 
    review.author = req.user._id;  
    hotel.reviews.push(review);
    await review.save();
    await hotel.save();
    req.flash('success', 'Created a new review!');
    res.redirect(`/hotels/${hotel._id}`);
}

/*we wait for it to find the campground and we remove the reference to the review 
   from the reviews array and the nwe delete the entire review */
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Hotel.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });      
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a review!');
    res.redirect(`/hotels/${id}`);
}



