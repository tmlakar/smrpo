const express = require("express");
const router = express.Router();
const ctrlUser = require("../controllers/users");
const ctrlAvtentikacija = require("../controllers/avtentikacija");
const ctrlHome = require("../controllers/home");
const ctrlProjects = require("../controllers/projects");
const ctrlAccount = require("../controllers/account");


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
router.delete("/users/:idUser", ctrlUser.userDelete);
//primer uporabe preverjanja avtentikacije:
//router.delete("/users/:idUser", avtentikacija, ctrlUser.userDelete);
router.get("/users/:idUser/edit-username", ctrlUser.userInfo);
router.put("/users/:idUser/edit-username", ctrlUser.userUpdateUsername);


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


/* Account */
router.get('/account/:idUser', ctrlAccount.userInfo);
router.put('/account/:idUser', ctrlAccount.userUpdate);
router.put('/account/pass/:idUser', ctrlAccount.userUpdatePass);


module.exports = router;
