const { UnauthenticatedError,
    NotFoundError,
    BadRequestError } = require("../errors/index");
const User = require("../models/user")
const Token = require('../models/token')


const login = async(req,res)=>{

    const {email, password} = req.body;
    if(!email || !password){
        throw new BadRequestError('Please provide email and password')
        // res.json('not found')
    }

    const user = await User.findOne({email});

    if(!user){
        throw new NotFoundError("User not Found")
    }

    const pwd = await user.verifyPassword(password);
    
    if(!pwd){
        throw new UnauthenticatedError("Invalid Password")
    }
    const token = user.createJwt()
    const refreshToken = user.createRefreshJwt()
    
    const refToken = await Token.create({refreshToken}) //mongodb always takes objects
    res.status(200).json({token,refreshToken,user})
}


const register = async(req,res)=>{
    
    const user = await User.create(req.body)
    res.status(200).json({user})
}

module.exports = {login, register}