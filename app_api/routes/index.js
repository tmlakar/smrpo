const express = require("express");
const router = express.Router();
const ctrlUser = require("../controllers/users");
const ctrlAvtentikacija = require("../controllers/avtentikacija");
const ctrlHome = require("../controllers/home");
const ctrlProjects = require("../controllers/projects");

const jwt = require("express-jwt");
const avtentikacija = jwt({
  secret: process.env.JWT_GESLO,
  userProperty: "payload",
  algorithms: ["HS256"],
});


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
router.delete("/users/:idUser", ctrlUser.userDelete);

/* Projects */
/* List of projects */
router.get("/projects", ctrlProjects.projectsList);
/* Adding new project */
router.post("/project-new", ctrlProjects.projectCreate);
/* Info of a particular project */
router.get("/projects/:idProject", ctrlProjects.projectInfo);
/* Updating a particular project */
router.put("/projects/:idProject", ctrlProjects.projectUpdate);

/* Avtentikacija */
router.post("/registracija", ctrlAvtentikacija.registracija);
router.post("/prijava", ctrlAvtentikacija.prijava);

/* Home page */
router.get("/home", ctrlHome.izpisiPodatke);


module.exports = router;
