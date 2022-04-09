
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
    var successfullyAdded = req.query.addstory;
    console.log(successfullyAdded)
    var uspesnoDodano = false;
    if (successfullyAdded == "successfully added") {
      uspesnoDodano = true;
    }
    var tokenParts = req.cookies.authcookie['žeton'].split('.');
    var encodedPayload = tokenParts[1];
    var rawPayload = Buffer.from(encodedPayload, 'base64').toString('ascii');
    var user = JSON.parse(rawPayload);
    var nivoDostopa = false;
    console.log(user.role)
    if(user.role == "admin"){
      nivoDostopa = true;
    }
    var vloga = user.role;

    //user feedback
    //uspesno dodana zgodba
    var successfullyAddedStory = req.query.add;
    var uspesnoDodanaZgodba = false;
    if (successfullyAddedStory == "successfully added story") {
      uspesnoDodanaZgodba = true;
    }

    var username = user.username;
    var projectId = req.params.id;
    axios
        .get (apiParametri.streznik + '/api/projects/' + projectId)
        .then((odgovor) => {
          //ločimo sprinte v pretekle, v teku in v prihodnosti
          const finishedSprints = [];
          var i1 = 0;
          const inProcessSprints = [];
          var i2 = 0;
          const futureSprints = [];
          var i3 = 0;
          var sprinti = odgovor.data.sprints;

          // uporabniske zgodbe
          var uporabniskeZgodbe = odgovor.data.userStories;

          // additional project info
          var info = odgovor.data.info;
          var collaborators = odgovor.data.collaborators;
          var scrumMasterUsername;
          var productManagerUsername;
          var teamMembers = [];
          var productManagers = [];
          var scrumMasters = [];
          var i4 = 0;
          var i5 = 0;
          var i6 = 0;
          for (let i = 0; i < collaborators.length; i++) {
            if (collaborators[i].project_role == "Team Member") {
              teamMembers[i4] = collaborators[i];
              i4 = i4 + 1;
            }
            if (collaborators[i].project_role == "Product Manager") {
              productManagerUsername = collaborators[i].username;
              productManagers[i5] = collaborators[i];
              i5 = i5 + 1;
            }
            if (collaborators[i].project_role == "Scrum Master") {
              scrumMasterUsername = collaborators[i].username;
              scrumMasters[i6] = collaborators[i];
              i6 = i6 + 1;

            }
          }

          var now = new Date();
          for(let i=0; i< sprinti.length; i++){
            //če je finished
            if((new Date(sprinti[i].startDate) < now) && (new Date(sprinti[i].endDate) < now)){
              finishedSprints[i1] = sprinti[i];
              i1 = i1 +1;
            }
            //če je in process
            if((new Date(sprinti[i].startDate) <= now) && (new Date(sprinti[i].endDate) > now)){
              inProcessSprints[i2] = sprinti[i];
              i2 = i2 +1;
            }
            //če je v prihodnosti
            if((new Date(sprinti[i].startDate) >= now) && (new Date(sprinti[i].endDate) > now)){
              inProcessSprints[i3] = sprinti[i];
              i3 = i3 +1;
            }
          }

          


          if (vloga == "user") {
            //ugotovimo kaj je njegova vloga na tem projektu
            var scrumMaster = false;
            if(scrumMasterUsername == username){
              scrumMaster = true;
            }
            // isto ugotovimo al je product manager
            var productManager = false;
            if(scrumMasterUsername == username){
              productManager = true;
            }

            res.render('project',
            { name: odgovor.data.name,
              id: projectId,
              sprints: sprinti,
              // finishedSprints: finishedSprints,
              // inProcessSprints: inProcessSprints,
              // futureSprints: futureSprints,
              teamMembers: teamMembers,
              productManagers: productManagers,
              scrumMasters: scrumMasters,
              userStories: uporabniskeZgodbe,
              admin: nivoDostopa,
              info: info,
              layout: 'layout-user',
              scrumMaster: scrumMaster,
              productManager: productManager,
              successfullyAddedSprint: uspesnoDodano,
              successfullyAddedStory: uspesnoDodanaZgodba
            });
          } else {

            res.render('project',
            { name: odgovor.data.name,
              id: projectId,
              sprints: sprinti,
              // finishedSprints: finishedSprints,
              // inProcessSprints: inProcessSprints,
              // futureSprints: futureSprints,
              userStories: uporabniskeZgodbe,
              teamMembers: teamMembers,
              productManagers: productManagers,
              scrumMasters: scrumMasters,
              admin: nivoDostopa,
              info: info,
              layout: 'layout',
              scrumMaster: scrumMaster,
              productManager: productManager,
              successfullyAddedSprint: uspesnoDodano,
              successfullyAddedStory: uspesnoDodanaZgodba
              
            });
          }
        });
  };




  module.exports = {
    prikaz,
};
