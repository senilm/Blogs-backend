const { NotFoundError, BadRequestError } = require('../errors')
const Post = require('../models/post')



const getAllPosts = async (req,res)=>{
    const category = req.query.category;
    if(!category){
        throw new BadRequestError("no category found")
    }
    if(category === 'All'){
        const posts = await Post.find({})
        if(!posts){
            throw new NotFoundError("No blogs found")
        }
    
        res.status(200).json(posts)
    }else{
        const posts = await Post.find({subject:category})
        if(!posts){
            throw new NotFoundError("No blogs found")
        }
    
        res.status(200).json(posts)
    }

    
}




const getUserPosts = async (req,res)=>{
    const {userId} = req.params
    
    const posts = await Post.find({authorId:userId})

    res.status(200).json(posts)
}


const getPost = async (req,res)=>{
    const postId = req.params.postId;
    
    const post = await Post.find({_id:postId})
    if(!post){
        throw new NotFoundError("No Post Found")
    }
    res.status(200).json(post)
}


const createPost = async (req,res)=>{
    req.body.authorId = req.user.id;
    req.body.authorName = req.user.name;
    req.body.views = Math.floor(Math.random()*1000)

    const post = await Post.create(req.body)

    res.status(200).json('Post saved successfully')
}


const editPost = async (req,res)=>{
    const {postId} = req.params;
    const {id} = req.user
    const {title, subject, content,picturePath} = req.body

    const update ={
        title,
        subject,
        content,
        picturePath
    }
    const editedPost = await Post.findOneAndUpdate({_id:postId, authorId:id},update,{new:true})

    if(!editedPost){
        throw new BadRequestError("You are not the creator of the post")
    }

    res.status(200).json(editedPost)
}


const deletePost = async (req,res)=>{
    const {postId} = req.params;
    const {id} = req.user

    const deletedPost  = await Post.findOneAndDelete({_id:postId, authorId:id})
    if(!deletedPost){
        throw new BadRequestError("You are not the creator of this post")
    }
    res.status(200).json(deletedPost)
}


module.exports ={
    editPost,
    createPost,
    getAllPosts,
    getPost,
    getUserPosts,
    deletePost,
    
}