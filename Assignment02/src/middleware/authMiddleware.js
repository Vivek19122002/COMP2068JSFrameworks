const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.user; // Here user is the cookie name which is stores in browser
        const verifyUser = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

        const user = await User.findOne({ _id:verifyUser._id })
        // console.log(admin);

        // For Logout
        req.token = token;
        req.user = user;

        next();
    } catch (error) {
        res.status(401).redirect('/');
    }    
}
  
module.exports = authMiddleware
