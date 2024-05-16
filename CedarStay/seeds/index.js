/* I will run this file on it's own seperatly anytime I want to seed my database */

const mongoose = require('mongoose');
const cities = require('./cities');
const hotelsNames = require('./hotelsNames');
const imageURL = require('./imageURL');
const prices = require('./prices');
const description = require('./description');
const Hotel = require("../models/hotel");
const User = require('../models/user');

mongoose.connect('mongodb://localhost:27017/cedar-stay');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})


//async function to seed the database
const seedDB = async () => {
    await Hotel.deleteMany({});
    await User.deleteMany({});

    const user = new User ({email:'toni@toni',
                            username:'Toni_Saliba'});

    const registeredUser = await User.register(user, 'Toni_Saliba');

    await user.save();

    for(let i = 0; i < 276; i++){
        const h = new Hotel({
            author: user._id,
            location: `${cities[i].city}, ${cities[i].governorate}`,
            title: `${hotelsNames[i]}`,
            price: prices[i],          
            description: description[i],
            geometry: {
                type: 'Point',
                coordinates: [cities[i].lng, cities[i].lat] 
              }
        });
    for (let j = 0; j < 3; j++) {
        h.image.push(imageURL[i][j]); 
    }
        await h.save();
    }

};


//it returns a promise 
seedDB().then(() => {
    mongoose.connection.close();
})