
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
        var projectId = req.params.id;
        console.log(projectId);
        res.render('sprint-new');
  };

  /* POST metoda - Ustvarjanje novega sprinta */
  const sprintCreate = (req, res) => {
    var projectId = req.params.id;
    if (!req.body.startDate || !req.body.endDate || !req.body.sprintSize) {
      res.render('error', {
           message: "Prišlo je do napake.",
           error: {
                status: "Niste izpolnili vseh zahtevanih polj!",
                stack: "Pri urejanju članka niste izpolnili enega izmed polj: name, surname, username, email, password, role. Prosimo izpolnite manjkajoča polja."
           }
      });
    } else {
      //tukaj pride in dela, dobi podatke iz ustvarjanja novega sprinta in id projekta
      console.log("server")
      console.log(req.body.sprintSize)
      console.log(req.body.startDate)
      axios({
        method: 'post',
        url: apiParametri.streznik + '/api/sprint-new/' + projectId,
        data: {
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          sprintSize: req.body.sprintSize
        }
      }).then(() => {
        console.log("uspešno dodan")
        var string = "#sprints";
        res.redirect('/project/' + projectId + string);
      }).catch((napaka) => {
        var string = "napaka";
      res.redirect('/sprint-new/:id?error=' + string);

      });
  }
  };



  module.exports = {
    prikaz,
    sprintCreate
};
