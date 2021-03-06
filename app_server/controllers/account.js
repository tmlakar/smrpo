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



 /* Prikaz account -> dobi id iz tokna in ga uporabi, da povlece uporabniske podatke od axiosa */
 var prikaz = (req, res) => {
  var x = req.query.error;
  var isError = true;
  if(x == "napaka"){
    isError = true;
  }
  else{
    isError = false;
  }
    console.log("dobim cookie", req.cookies.authcookie)
    var tokenParts = req.cookies.authcookie['žeton'].split('.');
    var encodedPayload = tokenParts[1];
    

    var rawPayload = Buffer.from(encodedPayload, 'base64').toString('ascii');
    var user = JSON.parse(rawPayload);
    var id = user._id;
    
    var userId = id;
    var vloga = user.role;
    var date = user.date;
    console.log(date);
    // parsanje datuma
    var date_parsed = Date.parse(date);
    
    var d = new Date(date_parsed);
    var month = d.getUTCMonth() + 1; //months from 1-12
    if (month < 10) {
      month = "0" + month;
    }
    var day = d.getUTCDate();
    if (day < 10) {
      day = "0" + day;
    }
    var year = d.getUTCFullYear();
    
    var hour = d.getUTCHours()+2;
    if (hour < 10) {
      hour = "0" + hour;
    }
    var minute = d.getUTCMinutes();
    if (minute < 10) {
      minute = "0" + minute;
    }

    var datum = day+ '/' + month + '/' + year +"  " + hour +":"+ minute;
    
    if(vloga == "user"){
      axios
        .get (apiParametri.streznik + '/api/account/' + userId)
        .then((odgovor) => {
            res.render('account', 
            {
              name: odgovor.data.name,
              surname: odgovor.data.surname,
              username: odgovor.data.username,
              email: odgovor.data.email,
              id: odgovor.data._id,
              layout: 'layout-user',
              napaka: isError,
              date: datum
            });
        });
      
    
    }
    else{
      axios
        .get (apiParametri.streznik + '/api/account/' + userId)
        .then((odgovor) => {
            res.render('account', 
            {
              name: odgovor.data.name,
              surname: odgovor.data.surname,
              username: odgovor.data.username,
              email: odgovor.data.email,
              id: odgovor.data._id,
              layout: 'layout',
              napaka: isError,
              date: datum
            });
        });
   }
  };

  
  /* GET prikaz za editing gesla */
  var prikaz2 = (req, res) => {
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
    console.log("dobim cookie", req.cookies.authcookie)
    var tokenParts = req.cookies.authcookie['žeton'].split('.');
    var encodedPayload = tokenParts[1];
    

    var rawPayload = Buffer.from(encodedPayload, 'base64').toString('ascii');
    var user = JSON.parse(rawPayload);
    var id = user._id;
    
    var userId = id;
    var vloga = user.role;
    var date = user.date;
    // parsanje datuma
    var date_parsed = Date.parse(date);
    
    var d = new Date(date_parsed);
    var month = d.getUTCMonth() + 1; //months from 1-12
    if (month < 10) {
      month = "0" + month;
    }
    var day = d.getUTCDate();
    if (day < 10) {
      day = "0" + day;
    }
    var year = d.getUTCFullYear();
    
    var hour = d.getUTCHours()+2;
    if (hour < 10) {
      hour = "0" + hour;
    }
    var minute = d.getUTCMinutes();
    if (minute < 10) {
      minute = "0" + minute;
    }

    var datum = day+ '/' + month + '/' + year +"  " + hour +":"+ minute;
    
    if(vloga == "user"){
      axios
        .get (apiParametri.streznik + '/api/account/' + userId)
        .then((odgovor) => {
            res.render('account-pass', 
            {
              name: odgovor.data.name,
              surname: odgovor.data.surname,
              username: odgovor.data.username,
              email: odgovor.data.email,
              id: odgovor.data._id,
              layout: 'layout-user',
              napaka: isError,
              napaka1: notAmatch,
              date: datum
            });
        });
      
    
    }
    else{
      axios
        .get (apiParametri.streznik + '/api/account/' + userId)
        .then((odgovor) => {
            res.render('account-pass', 
            {
              name: odgovor.data.name,
              surname: odgovor.data.surname,
              username: odgovor.data.username,
              email: odgovor.data.email,
              id: odgovor.data._id,
              layout: 'layout',
              napaka: isError,
              napaka1: notAmatch,
              date: datum
            });
        });
   }
  
  };



  /* posodabljanje userja na /account */

  const posodobiUserja = (req, res) => {
    var tokenParts = req.cookies.authcookie['žeton'].split('.');
    var encodedPayload = tokenParts[1];
    var rawPayload = Buffer.from(encodedPayload, 'base64').toString('ascii');
    var user = JSON.parse(rawPayload);
    var id = user._id;
    console.log(id);
  
    if (!req.body.name || !req.body.surname || !req.body.email ) {
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
           email: req.body.email,
  
       }
      })
      .then(() => {
      
          res.redirect('/home');
      }).catch((napaka) => {
        var string = "napaka";
        res.redirect('/account?error=' + string);
      });
    }
  };

  /* Posodobitev gesla  na /account/edit-password */
