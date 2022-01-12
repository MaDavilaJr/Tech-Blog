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
    })
    try {
    // Get all projects and JOIN with user data
    const locationData = await Location.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    })
    .then('dbPostData => { 
      const posts = dbPostData.map(post => post.get({ plain: true})); 
      res.render('dashboard', { posts, loggedIn: true });
    })
    .catch(err => {
    res.status(500).json(err);
  })
});

router.get('/', async (req, res) => {
  try {
    const locationsData = await Location.findAll({
      include: [
        {
          model: Review,
          attributes: ['id', 'description', 'user_id', 'location_id']
        }
      ]
    });
    const locations = locationsData.map((location) => location.get({ plain: true }));
    res.render("locations", {locations,  logged_in: req.session.logged_in});
  } catch (err) {
    res.status(500).json(err);
  }
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
