
module.exports.schemaLogin = {
    email : {
        notEmpty: {
            errorMessage: "Please input your email"
        },
        isEmail:{
            errorMessage: "Please enter a valid email"
        },
        escape: true
    },
    password: {
        notEmpty: {
            errorMessage: "Please input your password"
        },
        isString:{
            errorMessage: "Please enter a string value"
        },
    }
}