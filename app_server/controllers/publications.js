var apiParametri = {
    streznik: "http://localhost:" + (process.env.PORT || 3000),
};
if (process.env.NODE_ENV === "production") {

}
const axios = require("axios").create({
    baseURL: apiParametri.streznik,
    timeout: 5000,
});


/* Podrobnosti projekta */
var podrobnostiProject = (req, res) => {
    var tokenParts = req.cookies.authcookie['žeton'].split('.');
    var encodedPayload = tokenParts[1];
    //var rawPayload = window.atob(encodedPayload);
    var rawPayload = Buffer.from(encodedPayload, 'base64').toString('ascii');
    var user = JSON.parse(rawPayload);
    var projectId = req.params.id;

    //uspesno dodana nova objava
    var successfullyAddedPublish = req.query.addpublication;
    var uspesnoDodanaObjava = false;
    if (successfullyAddedPublish == "successfully added publication") {
        uspesnoDodanaObjava = true;
    }
    //napaka pri dodajanju nove objave
    var neuspesnoDodanaObjava = false;
    if (req.query.error == "napakaPriDodajanjuObjave") {
        neuspesnoDodanaObjava = true;
    }
    //uspesno dodan komentar objavi
    var successfullyAddedPublishComment = req.query.addcomment;
    var uspesnoDodanKomentarObjavi = false;
    if (successfullyAddedPublishComment == "successfully published comment") {
        uspesnoDodanKomentarObjavi = true;
    }
    //napaka pri dodajanju komentarja objavi
    var neuspesnoDodanKomentarObjavi = false;
    if (req.query.error == "napakaKomentarObjave") {
        neuspesnoDodanKomentarObjavi = true;
    }
    //uspesno izbrisana objava
    var successfullyDeletePublish = req.query.removed;
    var uspesnoZbrisanaObjava = false;
    if (successfullyDeletePublish == "successfully removed publication") {
        uspesnoZbrisanaObjava = true;
    }
    //napaka pri brisanju objave
    var neuspesnoZbrisanaObjava = false;
    if (req.query.error == "napakaPriBrisanjuObjave") {
        neuspesnoZbrisanaObjava = true;
    }
    //uspesno izbrisan komentar objave
    var successfullyDeletePublishComment = req.query.successDelete;
    var uspesnoZbrisanKomentarObjave = false;
    if (successfullyDeletePublishComment == "successfully deleted comment") {
        uspesnoZbrisanKomentarObjave = true;
    }
    //napaka pri brisanju komentarja objave
    var neuspesnoZbrisanKomentarObjave = false;
    if (req.query.error == "napakaPriBrisanjuKomentarjaObjave") {
        neuspesnoZbrisanKomentarObjave = true;
    }


    var vloga = user.role;
    //console.log(vloga);
    var canAddNewPublication = false;
    var canAddNewComment = false;
    var canDelete = false;
    var layout1 = 'layout';
    if (vloga == 'user') {
        layout1 = 'layout-user';
        canAddNewPublication = true;
        canAddNewComment = true;

    }

    var username = user.username;
    var isScrumMaster = false;

    var uspesnoDodanaObjava = false;
    if (req.query.addpublication == "successful") {
        uspesnoDodanaObjava = true;
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
            res.render('project-wall', {
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
                uspesnoDodanaObjava: uspesnoDodanaObjava,
                canAddNewPublication: canAddNewPublication,
                canAddNewComment: canAddNewComment,
                canDelete: canDelete,
                isScrumMaster: isScrumMaster,
                role: vloga,
                successfullyAddedPublish: uspesnoDodanaObjava,
                errorAddPublish: neuspesnoDodanaObjava,
                successfullyAddedPublishComment: uspesnoDodanKomentarObjavi,
                errorAddPublishComment: neuspesnoDodanKomentarObjavi,
                successfullyDeletePublish: uspesnoZbrisanaObjava,
                errorDeletePublish: neuspesnoZbrisanaObjava,
                successfullyDeletePublishComment: uspesnoZbrisanKomentarObjave,
                errorDeletePublishComment: neuspesnoZbrisanKomentarObjave,

            });
        });


};

