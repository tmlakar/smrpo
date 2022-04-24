var apiParametri = {
    streznik: "http://localhost:" + (process.env.PORT || 3000),
};
if (process.env.NODE_ENV === "production") {

}
const axios = require("axios").create({
    baseURL: apiParametri.streznik,
    timeout: 5000,
});

function isFutureDate(selected){
  selected.setHours(0,0,0,0);
  var now = new Date();
  now.setHours(0,0,0,0);
  if (selected < now) {
    // selected date is in the past
    return false;
  }
  else if(selected >= now){
    return true;
  }
}

var prikaziAcReady = (req, res) => {
  var projectId = req.params.id;
  //pridobimo vse storye. ki so acceptance ready - so v sprintu ki je končan, niso še sprejete, so končane in imajo sprejemne teste
  axios
      .get(apiParametri.streznik + '/api/projects/' + projectId)
      .then((odgovor) => {
        var projekt = odgovor.data;
        var stories = projekt.userStories;
        var acReadyStories = [];
        var doneStories = [];
        var notFinishedStories = [];
        for(var i= 0; i < stories.length; i++){
          //ali so v sprintu ki je končan
          var finishedSprint = false;
          var sprint = stories[i].sprint;
          for(var j=0; j<projekt.sprints.length; j++){
            if(projekt.sprints[j].number == sprint){
              if(isFutureDate(new Date(projekt.sprints[j].startDate)) == false && isFutureDate(new Date(projekt.sprints[j].endDate))==false){
                finishedSprint = true;
              }
            }
          }
          //ostali pogoji za acceptance ready stories
          //ne pozabi na koncu dodat finished sprints = true ker zdaj samo testiram ker se še ni končal
          if(stories[i].accepted == false && stories[i].finished==true && stories[i].tests.length != 0 && finishedSprint == true){
            acReadyStories[i] = stories[i];
          }
          //pogledamo če je zgodba že sprejeta - te spadajo pod done
          else if(stories[i].accepted == true){
            doneStories[i] = stories[i];
          }
          //tuki tut še dodat za finished sprint je true
          else if(stories[i].accepted == false && stories[i].finished==false && finishedSprint == true){
            notFinishedStories[i] = stories[i];
          }
        }
        console.log(acReadyStories)
        res.render('acceptance-ready',{
          layout: 'layout-user',
          acceptanceReadyStories: acReadyStories,
          projectId: projectId,
          doneStories: doneStories,
          notFinishedStories: notFinishedStories
        });
      });
}

//sprejmi acceptance ready story v Done
var acceptStory = (req, res) => {
  //pokličem api, da posodobim atribut v bazi
  var projectId = req.params.projectId;
  var storyId = req.params.storyId;
  axios({
    method: 'put',
    url: apiParametri.streznik + '/api/stories/accept/' + projectId + '/' + storyId
    })
    .then(() => {
      console.log("uspešno sprejeta zgodba")
      var string = "successStory";
      res.redirect('/project/' + projectId + '/acceptance-ready/' + '?add=' + string);
    }).catch((error) => {
      console.log("napaka")
    });
}



var declineStory = (req, res) => {
  var projectId = req.params.id;
  var tokenParts = req.cookies.authcookie['žeton'].split('.');
  var encodedPayload = tokenParts[1];
  //var rawPayload = window.atob(encodedPayload);
  var rawPayload = Buffer.from(encodedPayload, 'base64').toString('ascii');
  var user = JSON.parse(rawPayload);
  console.log(req.body.comment)
  // //pokličem api, da posodobim atribut v bazi, poleg tega pošljem še komentar
  var projectId = req.params.projectId;
  var storyId = req.params.storyId;
  var komentar = req.body.comment;
  console.log("komentar")
  console.log(req.query.neki)
  axios({
    method: 'put',
    url: apiParametri.streznik + '/api/stories/decline/' + projectId + '/' + storyId,
    data: {
      komentar: komentar,
      username: user.username
    }
    })
    .then(() => {
      console.log("uspešno zavrnjena zgodba")
      //odgovor.data.projectId
      var string = "declinedStory";
      res.redirect('/project/' + projectId + '/acceptance-ready/' + '?add=' + string);
    }).catch((error) => {
      console.log("napaka")
    });
}

