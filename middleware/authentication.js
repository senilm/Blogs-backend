const { StatusCodes } = require("http-status-codes")
const { BadRequestError, UnauthenticatedError } = require("../errors")
const jwt = require('jsonwebtoken')

const authenticationMiddleware = (req,res,next)=>{
    // console.log(req.headers);
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new BadRequestError("Please provide Token");
    }

    // console.log(authHeader);
    const token = authHeader.split(' ')[1]; //we need to add an empty string with a space not only the inverted ones
    // console.log(token);

    try {
        const payload = jwt.verify(token,process.env.SECRET_KEY)
        req.user = {
            id:payload.id,
            name:payload.name
        } 
        next()   
    } catch (error) {
        throw new UnauthenticatedError("Authentication failed")
    }
    


}

module.exports = authenticationMiddleware