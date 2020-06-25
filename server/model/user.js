const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true

    },
   resetToken:String,
   expireToken:Date,
    pic:{
       type:String,
       default:"https://res.cloudinary.com/dpad3bwv8/image/upload/v1592748617/default_qgqx61.webp"
    },
    followers:[{type:ObjectId,ref:"user"}],
    following:[{type:ObjectId,ref:"user"}]

})

mongoose.model("user",userSchema)