// get implementiram drugje - tukile samo updejti in creating

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

    // napaka - duplikat imena pri dodajanju zgodbe
    var napakaAddStory = false;
    if (req.query.error == "napakaPriDodajanjuUporabniskeZgodbe") {
        napakaAddStory = true;
    }

    if (napaka == "napaka") {
        jeNapaka = true;
    }

    var vloga = user.role;
    var layout1 = 'layout';
    if (vloga == 'user') {
        layout1 = 'layout-user';
    }

    console.log(jeNapaka);
    axios
        .get(apiParametri.streznik + '/api/projects/' + projectId)
        .then((odgovor) => {
            res.render('story-new', {
                name: odgovor.data.name,
                info: odgovor.data.info,
                collaborators: odgovor.data.collaborators,
                userStories: odgovor.data.userStories,
                sprints: odgovor.data.sprints,
                id: odgovor.data._id,
                napaka: jeNapaka,
                layout: layout1,
                napakaAddStory: napakaAddStory,

            });
        });


};

/* POST - Add new user story */
const addNewUserStory = (req, res) => {
    var projectId = req.params.id;
    if (!req.body.name || !req.body.aboutText || !req.body.priority || !req.body.businessValue) {

    } else {
        axios({
            method: 'post',
            url: apiParametri.streznik + '/api/projects/' + projectId + '/userStory-new',
            data: {
                name: req.body.name,
                aboutText: req.body.aboutText,
                priority: req.body.priority,
                businessValue: req.body.businessValue,

            }
        }).then((odgovor) => {
            var name = odgovor.name;
            var string = "successfully added story";
            res.redirect('/project/' + projectId + '?addstory=' + string + '#backlog');
        }).catch((napaka) => {
            var string = "napakaPriDodajanjuUporabniskeZgodbe";
            res.redirect('/project/' + projectId + '/new-user-story?error=' + string + '#backlog');

        });
    }
};

/* PUT - updating user story basic info */
const updateUserStoryInfo = (req, res) => {
    var projectId = req.params.id;
    var storyId = req.params.idStory;
    //console.log(req.body.name);
    var currName = req.body.nameOrig;
    var prefix = currName.substring(0, 3);
    //console.log(prefix + req.body.name);
    if (!req.body.aboutText || !req.body.priority || !req.body.businessValue) {

    } else {
        axios({
            method: 'put',
            url: apiParametri.streznik + '/api/projects/' + projectId + '/userStory/' + storyId + '/edit-info',
            data: {
                originalname: req.body.nameOrig,
                prefix: prefix,
                name: req.body.name,
                aboutText: req.body.aboutText,
                priority: req.body.priority,
                businessValue: req.body.businessValue,



            }
        }).then((odgovor) => {
            var name = odgovor.name;
            var string = "successfully edited";
            res.redirect('/project/' + projectId + '?edited=' + string + '#backlog');
        }).catch((napaka) => {
            var string = "napakaPriPosodabljanjuUporabniskeZgodbe";
            res.redirect('/project/' + projectId + '?error=' + string + '#backlog');

        });
    }
};

/* POST - Add subtask to a story */
const addSubtask = (req, res) => {
    var projectId = req.params.id;
    var storyId = req.params.idStory;

    if (!req.body.name || !req.body.hour) {

    } else {
        axios({
            method: 'post',
            url: apiParametri.streznik + '/api/projects/' + projectId + '/userStory/' + storyId + '/add-subtask',
            data: {
                name: req.body.name,
                hours: req.body.hour,
            }
        }).then((odgovor) => {
            var name = odgovor.name;
            var string = "successfully added task";
            res.redirect('/project/' + projectId + '?addtask=' + string + '#backlog');
        }).catch((napaka) => {
            var string = "napakaPriDodajanjuSubtaska";
            res.redirect('/project/' + projectId + '?error=' + string + '#backlog');

        });
    }
};


