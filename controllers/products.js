const { validationResult, matchedData } = require('express-validator');
var path = require('path');
const Products = require('../models/Products');
const { default: mongoose } = require('mongoose');


//[GET-section]
//get all active products
//offset pagination
module.exports.getAllProducts = async (req, res) => {
    const result = validationResult(req)

    if(!result.isEmpty()) 
        return res.status(400).send({error: result.array()});

    const data = matchedData(req);
    const pageNumber = parseInt(data.page) || 1; // Page number (1-based index)
    const pageSize = 16;
    const skip = (pageNumber - 1) * pageSize;

    console.log(data)

    const query = {
        isActive:true
    };

    data.name && (query.name = {$regex:data.name,$options:'i'})
    data.search && (query.name = {$regex:data.search,$options:'i'})
    data.isAvailable && (query.isAvailable = true);
    data.rented && (query.isAvailable = false);

    if(data.color){
        let regex = data.color instanceof Array ? data.color.join('|') : data.color;
        query.color = {$regex: regex, $options: 'i'};
    } 
    
    data.category_ageGroup && (query['category.ageGroup'] = data.category_ageGroup);
    data.category_class && (query['category.class'] = data.category_class);
    data.category_type && (query['category.type'] = {$in:data.category_type});
    data.category_gender && (query['category.gender'] = data.category_gender);
    data.category_eventType && (query['category.eventType'] = {$in:data.category_eventType});
    data.minPrice && (query.price={$gte:data.minPrice});
    data.maxPrice && (query.price={$lte:data.maxPrice});

    if(data.minPrice && data.maxPrice)
        query.price = { $gte:data.minPrice, $lte:data.maxPrice  }

    if(data.isAvailable && data.rented) 
        delete query.isAvailable

    console.log(data.sort);

    try {
        const products = await Products.find(query)
        .sort({name:1})
        .skip(skip)
        .limit(pageSize)
        .exec()

        if(!products.length) 
            return res.status(404).send({errorMsg:"Products not found!"});
        
        switch(data.sort){
        case "desc":
            products.reverse();
            break;
        case "lowPrice":
            products.sort((a,b)=>a.price-b.price);
            break;
        case "highPrice":
            products.sort((a,b)=>b.price-a.price);
            break;
        case "newest":
            products.sort( (a,b) => b.created - a.created );
        case "oldest":
            products.sort( (a,b) => a.created - b.created );
        }

        const totalPage = await Products.countDocuments({isActive:true ,...query});

        return res.status(200).send({
            msg: products, 
            totalProducts:products.length, 
            totalPage: Math.ceil(totalPage/pageSize)
        });

    } catch (error) {
        return res.status(500).send({error: error});
    }   
}

//get all active products
//cursor pagination
// module.exports.getAllProducts2 = async (req, res) => {
//     try {
//         const result = validationResult(req)
//         if (!result.isEmpty()) 
//             return res.status(400).send({ error: result.array() })
        
//         const data = matchedData(req);
//         const pageSize = 16;

//         let query = {
//             isActive: true
//         };

//         if (data.category) {
//             query.category = data.category;
//         }

//         // Construct the cursor based on the provided cursor or default to null
//         let cursor = null;
//         if (data.cursor) {
//             cursor = { _id: { $gt: data.cursor } };
//         }

//         const products = await Products.find({
//             ...query,
//             ...cursor
//         })
//         .sort({ name: 1 })
//         .limit(pageSize)
//         .exec();

//         // Determine the next cursor
//         const nextCursor = products.length > 0 ? products[products.length - 1]._id : null;

//         // Optionally, you can return the previous cursor as well if needed
//         const prevCursor = data.cursor;

//         // Get the total count for calculating total pages
//         const totalProducts = await Products.countDocuments(query);

//         return res.status(200).send({
//             msg: products,
//             nextCursor: nextCursor,
//             prevCursor: prevCursor,
//             totalPage: Math.ceil(totalProducts / pageSize),
//             length: products.length
//         });
//     } catch (error) {
//         return res.status(500).send({ error: error });
//     }
// 
// }

