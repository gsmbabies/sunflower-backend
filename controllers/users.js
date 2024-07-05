const { validationResult, matchedData } = require("express-validator");
const bcrypt = require('bcrypt');
const auth = require('../auth');

const User = require('../models/Users');


module.exports.login = async (req, res) => {
    const result = validationResult(req);
    
    if(!result.isEmpty())
        return res.status(400).send({error:result.array()});

    const data = matchedData(req);

    try {
        console.log(data);
        const user = await User.findOne({email:data.email}).exec();

        if(!user)
            return res.status(404).send({msg:"No email found!"});

        const isPasswordMatched = await bcrypt.compare(data.password, user.password);
        
        if(!isPasswordMatched)
            return res.status(401).send({msg:"Invalid crendentials!"});
        
        const createdToken = auth.createToken(user)
        return res.status(200).send({
            msg:"Login Success!",
            token:createdToken
        });

    } catch (error) {
        return res.status(500).send({msg:error});
    }

};

module.exports.register = async (req, res) => {
    const result = validationResult(req);
    
    if(!result.isEmpty())
        return res.status(400).send({error:result.array()});
    
    const data = matchedData(req);

    try {
        const hashedPassword = await bcrypt.hash(data.password,10);
        const saveUser =  new User({...data,password:hashedPassword});
        await saveUser.save();
        return res.status(201).send({msg:"Registration success!"});
    } catch (error) {
        return res.status(500).send({msg: error.msg});
    }
};

module.exports.getUserDetails = async ( req, res ) => {
    const {id} = req.user;
    console.log(id);
    try {
        const findUser = await User.findById(id,{_id:0,password:0});
        return res.status(200).send({msg:findUser});
    } catch (error) {
        return res.status(500).send({error: error});
    }
}