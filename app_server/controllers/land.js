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

  var vloga = user.role;
  var jeUser = false;
  if (vloga == "user") {
    jeUser = true;
  }
  if(vloga == "user"){
    let URL1 = apiParametri.streznik + '/api/projects';
    let URL2 = apiParametri.streznik + '/api/account/' + userId;

    const promise1 = axios.get(URL1);
    const promise2 = axios.get(URL2);

    Promise.all([promise1, promise2]).then(function(values) {
        //pogledamo pri katerih projektih sodeluje user
        var usersProjects = [];
        var iUsersProjects = 0;
        var usernameLoggedIn = values[1].data.username;
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
        res.render('home',
        {
          name: values[1].data.name,
          jeUser: jeUser,
          surname: values[1].data.surname,
          username: values[1].data.username,
          email: values[1].data.email,
          id: values[1].data._id,
          activeProjects: usersProjects,
          layout: 'layout-user',
          date: datum
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
          jeUser: jeUser,
          surname: odgovor.data.surname,
          username: odgovor.data.username,
          email: odgovor.data.email,
          id: odgovor.data._id,
          activeProjects: odgovor.data.activeProjects,
          layout: 'layout',
          date: datum
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
  var enaAktivna = false;
  var projectId;
  var storyId;
  var taskId;
  //pogledamo če je kakšen task še aktiven
  axios
      .get(apiParametri.streznik + '/api/projects')
      .then((odgovor) => {
        var projekti = odgovor.data;
        for(var i=0; i<projekti.length; i++){
          var stories = projekti[i].userStories;
          for(var j=0; j<stories.length; j++){
              var tasks = stories[j].subtasks;
              for(var k=0; k<tasks.length; k++){
                if(tasks[k].active == true){
                  //ta je še aktivna, moramo ji nastaviti da ne bo več aktivna in shraniti pretečen čas od začetka
                  projectId = projekti[i]._id;
                  storyId = stories[j]._id;
                  taskId = tasks[k]._id;
                  var endDate = new Date();
                  axios({
                    method: 'post',
                    url: apiParametri.streznik + '/api/time-log/save-work-hours/stop-task/' +  projectId + '/' + storyId + '/' + taskId,
                    data: {
                      endDate: endDate
                    }
                    })
                    .then(() => {
                      console.log("uspešno shranjen delovni čas za današnji dan")
                      //odgovor.data.projectId
                      var string = "saved time log";
                    }).catch((error) => {
                      console.log("napaka")
                    });
                }
              }
            }
          }
        }).catch((napaka) => {
            console.log("napaka");
        });
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
