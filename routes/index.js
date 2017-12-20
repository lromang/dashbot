var express = require('express');
var router = express.Router();
var path = require('path');
var json2csv = require('json2csv'); //export -> csv
var fs = require('fs'); //read/write files
var db_conf = require('../db_conf');
// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
var flash = require('connect-flash');
router.use(flash());

// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
var bCrypt = require('bcrypt-nodejs');

router.use(expressSession({secret: 'mySecretKey', resave : false , saveUninitialized: false}));
router.use(passport.initialize());
router.use(passport.session());
var LocalStrategy = require('passport-local').Strategy;


/*
 * Login
 */
passport.use('login', new LocalStrategy({
        passReqToCallback : true
    },
    function(req, username, password, done) {
        // check in postgres if a user with username exists or not
        console.log(req.body)
        // username=req.body.username
        // password=req.body.password
        db_conf.db.oneOrNone('select * from usuarios where usuario = $1', [ username ]).then(function (user) {
          // Verify user
          if (!user){
            console.log('User Not Found with username ' + username);
            return done(null, false, req.flash('message', 'Usuario no registrado'));
          }
          // Verify password
          if (!isValidPassword(user ,password)){
            console.log('Contraseña no válida');
            return done(null, false, req.flash('message', 'Contraseña no válida'));
          }
          return done(null, user);
        }).catch(function (error) {
          console.log(error);
          return done(error);
        });
    }
));

var isValidPassword = function(user, password){
    return bCrypt.compareSync(password, user.contrasena);
};

// Passport needs to be able to serialize and deserialize users to support persistent login sessions
passport.serializeUser(function(user, done) {
    console.log('serializing user: ');
    console.log(user);
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    db_conf.db.one(' select * from usuarios where id = $1',[ id ]).then(function (user) {
        done (null, user);
    }).catch(function (error) {
      done(error);
      console.log(error);
    });
});

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
};

var isNotAuthenticated = function (req, res, next) {
  if (req.isUnauthenticated())
    return next();
  // if the user is authenticated then redirect him to the main page
  res.redirect('/principal');
};

// Generates hash using bCrypt
var createHash = function(password){
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

/*
 * ############################################
 *  Exec
 * ############################################
 */


/* Handle Login POST */
router.post('/login', passport.authenticate('login', {
  successRedirect: '/principal',
  failureRedirect: '/',
  failureFlash : true
}));

/* Handle Logout */
router.get('/signout', function(req, res) {
    req.logout();
    res.redirect('/');
});


/* GET login page. */
router.get('/', isNotAuthenticated, function(req, res, next) {
    res.render('login', { title: '', message : req.flash('message') });
});

router.get('/principal', isAuthenticated, function (req, res) {
    res.render('principal', { title: 'Landing', user: req.user, section: 'principal'});
});

module.exports = router;
