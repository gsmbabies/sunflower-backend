const mongoose = require("mongoose");


const { Schema } = mongoose;

const cartSchema = new Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Products'
  }],
  created: {
    type: Date,
    default: Date.now(),
  }
});

const Carts = mongoose.model("Carts", cartSchema);
module.exports = Carts;

mongoose.connection.close();
