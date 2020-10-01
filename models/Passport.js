
const mongoose =require('mongoose');
const Schema =mongoose.Schema;
const PassportSchema=new Schema({
  
  First_Name:{
    type:String,
    required:true
  },
  Middle_Name:{
    type:String,
    required:true
  },
  Last_Name:{
    type:String,
    required:true
  },
  Email:{
    type:String,
    required:true
  },
  dob:{
    type:String,
    required:true
  },
  Address:{
    type:String,
    required:true
  },
  Passport_Verification:{
    type:String,
    required:true
  },
  
});
mongoose.model('passport',PassportSchema);