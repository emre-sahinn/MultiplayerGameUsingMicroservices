var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.send('GET ile /game isteği yapıldı.');
});

router.post('/', function(req, res) {
    res.send('POST ile /game isteği yapıldı.');
});

module.exports = router;