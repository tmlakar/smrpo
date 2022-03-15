const mongoose = require("mongoose");
const User = mongoose.model("User");

const usersList = (req, res) => {
    User.find().exec(function (err, users) {
        if (err) {
            console.log(err);
            res.status(404).json({"sporočilo": "Napaka pri poizvedbi: " + err});
        } else {
            res.status(200).json(users);
        }
    });
  };

const userCreate = (req, res) => {
      User.create({

        name: req.body.name,
        surname: req.body.surname,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        
    }, (napaka, user) => {
        if(napaka) {
            res.status(400).json(napaka);
        }  else {
            res.status(201).json(user);
        }
    }
  );
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
        user.role = req.body.role;

        user.save((napaka, user) => {
          if (napaka) {
            res.status(404).json(napaka);
          } else {
            res.status(200).json(user);
          }
        });
      });
  };

  const userDelete = (req, res) => {
    const { idUser } = req.params;
    if (idUser) {
      User.findByIdAndRemove(idUser).exec((napaka) => {
        if (napaka) {
          return res.status(500).json(napaka);
        }
        res.status(204).json(null);
      });
    } else {
      res.status(404).json({
        sporočilo: "Ne najdem uporabnika, idUser je obvezen parameter.",
      });
    }
  };



module.exports = {
    usersList,
    userCreate,
    userInfo,
    userUpdate,
    userDelete

};