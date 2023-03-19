const { Router } = require('express');
const path = require('path');
const router = Router();

router.get("/petfood", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/petfood.html'));
});

router.get("/pets", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/pets.html'));
});

router.get("/petmedicine", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/petmedicine.html'));
});

router.get("/pettoy", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/pettoy.html'));
});

module.exports = router;