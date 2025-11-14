// routes/commentRoutes.js
const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const protect = require("../middleware/auth");

// ✅ Create a new comment
router.post("/:postId", protect, async (req, res) => {
  const { content } = req.body;

  if (!content)
    return res.status(400).json({ message: "Comment content is required" });

  try {
    const post = await Post.findById(req.params.postId);
    if (!post)
      return res.status(404).json({ message: "Post not found" });

    const newComment = new Comment({
      post: post._id,
      author: req.user._id,
      content,
    });

    const savedComment = await newComment.save();

    res.status(201).json(savedComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Get comments for a post
router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Delete a comment (optional)
router.delete("/:id", protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment)
      return res.status(404).json({ message: "Comment not found" });

    if (comment.author.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    await comment.deleteOne();
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
