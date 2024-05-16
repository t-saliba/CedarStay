//Joi is a data validation library for Node.js applications.

const Joi = require('joi');

/*This code defines a Joi schema for validating hotel data,
 including required fields such as title, price, image, location, and description. */
module.exports.hotelSchema = Joi.object({
    hotel: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.array().items(Joi.string()).required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});


/*
This code defines a Joi schema for validating review data,
 including required fields such as rating and body. */
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})