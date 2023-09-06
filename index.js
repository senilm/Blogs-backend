require('dotenv').config()

// The most important one when handling async errors is to initialize the async error package
require('express-async-errors')

const express= require('express')
const helmet  = require('helmet')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
// const { fileURLToPath } = require('url')
const multer = require('multer')
const authRouter = require('./routes/auth')
const postRouter = require('./routes/posts')
const { register } = require('./controllers/auth')
const { createPost, editPost } = require('./controllers/posts')
const connectDB = require('./connectDB/connectDB');
const errorHandlerMiddleware = require('./middleware/errorHandler');
const notFoundMiddleware = require('./middleware/notFound')
const authenticationMiddleware = require('./middleware/authentication');
const {GridFsStorage} = require('multer-gridfs-storage');
const {handleFile,getImage} = require('./controllers/handleFile');
const {addComment, getComment, deleteComment} = require('./controllers/addComment')
const app = express();



// middleware
// const __filename = fileURLToPath(import.meta.url); //will not use this bcz we have not used type:"module" so this is commonjs module not ES
// const __dirname = path.dirname(__filename)
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('common'));
}
// app.use(cors())
app.use(express.json())
app.use(express.urlencoded({limit:'30mb',extended:true}))
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy:'cross-origin'}))
const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }
app.use(cors(corsOptions))
app.use('/assets', express.static(path.join(__dirname,'public/assets')))




// storage
const storage = new GridFsStorage({
    url:process.env.MONGO_URL,
    file:(request, file)=>{
        const match = ["image/png", "image/jpg", "image/jpeg"]


            if(match.indexOf(file.memeType)===-1)  //if it exists in array then it would return it's index otherwise it'll return -1 
            {
                return `${Date.now()}-blog-${file.originalname}`
            }

        return {
            bucketName:"photos",
            filename:`${Date.now()}-blog-${file.originalname}`      
        }
    }
    // destination:function(req,res,cb){
    //     cb(null,"public/assets")
    // },
    // filename:function(req,file,cb){
    //     cb(null,file.originalname)
    // }
})
const upload = multer({storage})




// router configuration
app.use('/auth', authRouter)
app.use('/posts',authenticationMiddleware, postRouter)

// routes with files
app.post('/auth/register', upload.single('picture'),register);
app.post('/file/upload', upload.single('file') ,handleFile)
app.get('/file/:filename',getImage)
app.post('/posts',upload.single('picture'),authenticationMiddleware, createPost)
app.patch('/posts/:postId',upload.single('picture'),authenticationMiddleware, editPost)
app.post('/:postId/comment',authenticationMiddleware,addComment)
app.get('/:postId/comment',authenticationMiddleware,getComment)
app.delete('/comment/:commentId/delete',authenticationMiddleware, deleteComment)
// routes
app.get('/',(req,res)=>{res.json("hi")})




// error handlers
app.use(errorHandlerMiddleware)//do not write () at end bcz that will just invoke the middleware and we do not want that.
app.use(notFoundMiddleware)

// connecting db
const connect = async () =>{
    try{
        await connectDB(process.env.MONGO_URL);
        app.listen(process.env.PORT,()=>{
            console.log(`connected and running on http://localhost:${process.env.PORT}`);
        } )
    }catch(error){
        console.log(error);
    }
    
}
connect()



