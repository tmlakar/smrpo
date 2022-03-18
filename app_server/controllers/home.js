

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
    res.render('login', {
        layout: 'layout-noNavbar'
        
    });
};

const prijava = (req, res) => {
    if (!req.body.username || !req.body.password) {
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
        url: apiParametri.streznik + '/api/prijava',
        data: {
          username: req.body.username,
          password: req.body.password,
        },
        
      }).then(() => {
          res.redirect('/home');
        
      }).catch((napaka) => {
        prikaziNapako(req, res, napaka);
        //+ alert
        
      });
    }
  };

  const token = (req, res) => {
    
  };



  const prikaziNapako = (req, res, napaka) => {
    let naslov = "Nekaj je šlo narobe!";
    let vsebina = napaka.response.data["sporočilo"] ?
        napaka.response.data["sporočilo"] : (napaka.response.data["message"] ?
            napaka.response.data["message"] : "Nekaj nekje očitno ne deluje.");
    res.render('error', {
        title: naslov,
        vsebina: vsebina,
        layout: "layout-noNavbar"
    }
    );
};

module.exports = {
    prikaz,
    prijava,
    token
};


