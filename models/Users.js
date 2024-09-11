const mongoose = require("mongoose");

const {Schema} = mongoose;

const userSchema = new Schema({
    firstName:{
        type: String,
        required: [true, "First Name must not be empty"],
        escape: true
    },
    lastName: {
        type: String,
        required: [true, "Last Name must not be empty"],
        escape: true
    },
    email: {
        type: String,
        required: [true, "Last Name must not be empty"],
        escape: true
    },
    password: {
        type: String,
        minLength: 8,
        required: [true, "Password is required"]
    },
    address:{
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

const Users = mongoose.model("Users", userSchema);
module.exports = Users;

mongoose.connection.close();