// Create web server using Express.js
// Use Mongoose to store data in MongoDB
// Use Passport.js to authenticate user login
// Use Bcrypt.js to hash passwords
// Use Connect-Flash to display flash messages
// Use Handlebars.js as the template engine

// Load modules
var express = require('express');
var router = express.Router();
var passport = require('passport');
var Comment = require('../models/comment');
var Post = require('../models/post');
var User = require('../models/user');

// GET /comments
// Display all comments
router.get('/', function(req, res, next) {
    Comment.find().populate('author').exec(function(err, comments) {
        if (err) {
            return next(err);
        }
        res.render('comments/index', { comments: comments });
    });
});

// GET /comments/new
// Display form for adding a new comment
router.get('/new', function(req, res, next) {
    if (req.isAuthenticated()) {
        res.render('comments/new', { message: req.flash('message') });
    } else {
        res.redirect('/users/login');
    }
});

// POST /comments
// Process form for adding a new comment
router.post('/', function(req, res, next) {
    if (req.isAuthenticated()) {
        var comment = new Comment({
            content: req.body.content,