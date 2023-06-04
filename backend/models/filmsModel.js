const { model, Schema } = require("mongoose");

const filmsShcema = Schema({
  title: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    default: 2000,
  },
  genre: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0.0,
  },
});

module.exports = model("films", filmsShcema);