/* POST - Add size  */
const addSize = (req, res) => {
    var projectId = req.params.id;
    var storyId = req.params.idStory;

    if (!req.body.size) {

    } else {
        axios({
            method: 'post',
            url: apiParametri.streznik + '/api/projects/' + projectId + '/userStory/' + storyId + '/add-size',
            data: {
                size: req.body.size,

            }
        }).then((odgovor) => {
            var name = odgovor.name;
            var string = "successfull";
            res.redirect('/project/' + projectId + '?addsize=' + string + '#backlog');
        }).catch((napaka) => {
            var string = "napakaPriDodajanjuSize";
            res.redirect('/project/' + projectId + '?error=' + string + '#backlog');

        });
    }
};


/* PUT - updating subtask owner */
const addSubtaskOwner = (req, res) => {
    var tokenParts = req.cookies.authcookie['žeton'].split('.');
    var encodedPayload = tokenParts[1];
    //var rawPayload = window.atob(encodedPayload);
    var rawPayload = Buffer.from(encodedPayload, 'base64').toString('ascii');
    var user = JSON.parse(rawPayload);
    var username = user.username;
    var projectId = req.params.id;
    var storyId = req.params.idStory;
    var subtaskId = req.params.idSubtask;
    if (!req.body.subtaskOwnerUsername) {

    } else {
        axios({
            method: 'put',
            url: apiParametri.streznik + '/api/projects/' + projectId + '/userStory/' + storyId + '/subtask/' + subtaskId + '/edit-subtask-owner',
            data: {
                subtaskOwnerUsername: req.body.subtaskOwnerUsername,
                currentUsername: username
            }
        }).then((odgovor) => {
            var name = odgovor.name;
            var string = "successfully added assignee";
            res.redirect('/project/' + projectId + '?updateowner=' + string + '#backlog');
        }).catch((napaka) => {
            var string = "napakaPriPosodabljanjuLastnika";
            res.redirect('/project/' + projectId + '?error=' + string + '#backlog');

        });
    }
};

/* PUT - updating subtask */
const editSubtask = (req, res) => {
    var projectId = req.params.id;
    var storyId = req.params.idStory;
    var subtaskId = req.params.idSubtask;
    if (!req.body.name || !req.body.hour) {

    } else {
        axios({
            method: 'put',
            url: apiParametri.streznik + '/api/projects/' + projectId + '/userStory/' + storyId + '/subtask/' + subtaskId + '/edit-subtask',
            data: {
                name: req.body.name,
                hours: req.body.hour,
            }
        }).then((odgovor) => {
            var name = odgovor.name;
            var string = "successfully updated task";
            res.redirect('/project/' + projectId + '?successful=' + string + '#backlog');
        }).catch((napaka) => {
            var string = "napakaPriPosodabljanjuNaloge";
            res.redirect('/project/' + projectId + '?error=' + string + '#backlog');

        });
    }
};

/* DELETE - remove subtask */
const removeSubtask = (req, res) => {
    var projectId = req.params.id;
    var storyId = req.params.idStory;

    var subtaskId = req.params.idSubtask;
    axios({
        method: 'delete',
        url: apiParametri.streznik + '/api/projects/' + projectId + '/userStory/' + storyId + '/subtask/' + subtaskId + '/delete',

    }).then((odgovor) => {
        var name = odgovor.name;
        var string = "successfully deleted task";
        res.redirect('/project/' + projectId + '?successDelete=' + string + '#backlog');
    }).catch((napaka) => {
        var string = "napakaPriBrisanjuNaloge";
        res.redirect('/project/' + projectId + '?error=' + string + '#backlog');

    });

};

/* POST - Add acceptance test to a story */
const addAcceptanceTest = (req, res) => {
    var projectId = req.params.id;
    var storyId = req.params.idStory;
    if (!req.body.tests) {

    } else {
        axios({
            method: 'post',
            url: apiParametri.streznik + '/api/projects/' + projectId + '/userStory/' + storyId + '/add-test',
            data: {
                tests: req.body.tests,
            }
        }).then((odgovor) => {
            var name = odgovor.name;
            var string = "successfully added acceptance test";
            res.redirect('/project/' + projectId + '?addtest=' + string + '#backlog');
        }).catch((napaka) => {
            var string = "napakaPriDodajanjuSprejemnegaTesta";
            res.redirect('/project/' + projectId + '?error=' + string + '#backlog');

        });
    }
};

