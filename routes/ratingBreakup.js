var express = require('express');
var router = express.Router();
var movie = require('./index');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('ratingBreakup', {
        title: 'Express',
        sha: 'Shantanu',
        titleCode: req.param('titlecode')
    });
});

module.exports = router;

