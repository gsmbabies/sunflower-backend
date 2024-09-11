const { default: mongoose } = require('mongoose');
const { validationResult, matchedData } = require('express-validator');
const Orders = require('../models/Order');
const Carts = require('../models/Cart');

module.exports.checkOut = async ( req, res ) => {
    const { id } = req.user;
    const result = validationResult(req);

    if(!result.isEmpty())
        return res.status(400).send({msg: result.array()});
    
    const data = matchedData(req);

    
    try {
        const findUserCart = await Carts.findOne( { userID: id } ).populate('products.productID');
        
        if(!findUserCart || findUserCart.products.length < 1 )
            return res.status(404).send( { msg: "Nothing to checkout!" } );

        const shipAdd = data.shipAdd || findUserCart.shipAdd;
        // console.log(shipAdd);

        if(!shipAdd) 
            return res.status(400).send( { msg: "Please enter a shipping address!" } );

        const totalPrice =  findUserCart.products.reduce( ( acc, current ) => {
            return acc + (current.productID.price * current.quantity);
        }, 0 );

        // console.log(totalPrice);

        const checkOutOrder = new Orders({ 
            userID : id,
            products : findUserCart.products,
            shipAdd : shipAdd,
            total : totalPrice
         });

        findUserCart.products = [];

        const savedOrder = await checkOutOrder.save();
        
        await findUserCart.save();
        

        return res.status(200).send( { 
            msg : "Thank you for ordering!",
            data : savedOrder
        } );

    } catch (error) {
        console.error(error);
        return res.status(500).send( {msg : "Something went wrong!"} );
    }
}

