const express=require('express')
const User=require('../models/user')
const router=new express.Router()

//ALL USER ROUTES
//route to get all the users
router.get('/users',async(req,res)=>{
    try{
        const users=await User.find({})
        res.send(users)
    }catch(e){
        res.status(500).send("Internal Server Error can not fetch all the data")
    }
})

// route for logging in 
router.post('/users/login',async(req,res)=>{
    try{
        const user=await User.findByCredentials(req.body.email,req.body.password)
        res.send(user)
    }catch(e){
        res.status(400).send(e)
    }
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

//route to add the user
router.post('/users',async(req,res)=>{ 
    // const user=new User(req.body)
    try{
        // await user.save()
        const user=await User.create(req.body)
        res.status(201).send(user)
    }catch(e){
        res.status(400).send(e)
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