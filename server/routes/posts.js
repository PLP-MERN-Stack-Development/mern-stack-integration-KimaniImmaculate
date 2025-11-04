const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const protect = require('../middleware/auth');
const upload = require('../middleware/upload');

// 🟢 Get all posts (public)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('category')
      .populate('author', 'name email')
      .sort({ createdAt: -1 }); // show newest first

    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 🟢 Get a single post (public)
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('category')
      .populate('author', 'name email');

    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    console.error('Error fetching single post:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 🟡 Create a new post (protected + with image)
router.post('/', protect, upload.single('image'), async (req, res) => {
  console.log('BODY:', req.body);
  console.log('FILE:', req.file);

  const { title, content, category, tags } = req.body;

  if (!title || !content || !category) {
    return res.status(400).json({ message: 'Title, content, and category are required' });
  }

  try {
    const slug = title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');

    const newPost = new Post({
      title,
      content,
      category,
      author: req.user._id,
      slug,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      image: req.file ? `/uploads/${req.file.filename}` : '',
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

