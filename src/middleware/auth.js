const jwt=require('jsonwebtoken')
const User=require('../models/user')
const auth=async(req,res,next)=>{
   try{
   //  console.log('_______________________')
    const token=req.header('Authorization').replace('Bearer ','')
    const decoded=jwt.verify(token,'newtoken')
    const user=await User.findOne({_id:decoded._id,'tokens.token':token})
    if(!user){
            throw new Error("User not found")
    }   
    req.token=token;
    req.user=user
    next();

   }catch(e){
      console.error(e)
      res.status(401).send({error:"Please authorize"})
   }
}

module.exports=auth;