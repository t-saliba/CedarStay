/* I made this controller folder so I can make my code cleaner.
   I will remove chuncks of code and put it in here so the routes folder will be simple to read*/

const Hotel = require("../models/hotel");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_ACCESS_TOKEN;

const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

const axios = require('axios');

// await allows you to pause execution until the promise is resolved.
module.exports.index = async (req, res) => {
  const hotels = await Hotel.find({});
  res.render('hotels/index', { hotels });
}

//make a new hotel page
//make sure that the user requesting the new hotel page is the admin else he can't.
module.exports.renderNewForm = (req, res) => {
  res.render('hotels/new');            
}

//create the hotel and save it and redirect to it
//make sure that the user posting a new hotel page is the admin else he can't.
//Also I'm geocoding information from the form from the location the user enters and I save it on the hotel model
module.exports.createHotel = async(req, res, next) => {
  const geoData = await geocoder.forwardGeocode({
    query: req.body.hotel.location ,
    limit: 1
  }).send()

  const hotel = new Hotel(req.body.hotel);
  hotel.geometry = geoData.body.features[0].geometry;
  hotel.author = req.user._id;
  await hotel.save();
  console.log(hotel);
  req.flash('success', 'Successfully made a new hotel!');
  res.redirect(`/hotels/${hotel._id}`);
}

// we find the hotel by ID and then render the page of this hotel
module.exports.showHotel = async(req, res) => {
  const hotel = await Hotel.findById(req.params.id).populate({
      path: 'reviews',
       populate:{
          path:'author'
      }
      }).populate('author');

  if(!hotel){
      req.flash('error', 'Cannot find that hotel');
      return res.redirect('/hotels');
  }
  res.render('hotels/show', { hotel });
}

//This route handler retrieves a hotel by its ID and renders an edit page with the hotel data.
module.exports.renderEditForm = async(req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if(!hotel){
      req.flash('error', 'Cannot find that hotel');
      return res.redirect('/hotels');
  }
  res.render('hotels/edit', { hotel });
}

//This route handler updates a hotel's information, validates the incoming data, and redirects to the hotel's details page after the update.
module.exports.updateHotel = async(req, res) => {
  const { id }=req.params;
  console.log(req.body.hotel);
  const hotel = await Hotel.findByIdAndUpdate(id, {...req.body.hotel});
  req.flash('success', 'Successfully updated the hotel!');
  res.redirect(`/hotels/${hotel._id}`);
}

//This route handler deletes a hotel by its ID and redirects to the hotels page after deletion.
module.exports.deleteHotel = async(req, res) => {
  const { id } = req.params;
  await Hotel.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted the hotel!');
  res.redirect('/hotels');
}

module.exports.organiseTrip = async (req, res) => {
  const { id } = req.params;
  const hotel = await Hotel.findById(id);
  if(!hotel){
    req.flash('error', 'Cannot find that hotel');
    return res.redirect('/hotels');
}

  // Get hotel location coordinates
  const { coordinates } = hotel.geometry;
  //console.log(coordinates);

  // Construct API request URL
  const baseURL = 'https://api.mapbox.com';
  const endpoint = '/search/searchbox/v1/category/';
  const category_1 = 'restaurant'; 
  const category_2 = 'coffee';
  const category_3 = 'shopping';

  const proximity = `${coordinates[0]},${coordinates[1]}`;
  const radius = 1; 
  const limit = 2; 
  const apiKey = mapBoxToken; 
  const url_1 = `${baseURL}${endpoint}${category_1}?access_token=${apiKey}&proximity=${proximity}&radius=${radius}&limit=${limit}`;
  const url_2 = `${baseURL}${endpoint}${category_2}?access_token=${apiKey}&proximity=${proximity}&radius=${radius}&limit=${limit}`;
  const url_3= `${baseURL}${endpoint}${category_3}?access_token=${apiKey}&proximity=${proximity}&radius=${radius}&limit=${limit}`;


  const response_1 = await axios.get(url_1);
  const place_1 = response_1.data.features;

  const response_2 = await axios.get(url_2);
  const place_2 = response_2.data.features;

  const response_3 = await axios.get(url_3);
  const place_3 = response_3.data.features;

  res.render('hotels/trip', { hotel, place_1, place_2, place_3});

}

