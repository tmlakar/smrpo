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
    var projectId = req.params.id;
    var tokenParts = req.cookies.authcookie['žeton'].split('.');
    var encodedPayload = tokenParts[1];
    //var rawPayload = window.atob(encodedPayload);
    var rawPayload = Buffer.from(encodedPayload, 'base64').toString('ascii');
    var user = JSON.parse(rawPayload);

    // je napaka?
    var napaka = req.query.error;
    var jeNapaka = false;
    if(napaka == "napakaPriDodajanjuUserja"){
      jeNapaka = true;
    }
   // je succesfully removed
   var success = req.query.error;
   var uspesnoRemoved = false;
   if(success == "success"){
    uspesnoRemoved = true;
  }
  // je successfully added
  var success = req.query.error;
  var uspesnoAdded = false;
  if(success == "successfully added"){
   uspesnoAdded = true;
 }
 // je successfully edited
 var successfullyEdited = req.query.edit;
 var uspesnoEdited = false;
  if(successfullyEdited == "successfully edited"){
   uspesnoEdited = true;
 }

          let URL1 = apiParametri.streznik + '/api/users';
          let URL2 = apiParametri.streznik + '/api/projects/' + projectId;
        
          const promise1 = axios.get(URL1);
          const promise2 = axios.get(URL2);
          

          Promise.all([promise1, promise2]).then(function(values) {
            //console.log(values[0]);
            console.log("working?");
            //console.log(values[1]);
            res.render("project-edit", {
              name: values[1].data.name,
              info: values[1].data.info,
              collaborators: values[1].data.collaborators,
              id: values[1].data._id,
              users: values[0].data,
              napaka1: jeNapaka,
              success: uspesnoRemoved,
              successfullyAdded: uspesnoAdded,
              successfullyEdited: uspesnoEdited
            });
          });
  };

  
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
                id: odgovor.data._id,
                napaka: jeNapaka
              });
          });
    

  };

/* POST - Add project collaborators */
const addProjectCollaborators = (req, res) => {
  var projectId = req.params.id;
  if (!req.body.username || !req.body.project_role) {

  } else {
    axios({
      method: 'post',
      url: apiParametri.streznik + '/api/projects/' + projectId + '/add-collaborators',
      data: {
        username: req.body.username,
        project_role: req.body.project_role
      }
    }).then(() => {
      var string = "successfully added";
      res.redirect('/projects/' + projectId + '?error=' + string);
    }).catch((napaka) => {
      var string = "napakaPriDodajanjuUserja";
    res.redirect('/projects/' + projectId + '?error=' + string);

    });
  }
};

/* PUT - Edit collaborators roles */

const editProjectCollaboratorRole = (req, res) => {
  var projectId = req.params.id;
  var collaboratorId = req.params.idC;
  if (!req.body.project_role) {

  } else {
    axios({
      method: 'put',
      url: apiParametri.streznik + '/api/projects/' + projectId + '/edit-collaborator/' + collaboratorId,
      data: {
        project_role: req.body.project_role
      }
    }).then(() => {
      var string = "successfully edited"
      res.redirect('/projects/' + projectId + '?edit=' + string);
    }).catch((napaka) => {
      var string = "napaka";
    res.redirect('/projects/' + projectId + '?error=' + string);

    });
  }
};

/* DELETE - Remove collaborators from a projects */

const deleteProjectCollaborator = (req, res) => {
  var projectId = req.params.id;
  var collaboratorId = req.params.idC;
  axios({
      method: 'delete',
      url: apiParametri.streznik + '/api/projects/' + projectId + '/delete-collaborator/' + collaboratorId,
      
    }).then(() => {
      var string = "success";
      res.redirect('/projects/' + projectId + '?error=' + string);
    }).catch((napaka) => {
      var string = "napaka";
    res.redirect('/projects/' + projectId + '?error=' + string);

    });
  
};

module.exports = {
  availableCollaboratorsList,
  podrobnostiProject,
  addProjectCollaborators,
  editProjectCollaboratorRole,
  deleteProjectCollaborator
        
};