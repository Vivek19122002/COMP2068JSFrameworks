var express = require('express');
var router = express.Router();

// code for home page
router.get('/', (req, res) => {
    res.render('home', { title: 'Home', layout: 'layout' });
});

// code for about Me page
router.get('/about', (req, res) => {
    res.render('about', { title: 'About Me', layout: 'layout' });
});

// code for projects page
router.get('/project', (req, res) => {
    res.render('project', { title: 'Projects', layout: 'layout' });
});

// contact me page
router.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact Me', layout: 'layout' });
});

module.exports = router;
