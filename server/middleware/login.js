const jwt = require('jsonwebtoken')
const {SECRET_KEY} = require('../key')
const mongoose = require('mongoose')
const user = mongoose.model("user")

module.exports =(req,res,next)=>{
    const {authorization} = req.headers
    if(!authorization){
        return res.status(401).json({err:"you must be logged in to view page"})
    }
    const token = authorization.replace("Bearer ","")
    jwt.verify(token,SECRET_KEY,(err,payload)=>{
        if(err){
           return res.status(401).json({error:"you must login first"})
        }
        const {_id} = payload
        user.findById(_id).then(userdata =>{
            req.User = userdata
            next()
        })
        
    })
}