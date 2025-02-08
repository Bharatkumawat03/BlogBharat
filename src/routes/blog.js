const express = require('express');
const { userAuth } = require('../middleware/auth');
const Blog = require('../models/Blog');
const blogRouter = express.Router();

blogRouter.post("/blog/add", userAuth, async(req, res) => {
    try {
        const { title, content, category, image } = req.body;
    
        const newBlog = new Blog({
            title,
            content,
            category,
            image,
            author: req.user._id
        })
    
        await newBlog.save()
        res.status(201).json({ message: "Blog created successfully", blog: newBlog });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

blogRouter.get("/blog/all", async (req,res) => {
    try {
        const {page = 1, limit = 10} = req.query;
        const blogs = await Blog.find()
            .populate("author", "name")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

blogRouter.get("/blog/:id", async (req, res) => {
    try {
        const blogId = req.params.id;
        const blog = await Blog.findById(blogId).populate("author", "name");
        if (!blog) return res.status(404).json({ message: "Blog not found" });
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

blogRouter.put("/blog/edit/:id", userAuth, async (req, res) => {
    try {
        const blogId = req.params.id;
        const blog = await Blog.findById(blogId);
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        if(blog.author._id.toString() !== req.user._id.toString()){
            return res.status(403).json({ message: "You are not authorized to edit this blog"});
        }

        const {title, content, category, image} = req.body;
        blog.title = title || blog.title;
        blog.content = content || blog.content;
        blog.category = category || blog.category;
        blog.image = image || blog.image;

        await blog.save();
        res.status(200).json({ message: "Blog updated successfully", blog });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

blogRouter.delete("/blog/delete/:id", userAuth, async (req, res) => {
    try {
        const blogId = req.params.id;
        const blog = await Blog.findById(blogId);
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        if(blog.author._id.toString() !== req.user._id.toString()){
            return res.status(403).json({ message: "You are not authorized to delete this blog"});
        }

        await blog.deleteOne();
        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

module.exports = blogRouter;