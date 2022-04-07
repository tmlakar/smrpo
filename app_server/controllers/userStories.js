var apiParametri = {
    streznik: "http://localhost:" + (process.env.PORT || 3000),
  };
  if (process.env.NODE_ENV === "production") {

  }
  const axios = require("axios").create({
    baseURL: apiParametri.streznik,
    timeout: 5000,
  });


  // get implementiram drugje - tukile samo updejti in creating

  /* Podrobnosti projekta */
  var podrobnostiProject = (req, res) => {
    var tokenParts = req.cookies.authcookie['žeton'].split('.');
    var encodedPayload = tokenParts[1];
    //var rawPayload = window.atob(encodedPayload);
    var rawPayload = Buffer.from(encodedPayload, 'base64').toString('ascii');
    var user = JSON.parse(rawPayload);
      var projectId = req.params.id;
      var napaka = req.query.error;
      var jeNapaka = false;
      
      if(napaka == "napaka"){
        jeNapaka = true;
      }

      console.log(jeNapaka);
      axios
          .get (apiParametri.streznik + '/api/projects/' + projectId)
          .then((odgovor) => {
              res.render('story-new',
              { name: odgovor.data.name,
                info: odgovor.data.info,
                collaborators: odgovor.data.collaborators,
                userStories: odgovor.data.userStories,
                sprints: odgovor.data.sprints,
                id: odgovor.data._id,
                napaka: jeNapaka
              });
          });
    

  };

  /* POST - Add new user story */
const addNewUserStory = (req, res) => {
    var projectId = req.params.id;
    if (!req.body.name || !req.body.aboutText || !req.body.priority || !req.body.businessValue || !req.body.size) {
        "/projects/:idProject/userStory-new"
    } else {
      axios({
        method: 'post',
        url: apiParametri.streznik + '/api/projects/' + projectId + '/userStory-new',
        data: {
            name: req.body.name,
            aboutText: req.body.aboutText,
            priority: req.body.priority,
            businessValue: req.body.businessValue,
            size: req.body.size,
        }
      }).then((odgovor) => {
        var name = odgovor.name;
        var string = "successfully added";
        res.redirect('/projects/' + projectId + '?error=' + string);
      }).catch((napaka) => {
        var string = "napakaPriDodajanjuUserja";
      res.redirect('/projects/' + projectId + '?error=' + string);
  
      });
    }
  };


  module.exports = {
    podrobnostiProject,
    addNewUserStory 
  };