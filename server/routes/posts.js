// server/routes/posts.js
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const protect = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET /api/posts?search=&category=&page=1&limit=10
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', category } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) query.category = category;

    const skip = (Number(page) - 1) * Number(limit);

    const [posts, total] = await Promise.all([
      Post.find(query)
        .populate('category')
        .populate('author', 'username email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Post.countDocuments(query),
    ]);

    res.json({ posts, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('category')
      .populate('author', 'username email');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// CREATE post (protected + image)
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    if (!title || !content || !category) {
      return res.status(400).json({ message: 'Title, content, and category are required' });
    }

    const slug = title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

    const newPost = new Post({
      title,
      content,
      category,
      author: req.user._id,
      slug,
      tags: tags ? tags.split(',').map((t) => t.trim()) : [],
      image: req.file ? `/uploads/${req.file.filename}` : '',
    });

    const saved = await newPost.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// UPDATE post (protected)
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'You can only edit your own posts' });

    const { title, content, category, tags } = req.body;
    if (title) {
      post.title = title;
      post.slug = title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    }
    if (content) post.content = content;
    if (category) post.category = category;
    if (tags) post.tags = tags.split(',').map((t) => t.trim());
    if (req.file) post.image = `/uploads/${req.file.filename}`;

    const updated = await post.save();
    res.json(updated);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE post (protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'You can only delete your own posts' });

    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// COMMENTS: POST /api/posts/:id/comments
router.post('/:id/comments', protect, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Comment cannot be empty' });
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ user: req.user._id, content });
    await post.save();
    // populate the newly added comment's user
    const populated = await Post.findById(post._id).populate('comments.user', 'username');
    res.status(201).json(populated.comments);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;


