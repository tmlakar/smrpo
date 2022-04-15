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
    var prekrivanje = req.query.prekrivanje;
    var sePrekriva = false;
    if (prekrivanje == "se") {
        sePrekriva = true;
    }
    var number = parseInt(req.query.sprint);
    console.log("stevilka")
    console.log(number)
        //napake glede datumov
    var napakaDate = req.query.napakaDate;
    var startPast = false;
    if (napakaDate == "start") {
        startPast = true;
    }
    var endPast = false;
    if (napakaDate == "end") {
        endPast = true;
    }
    var startEndPast = false;
    if (napakaDate == "startend") {
        endPast = true;
    }
    var correctDate = false;
    if (napakaDate == "correct") {
        correctDate = true;
    }
    var sizeBig = false;
    var napakaSize = req.query.napakaSize;
    if (napakaSize == "tooBig") {
        sizeBig = true;
    }
    var successfullyDeletedSprint = req.query.delete;
    var uspesnoIzbrisan = false;
    if (successfullyDeletedSprint == "success") {
        uspesnoIzbrisan = true;
    }
    var successfullyUpdated = req.query.update;
    var uspesnoPosodobljeno = false;
    if (successfullyUpdated == "success") {
        uspesnoPosodobljeno = true;
    }
    var successfullyAdded = req.query.add;
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
    if (user.role == "admin") {
        nivoDostopa = true;
    }
    var vloga = user.role;

    //user feedback uporabniske zgodbe
    //uspesno dodana zgodba
    var successfullyAddedStory = req.query.addstory;
    var uspesnoDodanaZgodba = false;
    if (successfullyAddedStory == "successfully added story") {
        uspesnoDodanaZgodba = true;
    }
    //uspesno posodobljena zgodba
    var successfullyEditedStory = req.query.edited;
    var uspesnoPosodobljenaZgodba = false;
    if (successfullyEditedStory == "successfully edited") {
        uspesnoPosodobljenaZgodba = true;
    }
    //napaka pri posodabljanju zgodbe
    var neuspesnoPosodobljenaZgodba = false;
    if (req.query.error == "napakaPriPosodabljanjuUporabniskeZgodbe") {
        neuspesnoPosodobljenaZgodba = true;
    }
    //uspesno odstranjena zgodba
    var successfullyRemovedStory = req.query.removed;
    var uspesnoOdstranjenaZgodba = false;
    if (successfullyRemovedStory == "successfully removed") {
        uspesnoOdstranjenaZgodba = true;
    }
    //uspesno dodan acceptance test
    var successfullyAddedAccepTest = req.query.addtest;
    var uspesnoDodanSprejemniTest = false;
    if (successfullyAddedAccepTest == "successfully added acceptance test") {
        uspesnoDodanSprejemniTest = true;
    }
    //Napaka pri dodajanju acceptance testa
    var neuspesnoDodanTest = false;
    if (req.query.error == "napakaPriDodajanjuSprejemnegaTesta") {
        neuspesnoDodanTest = true;
    }
    //uspesno dodan komentar
    var successfullyAddedComment = req.query.addcomment;
    var uspesnoDodanKomenar = false;
    if (successfullyAddedComment == "successfully added comment") {
        uspesnoDodanKomenar = true;
    }
    //Napaka pri dodajanju komentarja
    var neuspesnoDodanKomentar = false;
    if (req.query.error == "napakaPriDodajanjuKomentarja") {
        neuspesnoDodanKomentar = true;
    }
    //uspesno dodana naloga
    var successfullyAddedTask = req.query.addtask;
    var uspesnoDodanaNaloga = false;
    if (successfullyAddedTask == "successfully added task") {
        uspesnoDodanaNaloga = true;
    }
    //Napaka pri dodajanju naloge
    var neuspesnoDodanaNaloga = false;
    if (req.query.error == "napakaPriDodajanjuSubtaska") {
        neuspesnoDodanaNaloga = true;
    }
    //uspesno posodobljena naloga
    var successfullyUpdatedTask = req.query.successful;
    var uspesnoPosodobljenaNaloga = false;
    if (successfullyUpdatedTask == "successfully updated task") {
        uspesnoPosodobljenaNaloga = true;
    }
    //Napaka pri posodabljanju naloge
    var neuspesnoPosodobljenaNaloga = false;
    if (req.query.error == "napakaPriPosodabljanjuNaloge") {
        neuspesnoPosodobljenaNaloga = true;
    }
    //uspesno dodan lastnik naloge
    var successfullyAddedTaskAssign = req.query.updateowner;
    var uspesnoDodanLastnik = false;
    if (successfullyAddedTaskAssign == "successfully added assignee") {
        uspesnoDodanLastnik = true;
    }
    //napaka pri dodajanju lastnika naloge
    var neuspesnoDodanLastnik = false;
    if (req.query.error == "napakaPriPosodabljanjuLastnika") {
        neuspesnoDodanLastnik = true;
    }
    //uspesno zbrisana naloga
    var successfullyDeletedTask = req.query.successDelete;
    var uspesnoZbrisanaNaloga = false;
    if (successfullyDeletedTask == "successfully deleted task") {
        uspesnoZbrisanaNaloga = true;
    }
    //napaka pri brisanju naloge
    var neuspesnoZbrisanaNaloga = false;
    if (req.query.error == "napakaPriBrisanjuNaloge") {
        neuspesnoZbrisanaNaloga = true;
    }
    // edited story owner
    var uspesnoPosodobljenOwnerZgodbe = false;
    if (req.query.success == "successfully edited story owner") {
        uspesnoPosodobljenOwnerZgodbe = true;
    }
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

    var username = user.username;
    var usernameS = user.username;
    console.log(usernameS)
    var projectId = req.params.id;
    axios
        .get(apiParametri.streznik + '/api/projects/' + projectId)
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
            var teamMembersUsernames = [];
            var iTMUsr = 0;
            for (let i = 0; i < collaborators.length; i++) {
                if (collaborators[i].project_role == "Team Member") {
                    teamMembers[i4] = collaborators[i];
                    teamMembersUsernames[iTMUsr] = collaborators[i].username;
                    i4 = i4 + 1;
                    iTMUsr = iTMUsr + 1;
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

            //ima ze acceptance teste? ker ce ne, tut se nesme vidt add to sprint pa urejanje siz-a

            var inProcessSprintsNumbers = [];
            var inProcess = 0;
            var finishedSprintsNumbers = [];
            var futureSprintsNumbers = [];
            var now = new Date().setHours(0, 0, 0, 0);
            for (let i = 0; i < sprinti.length; i++) {
                var start = new Date(sprinti[i].startDate).setHours(0, 0, 0, 0);
                var end = new Date(sprinti[i].endDate).setHours(0, 0, 0, 0);
                //če je finished
                if ((start < now) && (end < now)) {
                    finishedSprints[i1] = sprinti[i];
                    i1 = i1 + 1;
                }
                //če je in process
                if ((start <= now) && (end >= now)) {
                    inProcessSprints[i2] = sprinti[i];
                    inProcessSprintsNumbers = sprinti[i].number;
                    inProcess = inProcess + 1;
                    i2 = i2 + 1;
                }
                //če je v prihodnosti
                if ((start > now) && (end > now)) {
                    futureSprints[i3] = sprinti[i];
                    i3 = i3 + 1;
                }
            }




            if (vloga == "user") {
                //ugotovimo kaj je njegova vloga na tem projektu
                var scrumMaster = false;
                if (scrumMasterUsername == username) {
                    scrumMaster = true;
                }
                // isto ugotovimo al je product manager
                var productManager = false;
                if (productManagerUsername == username) {
                    productManager = true;
                }
                // cez tabelo usernamov pa pol ce je katero isto vrnes true
                var teamMember = false;
                for (var i = 0; i < teamMembersUsernames.length; i++) {
                    if (username == teamMembersUsernames[i]) {
                        teamMember = true;
                        break;
                    }
                }

                res.render('project', {
                    name: odgovor.data.name,
                    collaborators: collaborators,
                    id: projectId,
                    username: usernameS,
                    sprints: sprinti,
                    finishedSprints: finishedSprints,
                    inProcessSprints: inProcessSprints,
                    inProcessSprintsNumbers: inProcessSprintsNumbers,
                    futureSprints: futureSprints,
                    teamMembers: teamMembers,
                    productManagers: productManagers,
                    scrumMasters: scrumMasters,
                    userStories: uporabniskeZgodbe,
                    admin: nivoDostopa,
                    info: info,
                    layout: 'layout-user',
                    scrumMaster: scrumMaster,
                    productManager: productManager,
                    teamMember: teamMember,
                    successfullyAddedSprint: uspesnoDodano,
                    successfullyAddedStory: uspesnoDodanaZgodba,
                    successfullyAddedSprint: uspesnoDodano,
                    successfullyUpdatedSprint: uspesnoPosodobljeno,
                    successfullyDeletedSprint: uspesnoIzbrisan,
                    successfullyEditedStory: uspesnoPosodobljenaZgodba,
                    successfullyRemovedStory: uspesnoOdstranjenaZgodba,
                    successfullyAddedAccepTest: uspesnoDodanSprejemniTest,
                    successfullyAddedComment: uspesnoDodanKomenar,
                    number: number,
                    prekrivanje: sePrekriva,
                    startPast: startPast,
                    endPast: endPast,
                    startEndPast: startEndPast,
                    correctDate: correctDate,
                    sizeBig: sizeBig,
                    errorAddComment: neuspesnoDodanKomentar,
                    errorAddAccepTest: neuspesnoDodanTest,
                    successfullyAddedTask: uspesnoDodanaNaloga,
                    errorAddTask: neuspesnoDodanaNaloga,
                    successfullyUpdatedTask: uspesnoPosodobljenaNaloga,
                    errorUpdateTask: neuspesnoPosodobljenaNaloga,
                    successfullyAddedTaskAssign: uspesnoDodanLastnik,
                    errorAddTaskAssign: neuspesnoDodanLastnik,
                    successfullyDeletedTask: uspesnoZbrisanaNaloga,
                    errorDeleteTask: neuspesnoZbrisanaNaloga,
                    errorEditedStory: neuspesnoPosodobljenaZgodba,
                    uspesnoPosodobljenOwnerZgodbe: uspesnoPosodobljenOwnerZgodbe,
                    successfullyAddedPublish: uspesnoDodanaObjava,
                    errorAddPublish: neuspesnoDodanaObjava,
                    successfullyAddedPublishComment: uspesnoDodanKomentarObjavi,
                    errorAddPublishComment: neuspesnoDodanKomentarObjavi,
                    successfullyDeletePublish: uspesnoZbrisanaObjava,
                    errorDeletePublish: neuspesnoZbrisanaObjava,
                    successfullyDeletePublishComment: uspesnoZbrisanKomentarObjave,
                    errorDeletePublishComment: neuspesnoZbrisanKomentarObjave,

                });
            } else {

                res.render('project', {
                    name: odgovor.data.name,
                    id: projectId,
                    sprints: sprinti,
                    username: usernameS,
                    finishedSprints: finishedSprints,
                    inProcessSprints: inProcessSprints,
                    inProcessSprintsNumbers: inProcessSprintsNumbers,
                    futureSprints: futureSprints,
                    userStories: uporabniskeZgodbe,
                    teamMembers: teamMembers,
                    productManagers: productManagers,
                    scrumMasters: scrumMasters,
                    admin: nivoDostopa,
                    info: info,
                    layout: 'layout',
                    scrumMaster: scrumMaster,
                    productManager: productManager,
                    teamMember: teamMember,
                    successfullyAddedSprint: uspesnoDodano,
                    successfullyAddedStory: uspesnoDodanaZgodba,
                    successfullyAddedSprint: uspesnoDodano,
                    successfullyDeletedSprint: uspesnoIzbrisan,
                    successfullyEditedStory: uspesnoPosodobljenaZgodba,
                    successfullyRemovedStory: uspesnoOdstranjenaZgodba,
                    successfullyAddedAccepTest: uspesnoDodanSprejemniTest,
                    successfullyAddedComment: uspesnoDodanKomenar,
                    number: number,
                    prekrivanje: sePrekriva,
                    startPast: startPast,
                    endPast: endPast,
                    startEndPast: startEndPast,
                    correctDate: correctDate,
                    sizeBig: sizeBig,
                    errorAddComment: neuspesnoDodanKomentar,
                    errorAddAccepTest: neuspesnoDodanTest,
                    successfullyAddedTask: uspesnoDodanaNaloga,
                    errorAddTask: neuspesnoDodanaNaloga,
                    successfullyUpdatedTask: uspesnoPosodobljenaNaloga,
                    errorUpdateTask: neuspesnoPosodobljenaNaloga,
                    successfullyAddedTaskAssign: uspesnoDodanLastnik,
                    errorAddTaskAssign: neuspesnoDodanLastnik,
                    successfullyDeletedTask: uspesnoZbrisanaNaloga,
                    errorDeleteTask: neuspesnoZbrisanaNaloga,
                    errorEditedStory: neuspesnoPosodobljenaZgodba,
                    uspesnoPosodobljenOwnerZgodbe: uspesnoPosodobljenOwnerZgodbe,
                    successfullyAddedPublish: uspesnoDodanaObjava,
                    errorAddPublish: neuspesnoDodanaObjava,
                    successfullyAddedPublishComment: uspesnoDodanKomentarObjavi,
                    errorAddPublishComment: neuspesnoDodanKomentarObjavi,
                    successfullyDeletePublish: uspesnoZbrisanaObjava,
                    errorDeletePublish: neuspesnoZbrisanaObjava,
                    successfullyDeletePublishComment: uspesnoZbrisanKomentarObjave,
                    errorDeletePublishComment: neuspesnoZbrisanKomentarObjave,

                });
            }
        });
};




module.exports = {
    prikaz,
};