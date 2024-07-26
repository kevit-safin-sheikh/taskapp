const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Task=require('./tasks')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        validate(email){
            if(!validator.isEmail(email)){
                throw new Error("Email is invalid")
            }
        }
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error("Age must be a positive number")
            }
        }
    },
    password:{
        type:String,
        required:true,
        minLength:6,
        trim:true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error("Password can not be set to password")
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
})

userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

userSchema.methods.toJSON=function(){
    const user=this
    const userObject=user.toObject();

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.methods.generateAuthToken=async function(){
    const user=this;
    const token=jwt.sign({_id:user._id.toString()},'newtoken');
    user.tokens=user.tokens.concat({token: token})
    await user.save();
    return token;
}

userSchema.statics.findByCredentials=async(email,password)=>{
    const user=await User.findOne({email})
    if(!user){
        throw new Error("Email id or password in invalid")
    }

    const isPasswordMatched=await bcrypt.compare(password,user.password)

    if(!isPasswordMatched){
        throw new Error('Email id or password is invalid')
    }


    return user;
}



//for password 
userSchema.pre('save',async function(next){
    const user=this
    
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8)
    }

    next();
})

const User=mongoose.model('User',userSchema)

module.exports=User