var passport = require('passport');
var LocalStrategy = require('passport-local');

var LocallyDB = require('locallydb');
var db = new LocallyDB('./.data');
var users = db.collection('users');

var crypto = require('crypto');

function hash (password) {
    return crypto.createHash('sha512').update(password).digest('hex');
}

passport.use(new LocalStrategy(function (username, password, done) {
    var user = users.where({ username: username, passwordHash: hash(password) }).items[0];

    if (user) {
        done(null, user);
    } else {
        done(null, false);
    }
}));

passport.serializeUser(function (user, done) {
    done(null, user.cid);
});

passport.deserializeUser(function (cid, done) {
    done(null, users.get(cid));
});

var router = require('express').Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true })); // Login Page
router.use(bodyParser.json()); // API
router.use(require('cookie-parser')());
router.use(require('express-session')({
    secret: 'p7r6uktdhmcgvho8o6e5ysrhxmcgjfkot7r6elu5dtjt7lirfyj',
    resave: false,
    saveUninitialized: true
}));
router.use(passport.initialize());
router.use(passport.session());

router.get('/login', function (req, res) {
    res.render('login');
});

router.post('/signup', function (req, res, next) {
    if (users.where({ username: req.body.username }).items.length === 0) {
        var user = {
            fullname: req.body.fullname,
            email: req.body.email,
            username: req.body.username,
            passwordHash: hash(req.body.password),
            following: []
        };

        var userId = users.insert(user);

        req.login(users.get(userId), function (err) {
            if (err) return next(err);
            res.redirect('/');
        });
    } else {
        res.redirect('/login');
    }
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login');
});

function loginRequired (req, res, next) {
    if (req.isAuthenticated()) {
        next(); 
    } else {
        res.redirect('/login');
    }
}

function makeUserSafe (user) {
    var safeUser = {};

    var safeKeys = ['cid', 'fullname', 'email', 'username', 'following'];

    safeKeys.forEach(function (key) {
        safeUser[key] = user[key];
    });
    return safeUser;
}

router.get('/api/users', function (req, res) {
    res.json(users.toArray().map(makeUserSafe));
});

router.post('/api/follow/:id', function (req, res) {
    var id = parseInt(req.params.id, 10);

    if (req.user.following.indexOf(id) < 0) {
        req.user.following.push(id);
        users.update(req.user.cid, req.user);
    }
    res.json(makeUserSafe(req.user));
});

router.post('/api/unfollow/:id', function (req, res) {
    var id = parseInt(req.params.id, 10);
    var pos = req.user.following.indexOf(id);
    if (pos > -1) {
        req.user.following.splice(pos, 1);
        users.update(req.user.cid, req.user);
    }
    res.json(makeUserSafe(req.user));
});

exports.routes = router;
exports.required = loginRequired;
exports.safe = makeUserSafe;
