const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,"Please provide title"]
    },
    subject:{
        type:String,
        required:[true, 'Please provide subject'],
        enum:['All','Technology', 'Travel', 'Food', 'Health', 'Fashion', 'Lifestyle', 'Science', 'Business', 'Sports', 'Entertainment', 'Education', 'Politics']
    },
    content:{
        type:String,
        required:[true, "Please provide content for blog"],
        // min:100
        // validate: {
        //     validator: function (value) {
        //         return value.length >= 100;
        //     },
        //     message: 'Content should be at least 100 characters long'
        // }
    },
    authorName:{
        type:String,
        default:'',
        
    },
    authorId:{
        type:mongoose.Schema.Types.ObjectId,
        default:''
    },
    picturePath:{
        type:String,
        default:''
    },
    views:Number,
},{timestamps:true, versionKey:false})


module.exports = mongoose.model('Post', postSchema)