var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var auth = require('./modules/auth.js');
var cookieParser = require('cookie-parser');
var ejsLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const moment = require('moment');
var flash = require('connect-flash');

var env = process.env.NODE_ENV || 'development',
    config = require('./config/config.' + env);

var index = require('./routes/index');
var user = require('./routes/user');
// var main = require('./routes/main');
var casemanager = require('./routes/casemanager');
var api = require('./routes/api/casemanager');
var post = require('./routes/post');
var postApi = require('./routes/api/post');
var createCase = require('./routes/createCase');
var createCaseApi = require('./routes/api/createCase');
var miscApi = require('./routes/api/misc');
var login = require('./routes/login');
var siteAdmin = require('./routes/siteAdmin');
var tools = require('./modules/tools');
var sessionManagement = require('./modules/sessionManagement');

var compression = require('compression');
var helmet = require('helmet');

var app = express();
app.use(flash());
app.use(fileUpload());
//
// Handlebars / HBS setup and configuration
//
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main');
app.use(ejsLayouts);

app.locals.moment = moment;
//
// App level variables initialization
//
// value to play with on request start and end
app.set('executionsThisTime', 0);
app.set('config', config);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());

app.use(helmet());
app.use(compression()); // Compress all routes

app.use(express.static(path.join(__dirname, 'public')));

// session will not work for static content
app.set('trust proxy', 1) // trust first proxy
app.use(sessionManagement);
// passport initialization
auth.initializeStrategy(passport);
app.use(passport.initialize());
app.use(passport.session())
app.set('passport', passport);

//
// General toolset
//
// on request start and on request end moved after static content
app.use(tools.onRequestStart);
app.use(tools.onRequestEnd);
// generate menu of the application
app.use('/user', tools.generateUserMenu);

const isWhiteListed = ( path, whiteList = [ 'login', 'autoLogin', 'create', 'details', 'review' ] ) => {
    let whiteListed = false;
    for(let i=0; i < whiteList.length; i++) {
        // this won't check authentication for login and autoLogin
        // add logic here if you want to check POST or GET method in login
        if( path.indexOf( whiteList[ i ] ) !== -1 ) {
            whiteListed = true;
        }
    }
    return whiteListed;
};

const authenticationMiddleware = (req, res, next) => {
    if( isWhiteListed(req.originalUrl) || req.isAuthenticated() ) {
        return next();
    }

    res.redirect('/login');
};
app.use( authenticationMiddleware );

var authentication = require('./modules/authentication');

// authentication
app.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/login', failureFlash: true
    }),
    function(req, res) {
        console.log(req.user);
        res.redirect('/');
    });
    

// Auto login
app.post('/autoLogin',
   authentication(),
    function(req, res) {
        res.redirect('/');
    });


app.get('/logout',
    function(req, res) {
        req.logout();
        res.redirect('/');
    });

//
// routing
//
app.use('/', index);
// app.use('/main', main);
// app.use('/user', function(req, res, next) {
//     console.log('I am here');
//     if (req.isAuthenticated()) {
//         next();
//     } else {
//         res.redirect('/login?m=not-logged-in');
//     }
// });

app.use('/user', user);
app.use('/siteAdmin', siteAdmin);
app.use('/login', login);
app.use('/api/case', api);
app.use('/case', casemanager);
app.use('/api/post', postApi);
app.use('/post', post);
app.use('/api/misc', miscApi);
app.use('/create', createCase);
app.use('/api/create', createCaseApi);

//
// error handling
//
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    // res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('pages/error', {layout: 'errorlayout'});
});

module.exports = app;
