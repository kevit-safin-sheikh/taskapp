const express=require('express')
const Task=require('../models/tasks')
const User=require('../models/user')
const auth=require('../middleware/auth')
const router=new express.Router()

//ALL TASKS ROUTE

//route to get all tasks
router.get('/tasks',auth,async(req,res)=>{
    try{
        // const task=await req.user.populate('tasks')
        await req.user.populate('tasks')

        res.send(req.user.tasks)
    }catch(e){
        res.status(500).send("Internal Server Error can not fetch all the data")
    }
})

//route to get specific tasks
router.get('/tasks/:id',auth,async(req,res)=>{
    const _id=req.params.id
    try{
        // const task=await Task.findById(req.params.id)
        const task=await Task.findOne({_id,owner:req.user._id})
        if(!task){
            return res.status(404).send("Task not found")
        }
        res.send(task)
    }catch(e){
        res.status(500).send("Internal server error can not fetch the data")
    }
})


//route to add a task
router.post('/tasks',auth,async(req,res)=>{
    // const task=new Task(req.body)
    try{
        const task=await Task.create({...req.body,owner:req.user._id})
        // const task=await Task.create(req.body)
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }

})

//route to update the task
router.patch('/tasks/:id',auth,async(req,res)=>{ 
    const incomingUpdate=Object.keys(req.body)
    const allowedUpdates=["description","completed"]
    const validation=incomingUpdate.every((update)=>allowedUpdates.includes(update))
    if(!validation){
        return res.status(400).send({error:"Invalid Update. Field that you entered does not exists"})
    }
    try{
        const updatedTask=await Task.findOne({_id:req.params.id,owner:req.user._id})
        if(!updatedTask){
            return res.status(404).send("No task found to Update")
        }
        incomingUpdate.forEach((update)=>updatedTask[update]=req.body[update])
        await updatedTask.save()
        res.send(updatedTask)
    }catch(e){
        res.status(500).send("Internal server error")
    }
})

router.delete('/tasks/:id',auth,async(req,res)=>{
    try{
        // const deletedTask=await Task.findByIdAndDelete(req.params.id)
        const deletedTask=await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if(!deletedTask){
            res.status(404).send("No user found to delete")
        }
        res.send(deletedTask)
    }catch(e){
        res.status(500).send("Internal Server error can not delete user.Please try again later")
    }
})


module.exports=router