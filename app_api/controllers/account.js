const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("User");

const userInfo = (req, res) => {
    
    User.findById(req.params.idUser).exec((napaka, user) => {
      if (!user) {
        return res
          .status(404)
          .json({
            sporočilo:
              "Ne najdem uporabnika s podanim enoličnim identifikatorjem idUser.",
          });
      } else if (napaka) {
        return res.status(500).json(napaka);
      }
      res.status(200).json(user);
    });
  };

  const userUpdate = (req, res) => {
    if (!req.params.idUser) {
      return res.status(404).json({
        sporočilo: "Ne najdem uporabnika, idUser je obvezen parameter.",
      });
    }
    User.findById(req.params.idUser)
      .exec((napaka, user) => {
        if (!user) {
          return res.status(404).json({ sporočilo: "Ne najdem uporabnika." });
        } else if (napaka) {
          return res.status(500).json(napaka);
        }
        
        user.name = req.body.name;
        user.surname = req.body.surname;
        user.username = req.body.username;
        user.email = req.body.email;
        console.log(user.name, user.surname, user.username, user.email)
        user.save((napaka, user) => {
          if (napaka) {
            res.status(404).json("Nekaj je narobe.");
          } else {
            res.status(200).json(user);
          }
        });
      });
  };

  module.exports = {
    userInfo,
    userUpdate
  };