/* POST - Add comment to a story */
const addComment = (req, res) => {
    var projectId = req.params.id;
    var storyId = req.params.idStory;
    if (!req.body.comment || !req.body.commentOwnerUsername) {

    } else {
        axios({
            method: 'post',
            url: apiParametri.streznik + '/api/projects/' + projectId + '/userStory/' + storyId + '/add-comment',
            data: {
                comment: req.body.comment,
                commentOwnerUsername: req.body.commentOwnerUsername
            }
        }).then((odgovor) => {
            var name = odgovor.name;
            var string = "successfully added comment";
            res.redirect('/project/' + projectId + '?addcomment=' + string + '#backlog');
        }).catch((napaka) => {
            var string = "napakaPriDodajanjuKomentarja";
            res.redirect('/project/' + projectId + '?error=' + string + '#backlog');

        });
    }
};

/* POST - Add a flag to a story */
const addFlag = (req, res) => {
    var projectId = req.params.id;
    var storyId = req.params.idStory;
    if (!req.body.flag) {

    } else {
        axios({
            method: 'post',
            url: apiParametri.streznik + '/api/projects/' + projectId + '/userStory/' + storyId + '/add-flag',
            data: {
                flag: req.body.flag
            }
        }).then((odgovor) => {
            var name = odgovor.name;
            var string = "successfully added";
            res.redirect('/project/' + projectId + '?error=' + string + '#backlog');
        }).catch((napaka) => {
            var string = "napakaPriDodajanjuSubtaska";
            res.redirect('/project/' + projectId + '?error=' + string + '#backlog');

        });
    }
};

/* PUT - updating  owner */
const updateOwner = (req, res) => {
    var projectId = req.params.id;
    var storyId = req.params.idStory;
    if (!req.body.userStorieOwnerUsername) {

    } else {
        axios({
            method: 'put',
            url: apiParametri.streznik + '/api/projects/' + projectId + '/userStory/' + storyId + '/edit-owner',
            data: {
                userStorieOwnerUsername: req.body.userStorieOwnerUsername,
            }
        }).then((odgovor) => {
            var name = odgovor.name;
            var string = "successfully edited story owner";
            res.redirect('/project/' + projectId + '?success=' + string + '#backlog');
        }).catch((napaka) => {
            var string = "napakaPriPosodabljanjuUporabniskeZgodbe";
            res.redirect('/project/' + projectId + '?error=' + string + '#backlog');

        });
    }
};


/* DELETE - deleting story */
const deleteStory = (req, res) => {
    var projectId = req.params.id;
    var storyId = req.params.idStory;
    axios({
        method: 'delete',
        url: apiParametri.streznik + '/api/projects/' + projectId + '/userStory/' + storyId + '/delete',

    }).then((odgovor) => {
        var name = odgovor.name;
        var string = "successfully removed";
        res.redirect('/project/' + projectId + '?removed=' + string + '#backlog');
    }).catch((napaka) => {
        var string = "napakaPriPosodabljanjuUporabniskeZgodbe";
        res.redirect('/project/' + projectId + '?error=' + string + '#backlog');

    });

};

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* */
var podrobnostiProjectSprint = (req, res) => {
    var tokenParts = req.cookies.authcookie['žeton'].split('.');
    var encodedPayload = tokenParts[1];
    //var rawPayload = window.atob(encodedPayload);
    var rawPayload = Buffer.from(encodedPayload, 'base64').toString('ascii');
    var user = JSON.parse(rawPayload);
    var projectId = req.params.id;
    var sprintId = req.params.sprintId;


    var vloga = user.role;
    var layout1 = 'layout';
    if (vloga == 'user') {
        layout1 = 'layout-user';
    }


    axios
        .get(apiParametri.streznik + '/api/projects/' + projectId)
        .then((odgovor) => {

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
          var username = user.username;
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
          }

          // sprints trenutni

          const finishedSprints = [];
            var i1 = 0;
            const inProcessSprints = [];
            var i2 = 0;
            const futureSprints = [];
            var i3 = 0;
            var sprinti = odgovor.data.sprints;
         //kater number je sprint
         var numberSprintId = 0;
          var inProcessSprintsNumbers = [];
            var inProcess = 0;
            var nameOfCurrentSprint = "Sprint";
            var currentSprintNumber = 0;
            var finishedSprintsNumbers = [];
            var futureSprintsNumbers = [];
            var now = new Date().setHours(0, 0, 0, 0);
            for (let i = 0; i < sprinti.length; i++) {
                var start = new Date(sprinti[i].startDate).setHours(0, 0, 0, 0);
                var end = new Date(sprinti[i].endDate).setHours(0, 0, 0, 0);
                if (sprinti[i]._id == sprintId) {
                    numberSprintId = sprinti[i].number;
                }
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
                    nameOfCurrentSprint = nameOfCurrentSprint + " " + sprinti[i].number;
                    currentSprintNumber = sprinti[i].number;
                }
                //če je v prihodnosti
                if ((start > now) && (end > now)) {
                    futureSprints[i3] = sprinti[i];
                    i3 = i3 + 1;
                }
            }

            console.log(numberSprintId);
            var numberOfSprint = numberSprintId;


            res.render('sprint-tasks', {
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
                nameOfCurrentSprint: "Sprint " + numberSprintId,
                numberOfSprint: numberOfSprint,
                currentSprintNumber: currentSprintNumber,

            });
        });


};

