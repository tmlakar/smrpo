const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("User");

const registracija = (req, res) => {
    if (!req.body.name || !req.body.surname || !req.body.username || !req.body.email || !req.body.password || !req.body.role)
      return res.status(400).json({ sporočilo: "Zahtevani so vsi podatki." });
    const uporabnik = new User();
    uporabnik.name = req.body.name;
    uporabnik.surname = req.body.surname;
    uporabnik.username = req.body.username;
    uporabnik.email = req.body.email;
    uporabnik.role = req.body.role;
    uporabnik.nastaviGeslo(req.body.password);
    uporabnik.save((napaka) => {
      if (napaka) res.status(500).json(napaka);
      //tukaj manjka še da generiramo in odjemalcu vrnemo jwt žeton?
      else res.status(200).json();
    });
  };

  const prijava = (req, res) => {
    if (!req.body.username || !req.body.password)
      return res.status(400).json({ sporočilo: "Zahtevani so vsi podatki." });
    passport.authenticate("local", (napaka, uporabnik, informacije) => {
      if (napaka) return res.status(500).json(napaka);
      if (uporabnik) {
        //generiramo jwt žeton
        var zeton = uporabnik.generirajJwt();
        res.status(200).json({žeton: zeton}); //vrne žeton nazaj serverju
        } else res.status(401).json(informacije);
    })(req, res);
  };

  module.exports = {
    registracija,
    prijava,
  };
