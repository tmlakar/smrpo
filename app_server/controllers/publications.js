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

    var vloga = user.role;
    var layout1 = 'layout';
    if (vloga == 'user') {
        layout1 = 'layout-user';
    }


    axios
        .get(apiParametri.streznik + '/api/projects/' + projectId + '/project-wall')
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
            res.render('project-wall', {
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

/* Podrobnosti projekta */
var podrobnostiProjectnewPublication = (req, res) => {
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
        .get(apiParametri.streznik + '/api/projects/' + projectId + '/project-wall')
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

    if (!req.body.text) {

    } else {
        axios({

            url: apiParametri.streznik + '/api/projects/' + projectId + '/new-publication',
            data: {
                text: req.body.text,
                date: date,
            }
        }).then((odgovor) => {
            var name = odgovor.name;
            var string = "successfully added publication";
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
    if (!req.body.comment) {

    } else {
        axios({
            method: 'post',
            url: apiParametri.streznik + '/api/projects/' + projectId + '/publications/' + pubId + '/new-comment',
            data: {
                comment: req.body.comment,
                commentOwner: req.body.commentOwner,
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
    podrobnostiProjectnewPublication
};