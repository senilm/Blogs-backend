const { NotFoundError } = require('../errors')
const Comment = require('../models/comment')

const addComment = async (req,res) => {
    try{
        const comment = await Comment.create(req.body)
        res.status(200).json({msg:'Comment Done',postId:req.params.postId})
    }catch(error){
        res.status(500).json({err:error.message})
    }
}


const getComment = async (req,res) => {
   
    try{
      const CommentPost =  await Comment.find({postId:req.params.postId})
      res.status(200).json(CommentPost)
    }catch(error){
        res.status(500).json({err:error.message})
    }
}
const deleteComment = async (req,res) => {
    const {commentId} = req.params ;

    let comment = await Comment.findOneAndDelete({_id:commentId});
    if (!comment) {
        throw new NotFoundError("Comment not found")
    }
    res.status(200).json('comment deleted')
}

module.exports = {addComment, getComment,deleteComment} 