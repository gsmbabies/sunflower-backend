const mongoose = require("mongoose");

const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    minLength: 1,
    maxLength: 30,
    required: [true, "Product name must not be empty"],
    unique: true,
  },
  size: {
    type: String,
    required: [true, "You must put size in product"],
    minLength: 1,
    maxLength: 8,
  },
  price: {
    type: Number,
    required: [true, "Please input a price product"],
  },
  color: {
    type: String,
    required: [true, "Please input a color product"],
    maxLength: 20,
    minLength: 1,
  },
  details: {
    bust: {
      type: Number,
      required: [true, "Please input a bust details"],
    },
    waist: {
      type: Number,
      required: [true, "Please input a waist details"],
    },
    hips: {
      type: Number,
      required: [true, "Please input a hips details"],
    },
    length: {
      type: Number,
      required: [true, "Please input a length details"],
    },
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  rentStatus:{
    start: {
      type: Date,
      default: null
    },
    end: {
      type: Date,
      default: null
    }
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  img: {
    type: String,
  },
  category: {
    class: {
      type: String,
      required: true,
    },
    type: {
      type: [String],
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    ageGroup: {
      type: String,
      required: true,
    },
    eventType: {
      type: [String],
      default: undefined,
      required: true,
    },
  },
  created: {
    type: Date,
    default: Date.now(),
  },
  newArrival: {
    type: Boolean,
    default: false,
  },
});

const Products = mongoose.model("Products", productSchema);
module.exports = Products;

mongoose.connection.close();
