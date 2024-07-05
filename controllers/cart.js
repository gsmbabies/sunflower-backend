const { validationResult, matchedData } = require('express-validator');
const Carts = require('../models/Cart');
const { default: mongoose } = require('mongoose');

module.exports.addToCart = async ( req, res ) => {
    const result = validationResult(req);
    if(!result.isEmpty())
        return res.status(404).send({error:result.array()});
    
    const data = matchedData(req);

    try {

        const findUserCart = await Carts.findById(data.userID).exec();
        
        if(!mongoose.isValidObjectId(data.userID))
            return res.status(400).send({msg:"Invalid object ID"});
            
    } catch (error) {
        return res.status(500).send({error: error});
    }

    return res.status(200).send("Hi");
}

module.exports.getCart = async ( req, res ) => {
    const result = validationResult(req);
    if(!result.isEmpty())
        return res.status(404).send({error:result.array()});
    const data = matchedData(req);

    try {
        const findUserCart = await Carts.findById(data.userID).exec();

        if(!mongoose.isValidObjectId(data.userID))
            return res.status(400).send({msg:"Invalid object ID"});

        if(!findUserCart)
            return res.status(404).send({msg:"Your cart is empty"});

        return res.status(200).send({msg:"Sample cart products"});
    } catch (error) {
        
    }
}