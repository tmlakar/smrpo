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
// router.get('/home', ctrlHome.podrobnostiUser);
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
router.get('/user-new', ctrlUsers.dodaj);
router.post('/user-new', ctrlUsers.shraniUserja);
router.get('/users/:id/edit-username', ctrlUsers.pridobiUserjaZaUsernamePosodobitev);
router.post('/users/:id/edit-username', ctrlUsers.posodobiUsername);
  


// projects
var ctrlProjects = require("../controllers/projects");
router.get('/projects', ctrlProjects.seznam);
router.get('/project-new', ctrlProjects.prikaz);
router.post('/project-new', ctrlProjects.createProject);
router.get('/projects/:id', ctrlProjects.podrobnostiProject);
router.post('/projects/:id', ctrlProjects.posodobiProject);

router.get('/projects/:id/add-collaborators', ctrlProjects.addCollaboratorsDisplay);
router.get('/projects/:id/edit-collaborator-roles', ctrlProjects.editCollaboratorsDisplay);
router.get('/projects/:id/delete-collaborators', ctrlProjects.deleteCollaboratorsDisplay);

// account
var ctrlAccount = require("../controllers/account");
// ista fora
// router.get('/account', ctrlAccount.podrobnostiUser);
router.get('/account', ctrlAccount.prikaz);
router.post('/account', ctrlAccount.posodobiUserja);
router.get('/account/edit-password', ctrlAccount.prikaz2);
router.post('/account/edit-password', ctrlAccount.posodobiGeslo);

module.exports = router;
