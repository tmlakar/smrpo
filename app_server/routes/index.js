var express = require('express');
const { route } = require('express/lib/application');

var router = express.Router();

// login
var ctrlLogin = require("../controllers/home");
router.get('/', ctrlLogin.seznam);

// users
var ctrlUsers = require("../controllers/users");
router.get('/users', ctrlUsers.seznam);

// projects
var ctrlProjects = require("../controllers/projects");
router.get('/projects', ctrlProjects.seznam);






module.exports = router;
