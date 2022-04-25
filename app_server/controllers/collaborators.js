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

    var vloga = user.role;
    var layout1 = 'layout';
    if (vloga == "user") {
        layout1 = "layout-user";
    }

    // je napaka?
    var napaka = req.query.error;
    var jeNapaka = false;
    if (napaka == "napakaPriDodajanjuUserja") {
        jeNapaka = true;
    }
    // je succesfully removed
    var success = req.query.error;
    var uspesnoRemoved = false;
    if (success == "success") {
        uspesnoRemoved = true;
    }
    // je successfully added
    var success = req.query.error;
    var uspesnoAdded = false;
    if (success == "successfully added") {
        uspesnoAdded = true;
    }
    // je successfully edited
    var successfullyEdited = req.query.edit;
    var uspesnoEdited = false;
    if (successfullyEdited == "successfully edited") {
        uspesnoEdited = true;
    }
    // duplikat pri spreminjanju imena projekta
    var napakaEdit = false;
    if (req.query.error == "napaka") {
        napakaEdit = true;
    }

    var successfullyEditedP = req.query.editp;
    var uspesnoPosodobljeno = false;
    if (successfullyEditedP == "success") {
        uspesnoPosodobljeno = true;
    }

    let URL1 = apiParametri.streznik + '/api/users';
    let URL2 = apiParametri.streznik + '/api/projects/' + projectId;

    const promise1 = axios.get(URL1);
    const promise2 = axios.get(URL2);


    Promise.all([promise1, promise2]).then(function(values) {



        var hasProductOwner = false;
          var hasTeamMembers = false;
          var hasScrumMaster = false;
          var missingProductOwner = true;
          var missingScrumMaster = true;
          var missingTeamMember = true;
          var collaborators = values[1].data.collaborators;
          for (var i = 0; i < collaborators.length; i++) {
            if (collaborators[i].project_role == "Product Manager") {
              hasProductOwner = true;
              missingProductOwner = false;
            }
            if (collaborators[i].project_role == "Team Member") {
              hasTeamMembers = true;
              missingTeamMember = false;
            }
            if (collaborators[i].project_role == "Scrum Master") {
              hasScrumMaster = true;
              missingScrumMaster = false;
            }
          }
        res.render("project-edit", {
            name: values[1].data.name,
            info: values[1].data.info,
            collaborators: values[1].data.collaborators,
            id: values[1].data._id,
            users: values[0].data,
            napaka1: jeNapaka,
            success: uspesnoRemoved,
            successfullyAdded: uspesnoAdded,
            successfullyEdited: uspesnoEdited,
            successfullyEditedProject: uspesnoPosodobljeno,
            layout: layout1,
            napaka: napakaEdit,
            missingProductOwner: missingProductOwner,
            missingScrumMaster: missingScrumMaster,
            missingTeamMember: missingTeamMember
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

    if (napaka == "napaka") {
        jeNapaka = true;
    }

    console.log(jeNapaka);
    axios
        .get(apiParametri.streznik + '/api/projects/' + projectId)
        .then((odgovor) => {
            res.render('project-edit', {
                name: odgovor.data.name,
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
    var prole = req.body.project_role;
    if (prole == "Product Owner") {
        prole = "Product Manager";
    }
    if (!req.body.username || !req.body.project_role) {

    } else {
        axios({
            method: 'post',
            url: apiParametri.streznik + '/api/projects/' + projectId + '/add-collaborators',
            data: {
                username: req.body.username,
                project_role: prole,
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
    var prole = req.body.project_role;
    if (prole == "Product Owner") {
        prole = "Product Manager";
    }
    if (!req.body.project_role) {

    } else {
        axios({
            method: 'put',
            url: apiParametri.streznik + '/api/projects/' + projectId + '/edit-collaborator/' + collaboratorId,
            data: {
                project_role: prole,
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
