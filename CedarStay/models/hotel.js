const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Review = require('./review');

const opts = { toJSON : { virtuals: true} };

const HotelSchema = new Schema({
   title: String,
   image: [String],
   geometry: {
      type: {
         type: String,
         enum: ['Point'],
         required: true
      },
      coordinates: {
         type: [Number],
         required: true
      }
   },
   price: Number,
   description: String,
   location: String,
   author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
   },
   reviews: [
      {
         type: Schema.Types.ObjectId,
         ref: 'Review'                        /* This means it's an objectID from a review model
                                                we connected each hotel with a review */
      }
   ]
}, opts);


/*I defined this virtual property that is going to include some markup for that popup
   on every single hotel which is based on what is the id and the title */
HotelSchema.virtual('properties.popUpMarkup').get(function () {
   return `<strong><a href="/hotels/${this._id}">${this.title}</a><strong>`
});


/*this is the mongoose middleware function that is executed when a hotel is deleted
  the entire hotel is passed here so I can take all the reviews in that array
  and delete every review with that matching id */
HotelSchema.post('findOneAndDelete', async function (doc) {
   if(doc){
      await Review.deleteMany({
         _id: {                      /*the id of each review is somewhere in doc.reviews */
            $in: doc.reviews
         }
      })
   }
})

module.exports = mongoose.model('Hotel', HotelSchema);