const posodobiGeslo = (req, res) => {
    var tokenParts = req.cookies.authcookie['žeton'].split('.');
    var encodedPayload = tokenParts[1];
    var rawPayload = Buffer.from(encodedPayload, 'base64').toString('ascii');
    var user = JSON.parse(rawPayload);
    var id = user._id;
    var username = user.username;
    console.log(id);
    console.log(req.body.username, req.body.password, req.body.newpassword)

    // preverjanje ce se oba gesla matchata
  if (req.body.newpassword  != req.body.password_retype) {
    var string = "napaka1";
    res.redirect('/account/edit-password?error=' + string);
 }

    if (!req.body.username || !req.body.password || !req.body.newpassword || !req.body.password_retype) {
      res.render('error', {
           message: "Prišlo je do napake.",
           error: {
                status: "Niste izpolnili vseh zahtevanih polj!"
           }
      });
    } else {
    axios({
      method: 'put',
      url: apiParametri.streznik + '/api/account/pass/' + id,
      data: {
           username: req.body.username,
           password: req.body.password,
           newpassword: req.body.newpassword,
       }
      })
      .then(() => {
        
          res.redirect('/home');
      }).catch((napaka) => {
        var string = "napaka";
        res.redirect('/account/edit-password?error=' + string);
        
      });
    }
  };


 
  /* prikaz za posodabljanje username */

  var prikaz3 = (req, res) => {
    var x = req.query.error;
  var isError = true;
  if(x == "napaka"){
    isError = true;
  }
  else{
    isError = false;
  }
    console.log("dobim cookie", req.cookies.authcookie)
    var tokenParts = req.cookies.authcookie['žeton'].split('.');
    var encodedPayload = tokenParts[1];
    

    var rawPayload = Buffer.from(encodedPayload, 'base64').toString('ascii');
    var user = JSON.parse(rawPayload);
    var id = user._id;
    
    var userId = id;
    var vloga = user.role;
    var date = user.date;
    // parsanje datuma
    var date_parsed = Date.parse(date);
    
    var d = new Date(date_parsed);
    var month = d.getUTCMonth() + 1; //months from 1-12
    if (month < 10) {
      month = "0" + month;
    }
    var day = d.getUTCDate();
    if (day < 10) {
      day = "0" + day;
    }
    var year = d.getUTCFullYear();
    
    var hour = d.getUTCHours()+2;
    if (hour < 10) {
      hour = "0" + hour;
    }
    var minute = d.getUTCMinutes();
    if (minute < 10) {
      minute = "0" + minute;
    }

    var datum = day+ '/' + month + '/' + year +"  " + hour +":"+ minute;
    
    if(vloga == "user"){
      axios
        .get (apiParametri.streznik + '/api/account/' + userId)
        .then((odgovor) => {
            res.render('account-username', 
            {
              name: odgovor.data.name,
              surname: odgovor.data.surname,
              username: odgovor.data.username,
              email: odgovor.data.email,
              id: odgovor.data._id,
              layout: 'layout-user',
              napaka: isError,
              date: datum
            });
        });
      
    
    }
    else{
      axios
        .get (apiParametri.streznik + '/api/account/' + userId)
        .then((odgovor) => {
            res.render('account-username', 
            {
              name: odgovor.data.name,
              surname: odgovor.data.surname,
              username: odgovor.data.username,
              email: odgovor.data.email,
              id: odgovor.data._id,
              layout: 'layout',
              napaka: isError,
              date: datum
            });
        });
   }
  };

  /* Posodobitev username-a na /account/edit-username */

  const posodobiUsername = (req, res) => {
    var tokenParts = req.cookies.authcookie['žeton'].split('.');
    var encodedPayload = tokenParts[1];
    var rawPayload = Buffer.from(encodedPayload, 'base64').toString('ascii');
    var user = JSON.parse(rawPayload);
    var id = user._id;
    console.log(id)
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
      url: apiParametri.streznik + '/api/account/username/' + id,
      data: {
           username: req.body.username
       }
      })
      .then(() => {
        
          res.redirect('/home');
      }).catch((napaka) => {
        var string = "napaka";
        res.redirect('/account/edit-username?error=' + string);
        
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
    posodobiUserja,
    prikaz2,
    posodobiGeslo,
    prikaz3,
    posodobiUsername

};
