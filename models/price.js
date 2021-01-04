var mongoose = require('mongoose');

// Page Schema
var PriceSchema = mongoose.Schema({
   
    title: {
        type: String
    },
    amount: {
        type: Number
    },
    content: {
        type: String
    },
    slug: {
        type: String
    },
    image:{
        type:String
    }

});

var Price = module.exports = mongoose.model('Price', PriceSchema);