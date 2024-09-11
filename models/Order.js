const mongoose = require("mongoose");


const { Schema } = mongoose;

const orderSchema = new Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  },
  products: [{
    productID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Products'
    },
    quantity: {
      type: Number,
      default: 1
    }
  }],
  total:{
    type: Number,
    required : [true, "total price cannot be empty!"]
  },
  status:{
    type: String,
    maxLength: 1,
    default: "p"
  },
  shipAdd: {
    type: String,
    required: [true, "Please enter a shipping address"]
  },
  paid:{
    type: Number,
    maxLength: 1,
    default : 0
  },  
  note: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now(),
  }
});

const Orders = mongoose.model("Orders", orderSchema);
module.exports = Orders;

mongoose.connection.close();
