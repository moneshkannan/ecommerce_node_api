const Blog = require('../models/blogModel')
const User = require('../models/userModel')
const {validMongoDbId} = require('../utils/validateMongoDbId')
const asyncHandler = require('express-async-handler')

const createBlog = asyncHandler(async (req, res) =>{
    try{
        const newBlog = await Blog.create(req.body)
        return res.json(newBlog)
    }catch(err){
        throw new Error(err)
    }
})

const updateBlog = asyncHandler(async (req, res) =>{
    const {id} = req.params
    validMongoDbId(id)
    try{
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {new: true})
        return res.json(updateBlog)
    }catch(err){
        throw new Error(err)
    }
})

const getBlog = asyncHandler(async (req, res) =>{
    const {id} = req.params
    validMongoDbId(id)
    try{
        const getBlog = await Blog.findById(id).populate("likes").populate("dislikes")
        await Blog.findByIdAndUpdate(
            id,{$inc:{numViews:1}},{new: true}
        )
        return res.json(getBlog)
    }catch(err){
        throw new Error(err)
    }
})

const getAllBlogs = asyncHandler(async (req, res) =>{
    const {id} = req.params
    try{
        const getAllBlogs = await Blog.find()
        return res.json(getAllBlogs)
    }catch(err){
        throw new Error(err)
    }
})

const deleteBlog = asyncHandler(async (req, res) =>{
    const {id} = req.params
    validMongoDbId(id)
    try{
        const deleteBlog = await Blog.findByIdAndDelete(id)
        return res.json(deleteBlog)
    }catch(err){
        throw new Error(err)
    }
})

const likeBlog = asyncHandler(async (req, res) => {
    const {blogId} = req.body
    validMongoDbId(blogId)

    // find the blog which you want to be liked
    const blog = await Blog.findById(blogId)
    // find the login user
    const loginUserId = req?.user?._id;
    // find the user has liked the blog
    const isLiked = blog?.isLiked
    // find if the user is disliked the blog
    const alreadyDisliked = blog?.dislikes?.find((userId) => userId?.toString() == loginUserId.toString())
    if (alreadyDisliked){
        const blog = await Blog.findByIdAndUpdate(blogId, {$pull: {dislikes: loginUserId}, isDisliked: false},{new: true});
        return res.json(blog)
    }
    if (isLiked){
        const blog = await Blog.findByIdAndUpdate(blogId, {$pull: {likes: loginUserId}, isLiked: false},{new: true});
        return res.json(blog)
    }else{
        const blog = await Blog.findByIdAndUpdate(blogId, {$push: {likes: loginUserId}, isLiked: true},{new: true});
        return res.json(blog)
    }
})

const dislikeBlog = asyncHandler(async (req, res) => {
    const {blogId} = req.body
    validMongoDbId(blogId)

    // find the blog which you want to be liked
    const blog = await Blog.findById(blogId)
    // find the login user
    const loginUserId = req?.user?._id;
    // find the user has liked the blog
    const isDisliked = blog?.isDisliked
    // find if the user is disliked the blog
    const alreadyliked = blog?.likes?.find((userId) => userId?.toString() == loginUserId.toString())
    if (alreadyliked){
        const blog = await Blog.findByIdAndUpdate(blogId, {$pull: {likes: loginUserId}, isLiked: false},{new: true});
        return res.json(blog)
    }
    if (isDisliked){
        const blog = await Blog.findByIdAndUpdate(blogId, {$pull: {dislikes: loginUserId}, isDisliked: false},{new: true});
        return res.json(blog)
    }else{
        const blog = await Blog.findByIdAndUpdate(blogId, {$push: {dislikes: loginUserId}, isDisliked: true},{new: true});
        return res.json(blog)
    }
})


module.exports = {
    createBlog,
    updateBlog,
    getBlog,
    getAllBlogs,
    deleteBlog,
    likeBlog,
    dislikeBlog
}