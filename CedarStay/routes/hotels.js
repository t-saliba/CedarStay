const express = require('express');
const router = express.Router();

const catchAsync = require('../Errors/catchAsync');
const ExpressError = require('../Errors/ExpressError');
const Hotel = require("../models/hotel");
const {isLoggedIn, isAdmin, validateHotel} = require('../middleware.js');

const hotels = require('../controllers/hotels');

router.route('/')
    .get(catchAsync(hotels.index))
    .post(isLoggedIn, isAdmin, validateHotel, catchAsync(hotels.createHotel));

router.get('/new',  isLoggedIn, isAdmin, hotels.renderNewForm);

router.route('/:id')
    .get(catchAsync(hotels.showHotel))
    .put(isLoggedIn, isAdmin, validateHotel, catchAsync(hotels.updateHotel))
    .delete(isLoggedIn, isAdmin, catchAsync(hotels.deleteHotel))

router.get('/:id/edit', isLoggedIn, isAdmin, catchAsync(hotels.renderEditForm));

router.get('/:id/trip' , isLoggedIn, hotels.organiseTrip);




module.exports = router;