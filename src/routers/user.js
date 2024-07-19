const express=require('express')
const User=require('../models/user')
const auth=require('../middleware/auth')
const router=new express.Router()

//ALL USER ROUTES


//route to add or signup a user
router.post('/users',async(req,res)=>{ 
    // const user=new User(req.body)
    try{
        // await user.save()
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

//route to get all the users
router.get('/users/me',auth,async(req,res)=>{
    // try{
    //     const users=await User.find({})
    //     res.send(users)
    // }catch(e){
    //     res.status(500).send("Internal Server Error can not fetch all the data")
    // }
    res.send(req.user)
})

//route to get a specific user
router.get('/users/:id',async(req,res)=>{
    try{
        const user=await User.findById(req.params.id)
        if(!user){
            return res.status(404).send("User not found")
        }
        res.send(user)
    }catch(e){
        res.status(500).send("Internal Server Error can not fetch the data. Please try aggain later")
    }
})


//route to update the user
router.patch('/users/:id',async(req,res)=>{
    const incomingUpdate=Object.keys(req.body)
    const allowedUpdates=['name','email','password','age']
    const validation=incomingUpdate.every((update)=>allowedUpdates.includes(update))    
    if(!validation){
        return res.status(400).send({error:"Invalid Update. Field that you entered does not exists"})
    }

    try{
        const user=await User.findById(req.params.id)

        incomingUpdate.forEach((update)=> user[update]=req.body[update])

        await user.save()


        // const updatedUser=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if(!user){
            return res.status(404).send("No user found to Update")
        }
        res.send(user)
    }catch(e){
        res.status(500).send("Internal Server Error can not update user. Please try again later")
    }
})

//route to delete the user
router.delete('/users/:id',async(req,res)=>{
    try{
        const deletedUser=await User.findByIdAndDelete(req.params.id)
        if(!deletedUser){
            res.status(404).send("No user found to delete")
        }
        res.send(deletedUser)
    }catch(e){
        res.status(500).send("Internal Server error can not delete user.Please try again later")
    }
})

module.exports=router