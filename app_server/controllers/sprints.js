
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

  function isFutureDate(selected){
    var now = new Date();
    if (selected < now) {
      // selected date is in the past
      return false;
    }
    else{
      return true;
    }
  }
  /* POST metoda - Ustvarjanje novega sprinta */
  const sprintCreate = (req, res) => {
    var projectId = req.params.id;
    //prvi if = če so manjkajoči podatki
    if (!req.body.startDate || !req.body.endDate || !req.body.sprintSize) {
      res.render('error', {
           message: "Prišlo je do napake.",
           error: {
                status: "Niste izpolnili vseh zahtevanih polj!",
                stack: "Pri urejanju članka niste izpolnili enega izmed polj: name, surname, username, email, password, role. Prosimo izpolnite manjkajoča polja."
           }
      });
    }
    //preverimo, da je start date v prihodnosti
    else if(isFutureDate(new Date(req.body.startDate))==false) {
      console.log("napaka")
      var napaka = true;
      res.render('sprint-new', {
           napaka2: napaka
      });
    }
    //preverimo, da je end date v prihodnosti
    else if(isFutureDate(new Date(req.body.endDate))==false) {
      console.log("napaka")
      var napaka = true;
      res.render('sprint-new', {
           napaka3: napaka
      });
    }
    //preverimo, da sta oba datuma v prihodnosti
    else if(isFutureDate(new Date(req.body.startDate))==false && isFutureDate(new Date(req.body.endDate))==false) {
      console.log("napaka")
      var napaka = true;
      res.render('sprint-new', {
           napaka4: napaka
      });
    }
    //preverimo da je končni datum pred začetnim
    else if(req.body.startDate > req.body.endDate){
      var napaka = true;
      console.log(typeof req.body.sprintSize)
      res.render('sprint-new', {
           napaka1: napaka
      });
    }
    //če so datumi in velikost sprinta uredu, pošljemo na api in ustvarimo nov sprint
    else {
      //tukaj pride in dela, dobi podatke iz ustvarjanja novega sprinta in id projekta
      console.log("server")
      //številka sprinta -- če še ni nobenga da 1
      let steviloSprintov = 0;
      console.log(projectId)
      let URL1 = apiParametri.streznik + '/api/projects/' + projectId;
      const promise1 = axios.get(URL1);
      Promise.all([promise1]).then(function(values) {
        steviloSprintov = values[0].data.sprints.length;
        axios({
          method: 'post',
          url: apiParametri.streznik + '/api/sprint-new/' + projectId,
          data: {
            number: steviloSprintov+1,
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
      });
  }
  };



  module.exports = {
    prikaz,
    sprintCreate
};
