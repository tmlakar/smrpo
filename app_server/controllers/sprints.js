
var apiParametri = {
    streznik: "http://localhost:" + (process.env.PORT || 3000),
  };
  if (process.env.NODE_ENV === "production") {

  }
  const axios = require("axios").create({
    baseURL: apiParametri.streznik,
    timeout: 5000,
  });


  var prikaz = (req, res) => {
        res.render('sprint-new');
  };

  /* POST metoda - Ustvarjanje novega sprinta */
  const sprintCreate = (req, res) => {
    if (!req.body.name || !req.body.info) {
      res.render('error', {
           message: "Prišlo je do napake.",
           error: {
                status: "Niste izpolnili vseh zahtevanih polj!",
                stack: "Pri urejanju članka niste izpolnili enega izmed polj: name, surname, username, email, password, role. Prosimo izpolnite manjkajoča polja."
           }
      });
    } else {
      axios({
        method: 'post',
        url: apiParametri.streznik + '/api/sprint-new',
        data: {
          name: req.body.name,
          info: req.body.info
        }
      }).then(() => {
        res.redirect('/project', );
      }).catch((napaka) => {
        var string = "napaka";
      res.redirect('/sprint-new?error=' + string);

      });
  }
  };



  module.exports = {
    prikaz,

};
