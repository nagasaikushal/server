const mongoose  = require('mongoose')

const userotpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        expires: 120, //Expiration time
    },
});

const userotp = mongoose.model('userotp', userotpSchema);
module.exports = userotp;