/* POST - Add story to a sprint  */
const addToSprint = (req, res) => {
    var projectId = req.params.id;
    var storyId = req.params.idStory;
    console.log(req.body.sprint);

    axios
        .get(apiParametri.streznik + '/api/projects/' + projectId)
        .then((odgovor) => {
            // size of current sprint -> cez sprinte + pogledas kok je size current sprinta
            // size of all cards in current sprint -> cez kartice + pogledas
            //ločimo sprinte v pretekle, v teku in v prihodnosti


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



            //stevilo current sprinta + size current sprinta
            var inProcessSprintsNumbers = [];
            var inProcessSprintSize = 0;

            var inProcess = 0;
            var finishedSprintsNumbers = [];
            var futureSprintsNumbers = [];
            var now = new Date().setHours(0, 0, 0, 0);
            for (let i = 0; i < sprinti.length; i++) {
                var start = new Date(sprinti[i].startDate).setHours(0, 0, 0, 0);
                var end = new Date(sprinti[i].endDate).setHours(0, 0, 0, 0);
                //če je finished
                if ((start < now) && (end < now)) {

                }
                //če je in process
                if ((start <= now) && (end >= now)) {

                    inProcessSprintsNumbers = sprinti[i].number;
                    inProcessSprintSize = sprinti[i].sprintSize;
                    inProcess = inProcess + 1;

                }
                //če je v prihodnosti
                if ((start > now) && (end > now)) {

                }
            }

            //cez uporabniske zgodbe pa katere so v sprintu pa sestevanje siza
            var sizeAllStoriesInSprint = 0;
            var sizeCurrentStory = 0;
            for (let i = 0; i < uporabniskeZgodbe.length; i++) {
                if (uporabniskeZgodbe[i].sprint == inProcessSprintsNumbers) {
                    sizeAllStoriesInSprint = sizeAllStoriesInSprint + uporabniskeZgodbe[i].size;
                } else if (uporabniskeZgodbe[i]._id == storyId) {
                    sizeCurrentStory = uporabniskeZgodbe[i].size;
                }

            }
            if (sizeAllStoriesInSprint == inProcessSprintSize) {
                var string = "full";
                return res.redirect('/project/' + projectId + '?addtosprint=' + string + '#backlog');
            }

            if (sizeAllStoriesInSprint + sizeCurrentStory > inProcessSprintSize) {
                var string = "unsuccessful";
                return res.redirect('/project/' + projectId + '?addtosprint=' + string + '#backlog');
            }


            if (!req.body.sprint) {

            } else {
                axios({
                    method: 'post',
                    url: apiParametri.streznik + '/api/projects/' + projectId + '/userStory/' + storyId + '/add-to-sprint',
                    data: {
                        sprint: req.body.sprint,

                    }
                }).then((odgovor) => {
                    var name = odgovor.name;
                    var string = "successfull";
                    res.redirect('/project/' + projectId + '?addsprint=' + string + '#backlog');
                }).catch((napaka) => {
                    var string = "napakaPriDodajanjuSubtaska";
                    res.redirect('/project/' + projectId + '?error=' + string + '#backlog');

                });
            }
        });



};


