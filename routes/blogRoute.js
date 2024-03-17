const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, likeBlog, dislikeBlog } = require('../controllers/blogController');
const router = express.Router();

router.post('/', authMiddleware, isAdmin, createBlog)
router.put("/likes", authMiddleware, isAdmin, likeBlog)
router.put("/dislikes", authMiddleware, isAdmin, dislikeBlog)
router.put('/:id', authMiddleware, isAdmin, updateBlog)
router.delete('/:id', authMiddleware, isAdmin, deleteBlog)
router.get('/:id', getBlog)
router.get('/', getAllBlogs)

module.exports = router