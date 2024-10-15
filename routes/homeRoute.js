const express = require('express');
const router =  express.Router();

router.get("/home",(req,res)=>{
    res.send("Reqruity Egency App using MERN STACK !!!");
})



module.exports = router;