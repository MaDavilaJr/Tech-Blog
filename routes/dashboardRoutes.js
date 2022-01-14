const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');
// 
router.get('/', async (req, res) => {
    Post.findAll({
        where: {
            user_id: req.session.user_id
        },
        attributes: [
            'id',
            'post_body',
            'title',
            'created_at'
        ],
      include: [
        {
          model: User,
          attributes: ['id','comment_text','post_id','user_id','created_at'],
          include: {
              model: User,
              attributes: ['username']
          }
        },
        {
          model: User,
          attributes: ['username']
        }
      ]
    })
    .then(dbPostData => {
      const posts = dbPostData.map(post => post.get({ plain: true})); 
      res.render('dashboard', { posts, loggedIn: true });
    })
    .catch(err => {
    res.status(500).json(err);
  })
});

router.get('/edit/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'post_body',
      'title',
      'created_at'
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
      model: User,
      attributes: ['username']
      }
    ]
  })
  .then(dbPostData => {
    if(!dbPostData) {
      res.status(404).json({message: "No post with this ID!"})
      return;
    }
    const post = dbPostData.get({plain:true});
    res.render("edit post", {post,  logged_in: true});
  }) .catch(err => {
    res.status(500).json(err);
  });
});


router.get('/location/:id', async (req, res) => {
  try {
    const locationData = await Location.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });
    
    const location = locationData.get({ plain: true });

    res.render('locations', {
      ...location,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
// router.get('/profile', withAuth, async (req, res) => {
//   try {
//     // Find the logged in user based on the session ID
//     const userData = await User.findByPk(req.session.user_id, {
//       attributes: { exclude: ['password'] },
//       include: [{ model: Location }],
//     });

//     const user = userData.get({ plain: true });

//     res.render('profile', {
//       ...user,
//       logged_in: true
//     });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

module.exports = router;
