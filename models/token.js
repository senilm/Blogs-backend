const mongoose = require('mongoose')
const tokenSchema = new mongoose.Schema({
    refreshToken:{
        type:String,
        required:true,
    }
})


const Token = mongoose.model('Token', tokenSchema)

module.exports=Token 