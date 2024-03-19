const jwt=require('jsonwebtoken');
const { createClient } = require('redis');
const { ObjectId } = require('mongodb');
const connecttoredis = require('./redis');

const redis=(objectIdString ,tok)=>{
    const client=connecttoredis()
    const objectId = new ObjectId(objectIdString);

    const id = objectId.toHexString();
    try{
    client.set(id,tok);
    client.expire(id,60*60*24);}

    catch(e){console.log(e);}
}
const generateToken=(id)=>{
    const tok=jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:'30d'
    })
    console.log(id)
    redis(id,tok);
    return tok;
}
module.exports=generateToken;