/* Podrobnosti projekta */
var podrobnostiProjectNewPublication = (req, res) => {
    var tokenParts = req.cookies.authcookie['žeton'].split('.');
    var encodedPayload = tokenParts[1];
    //var rawPayload = window.atob(encodedPayload);
    var rawPayload = Buffer.from(encodedPayload, 'base64').toString('ascii');
    var user = JSON.parse(rawPayload);
    var projectId = req.params.id;

    var vloga = user.role;
    var layout1 = 'layout';
    if (vloga == 'user') {
        layout1 = 'layout-user';
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

                }
            }
            res.render('new-publication', {
                name: odgovor.data.name,
                info: odgovor.data.info,
                collaborators: odgovor.data.collaborators,
                userStories: odgovor.data.userStories,
                sprints: odgovor.data.sprints,
                id: odgovor.data._id,
                layout: layout1,
                teamMembers: teamMembers,
                productManagers: productManagers,
                scrumMasters: scrumMasters,


            });
        });


};

/* POST - Add new publication */
const addNewPublication = (req, res) => {
    var projectId = req.params.id;
    var date = new Date();
    console.log(date);
    var tokenParts = req.cookies.authcookie['žeton'].split('.');
    var encodedPayload = tokenParts[1];
    var rawPayload = Buffer.from(encodedPayload, 'base64').toString('ascii');
    var user = JSON.parse(rawPayload);
    var currentUsername = user.username;



    if (!req.body.text) {

    } else {
        axios({
            method: 'post',
            url: apiParametri.streznik + '/api/projects/' + projectId + '/new-publication',
            data: {
                text: req.body.text,
                date: date,
                publicationOwner: currentUsername
            }
        }).then((odgovor) => {
            var name = odgovor.name;
            var string = "successful";
            res.redirect('/project/' + projectId + '/project-wall?addpublication=' + string);
        }).catch((napaka) => {
            var string = "napakaPriDodajanjuObjave";
            res.redirect('/project/' + projectId + '/project-wall?error=' + string);

        });
    }
};
/* POST - Add comment */
const addCommentToPublication = (req, res) => {
    var projectId = req.params.id;
    var pubId = req.params.idPublication;
    var date = new Date();
    var tokenParts = req.cookies.authcookie['žeton'].split('.');
    var encodedPayload = tokenParts[1];
    var rawPayload = Buffer.from(encodedPayload, 'base64').toString('ascii');
    var user = JSON.parse(rawPayload);
    var currentUsername = user.username;
    if (!req.body.comment) {

    } else {
        axios({
            method: 'post',
            url: apiParametri.streznik + '/api/projects/' + projectId + '/publications/' + pubId + '/new-comment',
            data: {
                comment: req.body.comment,
                commentOwner: currentUsername,
                date: date,

            }
        }).then((odgovor) => {
            var name = odgovor.name;
            var string = "successfully published comment";
            res.redirect('/project/' + projectId + '/project-wall?addcomment=' + string);
        }).catch((napaka) => {
            var string = "napakaKomentarObjave";
            res.redirect('/project/' + projectId + '/project-wall?error=' + string);

        });
    }
};

/* DELETE - remove comment */
const removeComment = (req, res) => {
    var projectId = req.params.id;
    var pubId = req.params.idPublication;

    var commentId = req.params.idComment;
    axios({
        method: 'delete',
        url: apiParametri.streznik + '/api/projects/' + projectId + '/publications/' + pubId + '/comment/' + commentId + '/remove',

    }).then((odgovor) => {
        var name = odgovor.name;
        var string = "successfully deleted comment";
        res.redirect('/project/' + projectId + '/project-wall?successDelete=' + string);
    }).catch((napaka) => {
        var string = "napakaPriBrisanjuKomentarjaObjave";
        res.redirect('/project/' + projectId + '/project-wall?error=' + string);

    });

};

/* DELETE - delete publication */
const deletePublication = (req, res) => {
    var projectId = req.params.id;
    var pubId = req.params.idPublication;
    axios({
        method: 'delete',
        url: apiParametri.streznik + '/api/projects/' + projectId + '/publications/' + pubId + '/remove',

    }).then((odgovor) => {
        var name = odgovor.name;
        var string = "successfully removed publication";
        res.redirect('/project/' + projectId + '/project-wall?removed=' + string);
    }).catch((napaka) => {
        var string = "napakaPriBrisanjuObjave";
        res.redirect('/project/' + projectId + '/project-wall?error=' + string);

    });

};
module.exports = {
    podrobnostiProject,
    addNewPublication,
    addCommentToPublication,
    removeComment,
    deletePublication,
    podrobnostiProjectNewPublication
};