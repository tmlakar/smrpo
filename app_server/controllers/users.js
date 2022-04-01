var apiParametri = {
    streznik: "http://localhost:" + (process.env.PORT || 3000),
  };
  if (process.env.NODE_ENV === "production") {

  }
  const axios = require("axios").create({
    baseURL: apiParametri.streznik,
    timeout: 5000,
  });






/* Seznam vseh uporabnikov */
var seznam = (req, res) => {

  var tokenParts = req.cookies.authcookie['žeton'].split('.');
  var encodedPayload = tokenParts[1];
  //var rawPayload = window.atob(encodedPayload);
  var rawPayload = Buffer.from(encodedPayload, 'base64').toString('ascii');
  var user = JSON.parse(rawPayload);

  axios
      .get (apiParametri.streznik + '/api/users', {})
      .then((odgovor) => {
          prikaziStran(req, res, odgovor.data)
        })
};

const prikaziStran = (req, res, uporabniki) => {
  var tokenParts = req.cookies.authcookie['žeton'].split('.');
  var encodedPayload = tokenParts[1];
  //var rawPayload = window.atob(encodedPayload);
  var rawPayload = Buffer.from(encodedPayload, 'base64').toString('ascii');
  var user = JSON.parse(rawPayload);
  var usernameC = user.username;
  console.log(usernameC);
  console.log("dobim cookie delaaaa", req.cookies.authcookie)
  res.render('users', {
    users: uporabniki,
    usernameC: usernameC,

  });
};

/* Obrazec za dodavanje novega uporabnika */

const dodaj = (req, res) => {
  var tokenParts = req.cookies.authcookie['žeton'].split('.');
  var encodedPayload = tokenParts[1];
  //var rawPayload = window.atob(encodedPayload);
  var rawPayload = Buffer.from(encodedPayload, 'base64').toString('ascii');
  var user = JSON.parse(rawPayload);
    var x = req.query.error;
    var isError = true;
    var notAmatch = true;
    if(x == "napaka"){
      isError = true;
    }
    else{
      isError = false;
    }
    if(x == "napaka1"){
      notAmatch = true;
    }
    else{
      notAmatch = false;
    }
  res.render('user-new', {napaka: isError,
  napaka1: notAmatch});
};

const shraniUserja = (req, res) => {

  // preverjanje, ce se oba gesla matchata (retyping password)
  if (req.body.password != req.body.password_retype) {
      var string = "napaka1";
      res.redirect('/user-new?error=' + string);
   }
  
   // preverjanje, ce so vsa vnosna polja izpolnjena
  if (!req.body.name || !req.body.surname || !req.body.username || !req.body.email || !req.body.password || !req.body.password_retype || !req.body.role) {
    res.render('error', {
         message: "Prišlo je do napake.",
         error: {
              status: "Niste izpolnili vseh zahtevanih polj!"
         }
    });
  } 
  else {
    axios({
      method: 'post',
      url: apiParametri.streznik + '/api/registracija',
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
      // feedback -> user was created
    }).catch((napaka) => {
      var string = "napaka";
      res.redirect('/user-new?error=' + string);
    });
}
};

/* Posodobitev uporabnikovih osnovnih atributov */

var podrobnostiUser = (req, res) => {
  var tokenParts = req.cookies.authcookie['žeton'].split('.');
  var encodedPayload = tokenParts[1];
  //var rawPayload = window.atob(encodedPayload);
  var rawPayload = Buffer.from(encodedPayload, 'base64').toString('ascii');
  var user = JSON.parse(rawPayload);
  var x = req.query.error;
  var currentUser = user.username;

  var userId = req.params.id;
  var napaka = req.query.error;
  var jeNapaka = false;
  if(napaka == "napaka"){
    jeNapaka = true;
  }
  axios
      .get (apiParametri.streznik + '/api/users/' + userId)
      .then((user) => {
          res.render('user-edit',  { name: user.data.name,
            
              surname: user.data.surname,
              username: user.data.username,
              email: user.data.email,
              password: user.data.password,
              isNotDeleted: user.data.isNotDeleted,
              currentUser: currentUser,
              role: user.data.role,
              _id: user.data._id,
              napaka: jeNapaka
            });
      });
};

const posodobiUserja = (req, res) => {

  var userId = req.params.id;
  // preverimo, ce so izpolnjena vsa polja
  if (!req.body.name || !req.body.surname ||  !req.body.role ||  !req.body.password) {
    res.render('error', {
         message: "Prišlo je do napake.",
         error: {
              status: "Niste izpolnili vseh zahtevanih polj!"
         }
    });
  } else { 
  axios({
    method: 'put',
    url: apiParametri.streznik + '/api/users/' + userId,
    data: {
         name: req.body.name,
         surname: req.body.surname,
         email: req.body.email,
         password: req.body.password,
         role: req.body.role
     }
    })
    .then(() => {
        res.redirect('/users');
    }).catch((napaka) => {
      var string = "napaka";
      res.redirect('/users/' + userId + '?error=' + string);
    //prikaziNapako(req, res, napaka);
    });
  }
};

