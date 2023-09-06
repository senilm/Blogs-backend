const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    postId:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    comments:{
        type:String,
        required:true
    }
},{versionKey:false})

const Comment = mongoose.model('Comment', commentSchema)

module.exports =Comment