var express = require('express');
var router = express.Router();

router.post('/login', function(req, res) {
    res.send('Login username: ' + req.body.username + " password: " + req.body.password);
});

router.post('/register', function(req, res) {
    res.send('Register username: ' + req.body.username + " password: " + req.body.password);
});

module.exports = router;
