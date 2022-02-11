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

router.put('/:id', withAuth, async(req, res) => {
  try {
        console.log('hello')
        const newPost = await Post.update(req.body, {
            where: {
                user_id: req.session.user_id,
                id: req.params.id
            }
        });
  
        res.status(200).json(newPost);
    } catch (err) {
        console.log(err)
        res.status(400).json(err);
    }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id
      },
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with this ID!"'});
      return;
    }
    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;