const express=require('express')
const sharp=require('sharp')
const User=require('../models/user')
const Task=require('../models/tasks')
const auth=require('../middleware/auth')
const router=new express.Router()
const multer=require('multer')
const upload=multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error("Please Upload a jpg,jpeg or png"))
        }
        cb(undefined,true)
    }
})
//ALL USER ROUTES


//route to add or signup a user
router.post('/users/signup',async(req,res)=>{ 
    try{
        const user=await User.create(req.body)
        const token=await user.generateAuthToken();
        res.status(201).send({user,token})
    }catch(e){
        res.status(400).send(e)
    }
})



// route for login
router.post('/users/login',async(req,res)=>{
    try{
        const user=await User.findByCredentials(req.body.email,req.body.password)
        const token=await user.generateAuthToken();
        res.send({user,token})
    }catch(e){
        res.status(400).send(e)
    }
})


//route for logout
router.post('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!==req.token
        })
        await req.user.save()
        res.send({message:'logout done'})
    }catch(e){
         res.status(500).send("Can not log out, Please authorize")
    }
})


//route for logoutall
router.post('/users/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens=[];
        await req.user.save()
        res.send({message:"logged out from all accounts"})
    }catch(e){
        res.status(500).send("Can not log out, Please authorize")
    }
})

//route to get the user
router.get('/users/me',auth,async(req,res)=>{
    res.send(req.user)
})

//route to update the user
router.patch('/users/me',auth,async(req,res)=>{
    const incomingUpdate=Object.keys(req.body)
    const allowedUpdates=['name','email','password','age']
    const validation=incomingUpdate.every((update)=>allowedUpdates.includes(update))    
    if(!validation){
        return res.status(400).send({error:"Invalid Update. Field that you entered does not exists"})
    }

    try{
        const user=await User.findById(req.user._id)
        await user.save()
        res.send(user)
    }catch(e){
        res.status(500).send("Internal Server Error can not update user. Please try again later")
    }
})

//route to delete the user
router.delete('/users/me',auth,async(req,res)=>{
    try{
        const deletedUser=await User.findByIdAndDelete({_id:req.user._id})
        await Task.deleteMany({owner:req.user._id})
        res.send({deletedUser})
    
    }catch(e){
        res.status(500).send("Internal Server error can not delete user.Please try again later")
    }
})

//route for uploading profile picture
router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
    // console.log(req.file)
    // console.log(req.user)
    const buffer=await sharp(req.file.buffer).resize({height:250,width:250}).png().toBuffer()
    req.user.avatar=buffer
    await req.user.save();
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

//route to delete the profile picture
router.delete('/users/me/avatar',auth,async(req,res)=>{
    req.user.avatar=undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar',async(req,res)=>{
    try{
        const user=await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error("User or avatar not found")
        }
        res.set('Content-Type','image/png')
        res.send(user.avatar)
    }catch(e){

    }
})

module.exports=router