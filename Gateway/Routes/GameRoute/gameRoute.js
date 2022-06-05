var express = require('express');
var router = express.Router();

router.post('/1', function(req, res) {
    res.send('POST ile /1 isteği yapıldı.');
});

router.post('/2', function(req, res) {
    res.send('POST ile /2 isteği yapıldı.');
});

module.exports = router;