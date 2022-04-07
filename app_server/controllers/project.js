
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
            res.render('project',
            { name: odgovor.data.name,
              id: projectId,
              sprints: sprinti,
              // finishedSprints: finishedSprints,
              // inProcessSprints: inProcessSprints,
              // futureSprints: futureSprints,
              admin: nivoDostopa,
              layout: 'layout-user'
            });
          } else {

          }
            res.render('project',
            { name: odgovor.data.name,
              id: projectId,
              sprints: sprinti,
              // finishedSprints: finishedSprints,
              // inProcessSprints: inProcessSprints,
              // futureSprints: futureSprints,
              admin: nivoDostopa,
              layout: 'layout'
            });
        });
  };




  module.exports = {
    prikaz,
};
