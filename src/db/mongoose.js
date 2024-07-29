const mongoose=require('mongoose')

mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    console.log("Connected ")
  }).catch((error)=>{
    console.log("Error connecting",error)
  })
