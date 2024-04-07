const mongoose=require('mongoose');

const connectToDB = async () => {
    try{
    const conn=await mongoose.connect (process.env.MONGO_URI,{    //127.07
    useNewUrlParser : true,useUnifiedTopology :true,  useCreateIndex: true,
});
    console.log("MongoDB Connected".cyan.underline.bold);
}
    catch(e){
        console.log(e);
        process.exit(); //exit with failure
    }
}
module.exports = connectToDB ;