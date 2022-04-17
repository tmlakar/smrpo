
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
    //var rawPayload = window.atob(encodedPayload);
    var rawPayload = Buffer.from(encodedPayload, 'base64').toString('ascii');
    var user = JSON.parse(rawPayload);
    var projectId = req.params.id;




    var vloga = user.role;
    //console.log(vloga);
    
    var layout1 = 'layout';
    if (vloga == 'user') {
        layout1 = 'layout-user';

    }

    var username = user.username;
    var isScrumMaster = false;

    

    axios
        .get(apiParametri.streznik + '/api/projects/' + projectId)
        .then((odgovor) => {
            var teamMembers = [];
            var productManagers = [];
            var scrumMasters = [];
            var i4 = 0;
            var i5 = 0;
            var i6 = 0;
            var collaborators = odgovor.data.collaborators;
            for (let i = 0; i < collaborators.length; i++) {
                if (collaborators[i].project_role == "Team Member") {
                    teamMembers[i4] = collaborators[i];
                    i4 = i4 + 1;


                }
                if (collaborators[i].project_role == "Product Manager") {
                    productManagers[i5] = collaborators[i];
                    i5 = i5 + 1;
                }
                if (collaborators[i].project_role == "Scrum Master") {
                    scrumMasters[i6] = collaborators[i];
                    i6 = i6 + 1;
                    if (collaborators[i].username == username) {
                        canDelete = true;
                    }

                }


            }
            res.render('documentation', {
                name: odgovor.data.name,
                info: odgovor.data.info,
                collaborators: odgovor.data.collaborators,
                userStories: odgovor.data.userStories,
                publications: odgovor.data.publications,
                sprints: odgovor.data.sprints,
                id: odgovor.data._id,
                layout: layout1,
                teamMembers: teamMembers,
                productManagers: productManagers,
                scrumMasters: scrumMasters,
                isScrumMaster: isScrumMaster,
                role: vloga,

            });
        });


};


  module.exports = {
    prikaz
    
};