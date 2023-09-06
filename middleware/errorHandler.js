const {CustomAPIError} = require('../errors')
const {StatusCodes} = require('http-status-codes')

const errorHandlerMiddleware = (err,req,res,next) =>{
    // console.log("Error handler middleware is being called.");

    if (err instanceof CustomAPIError) {
        // console.log("Custom API error encountered.");
        return res.status(err.statusCode).json({ msg: err.message })
        // console.log(err);
        
     }

    // let customError={
    //     statusCode:err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    //     msg: err.message || 'Something went wrong, try again later'
    //   }
    //  return res.status(customError.statusCode).json({error:customError.msg});
     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
}

module.exports = errorHandlerMiddleware   