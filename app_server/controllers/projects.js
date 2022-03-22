
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
    axios
      .get (apiParametri.streznik + '/api/projects', {})
      .then((odgovor) => {
          res.render('projects', {
          projects: odgovor.data});
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
            res.render('project-edit',
            { name: odgovor.data.name,
              info: odgovor.data.info,
              collaborators: odgovor.data.users,
              id: odgovor.data._id,
              napaka: jeNapaka
            });
        });
  };

/* GET metoda (prikaz) - Ustvarjanje novega projekta (s strani admina) na /project-new */

  var prikaz = (req, res) => {
    var tokenParts = req.cookies.authcookie['žeton'].split('.');
  var encodedPayload = tokenParts[1];
  var rawPayload = Buffer.from(encodedPayload, 'base64').toString('ascii');
  var user = JSON.parse(rawPayload);
    var x = req.query.error;
    var isError = true;
    if(x == "napaka"){
      isError = true;
    }
    else{
      isError = false;
    }
  res.render('project-new', {napaka: isError});
};

  /* PUT metoda - Ustvarjanje novega projekta (s strani admina) na /project-new */

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
        res.redirect('/projects', );
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
          res.redirect('/projects');
      }).catch((napaka) => {
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

/* Add project collaborators */

/* GET metoda (prikaz) - Dodajanje uporabnikov na projekt in določitev projektnih vlog 
  s strani admina na /projects/unikaten_id_projekta/add-collaborators */
  // prikazovanje vseh userjev z role user iz sistema, med katerimi lahko admin izbere
const addCollaboratorsDisplay = (req, res) => {
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
            res.render('project-add-collaborators',
            { name: odgovor.data.name,
              info: odgovor.data.info,
              collaborators: odgovor.data.users,
              id: odgovor.data._id,
              napaka: jeNapaka
            });
        });
  
}

/* PUT metoda - Dodajanje uporabnikov na projekt in določitev projektnih vlog 
s strani admina na /projects/unikaten_id_projekta/add-collaborators */

/* Edit project collaborators */

/* GET metoda (prikaz) - Urejanje uporabnikov oziroma njihovih projektnih vlog 
  s strani admina na /projects/unikaten_id_projekta/edit-collaborator-roles */
  const editCollaboratorsDisplay = (req, res) => {
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
              res.render('project-edit-collaborator-roles',
              { name: odgovor.data.name,
                info: odgovor.data.info,
                collaborators: odgovor.data.users,
                id: odgovor.data._id,
                napaka: jeNapaka
              });
          });
    
  }

  /* PUT metoda  - Urejanje uporabnikov oziroma njihovih projektnih vlog 
  s strani admina na /projects/unikaten_id_projekta/edit-collaborator-roles */

/* Delete project collaborators */

/* GET metoda (prikaz) - Brisanje uporabnikov s projekta
  s strani admina na /projects/unikaten_id_projekta/delete-collaborators */
  const deleteCollaboratorsDisplay = (req, res) => {
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
              res.render('project-delete-collaborators',
              { name: odgovor.data.name,
                info: odgovor.data.info,
                collaborators: odgovor.data.users,
                id: odgovor.data._id,
                napaka: jeNapaka
              });
          });
    
  }

  /* PUT metoda  - Brisanje uporabnikov s projekta
  s strani admina na /projects/unikaten_id_projekta/delete-collaborators */


module.exports = {
    seznam,
    prikaz,
    podrobnostiProject,
    posodobiProject,
    createProject,
    addCollaboratorsDisplay,
    editCollaboratorsDisplay,
    deleteCollaboratorsDisplay
};
