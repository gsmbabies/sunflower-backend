const { validationResult, matchedData } = require('express-validator');
const Carts = require('../models/Cart');
const { default: mongoose } = require('mongoose');

module.exports.addToCart = async ( req, res ) => {
    
    //get from auth 
    
    try {
        const { id }  = req.user;
        const products = req.body.products;
        
        if(!mongoose.isValidObjectId(id))
            throw new Error("Invalid objectID");

        if(!products)
            return res.status(400).send({ msg: "Empty Fields!" });

        const findUserCart  = await Carts.findOne({ userID:id });

        const validProducts = products.filter(item => {
           return mongoose.isValidObjectId(item.productID) && !isNaN(item.quantity)  
        });
        
        if(validProducts.length !== products.length)
            throw new Error("Invalid product found product list!");

        //reduce duplicate entries
        console.log(validProducts);  
        const reducedProducts = validProducts.reduce((acc, product) => {
            
            const index = acc.findIndex(item => item.productID === product.productID);
            
            if (index !== -1) {
                acc[index].quantity += product.quantity;
            } else {
                acc.push({ productID: product.productID, quantity: product.quantity });
            }
            
            return acc;
        }, []);

        if(!findUserCart){
            const createUserCart = new Carts({userID:id, products:reducedProducts});
            const savedCart = await createUserCart.save();
            
            if(!savedCart)
                return res.status(503).send({msg: "Error in saving your Cart!"});

            return res.status(201).send({msg:"Product added to cart!"});

        } else {

            if(findUserCart.products.length < 1) {
                console.log("empty jud");
                findUserCart.products = reducedProducts;
            } else {
                reducedProducts.map(item => {
                    // console.log(item);
                    const findSingleProduct = findUserCart.products.findIndex(elem => elem.productID.toString() === item.productID)
                    // console.log(findSingleProduct);
                    if(findSingleProduct === -1) {
                        findUserCart.products.push(item);
                    } else {
                        findUserCart.products[findSingleProduct].quantity += Number(item.quantity);
                    }
                } );
            }

            await findUserCart.save();              
            return res.status(201).send({msg:"Products added to cart!"});
        }


    } catch (error) {
        console.error(error);
        return res.status(500).send({error: "Something went wrong!"});
    }

}

module.exports.getCart = async ( req, res ) => {
    const { id } = req.user;

    try {   
        if(!mongoose.isValidObjectId(id))
            return res.status(400).send({msg:"Invalid object ID"});
        
        const findUserCart = await Carts.findOne({userID:id}).populate('products.productID');

        if(!findUserCart)
            return res.status(404).send({msg:"Your cart is empty"});

        return res.status(200).send({msg:findUserCart.products});
    } catch (error) {
        
    }
}

module.exports.editQuantity = async ( req, res ) => {
    const { id } = req.user;
    const {productID, quantity} = req.body;
    
    if(!productID || !quantity)
        return res.status(404).send({msg:"Please dont leave a blank fields"});

    if(!mongoose.isValidObjectId(productID))
        return res.status(400).send({msg:"Invalid object id"});

    // console.log(isNan(quantity));
    
    if(isNaN(quantity))
        return res.status(400).send({msg: "Invalid number of quantity"});

    try {
        const findProduct = await Carts.findOne({userID:id});
        
        if(!findProduct)
            return res.status(200).send({msg:"Cannot find your cart!"});

        const foundProduct = findProduct.products.find(item => item.productID.toString() === productID );
        
        if(!foundProduct)
            return res.status(404).send({msg:"Cannot find the product in your cart that you're trying to change!"});

        foundProduct.quantity = Number(quantity);

        await findProduct.save();
        return res.status(200).send({msg:"Change quantity success!"});

    } catch (error) {
        console.log(error);
        return res.status(500).send({msg:"Something went wrong!"});
    }
}

module.exports.removeProduct = async ( req, res ) => {
    return res.status(200).send( {msg:"Product remove successfully!"} );
}

