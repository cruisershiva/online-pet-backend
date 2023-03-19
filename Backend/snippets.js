const { Router } = require('express');
const path = require('path');
const router = Router();

router.get("/home", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/home.html'));
});

router.get("/signup", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/signup.html'));
});

router.get("/login", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/login.html'));
});


module.exports = router;