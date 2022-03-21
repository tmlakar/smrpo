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




var prikaz = (req, res) => {
  console.log("dobim cookie", req.cookies.authcookie)
  var tokenParts = req.cookies.authcookie['žeton'].split('.');
  var encodedPayload = tokenParts[1];
  var rawPayload = Buffer.from(encodedPayload, 'base64').toString('ascii');
  var user = JSON.parse(rawPayload);
  var username = user.username;
  var vloga = user.role;
  if(vloga == "user"){
    res.render('home', {
        name: username,
        layout: 'layout-user'
    });
  }
  else{
    res.render('home', {
      name: username
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
    prikaz
};
