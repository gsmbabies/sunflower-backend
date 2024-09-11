const Users = require('../../models/Users');

module.exports.schemaUser = {
    firstName: {
        notEmpty: {
            errorMessage: "Please input your first name"
        },
        isString:{
            errorMessage: "Please enter a string value"
        },
        escape: true,
    },
    lastName : {
        notEmpty: {
            errorMessage: "Please input your last name"
        },
        isString:{
            errorMessage: "Please enter a string value"
        },
        escape: true,
    },
    email : {
        notEmpty: {
            errorMessage: "Please input your last name"
        },
        isEmail:{
            errorMessage: "Please enter a valid email"
        },
        custom:{
            options: async (value) => {
                const isDuplicateEmail = await Users.findOne({email:value});
                if(isDuplicateEmail)
                    throw new Error("Email already in use");
                return true;
            }
        },
        escape: true,
    },
    password: {
        notEmpty: {
            errorMessage: "Please input your password"
        },
        isString:{
            errorMessage: "Please enter a string value"
        },
        isLength: {
            errorMessage: "Password must be atleast 8 characters",
            options: {min:8}
        }
    },
    confirmPassword: {
        notEmpty:{
            errorMessage:"Please enter a confirm password"
        },
        isLength: {
            errorMessage: "Password must be atleast 8 characters",
            options: {min:8}
        },
        custom: {
            options: (value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error("Password do not match");
                }
                return true;
            }
        }
    }
}