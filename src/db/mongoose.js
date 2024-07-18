const mongoose=require('mongoose')

mongoose.connect('mongodb://localhost:27017/task-manager-api')
.then(()=>{
    console.log("Connected ")
  }).catch((error)=>{
    console.log("Error connecting",error)
  })
