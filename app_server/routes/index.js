var express = require('express');
const { route } = require('express/lib/application');

var router = express.Router();

// login
var ctrlLogin = require("../controllers/home");
router.get('/', ctrlLogin.prikaz);
router.post('/', ctrlLogin.prijava);

//home page
var ctrlHome = require("../controllers/land");
router.get('/home', ctrlHome.prikaz);


// users
var ctrlUsers = require("../controllers/users");
router.get('/users', ctrlUsers.seznam);
router.get('/users/:id', ctrlUsers.podrobnostiUser);
router.post('/users/:id', ctrlUsers.posodobiUserja);
router.get('/users/:id/izbrisi', ctrlUsers.pridobiUserjaZaIzbris);
router.post('/users/:id/izbrisi', ctrlUsers.izbrisiUserja);
router
  .route('/users')
  .post(ctrlUsers.shraniUserja);
  


// projects
var ctrlProjects = require("../controllers/projects");
router.get('/projects', ctrlProjects.seznam);






module.exports = router;
