const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Provide name please'],
        min:2,
        max:80
    },
    location:{
        type:String,
        required:[true, "Provide location please"],
    },
    occupation:{
        type:String,
        required:[true, "Provide occupation please"]
    },
    email:{
        type:String,
        match:[ /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i],
        required:[true, "Provide email please"],
        unique: true
    },
    password:{
        type:String,
        required:[true, "Provide password please"],
        min:2,
        max:16
    },
    picturePath:{
        type:String,
        default:''
    },
    viewedProfile:Number,
    impressions:Number
},{timestamps:true,versionKey:false})

userSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next()
});

userSchema.methods.verifyPassword= async function(password){
    const pwd = await bcrypt.compare(password, this.password)
    return pwd;
}

userSchema.methods.createJwt = function(){
    return jwt.sign({id:this._id,name:this.name},process.env.SECRET_KEY,{expiresIn:'1d'})
}
userSchema.methods.createRefreshJwt = function(){
    return jwt.sign({id:this._id, name:this.name},process.env.REFRESH_KEY )
}

const User = mongoose.model('User',userSchema)


module.exports = User;