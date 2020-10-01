const mongoose =require('mongoose');
const Schema =mongoose.Schema;
const Buyer_registerSchema=new Schema({
  Buyer_Name:{
    type:String,
    required:true
  },
  Buyer_Cell:{
    type:String,
    required:true
  },
  Buyer_Address:{
    type:String,
    required:true
  },
  Buyer_Email:{
    type:String,
    required:true
  },
  Purchased:{
    type:String,
    required:true
  },
  
  
});
mongoose.model('buyer_register',Buyer_registerSchema);