/* Brisanje uporabnika - zastavica isDeleted */
const pridobiUserjaZaIzbris = (req, res) => {
  var userId = req.params.id;
  axios
      .get (apiParametri.streznik + '/api/users/' + userId)
      .then((odgovor) => {
          res.render('user-delete', odgovor.data);
      });
};

const izbrisiUserja = (req, res) => {

  var userId = req.params.id;
  axios({
    method: 'put',
    url: apiParametri.streznik + '/api/users/' + userId + "/delete"
    })
    .then(() => {
        res.redirect('/users');
    }).catch((napaka) => {
    prikaziNapako(req, res, napaka);
    });


};

/* Brisanje uporabnika - iz baze */
const pridobiUserjaZaIzbrisPermanent = (req, res) => {
  var userId = req.params.id;
  axios
      .get (apiParametri.streznik + '/api/users/' + userId)
      .then((odgovor) => {
          res.render('user-delete-permanent', odgovor.data);
      });
};

const izbrisiUserjaPermanent = (req, res) => {

  var userId = req.params.id;
  axios({
    method: 'delete',
    url: apiParametri.streznik + '/api/users/' + userId
    })
    .then(() => {
        res.redirect('/users');
    }).catch((napaka) => {
    prikaziNapako(req, res, napaka);
    });


};


/* Posodobitev uporabniskega imena */

const pridobiUserjaZaUsernamePosodobitev = (req, res) => {
  var tokenParts = req.cookies.authcookie['žeton'].split('.');
  var encodedPayload = tokenParts[1];
  //var rawPayload = window.atob(encodedPayload);
  var rawPayload = Buffer.from(encodedPayload, 'base64').toString('ascii');
  var user = JSON.parse(rawPayload);
  var x = req.query.error;

  var userId = req.params.id;
  var napaka = req.query.error;
  var jeNapaka = false;
  if(napaka == "napaka"){
    jeNapaka = true;
  }
  axios
      .get (apiParametri.streznik + '/api/users/' + userId)
      .then((user) => {
          res.render('user-username',  { name: user.data.name,
            
              surname: user.data.surname,
              username: user.data.username,
              email: user.data.email,
              password: user.data.password,
              isNotDeleted: user.data.isNotDeleted,
              role: user.data.role,
              _id: user.data._id,
              napaka: jeNapaka
            });
      });
};

const posodobiUsername = (req, res) => {

  var userId = req.params.id;

  if (!req.body.username) {
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
    url: apiParametri.streznik + '/api/users/' + userId + '/edit-username',
    data: {
         username: req.body.username,
     }
    })
    .then(() => {
        res.redirect('/users/' + userId);
    }).catch((napaka) => {
      var string = "napaka";
      res.redirect('/users/' + userId + '/edit-username?error=' + string);
    //prikaziNapako(req, res, napaka);
    });
  }
};

/* Posodobitev uporabniskega gesla */

const pridobiUserjaZaPosodobitevGesla = (req, res) => {
  var x = req.query.error;
  var isError = true;
  var notAmatch = true;
  if(x == "napaka"){
    isError = true;
  }
  else{
    isError = false;
  }
  if(x == "napaka1"){
    notAmatch = true;
  }
  else{
    notAmatch = false;
  }

  var tokenParts = req.cookies.authcookie['žeton'].split('.');
  var encodedPayload = tokenParts[1];
  //var rawPayload = window.atob(encodedPayload);
  var rawPayload = Buffer.from(encodedPayload, 'base64').toString('ascii');
  var user = JSON.parse(rawPayload);
  
  var userId = req.params.id;
  
  axios
      .get (apiParametri.streznik + '/api/users/' + userId)
      .then((user) => {
          res.render('user-pass',  {
            
            name: user.data.name,
              surname: user.data.surname,
              username: user.data.username,
              email: user.data.email,
              role: user.data.role,
              isNotDeleted: user.data.isNotDeleted,
              _id: user.data._id,
              napaka: isError,
              napaka1: notAmatch,
            });
      });
};

const posodobitevGesla = (req, res) => {

  var userId = req.params.id;

  if (req.body.newpassword != req.body.password_retype) {
    var string = "napaka1";
    res.redirect('/users/' + userId + '/edit-password?error=' + string);
 }

  if (!req.body.username) {
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
    url: apiParametri.streznik + '/api/users/' + userId + '/edit-password',
    data: {
        username: req.body.username,
         password: req.body.newpassword,
     }
    })
    .then(() => {
        res.redirect('/users/' + userId);
    }).catch((napaka) => {
      var string = "napaka";
      res.redirect('/users/' + userId + '/edit-password?error=' + string);
    //prikaziNapako(req, res, napaka);
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
    podrobnostiUser,
    dodaj,
    shraniUserja,
    izbrisiUserja,
    posodobiUserja,
    pridobiUserjaZaIzbris,
    pridobiUserjaZaUsernamePosodobitev,
    posodobiUsername,
    pridobiUserjaZaPosodobitevGesla,
    posodobitevGesla,
    izbrisiUserjaPermanent,
    pridobiUserjaZaIzbrisPermanent
};
