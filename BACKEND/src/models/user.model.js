const mongoose = require('mongoose');
require('dotenv').config();
const userSchema = new mongoose.Schema({
   username:{
    type : String,
    required : true,
    unique : [true,"Username already exists"],
   } ,
   email :{
    type :String,
    required : true,
    unique : [true,"Email already exists"],
   },
   password :{
   type : String,
   required : true,
   unique : [true,"Password already exists"],
   }

})

const User = mongoose.model('User',userSchema);
module.exports = User;