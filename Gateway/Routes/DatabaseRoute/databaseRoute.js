var express = require('express');
var request = require('request');
var router = express.Router();

router.post('/login', function(req, res) {
    //send POST request to the database microservice
    var clientServerOptions = {
        uri: 'http://localhost:5000/api/login',
        body: JSON.stringify(req.body),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    console.log("Request sent");
    request(clientServerOptions, function (error, response) {
        res.send("Response: " + response.body);
        return;
    });
});

router.post('/register', function(req, res) {
    res.send('Register username: ' + req.body.username + " password: " + req.body.password);
});

module.exports = router;
