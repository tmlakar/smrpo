var express = require('express');
const { route } = require('express/lib/application');

var router = express.Router();

var ctrlHome = require("../controllers/home");
router.get('/', ctrlHome.seznam);



module.exports = router;
