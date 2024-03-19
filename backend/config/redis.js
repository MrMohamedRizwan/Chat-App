const { createClient } = require('redis');


const connecttoredis=()=>{

const client = createClient();

    client.on('error', err => console.log('Redis Client Error', err));
    try{
        client.connect();
        console.log('Redis Connected');
    }
    catch(e)
    {
        console.log(e);
    }
    return client;

}

module.exports=connecttoredis;
    