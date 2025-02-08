const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      minLength: 50,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Technology", "Lifestyle", "Education", "Health", "Business",
        "Entertainment", "Travel", "Food", "Finance", "Sports",
        "Science", "Politics", "Personal Development", "Culture",
        "History", "Automobile", "Gaming", "Fashion", "Photography", "Other"
        ],
      default: "Other",
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
