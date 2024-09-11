module.exports.schemaProducts = {
    name: {
        notEmpty: {
            errorMessage: "Please input a product name"
        },
        isString:{
            errorMessage: "Please enter a string value"
        },
        escape: true,
    },
    size: {
        isString: true,
        escape: true,
    },
    price: {
        isNumeric: true,
    },
    'category.class': {
        isString: true,
        notEmpty: true,
        escape: true
    },
    'category.type':{
        notEmpty: true,
        isArray:true,
        isIn:{
            options:[['top','bottom','set']]
        },
        escape: true
    },
    'category.gender':{
        isString: true,
        notEmpty: true,
        isIn:{
            options:[['female','male']]
        },
        escape: true
    },
    'category.ageGroup':{
        isIn:{
            options:[['adult','children']]
        }
    },
    'category.eventType':{
        notEmpty: true,
        isArray: true,
        isIn:{
            options:[['formal','wedding','casual','fashion','cocktail']]
        }
    },
    'details.bust':{
        notEmpty: true,
        isNumeric: true,
    },
    'details.waist':{
        notEmpty: true,
        isNumeric: true,
    },
    'details.hips':{
        notEmpty: true,
        isNumeric: true,
    },
    'details.length':{
        notEmpty: true,
        isNumeric: true,
    },
    color: {
        isString: true,
        escape: true
    },
    img: {
        isString: true,
        escape: true
    },
}