//get single active products

module.exports.getProductByName = async ( req, res ) => {
    try {
        const result = validationResult(req)
        if(!result.isEmpty()) 
            return res.status(400).send({error: result.array()})
        const data = matchedData(req);
        const trimmedData = data.name.replace(/[-]/gi, ' ');
        console.log(trimmedData);
        const products = await Products.findOne({name:trimmedData,isActive:true}).exec();
        if(!products) 
            return res.status(404).send({msg:"No product found"});
        return res.status(200).send({msg: products})
    } catch (error) {
        return res.status(500).send({error: error});
    }   
}

//get product by ID
module.exports.getProductByID = async ( req, res ) => {
    try {
        const data = matchedData(req);
        const product = await Products.findOne({_id:data.id, isActive:true});
        if(!product) {
            return res.status(404).send({msg: 'No product found'})
        }
            return res.status(200).send({msg: product})
    } catch (error) {
        return res.sendStatus(500);
    }
}

//get product by Array of ID's
module.exports.getProductsByArray = async ( req, res ) => {
    try {
        const productItems = req.query;
        const productList = [];

        for(let key in productItems){
            if(!mongoose.isValidObjectId(key))
                continue;
            const findProduct = await Products.findById(key);
            if(!findProduct){
                continue;
            } else {
                productList.push({...findProduct.toObject(), quantity: Number(productItems[key])});
            }
        }

        return res.status(200).send({msg:productList});
    } catch (error) {
        console.error(error);
        return res.status(500).send({msg:error});
    }   
}

// get featured products
module.exports.getFeaturedProducts = async (req, res) => {
    try {
        const products = await Products.aggregate([{$match:{isActive:true}},{$sample:{size:8}}])
        if(!products.length) return res.status(404).send({error: "Error in fetching data"}) 
        return res.status(200).send({msg: products})
    } catch (error) {
        return res.sendStatus(500);
    }
}

//get alsolikeproduct
module.exports.getAlsoLikeProduct = async (req, res) => {
    try {
        const products = await Products.aggregate([{$match:{isActive:true}},{$sample:{size:4}}])
        if(!products.length) return res.status(404).send({error: "Error in fetching data"}) 
        return res.status(200).send({msg: products})
    } catch (error) {
        return res.sendStatus(500);
    }
}

//get new Arrival products
module.exports.getNewArrival = async (req,res) => {
    try {
        const products = await Products.find({})
    } catch (error) {
        console.error(error);
        res.status(500).send("Someting went wrong")
    }
}

//[POST-section]

//add product 
module.exports.addProducts = async (req, res) => {
    
    try {
        const result = validationResult(req);
        // console.log(result);
        if(result.isEmpty()){
            const data= matchedData(req)
            const product = await Products.create(data);
            return res.status(200).send({msg: product })
        }
         return res.status(400).send({error: result.array()})
    } catch (error) {
        return res.status(500).send({msg:error});
    }
    
}


//[Patch-section]

module.exports.editProduct = async ( req, res )  =>  {

    const id = req.params.id
    const result = validationResult(req);
    const data =  matchedData(req);
    console.log(data);
    if(!mongoose.Types.ObjectId.isValid(id))
        return res.send({msg: "Invalid ID"})
    if(!result.isEmpty())
        return res.send({msg: result.array()})
    try {
        const product = await Products.findByIdAndUpdate(id, data,{new:true});
        if(product)
            return res.status(200).send({msg: product})
        return res.status(404).send({msg:"Product not found"})
    } catch (error) {
        return res.sendStatus(500) 
    }

}

//use multer modules for images upload
module.exports.upload = (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    const uploadedFile = req.files.image
    const parentDir = path.resolve(__dirname, '..')
    const uploadPath = parentDir+'/public/images/' + uploadedFile.name;
    uploadedFile.mv(uploadPath, (err)=>{
        if(err) return res.status(500).send(err)
        return res.status(201).send({msg: uploadPath})
    })
}

//[Delete section]
module.exports.deleteProduct = ( req, res ) => {
    console.log('delete product')
}