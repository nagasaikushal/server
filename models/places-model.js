const { Schema, model } = require('mongoose');

const placeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        address: String,
        city: String,
        state: String,
        country: String
    },
    images: [String],
    video: String,
    openingHours: String,
    entryFees: String,
    contactInformation: {
        phone: String,
        email: String,
        website: String
    }
});

const Place = model('Place', placeSchema);
module.exports = Place;
