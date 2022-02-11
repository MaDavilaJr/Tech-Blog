const router = require('express').Router();
const { Post } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', async (req, res) => {
    try {
      const posts = await Post.findAll();
      res.status(200).json(posts);
    } catch (err) {
      res.status(400).json(err);
    }
  });

router.post('/', withAuth, async (req, res) => {
    try {
      const newPost = await Post.create({
        ...req.body,
        user_id: req.session.user_id,
        location_id: req.body.location_id
      });
  
      res.status(200).json(newPost);

    } catch (err) {
      res.status(400).json(err);
    }
  });

module.exports = router;