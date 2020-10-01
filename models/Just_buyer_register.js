const mongoose =require('mongoose');
const Schema =mongoose.Schema;
const Just_buyer_registerSchema=new Schema({
  Name:{
    type:String,
    required:true
  },
  Phone:{
    type:String,
    required:true
  },
 
  
  
});
mongoose.model('just_buyer_register',Just_buyer_registerSchema);