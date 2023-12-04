const express = require('express');
const { renderMain, renderProfile, renderJoin } = require('../controllers/page');

const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = req.user
    res.locals.followerCount = req.user?.followerCount || 0;
    res.locals.followingCount = req.user?.followingCount || 0;
    res.locals.followerIdList = req.user?.followers?.map(f => f.id) || [];
    next();
})

router.get('/profile', renderProfile);

router.get('/join', renderJoin);

router.get('/', renderMain);

module.exports = router;