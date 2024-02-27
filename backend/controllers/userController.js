const asyncHandler = require('express-async-handler')
const User=require('../models/userModel');
const generateToken = require('../config/generateToken');

const registerUser =asyncHandler( async (req, res) => {

    const {name,email,password,pic}=req.body
    if(!name||!email||!password){
        res.status(400)
        throw new Error('Please fill all the fields')
    }
    const UserExists=await User.findOne({email})
    if(UserExists){
        res.status(400)
        throw new Error('User already exists')
    }
    const pwdwh=password
    const user=await User.create({
        name,
        email,
        password,
        pwdwh,
        pic
    })
    if(user)
    {
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin,
            pic:user.pic,
            token:generateToken(user._id)
        })
    }
    else{
        res.status(400)
        throw new Error('Failed to create user data')
    }




    res.send({
        name,
        email,
        password
    })

});


const authUser =asyncHandler( async (req, res) => {
    const {email,password}=req.body
    console.log("email",email,password)
    if(!email||!password){
        res.status(400)
        throw new Error('Please fill all the fields')
    }
    const user=await User.findOne({email})
    console.log(user)
    if(user&&(await user.matchPassword(password)))
    {
        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin,
            pic:user.pic,
            token:generateToken(user._id)
        })
        // res.send("Login Successful");
    }
    else{
        res.status(400)
        throw new Error('Invalid email or password')
    
    }


});

const allUsers =asyncHandler( async (req, res) => {
    const keyword=req.query.search
    ?{
        $or:[
            {name:{$regex:req.query.search,$options:"i"}},
            {email:{$regex:req.query.search,$options:"i"}}
        ]
    }
    :{};
    const users=await User.find(keyword).find({_id:{$ne:req.user._id}})
    res.send(users)
});


module.exports={registerUser,authUser,allUsers};



