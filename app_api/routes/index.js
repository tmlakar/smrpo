const express = require("express");
const router = express.Router();
const ctrlUser = require("../controllers/users");
const ctrlAvtentikacija = require("../controllers/avtentikacija");
const ctrlHome = require("../controllers/home");
const ctrlProjects = require("../controllers/projects");
const ctrlAccount = require("../controllers/account");
const ctrlCollaborators = require("../controllers/collaborators");
const ctrlSprints = require("../controllers/sprints");
const ctrlUserStories = require("../controllers/userStories");

const jwt = require("express-jwt");
const avtentikacija = jwt({
  secret: process.env.JWT_GESLO,
  userProperty: "payload",
  algorithms: ["HS256"],
});

const avtorizacija = (req,res,next) => {
  const token = req.cookies.authcookie;
  console.log("dobim cookie", token)
  if(!token){
    return res.sendStatus(403);
  }
  try{
    //če imamo žeton moramo preveriti token da pridobimo podatke
    const data = jwt.verify(token, process.env.JWT_GESLO);
    req.userId = data.id;
    req.userRole = data.role;
    return next();
  } catch {
    return res.sendStatus(403);
  }
};


/* Users */
// branje seznama userjev
router.get("/users", ctrlUser.usersList);
// dodajanje novega userja
router.post("/user-new", ctrlUser.userCreate);
//branje dolocenega userja
router.get("/users/:idUser", ctrlUser.userInfo);
//posodabljanje dolocenega userja
router.put("/users/:idUser", ctrlUser.userUpdate);
//brisanje userja
router.put("/users/:idUser/delete", ctrlUser.userDelete);
router.delete("/users/:idUser", ctrlUser.userDeletePermanent);
//primer uporabe preverjanja avtentikacije:
//router.delete("/users/:idUser", avtentikacija, ctrlUser.userDelete);
router.get("/users/:idUser/edit-username", ctrlUser.userInfo);
router.put("/users/:idUser/edit-username", ctrlUser.userUpdateUsername);

router.get("/users/:idUser/edit-password", ctrlUser.userInfo);
router.put("/users/:idUser/edit-password", ctrlUser.userUpdatePassword);


/* Projects */
/* List of projects */
router.get("/projects", ctrlProjects.projectsList);
router.delete("/project/:idProject/delete", ctrlProjects.deleteProject);
/* Adding new project */
router.post("/project-new", ctrlProjects.projectCreate);
/* Info of a particular project */
router.get("/projects/:idProject", ctrlProjects.projectInfo);
/* Updating a particular project */
router.put("/projects/:idProject", ctrlProjects.projectUpdate);
router.delete("/projects/:idProject/delete", ctrlProjects.deleteProject);


/* Collaborators on a project */
/* Adding collaborators */
router.post("/projects/:idProject/add-collaborators", ctrlCollaborators.addCollaboratorToAProject);
router.get("/projects/:idProject/collaborator/:idCollaborator", ctrlCollaborators.collaboratorInfo);
/* Updating their roles */
router.put("/projects/:idProject/edit-collaborator/:idCollaborator", ctrlCollaborators.updateCollaboratorsRoleProject);
/* Deleting collaborators from a project */
router.delete("/projects/:idProject/delete-collaborator/:idCollaborator", ctrlCollaborators.deleteCollaborator);



/*Sprints */
/* Adding new sprint */
router.post("/sprint-new/:id", ctrlSprints.addSprintToAProject);
router.put("/sprints/:idProject/edit-sprint/:idSprint", ctrlSprints.updateSprintInProcess);
router.put("/sprints/:idProject/edit-sprint-all/:idSprint", ctrlSprints.updateFutureSprint);
router.delete("/sprints/:idProject/delete-sprint/:idSprint", ctrlSprints.deleteSprint);
/* User stories */
/* userStory info */
router.get("/projects/:idProject/userStory/:idUserStory", ctrlUserStories.userStoryInfo);
/* New user story */
router.post("/projects/:idProject/userStory-new", ctrlUserStories.addUserStoryToAProject);
/* Updating basic info */
router.put("/projects/:idProject/userStory/:idUserStory/edit-info", ctrlUserStories.updateUserStoryInfo);
/* Adding subtasks */
router.post("/projects/:idProject/userStory/:idUserStory/add-subtask", ctrlUserStories.updateUserStoryAddSubtask);
/* Updating subtaks owner */
router.put("/projects/:idProject/userStory/:idUserStory/subtask/:idSubtask/edit-subtask-owner", ctrlUserStories.updateUserStoryAddOwnerToSubtask);
/* Add acceptance test */
router.post("/projects/:idProject/userStory/:idUserStory/add-test", ctrlUserStories.updateUserStoryAddAcceptanceTests);
/* Add comment / footnote */
router.post("/projects/:idProject/userStory/:idUserStory/add-comment", ctrlUserStories.updateUserStoryAddAComment);
/* Add a flag */
router.post("/projects/:idProject/userStory/:idUserStory/add-flag", ctrlUserStories.updateUserStoryAddFlags);
/* Update userStory owner */
router.put("/projects/:idProject/userStory/:idUserStory/edit-owner", ctrlUserStories.updateUserStoryAddOwner);
/* Delete userStory */
router.delete("/projects/:idProject/userStory/:idUserStory/delete", ctrlUserStories.deleteUserStory);



/* Avtentikacija */
router.post("/registracija", ctrlAvtentikacija.registracija);
router.post("/prijava", ctrlAvtentikacija.prijava);

/* Home page */


/* Account */
router.get('/account/:idUser', ctrlAccount.userInfo);
router.put('/account/:idUser', ctrlAccount.userUpdate);
router.put('/account/pass/:idUser', ctrlAccount.userUpdatePass);
router.put('/account/username/:idUser', ctrlAccount.userUpdateUsername);



module.exports = router;
