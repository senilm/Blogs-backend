const { BadRequestError, NotFoundError } = require("../errors")
const mongoose = require('mongoose')
const grid = require('gridfs-stream')
const url = 'https://blogs-u0mj.onrender.com'

let gfs,gridfsBucket;
const conn = mongoose.connection;
conn.once('open', () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db,{
        bucketName:'fs'
    });
    gfs = grid(conn.db, mongoose.mongo);
    gfs.collection('fs')
  });


const handleFile = async (req,res) =>{
    if(!req.file){
        throw new BadRequestError("File not found")
    }

    const imageUrl = `${url}/file/${req.file.filename}`
    return res.status(200).json(imageUrl)
}


const getImage = async(req,res)=>{
    const {filename} = req.params;
    try {
        const file = await gfs.files.findOne({ filename:filename});
        const readStream = gridfsBucket.openDownloadStream(file._id);
        readStream.pipe(res)
    } catch (error) {
        throw new NotFoundError('Image not found')
    }
}
module.exports = {handleFile,getImage}