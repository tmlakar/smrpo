var apiParametri = {
    streznik: "http://localhost:" + (process.env.PORT || 3000),
  };
  if (process.env.NODE_ENV === "production") {

  }
  const axios = require("axios").create({
    baseURL: apiParametri.streznik,
    timeout: 5000,
  });

  /* seznam userjev, ki se jih lahko doda na projekt */
  var availableCollaboratorsList = (req, res) => {

    var tokenParts = req.cookies.authcookie['žeton'].split('.');
    var encodedPayload = tokenParts[1];
    //var rawPayload = window.atob(encodedPayload);
    var rawPayload = Buffer.from(encodedPayload, 'base64').toString('ascii');
    var user = JSON.parse(rawPayload);
  
    axios
        .get (apiParametri.streznik + '/api/users', {})
        .then((odgovor) => {
            res.send(odgovor.data);
          })
  };

  /* Podrobnosti projekta */
  var podrobnostiProject = (req, res) => {
      axios
          .get (apiParametri.streznik + '/api/projects/' + projectId)
          .then((odgovor) => {
              res.render('project-edit',
              { name: odgovor.data.name,
                info: odgovor.data.info,
                collaborators: odgovor.data.collaborators,
                id: odgovor.data._id,
                
              });
          });
    };

/* POST - Add project collaborators */
const addProjectCollaborators = (req, res) => {
  const idProject = req.params.idProject;
  
};

/* PUT - Edit collaborators roles */

/* DELETE - Remove collaborators from a projects */

module.exports = {
  availableCollaboratorsList,
  podrobnostiProject,
  addProjectCollaborators
        
};
    