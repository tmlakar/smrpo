const mongoose = require("mongoose");
const User = mongoose.model("User");

const usersList = (req, res) => {
    User.find().exec(function (err, seznam) {
        if (err) {
            console.log(err);
            res.status(404).json({"sporočilo": "Napaka pri poizvedbi: " + err});
        } else {
            res.status(200).json(seznam);
        }
    });
  };

  const userCreate = (req, res) => {
    res.status(200).json({ status: "uspešno" });
  };

  const userInfo = (req, res) => {
    res.status(200).json({ status: "uspešno" });
  };

  const userUpdate = (req, res) => {
    res.status(200).json({ status: "uspešno" });
  };

  const userDelete = (req, res) => {
    res.status(200).json({ status: "uspešno" });
  };



module.exports = {
    usersList,
    userCreate,
    userInfo,
    userUpdate,
    userDelete

};