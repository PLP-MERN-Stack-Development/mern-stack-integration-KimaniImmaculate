// controllers/postController.js
const Post = require('../models/Post');

// Create a new post (without authentication for testing)
exports.createPost = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ message: 'Title, content, and category are required' });
    }

    // TEMPORARY: Hardcode a valid user ID from your users collection
    const authorId = '6908bdc9e98f55bb5dfdbb66'; // <-- replace with your actual user _id

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');

    const newPost = await Post.create({
      title,
      content,
      category,
      tags: tags || [],
      author: authorId,
      slug
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


