const { vrniUporabnika } = require("../../app_api/controllers/home");
const jwt = require("express-jwt");


var apiParametri = {
    streznik: "http://localhost:" + (process.env.PORT || 3000), };
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
    //var rawPayload = window.atob(encodedPayload);
    var rawPayload = Buffer.from(encodedPayload, 'base64').toString('ascii');
    var user = JSON.parse(rawPayload);
    var name = user.name;
    var surname = user.surname;
    var id = user._id;
    var username = user.username;
    var email = user.email;
    var vloga = user.role;
    if(vloga == "user"){
      res.render('account', {
          name: name,
          surname: surname,
          username: username,
          email: email,
          id: id,
          layout: 'layout-user'
      });
    }
    else{
      res.render('account', {
        name: name,
        surname: surname,
        username: username,
        id: id,
        email: email
    });
   }
  };


  var podrobnostiUser = (req, res) => {
    var tokenParts = req.cookies.authcookie['žeton'].split('.');
    var encodedPayload = tokenParts[1];
    var rawPayload = Buffer.from(encodedPayload, 'base64').toString('ascii');
    var user = JSON.parse(rawPayload);

    var id = user._id;
    
    var userId = id;
    axios
        .get (apiParametri.streznik + '/api/account/' + userId)
        .then((odgovor) => {
            res.render('account', odgovor.data);
        });
  };

  const posodobiUserja = (req, res) => {
    var tokenParts = req.cookies.authcookie['žeton'].split('.');
    var encodedPayload = tokenParts[1];
    var rawPayload = Buffer.from(encodedPayload, 'base64').toString('ascii');
    var user = JSON.parse(rawPayload);
    var id = user._id;
    console.log(id);
  
    if (!req.body.name || !req.body.surname || !req.body.username || !req.body.email ) {
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
      url: apiParametri.streznik + '/api/account/' + id,
      data: {
           name: req.body.name,
           surname: req.body.surname,
           username: req.body.username,
           email: req.body.email,
  
       }
      })
      .then(() => {
        
          res.redirect('/home');
      }).catch((napaka) => {
          res.send(napaka);
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
    prikaz,
    podrobnostiUser,
    posodobiUserja

};
