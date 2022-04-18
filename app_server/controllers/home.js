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

  if (!req.cookies.authcookie) {
    var x = req.query.error;
    if(x == "napaka"){
      res.render('login', {
          layout: 'layout-noNavbar',
          napaka: true
      });
    }
    else{
      res.render('login', {
          layout: 'layout-noNavbar',
          napaka: false
      });
    }

    
  } else {
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
    var activeProjects = user.activeProjects;

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
      let URL1 = apiParametri.streznik + '/api/projects';
      
  
      const promise1 = axios.get(URL1);
      
  
      Promise.all([promise1]).then(function(values) {
          //pogledamo pri katerih projektih sodeluje user
          var usersProjects = [];
          var iUsersProjects = 0;
          var usernameLoggedIn = user.username;
          var allProjects = values[0].data;
          //console.log(allProjects);
          for (var i = 0; i < allProjects.length; i++) {
            var collaborators = allProjects[i].collaborators;
            //console.log(collaborators);
            for (var j = 0; j < collaborators.length; j++) {
              if (collaborators[j].username == usernameLoggedIn) {
                //console.log("Sodeluje na projektu");
                //shranimo v usersProject project, project id + ime projekta + kaj je njegov role na projektu
                //console.log(allProjects[i].name, allProjects[i].info, allProjects[i]._id, collaborators[j].project_role);
                var userProject = new Object();
                userProject.name = allProjects[i].name;
                userProject.info = allProjects[i].info;
                userProject.id = allProjects[i]._id;
                userProject.project_role = collaborators[j].project_role;
                //iUsersProjects = iUsersProjects + 1;
                usersProjects[iUsersProjects] = userProject;
                iUsersProjects = iUsersProjects + 1;
                //console.log(userProject);
              }
            }
          }
          
          console.log(usersProjects);

          res.render('home', {
              name: name,
              surname: surname,
              username: username,
              email: email,
              activeProjects: usersProjects,
              layout: 'layout-user',
              date: datum
          });
        
        })
      } else {
          res.render('home', {
            name: name,
            surname: surname,
            username: username,
            activeProjects: activeProjects,
            email: email,
            date: datum
        }); 
      }

  }
  
  

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
        //se pošljejo prijavni podatki na api, kjer bo v bazi preveril če uporabnik obstaja, če se ujema geslo in tam zgeneriral webtoken in ga poslal nazaj na strežnik
        method: 'post',
        url: apiParametri.streznik + '/api/prijava',
        data: {
          username: req.body.username,
          password: req.body.password,
        },

      }).then((response) => {
        //v response.data je shranjen žeton v obliki: {'žeton': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjMwOGY5MGEwOGY3YmE3ZTU3NTgzMzciLCJuYW1lIjoixaBwZWxhIiwic3VybmFtZSI6IlZpZG1hciIsInVzZXJuYW1lIjoic3BlbHZpZCIsImVtYWlsIjoic3BlbGxhLnZpZEBnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImV4cCI6MTY0ODI5MzY2MSwiaWF0IjoxNjQ3Njg4ODYxfQ.j-IQvL63E8DmcsIMXaD-LSMOyP_PfNetpGfomJDPjvE'}
        console.log(response.data);
        res.cookie('authcookie', response.data, {maxAge:9000000000,httpOnly:true});
        console.log("secret key", process.env.JWT_GESLO)
        //žeton je zdaj shranjen v cookie in se ga lahko dostopa z req.cookies.authcookie
        res.redirect('/home');
      }).catch((napaka) => {
        var string = "napaka";
        res.redirect('/?error=' + string);
        //prikaziNapako(req, res, napaka);
      });
    }
  };



  const prikaziNapako = (req, res, napaka) => {
    let naslov = "Nekaj je šlo narobe!";
    let vsebina = napaka.response.data["sporočilo"] ?
        napaka.response.data["sporočilo"] : (napaka.response.data["message"] ?
            napaka.response.data["message"] : "Nekaj nekje očitno ne deluje.");
    res.send({
        title: naslov,
        vsebina: vsebina,

    }
    );
};

module.exports = {
    prikaz,
    prijava
};
