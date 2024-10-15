const mongoose = require("mongoose");
const {User} = require('./userModel');
const jobSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true
    },
    logo:{
        type:String,
        required:true
    },
    cnlogo:{
        type:String,
        required:true
    },
    position:{
        type:String,
        required:true
    },
    salary:{
        type:Number,
        required:true
    },
    jobType : {
        type:String,
        required:true,
        enum : ["full-time","part-time","contract","internship"]  //only the values in this array can be used for jobType.
    },
    remote:{
        type:Boolean,
        required:true,
        default:false
    },
    location:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    about:{
        type:String,
        required:true
    },
    skills:{
        type:[String],       // array of strings
        required:true 
    },
    information:{
        type:String,
        required:true
    },
    creator:{
        type:mongoose.Schema.ObjectId,  //it used to reference other document in mongodb
        ref:"User",  //it ensure this field reference the _id from the user model
        required:true,

    }
    
})

const Job = mongoose.model("Job",jobSchema);
module.exports = {Job};
