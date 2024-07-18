const express=require('express')
const Task=require('../models/tasks')
const router=new express.Router()

//ALL TASKS ROUTE

//route to get all tasks
router.get('/tasks',async(req,res)=>{
    try{
        const tasks=await Task.find()
        res.send(tasks)
    }catch(e){
        res.status(500).send("Internal Server Error can not fetch all the data")
    }
})

//route to get specific tasks
router.get('/tasks/:id',async(req,res)=>{
    try{
        const task=await Task.findById(req.params.id)
        if(!task){
            return res.status(404).send("Task not found")
        }
        res.send(task)
    }catch(e){
        res.status(500).send("Internal server error can not fetch the data")
    }
})


//route to add a task
router.post('/tasks',async(req,res)=>{
    // const task=new Task(req.body)
    try{
        const task=await Task.create(req.body)
        // await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }

})

//route to update the task
router.patch('/tasks/:id',async(req,res)=>{ 
    const incomingUpdate=Object.keys(req.body)
    const allowedUpdates=["description","completed"]
    const validation=incomingUpdate.every((update)=>allowedUpdates.includes(update))
    if(!validation){
        return res.status(400).send({error:"Invalid Update. Field that you entered does not exists"})
    }
    try{
        const updatedTask=await Task.findById(req.params.id)

        incomingUpdate.forEach((update)=>updatedTask[update]=req.body[update])

        await updatedTask.save()

        // const updatedTask=await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if(!updatedTask){
            return res.status(404).send("No task found to Update")
        }
        res.send(updatedTask)
    }catch(e){
        res.status(500).send("Internal server error")
    }
})

router.delete('/tasks/:id',async(req,res)=>{
    try{
        const deletedTask=await Task.findByIdAndDelete(req.params.id)
        if(!deletedTask){
            res.status(404).send("No user found to delete")
        }
        res.send(deletedTask)
    }catch(e){
        res.status(500).send("Internal Server error can not delete user.Please try again later")
    }
})


module.exports=router