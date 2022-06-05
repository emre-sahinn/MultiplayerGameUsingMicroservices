var express = require('express');
var request = require('request');
var router = express.Router();

router.post('/login', function(req, res) {
    console.log(req.body);
    //send POST request to the database microservice
    var clientServerOptions = {
        uri: 'http://localhost:5000/api/auth/login',
        body: JSON.stringify(req.body),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    console.log("login request sent");
    request(clientServerOptions, function (error, response) {
        const token = JSON.parse(response.body).accessToken;
        if(token){
            res.send(JSON.parse(response.body).accessToken);
        }else{
            res.status(404).send(response.body);
        }
        return;
    });
});

router.post('/register', function(req, res) {
    console.log(req.body);
    //send POST request to the database microservice
    var clientServerOptions = {
        uri: 'http://localhost:5000/api/auth/register',
        body: JSON.stringify(req.body),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    console.log("register request sent");
    request(clientServerOptions, function (error, response) {
        res.send(response.body);
        return;
    });
});

module.exports = router;
