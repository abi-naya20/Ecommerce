const mongoose=require("mongoose");
const productSchema = new mongoose.Schema({
  
    productName: String,
    brandName: String,
    price: Number,
    category:String,
    images: String,
    gram:String
  });
module.exports=mongoose.model('Product', productSchema,'Product');