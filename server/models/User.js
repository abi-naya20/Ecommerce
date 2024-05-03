const mongoose=require("mongoose");
 const UserSchema=new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    mobile:String,
    role:{
        type:String,
        default:"visitor"
    }
 })

 const UserModel =mongoose.model("User",UserSchema,'User')
 module.exports=UserModel;