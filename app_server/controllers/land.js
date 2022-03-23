const { vrniUporabnika } = require("../../app_api/controllers/home");
const jwt = require("express-jwt");
var apiParametri = {
    streznik: "http://localhost:" + (process.env.PORT || 3000),
  };
  if (process.env.NODE_ENV === "production") {

  }
  const axios = require("axios").create({
    baseURL: apiParametri.streznik,
    timeout: 5000,
  });


var podrobnostiUser = (req, res) => {
  // dobim podatke od userja iz idja, ki je v cookiju -> ce uporabnik posodobi svoje podatke
  // se ne pokazejo posodobljeni, kr je za zdej se vedno crpu vn iz cookie-ja
    var tokenParts = req.cookies.authcookie['žeton'].split('.');
    var encodedPayload = tokenParts[1];
    var rawPayload = Buffer.from(encodedPayload, 'base64').toString('ascii');
    var user = JSON.parse(rawPayload);

    var id = user._id;
    var role = user.role;
    var layout2 = "layout";
    if (role == user) {
      layout2 = "layout-user";
    }
    var userId = id;
    axios
        .get (apiParametri.streznik + '/api/account/' + userId)
        .then((user, layout) => {
            res.render('home', user.data);
        });
  };



  // ne dela v primeru, ko uporabnik posodobi svoje podatke, pa mu se vedno kaze tastare
var prikaz = (req, res) => {
  console.log("dobim cookie", req.cookies.authcookie)
  var tokenParts = req.cookies.authcookie['žeton'].split('.');
  var encodedPayload = tokenParts[1];
  var rawPayload = Buffer.from(encodedPayload, 'base64').toString('ascii');
  var user = JSON.parse(rawPayload);

  // var name = user.name;
  // var surname = user.surname;
  var id = user._id;
  var userId = id;
  // var username = user.username;
  // var email = user.email;
  var date = user.date;
  // parsanje datuma
  var date_parsed = Date.parse(date);
  var d = new Date(date_parsed);
  var vloga = user.role;
  if(vloga == "user"){

    axios
    .get (apiParametri.streznik + '/api/account/' + userId)
    .then((odgovor) => {
        res.render('home', 
        {
          name: odgovor.data.name,
          surname: odgovor.data.surname,
          username: odgovor.data.username,
          email: odgovor.data.email,
          id: odgovor.data._id,
          layout: 'layout-user',
          date: d
        });
    });

  }
  else{
    axios
    .get (apiParametri.streznik + '/api/account/' + userId)
    .then((odgovor) => {
        res.render('home', 
        {
          name: odgovor.data.name,
          surname: odgovor.data.surname,
          username: odgovor.data.username,
          email: odgovor.data.email,
          id: odgovor.data._id,
          layout: 'layout',
          date: d
        });
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

const logout = (req, res) => {
  var tokenParts = req.cookies.authcookie['žeton'].split('.');
  var encodedPayload = tokenParts[1];
  var rawPayload = Buffer.from(encodedPayload, 'base64').toString('ascii');
  var user = JSON.parse(rawPayload);
  var name = user.name;
  var surname = user.surname;
  var id = user._id;
  var username = user.username;
  var email = user.email;
  var vloga = user.role;
  if (req.cookies.authcookie) {
    
    console.log(req.cookies.authcookie);
    res.clearCookie("authcookie")
  }
  res.redirect('/');
};

module.exports = {
    prikaz,
    logout,
    podrobnostiUser
};
