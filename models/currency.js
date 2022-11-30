let mongoose = require("mongoose");

let currencySchema = new mongoose.Schema({
    paridade: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required:true
    } 
});

const Currency = mongoose.model("Currency", currencySchema);

module.exports = Currency;

