const mongoose = require("mongoose");

const houseSchema = new mongoose.Schema({
  place: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  sqft: {
    type: Number,
    required: true,
  },
  bhk: {
    type: Number,
    required: true,
  },
  image : {
    public_id: String,
    url: String,
  },
  address:{
    type:String,
    required: true,
  },
  categories : {
    type:String,
    required: true,
    enum : ['House', 'Apartment', 'Land', 'Building', 'Flat']
  }
});

const House = mongoose.model("House", houseSchema);

module.exports = House;
