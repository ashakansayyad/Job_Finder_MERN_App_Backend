const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const jsonwebtoken = require("jsonwebtoken");
const {User} = require('../model/userModel');
dotenv.config();



// register user 
router.post('/register',async(req,res)=>{
    const {name,email,password,mobile} = req.body;
    const userExist = await User.findOne({email});
    if(userExist){
        return res.status(400).json({message:"user already exist"});
    }
    const hashedPassword = await bcrypt.hash(password,10);   
    const newUser = new User({name,email,password:hashedPassword,mobile});
    await newUser.save();
    
    return res.status(201).json({message:"user register successfully!"})

});
// Get all users (without password and _id)
router.get('/',async(req,res)=>{
    // send userdata without passeord and _id
    const userData = await User.find().select("-password -_id");
    if(!userData){
        return res.status(404).json({message:"data not found"});
    }
     return res.status(200).json(userData);
})

// Get specific user by id
router.get('/:id',async(req,res)=>{
    const {id} = req.params;
    
    const user = await User.findById(id);
    if(!user){
        return res.status(404).json({message:"user not found "});
    }
    return res.status(200).json(user);
})


// user login
router.post("/login",async(req,res)=>{
    // get email and pwd from body
    const {email,password} = req.body;
    // check email is valid or not
    const user = await User.findOne({email});
   
    if(!user){
        return res.status(400).json({message:"Wrong Email or Password!"});
    }
 
    //  Compare the input password with the hashed password stored in the database
    const isPasswordMatch = await bcrypt.compare(password,user.password);
    if(!isPasswordMatch){
        return res.status(400).json({message:"Wrong Email or Password"});
    }
    // generate JSON webtoken
    // This creates the payload, containing the user’s ID.
    const payload = {id:user._id};
    // This creates and signs the token using the secret key.
    const token = jsonwebtoken.sign(payload,process.env.JWT_SECRET);
    res.status(200).json({token});
})






module.exports = router;