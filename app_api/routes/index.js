const express = require("express");
const router = express.Router();
const ctrlUser = require("../controllers/users");
const ctrlAdmin = require("../controllers/admins");

/* Users */

// branje seznama userjev
router.get("/users", ctrlUser.usersList);

// dodajanje novega userja
router.post("/users", ctrlUser.userCreate);

//branje dolocenega userja
router.get("/users/:idUser", ctrlUser.userInfo);

//posodabljanje dolocenega userja
router.put("/users/:idUser", ctrlUser.userUpdate);

//brisanje userja
router.delete("/users/:idUser", ctrlUser.userDelete);



/* Admins */



module.exports = router;