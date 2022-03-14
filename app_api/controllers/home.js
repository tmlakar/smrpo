const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("User");


const vrniUporabnika = (req, res, pkOdgovor) => {
    if (req.payload && req.payload.username) {
      User.findOne({
        username: req.payload.username,
      }).exec((napaka, uporabnik) => {
        if (!uporabnik)
          return res.status(404).json({ sporočilo: "Ne najdem uporabnika." });
        else if (napaka) return res.status(500).json(napaka);
        pkOdgovor(req, res, uporabnik._id);
      });
    }
  };

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

module.exports = {
    vrniUporabnika,
    userInfo
  };