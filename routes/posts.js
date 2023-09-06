const express = require('express')
const router = express.Router();
const {
    getAllPosts,
    getPost,
    getUserPosts,
    deletePost,
    addComment
} = require('../controllers/posts')


router.route('/').get(getAllPosts);
router.route('/:postId').get(getPost).delete(deletePost);
router.route('/:userId/posts').get(getUserPosts);


module.exports = router

// delete set e rite karvanu k j login kare eni potani post hoy to j ene delete nu button show thavu joi nakar nai etle apde khali postid vala req.url ma delete ser karvi chavi