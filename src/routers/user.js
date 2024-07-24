const express=require('express')
const User=require('../models/user')
const Task=require('../models/tasks')
const auth=require('../middleware/auth')
const router=new express.Router()

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
        const deletedTasks=await Task.deleteMany({owner:req.user._id})
        res.send({deletedUser,deletedTasks})
    
    }catch(e){
        console.log(e)
        res.status(500).send("Internal Server error can not delete user.Please try again later")
    }
})

module.exports=router