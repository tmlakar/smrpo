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
        user.email = req.body.email;
        
        user.save((napaka, user) => {
          if (napaka) {
            res.status(404).json("Nekaj je narobe.");
          } else {
            res.status(200).json(user);
          }
        });
      });
  };


  /* update password - param - old pass in new pass
  1. avtentikacija ce username pa pass sta ok
  2. shrani novo geslo */
  const userUpdatePass = (req, res) => {
    
    if (!req.body.username || !req.body.password || !req.body.newpassword)
    return res.status(400).json({ sporočilo: "Zahtevani so vsi podatki." });
  passport.authenticate("local", (napaka, uporabnik, informacije) => {
    if (napaka) return res.status(500).json(napaka);
    if (uporabnik) {
      // shranimo novo geslo
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
          
          user.nastaviGeslo(req.body.newpassword);
          user.save((napaka, user) => {
            if (napaka) {
              res.status(404).json("Nekaj je narobe.");
            } else {
              res.status(200).json(user);
              
            }
          });
        });
      } else res.status(401).json(informacije);
  })(req, res);

  };

  const userUpdateUsername = (req, res) => {
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
        
        
        user.username = req.body.username;
        
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
    userUpdate,
    userUpdatePass,
    userUpdateUsername
  };