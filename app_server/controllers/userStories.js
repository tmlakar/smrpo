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
              res.render('project-edit',
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


  module.exports = {
    podrobnostiProject
          
  };