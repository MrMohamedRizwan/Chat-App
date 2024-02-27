const jwt=require('jsonwebtoken')
const User=require("../models/userModel");
const asyncHandler=require("express-async-handler");
const protect=asyncHandler(async(req,res,next)=>{
    let token;
    if(req.headers.authorization&&req.headers.authorization.startsWith("Bearer"))
    {
        try{
            token=req.headers.authorization.split(" ")[1];
            // console.log(token)

            const decode=jwt.verify(token,process.env.JWT_SECRET)
            req.user=await User.findById(decode.id).select("-password");
            // console.log(req.user) 
            next();
        }
        catch(e)
        {
            res.status(401);
            console.log(e)
            throw new Error("Token",e)
        }
        
    }
    if(!token)
    {
        res.status(401);
        console.log("Token not found");
    }

})
module.exports={protect}