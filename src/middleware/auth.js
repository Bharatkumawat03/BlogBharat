const jwt = require("jsonwebtoken");
const User = require('../models/user');

const userAuth = async(req,res,next) =>{
    try {
        const {token} = req.cookies;
        if(!token) return res.status(401).send("Please Login!");

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const {_id} = decode;

        const user = await User.findById(_id).select("-password");
        if(!user) return res.status(404).send("User Not Found!");

        req.user = user;
        next();
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
}

module.exports = {userAuth};