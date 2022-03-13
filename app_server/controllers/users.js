
var apiParametri = {
    streznik: "http://localhost:" + (process.env.PORT || 3000),
  };
  if (process.env.NODE_ENV === "production") {
    
  }
  const axios = require("axios").create({
    baseURL: apiParametri.streznik,
    timeout: 5000,
  });


var users = require("../models/user.json");


/* Seznam vseh uporabnikov */
var seznam = (req, res) => {
    
  axios
      .get (apiParametri.streznik + '/api/users', {})
      .then((odgovor) => {
          res.render('users', {
          users: odgovor.data});
      });
};


/* Prikazi stran za dodajanje novega uporabnika */
const dodajanjeUserja = (req, res) => {
  res.render('user-new');
};

/* POST metoda - dodajanje novega uporabika */
const shraniUserja = (req, res) => {
  if (!req.body.name || !req.body.surname || !req.body.username || !req.body.email || !req.body.password || !req.body.role) {
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
      url: '/api/user-new',
      data: {
        name: req.body.name,
        surname: req.body.surname,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
      }
    }).then(() => {
      res.redirect('/users', );
    }).catch((napaka) => {
      prikaziNapako(req, res, napaka);
    });
}
};

/* Prikazi stran s podrobnostmi uporabnika */
var podrobnostiUser = (req, res) => {
  var userId = req.params.id;
  axios
      .get (apiParametri.streznik + '/api/users/' + userId)
      .then((odgovor) => {
          res.render('user-edit', odgovor.data);
      });
};

/* Posodobitev uporabnika */


const posodobiUserja = (req, res) => {
  
  var userId = req.params.id;

  if (!req.body.name || !req.body.surname || !req.body.username || !req.body.email || !req.body.password || !req.body.role) {
    res.render('error', {
         message: "Prišlo je do napake.",
         error: {
              status: "Niste izpolnili vseh zahtevanih polj!",
              stack: "Pri urejanju članka niste izpolnili enega izmed polj: name, surname, username, email, password, role. Prosimo izpolnite manjkajoča polja."
         }
    });
  } else {
  axios({
    method: 'put',
    url: apiParametri.streznik + '/api/users/' + userId,
    data: {
         name: req.body.name,
         surname: req.body.surname,
         username: req.body.username,
         email: req.body.email,
         password: req.body.password,
         role: req.body.role
     }
    })
    .then(() => {
        res.redirect('/user' + userId);
    }).catch((napaka) => {
    prikaziNapako(req, res, napaka);
    });
  }
};

/* Brisanje uporabnika */

const izbrisiUserja = (req, res) => {
  console.log(req.params.id);
  var userId = req.params.id;
  axios
       .delete(apiParametri.streznik + '/api/users/' + userId)
       .then(() => {
            res.redirect('/users', odgovor.data);
       })
       .catch((napaka) => {
            prikaziNapako(req, res, napaka);
       });

};



module.exports = {
    seznam,
    podrobnostiUser,
    dodajanjeUserja,
    shraniUserja,
    izbrisiUserja,
    posodobiUserja
};


