
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
    axios
      .get (apiParametri.streznik + '/api/projects', {})
      .then((odgovor) => {
          res.render('projects', {
          projects: odgovor.data});
      });
};

/* Details project */
var podrobnostiProject = (req, res) => {
    var projectId = req.params.id;
    axios
        .get (apiParametri.streznik + '/api/projects/' + projectId)
        .then((odgovor) => {
            res.render('project-edit', odgovor.data);
        });
  };


  const createProject = (req, res) => {
    if (!req.body.name) {
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
          name: req.body.name
        }
      }).then(() => {
        res.redirect('/projects', );
      }).catch((napaka) => {
        prikaziNapako(req, res, napaka);
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
           name: req.body.name
       }
      })
      .then(() => {
          res.redirect('/projects');
      }).catch((napaka) => {
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
    podrobnostiProject,
    posodobiProject,
    createProject
};
