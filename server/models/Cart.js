const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const CartSchema = new Schema({
    userEmail:{type:String,required:true},
    productId:{type:String,required:true},
    quantity: { type: Number, default: 1 }
});

const Cart = mongoose.model('Cart', CartSchema,'Cart');
module.exports=Cart
