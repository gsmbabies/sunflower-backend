const Carts = require('../models/Cart');
const { default: mongoose } = require('mongoose');
const {  matchedData, validationResult } = require('express-validator');

module.exports.addToCart = async ( req, res ) => {

    //get from auth 

    try {
        const { id }  = req.user;
        const products = req.body.products;
        
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).send({ msg: "Invalid user ID" });
        }

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).send({ msg: "Empty product list" });
        }

        const validProducts = products.filter(item =>
            mongoose.isValidObjectId(item.productID) &&
            !isNaN(item.quantity) &&
            Number(item.quantity) > 0
        );
        
        if (validProducts.length !== products.length) {
            return res.status(400).send({ msg: "Invalid product data" });
        }
        //reduce duplicate entries
        console.log(validProducts);  

        const reducedProducts = validProducts.reduce((acc, product) => {
            const index = acc.findIndex(item => item.productID.toString() === product.productID.toString());
            if (index !== -1) {
                acc[index].quantity += Number(product.quantity);
            } else {
                acc.push({ productID: product.productID, quantity: Number(product.quantity) });
            }
            return acc;
        }, []);

        const findUserCart  = await Carts.findOne({ userID:id });

        if(!findUserCart){
            const createUserCart = new Carts({userID:id, products:reducedProducts});
            const savedCart = await createUserCart.save();
            
            if (!savedCart) {
                return res.status(503).send({ msg: "Failed to save the cart" });
            }

            return res.status(201).send({ msg: "Cart created and products added" });

        } else {

            findUserCart.products.forEach(existingProduct => {
                const newProduct = reducedProducts.find(p => p.productID.toString() === existingProduct.productID.toString());
                if (newProduct) {
                    existingProduct.quantity += newProduct.quantity;
                }
            });

            reducedProducts.forEach(newProduct => {
                if (!findUserCart.products.some(p => p.productID.toString() === newProduct.productID.toString())) {
                    findUserCart.products.push(newProduct);
                }
            });

            await findUserCart.save();
            return res.status(200).send({ msg: "Cart updated with new products" });
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

        return res.status(200).send({msg: findUserCart.products, shipAdd : findUserCart.shipAdd });
        
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
    const product = req.params.id;
    const { id } = req.user;
    
    if(!mongoose.isValidObjectId(product))
        return res.status(404).send( {msg:"Invalid Product!"} );
    
    try {
        const removeProduct = await Carts.findOneAndUpdate( 
            { userID: id},
            { $pull: { products: { productID:product } } },    
            { new:true }
        );    
        
        if(!removeProduct)
            return res.status(404).send( { msg:"Cannot find cart or product to remove" } )
    
        return res.status(200).send( {
            msg : "product remove!",    
            data : removeProduct
        } );

    } catch (error) {
        console.error(error);
        return res.status(500).send( { msg: "Something went wrong removing product!" } );
    }
   
}
 
module.exports.editShipAdd = async ( req, res ) => {
    const { id } = req.user;
    const result = validationResult(req);

    if(!result.isEmpty())
        return res.status(400).send( { msg : result.array() } );

    const data = matchedData(req);

    try {
        const findUserCart = await Carts.findOneAndUpdate(
            { userID : id },
            { $set : { shipAdd : data.shipAdd  } },
            { new: true } )
            .exec();
        
        if(!findUserCart)
            return res.status(404).send( { msg : "Cannot find your cart!" } );

        return res.status(200).send( { 
            msg: "Shipping address added!",
            data: findUserCart 
        } );

    } catch (error) {
        console.error(error);
        return res.status(500).send( { msg: "Something went wrong editing shipping address!" } );
    }
}

