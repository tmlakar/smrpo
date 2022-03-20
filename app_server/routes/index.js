var express = require('express');
const { route } = require('express/lib/application');

var router = express.Router();

// login
var ctrlLogin = require("../controllers/home");
router.get('/', ctrlLogin.prikaz);
router.post('/', ctrlLogin.prijava);

//home page
var ctrlHome = require("../controllers/land");
// tale dela z uporabniskimi podatki
//router.get('/home', ctrlHome.podrobnostiUser);
// tale dela z cookiji -> torej ce je posodobitev, se ne bo posodobil, se bo mogu najprej odjavit pa prijavit spet
router.get('/home', ctrlHome.prikaz);
router.get('/logout', ctrlHome.logout);


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
router.post('/projects', ctrlProjects.createProject);
router.get('/projects/:id', ctrlProjects.podrobnostiProject);
router.post('/projects/:id', ctrlProjects.posodobiProject);


// account
var ctrlAccount = require("../controllers/account");
// ista fora
// router.get('/account', ctrlAccount.podrobnostiUser);
router.get('/account', ctrlAccount.prikaz);
router.post('/account', ctrlAccount.posodobiUserja);

module.exports = router;
