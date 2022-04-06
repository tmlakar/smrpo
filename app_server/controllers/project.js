
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
    var vloga = user.role;

    var projectId = req.params.id;
    axios
        .get (apiParametri.streznik + '/api/projects/' + projectId)
        .then((odgovor) => {
          if (vloga == "user") {
            res.render('project',
            { name: odgovor.data.name,
              id: projectId,
              sprints: odgovor.data.sprints,
              layout: 'layout-user'
            });
          } else {

          }
            res.render('project',
            { name: odgovor.data.name,
              id: projectId,
              sprints: odgovor.data.sprints,
              layout: 'layout'
            });
        });
  };




  module.exports = {
    prikaz,
};
