const jwt_decode = require("jwt-decode");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user")

//register
router.post("/register", async (req, res) => {
  try {
      console.log(req.body);
    const checkUser = await User.findOne({ username: req.body.username });
    if (checkUser) {
      console.log("user already exists");
      return res.status(400).json("user already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
    //create new user
    const newUser = new User({
      username: req.body.username,
      password: hashedPassword,
    });

    //save user and respond
    const user = await newUser.save();

    const accessToken = jwt.sign(
        {
          id: user._id,
          username: user.username
        }, "microserviceapp", //secret key
        { expiresIn: "3d" },
      );

    res.status(200).json(accessToken);
  } catch (err) {
      console.log(err);
    res.status(500).json(err)
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    console.log(req.body);
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).json("user not found");

    }

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) {
      return res.status(400).json("wrong password");
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        username: user.username
      }, "microserviceapp", //secret key
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, accessToken });

  } catch (err) {
    console.log(err);
    res.status(500).json(err)
  }
});

//Check token 
router.post("/checkToken", async (req, res) => {
  console.log("checking token: " + req.body.token)
  try {
    console.log(req.body);
    jwt.verify(req.body.token, "microserviceapp", function(err, decoded) {
      if (err) {
        return res.status(401).json(err)
      }
  });

  var decoded = jwt_decode(req.body.token);
  console.log(decoded);
  res.send(decoded.username);
  } catch (err) {
    console.log(err);
    res.status(500).json(err)
  }
});

module.exports = router;