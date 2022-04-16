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

router.get('/users/:id/izbrisi-permanent', ctrlUsers.pridobiUserjaZaIzbrisPermanent);
router.post('/users/:id/izbrisi-permanent', ctrlUsers.izbrisiUserjaPermanent);

router.get('/user-new', ctrlUsers.dodaj);
router.post('/user-new', ctrlUsers.shraniUserja);
router.get('/users/:id/edit-username', ctrlUsers.pridobiUserjaZaUsernamePosodobitev);
router.post('/users/:id/edit-username', ctrlUsers.posodobiUsername);
router.get('/users/:id/edit-password', ctrlUsers.pridobiUserjaZaPosodobitevGesla);
router.post('/users/:id/edit-password', ctrlUsers.posodobitevGesla);



// projects
var ctrlProjects = require("../controllers/projects");
router.get('/projects', ctrlProjects.seznam);
router.get('/project-new', ctrlProjects.prikaz);
router.post('/project-new', ctrlProjects.createProject);
//router.get('/projects/:id', ctrlProjects.podrobnostiProject);
router.post('/projects/:id', ctrlProjects.posodobiProject);

// collaborators add/edit/remove
var ctrlCollaborators = require("../controllers/collaborators");
router.get('/projects/:id', ctrlCollaborators.availableCollaboratorsList);
//router.get('/projects/:id', ctrlCollaborators.podrobnostiProject);
router.post('/projects/:id/add-collaborators', ctrlCollaborators.addProjectCollaborators);
router.post('/projects/:id/edit-collaborator/:idC', ctrlCollaborators.editProjectCollaboratorRole);
router.post('/projects/:id/delete-collaborator/:idC', ctrlCollaborators.deleteProjectCollaborator);

//my tasks
var ctrlMyTasks = require("../controllers/mytasks");
router.get('/mytasks', ctrlMyTasks.prikaz);
router.get('/mytasks/accept/:projectId/:storyId/:taskId', ctrlMyTasks.acceptTask);
router.get('/mytasks/decline/:projectId/:storyId/:taskId', ctrlMyTasks.declineTask);
router.get('/mytasks/finish/:projectId/:storyId/:taskId', ctrlMyTasks.finishTask);
/* Project -> Sprint -> User stories */
var ctrlProject = require("../controllers/project");
//router.get('/project', ctrlProject.prikaz);

//osnovna stran za sprinte in product backlog
router.get('/project/:id', ctrlProject.prikaz);
//Sprints
var ctrlSprint = require("../controllers/sprints");
router.get('/sprint-new/:id', ctrlSprint.prikaz);
router.post('/sprint-new/:id', ctrlSprint.sprintCreate);
router.get("/sprint-edit/:id", ctrlSprint.prikazEdit);
router.post("/sprints/:projectId/sprint-edit/:sprintId", ctrlSprint.posodobiInprocessSprint)
router.post("/sprints/:projectId/sprint-edit-all/:sprintId", ctrlSprint.posodobiFutureSprint)
router.post("/sprints/:projectId/delete-sprint/:sprintId", ctrlSprint.deleteSprint);




/* User stories a.k.a uporabniska zgodba */
var ctrlUserStories = require("../controllers/userStories");
/* Adding a new user story to a project */
router.get('/project/:id/new-user-story', ctrlUserStories.podrobnostiProject);
router.post('/project/:id/new-user-story', ctrlUserStories.addNewUserStory);
/* Updating basic info */
router.post("/project/:id/userStory/:idStory/edit-info", ctrlUserStories.updateUserStoryInfo);
/* Adding subtasks */
router.post("/project/:id/userStory/:idStory/add-subtask", ctrlUserStories.addSubtask);
/* Updating subtaks owner */
router.post("/project/:id/userStory/:idStory/subtask/:idSubtask/edit-subtask-owner", ctrlUserStories.addSubtaskOwner);
/* Remove subtask */
router.post("/project/:id/userStory/:idStory/subtask/:idSubtask/delete", ctrlUserStories.removeSubtask);
/* Edit subtask */
router.post("/project/:id/userStory/:idStory/subtask/:idSubtask/edit-subtask", ctrlUserStories.editSubtask);
/* Add acceptance test */
router.post("/project/:id/userStory/:idStory/add-test", ctrlUserStories.addAcceptanceTest);
/* Add comment / footnote */
router.post("/project/:id/userStory/:idStory/add-comment", ctrlUserStories.addComment);
/* Add a flag */
router.post("/project/:id/userStory/:idStory/add-flag", ctrlUserStories.addFlag);
/* Update userStory owner */
router.post("/project/:id/userStory/:idStory/edit-owner", ctrlUserStories.updateOwner);
/* Delete userStory */
router.post("/project/:id/userStory/:idStory/delete", ctrlUserStories.deleteStory);
/* add to sprint */
router.post("/project/:id/userStory/:idStory/add-to-sprint", ctrlUserStories.addToSprint);
/* add size */
router.post("/project/:id/userStory/:idStory/add-size", ctrlUserStories.addSize);


router.get("/project/:id/sprint/:sprintId/tasks", ctrlUserStories.podrobnostiProjectSprint);




/* Publications */
var ctrlPublications = require("../controllers/publications");
router.get('/project/:id/project-wall', ctrlPublications.podrobnostiProject);
router.get('/project/:id/new-publication', ctrlPublications.podrobnostiProjectNewPublication);
router.post('/project/:id/new-publication', ctrlPublications.addNewPublication);
router.post('/project/:id/publications/:idPublication/new-comment', ctrlPublications.addCommentToPublication);
// delete
router.post('/project/:id/publication/:idPublication/remove', ctrlPublications.deletePublication);
router.post('/project/:id/publication/:idPublication/comment/:idComment', ctrlPublications.removeComment);




// account

var ctrlAccount = require("../controllers/account");
router.get('/account', ctrlAccount.prikaz);
router.post('/account', ctrlAccount.posodobiUserja);
router.get('/account/edit-password', ctrlAccount.prikaz2);
router.post('/account/edit-password', ctrlAccount.posodobiGeslo);

router.get('/account/edit-username', ctrlAccount.prikaz3);
router.post('/account/edit-username', ctrlAccount.posodobiUsername);


module.exports = router;
