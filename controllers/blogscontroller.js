const express = require('express');
const Blog = require('../models/blogmodel');
const User = require('../models/user');
const jwt = require('jsonwebtoken')

const router = express.Router();

router.get('/', async (req, res) => {
    const blogs = await Blog.find({}).populate('creator', 'username name')
    res.json(blogs)
})

router.post('/', async (req, res) => {
    const { user } = req;
    const { title, author, url, likes = 0 } = req.body;
  
    if (!title || !url) {
      return res.status(400).json({ error: 'Include title or url' });
    }
  
    const blog = new Blog({ title, author, url, likes, user: user._id });
  
    try {
      const result = await blog.save();
      await result.populate('user', 'username name').execPopulate();
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: 'Invalid blog data' });
    }
  });
  
  router.delete('/:id', async (req, res) => {
    const { user } = req;
    const { id } = req.params;
  
    const blog = await Blog.findById(id);
  
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
  
    if (blog.user.toString() !== user._id.toString()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    try {
      await Blog.findByIdAndRemove(id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while deleting the blog' });
    }
  });

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { likes } = req.body;
  
    try {
      const updatedBlog = await Blog.findByIdAndUpdate(
        id,
        { likes },
        { new: true }
      );
      res.json(updatedBlog.toJSON());
    } catch (error) {
      res.status(400).json({ error: 'Failed to update blog post' });
    }
  });

router.use((req, res, next) => {
    const originalToJSON = res.json;
  
    res.json = function (body) {
      if (body && body._id) {
        body.id = body._id.toString();
        delete body._id;
      }
  
      return originalToJSON.call(this, body);
    };
  
    next();
  });
  
  module.exports = router;
  



