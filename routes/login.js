var express = require('express');
var router = express.Router();
var auth = require('./../modules/auth');

router.get('/', function(req, res, next) {
    res.render('pages/content', {
        title: 'Login',
        functioName: 'LOGIN',
        layout: 'loginlayout'
    });
});

// router.post('/', function(req, res, next) {
//     var passport = req.app.get('passport');
//     passport.authenticate('local', { failureRedirect: '/login?f=1', successRedirect: '/dashboard' });
// });

router.post('/signup', function(req, res, next) {
    auth.createUser(req, res, function(data) {
        var viewData = {
            title: 'Signup page',
            message: data.message,
        }
        res.render('pages/loginSignup', viewData);
    });
});

module.exports = router;
