const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const {SECRET_KEY} = require('../key')
const login = require('../middleware/login')
const fetch = require('node-fetch')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')


const { response } = require('express')


const router = express.Router()
const user = mongoose.model("user")

const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:"key",
    }
}))

    

router.post('/signup',(req,res)=>{
    // console.log(req.body)
    const {name,email,password,pic} = req.body
    if(!email || !password || !name){
        return res.status(422).json({error:"Please fill all the fields"})
    }
    // res.json({message:"posted successfully"})
    user.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({errMessage:"user already exist"}) 
        }
        bcrypt.hash(password,12)
        .then(hashedpassword =>{
            const User = new user({
                email,
                password:hashedpassword,
                name,
                pic:pic
            })
            User.save().then(User =>{
                transporter.sendMail({
                    to:User.email,
                    from:"officialappogram@gmail.com",
                    subject:"signup success",
                    html:`<h2>hello <mark>${User.name}!!</mark> Welcome to Appogram family</h2>`
                })
               
                
                res.json({message:"Registered successfully!!"})
            })
            .catch(err=>{
                console.log(err)
            })

        })
        
    }).catch(err =>{
        console.log(err)
    })
})

router.post('/login',(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
      return res.status(422).json({error:"add email/password"})
    }
    user.findOne({email:email}).then(savedUser =>{
        if(!savedUser){
            return res.status(422).json({error:"invalid user"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch =>{
            if(doMatch){
                // return res.json({message:"successfully signedin"})
                const token = jwt.sign({_id:savedUser._id},SECRET_KEY)
                const {_id,name,email,followers,following,pic} = savedUser
                res.json({token,user:{_id,name,email,followers,following,pic}})
            }
            else{
                return res.status(422).json({error:"invalid user"})
            }
        }).catch(err =>{
            console.log(err)
        })
    })
})

router.post('/resetPassword',(req,res)=>{
   crypto.randomBytes(32,(err,buffer)=>{
       if(err){
           console.log(err)
       }
       const token = buffer.toString("hex")
       user.findOne({email:req.body.email})
       .then(user=>{
           if(!user){
               return res.status(422).json({error:"user dont exist with this email"})

           }
           user.resetToken = token
           user.expireToken = Date.now()+ 3600000
           user.save().then((result)=>{
            //    console.log("bhkj",User)
               transporter.sendMail({
                   to:user.email,
                   from:"officialappogram@gmail.com",
                   subject:"reset password",
                   html:`<h2>You have requested for password reset</h2><h3> click in this <a href="http://localhost:3000/reset/${token}"> link</a> to reset password</h3>`
               })
               res.json({message:"check your mail"})
           })
       })
   })
})

router.post('/newPass',(req,res)=>{
    const newPassword = req.body.password
    const sentToken = req.body.token
    user.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
.then(user=>{
    if(!user){
       return res.status(422).json({error:"try again session expires"})
    }
    bcrypt.hash(newPassword,12).then(hashedpassword=>{
        user.password = hashedpassword,
        user.resetToken = undefined,
        user.expireToken = undefined
        user.save().then((savedUser)=>{
            res.json({message:"password updated successfuly"})
        })
    })
}).catch(err=>{
    console.log(err)
})
})
router.post('/facebookLogin',(req,res)=>{
    const {userID,accessToken} = req.body
    let urlGraphFacebook = `https://graph.facebook.com/v2.12/${userID}/?fields=id,name,email&access_token=${accessToken}`
    fetch(urlGraphFacebook,{
        method:"GET"
    }).then(response => response.json())
    .then(response => {
        const {email,name,followers,following,pic} = response;
        console.log("cfgvhb",response)
        user.findOne({email}).exec((err,Users)=>{
            if(err){
                return res.status(400).json({
                    error:"somenthing wring"
                })
            }else{
                if(Users){
                    console.log(Users)
                    transporter.sendMail({
                        to:Users.email,
                        from:"officialappogram@gmail.com",
                        subject:"signup success",
                        html:`<h2>hello <mark>${Users.name}!!</mark> Welcome to Appogram family</h2><h5>You registered through Facebook</h5>`
                    })
                    
                const token = jwt.sign({_id:Users._id},SECRET_KEY)
                const {_id,name,email,followers,following,pic} = Users
                res.json({token,user:{_id,name,email,followers,following,pic}})

                }else{
                    let password = email +SECRET_KEY;
                    let Users = new user({name,email,password,followers,following,pic});
                    Users.save((err,Users)=>{
                        if(err){
                        return res.status(400).json({
                            error:"data wrong"
                        })
                        }else{
                        const token = jwt.sign({_id:Users._id},SECRET_KEY)
                        const {_id,name,email,followers,following,pic} = Users
                        res.json({token,user:{_id,name,email,followers,following,pic}})
                        }
                    })
                }
            }

        })
    
    })

})


module.exports = router