/* multiple axios poizvedbe za dodajanje kartic v sprint */
const addMultipleToSprint = (req, res) => {
    var projectId = req.params.id;

    //tabela idStoryjev bo
    var array = req.body.storiesArray;
    console.log(array);
    //split
    var IDs = array.split(",");
    console.log(IDs);
    console.log(req.body.sprint);

    if (array == '') {
        // opozorilo da mora bit checked.. oziroma ne preusmeri.
        return;
    }
    var currentSprintNumber = req.body.sprint;

    // axios get
    axios
        .get(apiParametri.streznik + '/api/projects/' + projectId)
        .then((odgovor) => {
            // size of current sprint -> cez sprinte + pogledas kok je size current sprinta
            // size of all cards in current sprint -> cez kartice (idje dobis iz tabele IDs) + pogledas

            //sprinti
            var sprinti = odgovor.data.sprints;

            // uporabniske zgodbe
           var uporabniskeZgodbe = odgovor.data.userStories;

            //stevilo current sprinta + size current sprinta
            var inProcessSprintsNumbers = [];
            var inProcessSprintSize = 0;

            var inProcess = 0;
            var now = new Date().setHours(0, 0, 0, 0);
            for (let i = 0; i < sprinti.length; i++) {
                var start = new Date(sprinti[i].startDate).setHours(0, 0, 0, 0);
                var end = new Date(sprinti[i].endDate).setHours(0, 0, 0, 0);
                //če je in process
                if ((start <= now) && (end >= now)) {

                    inProcessSprintsNumbers = sprinti[i].number;
                    inProcessSprintSize = sprinti[i].sprintSize;
                    inProcess = inProcess + 1;

                }
            }

            //cez uporabniske zgodbe pa katere so v sprintu pa sestevanje siza
            var sizeAllStoriesInSprint = 0;
            var sizeCurrentStory = 0;
            //cez tabelco z idji uporabniskih zgodb

            for (let i = 0; i < uporabniskeZgodbe.length; i++) {
                if (uporabniskeZgodbe[i].sprint == inProcessSprintsNumbers) {
                    sizeAllStoriesInSprint = sizeAllStoriesInSprint + uporabniskeZgodbe[i].size;
                }
            }

            var sizeAllStoriesChecked = 0;
            for (let i = 0; i < uporabniskeZgodbe.length; i++) {
                for (let j = 0; j < IDs.length; j++) {
                    if (uporabniskeZgodbe[i]._id == IDs[j]) {
                        sizeAllStoriesChecked = sizeAllStoriesChecked + uporabniskeZgodbe[i].size;
                    }
                }
            }




            if (sizeAllStoriesInSprint == inProcessSprintSize) {
                var string = "full";
                return res.redirect('/project/' + projectId + '?addtosprint=' + string + '#backlog');
            }

            if (sizeAllStoriesInSprint + sizeAllStoriesChecked > inProcessSprintSize) {
                var string = "unsuccessful";
                return res.redirect('/project/' + projectId + '?addmtosprint=' + string + '#backlog');
            }

            if (!req.body.storiesArray) {

            } else {
                for (var i = 0; i < IDs.length; i++) {
                console.log(IDs[i]);
                var storyId = IDs[i];
                axios({
                    method: 'post',
                    url: apiParametri.streznik + '/api/projects/' + projectId + '/userStory/' + storyId + '/add-to-sprint',
                    data: {
                        sprint: currentSprintNumber,

                    }

                }).then((odgovor) => {
                    var name = odgovor.name;

                }).catch((napaka) => {
                    var string = "napakaPriDodajanjuM";
                    return res.redirect('/project/' + projectId + '?error=' + string + '#backlog');

                });
             }
            var string = "successfull";
            res.redirect('/project/' + projectId + '?addsprintm=' + string + '#backlog');
            }


    });



};


module.exports = {
    podrobnostiProject,
    addNewUserStory,
    updateUserStoryInfo,
    addSubtask,
    addSubtaskOwner,
    addAcceptanceTest,
    addComment,
    addFlag,
    updateOwner,
    deleteStory,
    removeSubtask,
    editSubtask,
    addToSprint,
    addSize,
    podrobnostiProjectSprint,
    addMultipleToSprint,
    prikaziAcReady,
    acceptStory,
    declineStory
};
