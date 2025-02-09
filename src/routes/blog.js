import express from "express";
import { userAuth } from "../middleware/auth.js";
import Blog from "../models/Blog.js";
import { v2 as cloudinary } from "cloudinary";
import upload from "../middleware/multer.js";

const blogRouter = express.Router();

blogRouter.post(
  "/blog/add",
  userAuth,
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, content, category, image } = req.body;
      let imageFile = req.file;

      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        folder: "blog_images",
        resource_type: "image",
      });
      const imageUrl = imageUpload.secure_url;

      const newBlog = new Blog({
        title,
        content,
        category,
        image: imageUrl,
        author: req.user._id,
      });

      await newBlog.save();
      res
        .status(201)
        .json({ message: "Blog created successfully", blog: newBlog });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

blogRouter.get("/blog/all", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const blogs = await Blog.find()
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

blogRouter.get("/blog/:id", async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId).populate("author", "name");
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

blogRouter.patch("/blog/edit/:id", userAuth, upload.single("image"), async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.author._id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to edit this blog" });
    }

    Object.keys(req.body).forEach((key) => {
      blog[key] = req.body[key];
    });

    if (req.file) {
      const imageUpload = await cloudinary.uploader.upload(req.file.path, {
        folder: "blog_images",
        resource_type: "image",
      });

      blog.image = imageUpload.secure_url;
    }

    await blog.save();
    res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

blogRouter.delete("/blog/delete/:id", userAuth, async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.author._id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this blog" });
    }

    await blog.deleteOne();
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default blogRouter;