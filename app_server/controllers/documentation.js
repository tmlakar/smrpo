const fs = require('fs');
const https = require("https");
var formidable = require('formidable');


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

    var uspesnoPosodobljenaDokumentacija = false;
    if (req.query.editd == "success") {
        uspesnoPosodobljenaDokumentacija = true;
    }
    var uspesnoDownloadedDokumentacija = false;
    if (req.query.download == "success") {
        uspesnoDownloadedDokumentacija = true;
    }
   
  

    

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
                uspesnoPosodobljenaDokumentacija: uspesnoPosodobljenaDokumentacija,
                documentation: odgovor.data.documentation,
                uspesnoDownloadedDokumentacija: uspesnoDownloadedDokumentacija,

            });
        });


};

/* */
const updateDocumentation = (req, res) => {

    var projectId = req.params.id;

    if (!req.body.documentation) {
      
    } else {
    axios({
      method: 'put',
      url: apiParametri.streznik + '/api/projects/' + projectId + '/documentation-edit',
      data: {
           documentation: req.body.documentation,
           }
      })
      .then(() => {
          var string = "success";
          res.redirect('/project/' + projectId + '/documentation' + '?editd=' + string);
      }).catch((error) => {
        var string = "napaka";
        res.redirect('/project/' + projectId + '/documentation' + '?error=' + string);
      });
    }
};

/* */
const downloadDocumentation = (req, res) => {

    var projectId = req.params.id;

    axios.get(apiParametri.streznik + '/api/projects/' + projectId)
    .then((odgovor) => {

        var documentation = odgovor.data.documentation;
        console.log(documentation);
       
        //write documentation into a file and save to downloads folder
        var fs = require('fs');
        var path = require('path'); 
        var DOWNLOAD_DIR = path.join(process.env.HOME || process.env.USERPROFILE, 'downloads/');
        var file_path = path.join(DOWNLOAD_DIR, 'documentation.txt');

        fs.writeFile(file_path, documentation, function (err) {
        if (err) return console.log(err);
        console.log('documentation.txt');
        });

        

        var string = "success";
        res.redirect('/project/' + projectId + '/documentation' + '?download=' + string);

    });
    
  };

/* */
  const uploadDocumentation = (req, res) => {
    
    var projectId = req.params.id;
    var documentation = req.body.documentation;
    console.log(documentation);

    if (!req.body.documentation) {
      
    } else {
    axios({
      method: 'put',
      url: apiParametri.streznik + '/api/projects/' + projectId + '/documentation-edit',
      data: {
           documentation: req.body.documentation,
           }
      })
      .then(() => {
          var string = "success";
          res.redirect('/project/' + projectId + '/documentation' + '?editd=' + string);
      }).catch((error) => {
        var string = "napaka";
        res.redirect('/project/' + projectId + '/documentation' + '?error=' + string);
      });
    }


  };

  module.exports = {
    prikaz,
    updateDocumentation,
    downloadDocumentation,
    uploadDocumentation
    
};