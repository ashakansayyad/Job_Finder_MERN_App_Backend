const jsonwebtoken = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();

const authMiddleware = (req,res,next)=>{
//   checks the authorization header to get JWT token from client
    const token = req.headers.authorization;
  
    if(!token){
        return res.status(401).json({message:"User is not logged in!!!"});
    }
    try{
        // console.log("token: ",token);
        const decoded = jsonwebtoken.verify(token,process.env.JWT_SECRET);
        //token payload contains the user's ID (decoded.id), which is extracted and attached to req.user.
        req.user = decoded.id;
        // console.log("decoded token: ",decoded)
        next();
    }catch(err){
        console.log(err);
        res.status(401).json({message:"user is not logged in"});
    }
}

module.exports = authMiddleware;