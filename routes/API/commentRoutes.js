const router = require('express').Router();
const { Comment } = require('../../models');

router.get('/', async (req, res) => {
    try {
      const comments = await Comment.findAll();
      res.status(200).json(comments);
    } catch (err) {
      res.status(400).json(err);
    }
  });

router.post('/', async (req, res) => {
    try {
      const newComment = await Comment.create({
        ...req.body,
        user_id: req.session.user_id,
        location_id: req.body.location_id
      });
  
      res.status(200).json(newComment);

    } catch (err) {
      res.status(400).json(err);
    }
  });

module.exports = router;