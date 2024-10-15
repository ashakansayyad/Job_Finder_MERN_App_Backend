
const fs = require("fs");





// store req mtehod and url in log.txt file
const incommingRequest=(req,res,next)=>{
    fs.appendFileSync("log.txt",`method:${req.method }  url:${req.url}   Date and Time:${new Date().toISOString()}\n`);
    next();
};

module.exports = {incommingRequest}