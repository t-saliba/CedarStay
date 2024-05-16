const { hotelSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./Errors/ExpressError');
const Hotel = require("./models/hotel");
const Review = require("./models/review");


module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo =  req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isAdmin = (req, res, next) => {
    if(req.user.username !== 'Toni_Saliba'){
        req.flash('error', 'You do not have a permission to do that!');
        return res.redirect('/hotels');
    } 
    next();
}

/* const User = require('./models/user'); // Assuming you have a User model

module.exports.isAdmin = async (req, res, next) => {
    try {
        const adminUser = await User.findOne({ username: 'Toni_Saliba' });
        if (!adminUser) {
            // If admin user not found in the database, handle the error
            req.flash('error', 'Admin user not found!');
            return res.redirect('/hotels');
        }

        // Compare the username of the authenticated user with the admin username
        if (req.user.username !== adminUser.username) {
            req.flash('error', 'You do not have permission to do that!');
            return res.redirect('/hotels');
        }

        next(); // If the user is Toni_Saliba, proceed to the next middleware
    } catch (err) {
        // Handle errors in a proper way
        console.error('Error checking admin permission:', err);
        req.flash('error', 'An error occurred while checking admin permission');
        return res.redirect('/hotels');
    }
}; */


//this is the middleware to check on the review delete route if you own the review before you are able to delete it
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/hotels/${id}`);
    }
    next();
}


/*This middleware validates hotel data using Joi schema validation, throwing an error 
with status 400 if validation fails, or passing control to the next middleware if successful.*/
module.exports.validateHotel = (req, res, next) => {                                                
    const { error } = hotelSchema.validate(req.body);
    if(error){   
        console.log(error);                                        //if there is an error we are going to map over the error details, make it a simple message and pass it to the error middelware function
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {     
        next();        //otherwise we're good
    }
}


/*This middleware validates review data using Joi schema validation, throwing a
 400 error if validation fails, or passing control to the next middleware if successful.*/
 module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error){                                           //if there is an error we are going to map over the error details, make it a simple message and pass it to the error middelware function
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();    //otherwise we're good
    }
}