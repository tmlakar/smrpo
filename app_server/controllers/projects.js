
var apiParametri = {
    streznik: "http://localhost:" + (process.env.PORT || 3000),
  };
  if (process.env.NODE_ENV === "production") {
    
  }
  const axios = require("axios").create({
    baseURL: apiParametri.streznik,
    timeout: 5000,
  });


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

/* Details project */
var podrobnostiProject = (req, res) => {
  var tokenParts = req.cookies.authcookie['žeton'].split('.');
  var encodedPayload = tokenParts[1];
  //var rawPayload = window.atob(encodedPayload);
  var rawPayload = Buffer.from(encodedPayload, 'base64').toString('ascii');
  var user = JSON.parse(rawPayload);
    var projectId = req.params.id;
    axios
        .get (apiParametri.streznik + '/api/projects/' + projectId)
        .then((odgovor) => {
            res.render('project-edit', odgovor.data);
        });
  };

  var prikaz = (req, res) => {
    var tokenParts = req.cookies.authcookie['žeton'].split('.');
  var encodedPayload = tokenParts[1];
  //var rawPayload = window.atob(encodedPayload);
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
        //prikaziNapako(req, res, napaka);
      });
  }
  };


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
      //   var string = "napaka";
      // res.redirect('/projects/' + projectId + '?error=' + string);
      prikaziNapako(req, res, napaka);
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
    createProject
};
