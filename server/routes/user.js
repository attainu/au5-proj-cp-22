const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const login = require('../middleware/login')
const Post = mongoose.model("Post")
const User =  mongoose.model("user")


router.get('/user/:id',login,(req,res)=>{
   User.findOne({_id:req.params.id})
   .select("-password")
   .then(user=>{
      Post.find({postedBy:req.params.id})
      .populate("postedBy","_id name")
      .exec((err,posts)=>{
          if(err){
              return res.status(422).json({error:err})
          }
          else{
              res.json({user,posts})
          }
      })

   }).catch(err=>{
    return res.status(404).json({error:"user not found"})
})
})

router.put('/follow',login,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.User._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({err:err})
        }
        User.findByIdAndUpdate(req.User._id,{
            $push:{following:req.body.followId},
            
        },{new:true}).select("-password").then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({err:err})
        })
    })
})

router.put('/unfollow',login,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.User._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({err:err})
        }
        User.findByIdAndUpdate(req.User._id,{
            $pull:{following:req.body.unfollowId},
            
        },{new:true}).select("-password").then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({err:err})
        })
    })
})

router.put("/updatePic/:id",login,(req,res)=>{
    User.findByIdAndUpdate(req.User._id,{$set:{pic:req.body.pic}},{new:true},
        (err,result)=>{
       
            if(err){
                return res.status(400).json({
                    error:"email already exist"
                })
            }else{
                    res.json(result)
                }
        })
})
router.put("/updateProfile/:id",login,(req,res)=>{
    
    User.findByIdAndUpdate(req.User._id,{$set:{name:req.body.name,email:req.body.email}},{new:true},
       (err,result)=>{
         if(err){
             return res.status(422).json({error:"data cannot update"})
         }
         res.json(result)
        
        })
    
})
router.delete("/deleteuser/:userId",login,(req,res)=>{
    User.findOne({_id:req.params.userId})
    .populate("user","_id pic")
    .exec((err,user)=>{
        console.log("post",user)
        if(err||!user){
            return  res.status(422).json({err:err})
        }
       if(user._id.toString() === req.User._id.toString()){
             User.remove()
             .then(result=>{
                 res.json(result)
             }).catch(err=>{

                 console.log(err)
             })
       }
    })
})

module.exports = router