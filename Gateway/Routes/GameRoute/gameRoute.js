var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/serverList', function(req, res) {
    //send POST request to the database microservice
    var clientServerOptions = {
        uri: 'http://localhost:5001/api/server/list',
        body: JSON.stringify(req.body),
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    console.log("serverList request sent");
    request(clientServerOptions, function (error, response) {
        res.send(response.body);
        return;
    });
});

router.post('/play', function(req, res) {
    //hangi sunucuya girecegini secsin
});

module.exports = router;