const jwt=require('jsonwebtoken');
const { createClient } = require('redis');
const { ObjectId } = require('mongodb');
// const redisClient=require('./redis');

// const redis=(objectIdString ,tok)=>{
//     const objectId = new ObjectId(objectIdString);

//     const id = objectId.toHexString();
//     try{
//         redisClient.set(id, tok, function(err, reply) {
//             if (err) {
//                 console.error('Error storing token:', err);
//             } else {
//                 console.log('Token stored for user ID:', id);
//             }
//         });
//         // redisClient.expire(id,60*60*24);
//     }

//     catch(e){
//         console.log("cfgvhbjkml,;jhgcgfvbhjnkmljhbgvcfxcgvbhjk",e);
//     }
// }
// function storeToken(userId, token) {
//     redisClient.set(id, tok, function(err, reply) {
//         if (err) {
//             console.error('Error storing token:', err);
//         } else {
//             console.log('Token stored for user ID:', userId);
//         }
//     });
// }
const generateToken=(id)=>{
    const tok=jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:'30d'
    })
    console.log(id)
    // redis(id,tok);
    return tok;
}
module.exports=generateToken;