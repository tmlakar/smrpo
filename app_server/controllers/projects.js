
var apiParametri = {
    streznik: "http://localhost:" + (process.env.PORT || 3000),
  };
  if (process.env.NODE_ENV === "production") {

  }
  const axios = require("axios").create({
    baseURL: apiParametri.streznik,
    timeout: 5000,
  });


  /* GET metoda (prikaz) - Seznam vseh ustvarjenih projektov (s strani admina) na /projects */

var seznam = (req, res) => {
  var tokenParts = req.cookies.authcookie['žeton'].split('.');
  var encodedPayload = tokenParts[1];
  //var rawPayload = window.atob(encodedPayload);
  var rawPayload = Buffer.from(encodedPayload, 'base64').toString('ascii');
  var user = JSON.parse(rawPayload);

  var successfullyAdded = req.query.add;
  var uspesnoDodano = false;
  if (successfullyAdded == "successfully added") {
    uspesnoDodano = true;
  }

  
    axios
      .get (apiParametri.streznik + '/api/projects', {})
      .then((odgovor) => {
          res.render('projects', {
          projects: odgovor.data,
          successfullyAddedProject: uspesnoDodano,
          
        });
      });
};

/* GET metoda (prikaz) - Prikaz informacij projekta na /projects/unikaten_id_projekta */

var podrobnostiProject = (req, res) => {
  var tokenParts = req.cookies.authcookie['žeton'].split('.');
  var encodedPayload = tokenParts[1];
  //var rawPayload = window.atob(encodedPayload);
  var rawPayload = Buffer.from(encodedPayload, 'base64').toString('ascii');
  var user = JSON.parse(rawPayload);
    var projectId = req.params.id;
    var napaka = req.query.error;
    var jeNapaka = false;
    if(napaka == "napaka"){
      jeNapaka = true;
    }
    axios
        .get (apiParametri.streznik + '/api/projects/' + projectId)
        .then((odgovor) => {
          var hasProductOwner = false;
          var hasTeamMembers = false;
          var hasScrumMaster = false;
          var collaborators = odgovor.data.collaborators;
          for (var i = 0; i < collaborators.length; i++) {
            if (collaborators[i].project_role == "Product Manager") {
              hasProductOwner = true;
            }
            if (collaborators[i].project_role == "Team Member") {
              hasTeamMembers = true;
            }
            if (collaborators[i].project_role == "Scrum Master") {
              hasScrumMaster = true;
            }
          }
            res.render('project-edit',
            { name: odgovor.data.name,
              info: odgovor.data.info,
              collaborators: odgovor.data.collaborators,
              id: odgovor.data._id,
              napaka: jeNapaka,
              hasProductOwner: hasProductOwner,
              hasScrumMaster: hasScrumMaster,
              hasTeamMembers: hasTeamMembers
            });
        });
  };

/* GET metoda (prikaz) - Ustvarjanje novega projekta (s strani admina) na /project-new */

  var prikaz = (req, res) => {
    var tokenParts = req.cookies.authcookie['žeton'].split('.');
  var encodedPayload = tokenParts[1];
  var rawPayload = Buffer.from(encodedPayload, 'base64').toString('ascii');
  var user = JSON.parse(rawPayload);
  var vloga = user.role;
  var layout1 = 'layout';
  if (vloga == 'user') {
    layout1 = 'layout-user';
  }
    var x = req.query.error;
    var isError = true;
    if(x == "napaka"){
      isError = true;
    }
    else{
      isError = false;
    }
  res.render('project-new', {
    napaka: isError,
    layout: layout1
  });
};

  /* POST metoda - Ustvarjanje novega projekta (s strani admina) na /project-new */

  const createProject = (req, res) => {
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
        url: apiParametri.streznik + '/api/project-new',
        data: {
          name: req.body.name,
          info: req.body.info
        }
      }).then(() => {
        var string = "successfully added";
        res.redirect('/projects?add=' + string);
      }).catch((napaka) => {
        var string = "napaka";
      res.redirect('/project-new?error=' + string);

      });
  }
  };

  /* PUT metoda - Posodobitev informacij projekta (s strani admina) na /projects/unikaten_id_projekta */

  const posodobiProject = (req, res) => {

    var projectId = req.params.id;

    if (!req.body.name) {
      res.render('error', {
           message: "Prišlo je do napake.",
           error: {
                status: "Niste izpolnili vseh zahtevanih polj!",
                stack: "Pri urejanju članka niste izpolnili enega izmed polj: name, Prosimo izpolnite manjkajoča polja."
           }
      });
    } else {
    axios({
      method: 'put',
      url: apiParametri.streznik + '/api/projects/' + projectId,
      data: {
           name: req.body.name,
           info: req.body.info
       }
      })
      .then(() => {
          var string = "success";
          res.redirect('/projects/' + projectId + '?editp=' + string);
      }).catch((error) => {
        var string = "napaka";
        res.redirect('/projects/' + projectId + '?error=' + string);
      });
    }
  };

const prikaziNapako = (req, res, napaka) => {
    let naslov = "Nekaj je šlo narobe!";
    let vsebina = napaka.response.data["sporočilo"] ?
        napaka.response.data["sporočilo"] : (napaka.response.data["message"] ?
            napaka.response.data["message"] : "Nekaj nekje očitno ne deluje.");
    res.render('error', {
        title: naslov,
        vsebina: vsebina
    });
};



module.exports = {
    seznam,
    prikaz,
    podrobnostiProject,
    posodobiProject,
    createProject,
};
