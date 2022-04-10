var apiParametri = {
    streznik: "http://localhost:" + (process.env.PORT || 3000),
  };
  if (process.env.NODE_ENV === "production") {

  }
  const axios = require("axios").create({
    baseURL: apiParametri.streznik,
    timeout: 5000,
  });


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
      
      if(napaka == "napaka"){
        jeNapaka = true;
      }

      var vloga = user.role;
      var layout1 = 'layout';
      if (vloga == 'user') {
        layout1 = 'layout-user';
      }

      console.log(jeNapaka);
      axios
          .get (apiParametri.streznik + '/api/projects/' + projectId)
          .then((odgovor) => {
              res.render('story-new',
              { name: odgovor.data.name,
                info: odgovor.data.info,
                collaborators: odgovor.data.collaborators,
                userStories: odgovor.data.userStories,
                sprints: odgovor.data.sprints,
                id: odgovor.data._id,
                napaka: jeNapaka,
                layout: layout1
              });
          });
    

  };

  /* POST - Add new user story */
const addNewUserStory = (req, res) => {
    var projectId = req.params.id;
    if (!req.body.name || !req.body.aboutText || !req.body.priority || !req.body.businessValue || !req.body.size) {
        
    } else {
      axios({
        method: 'post',
        url: apiParametri.streznik + '/api/projects/' + projectId + '/userStory-new',
        data: {
            name: req.body.name,
            aboutText: req.body.aboutText,
            priority: req.body.priority,
            businessValue: req.body.businessValue,
            size: req.body.size,
        }
      }).then((odgovor) => {
        var name = odgovor.name;
        var string = "successfully added story";
        res.redirect('/project/' + projectId + '?addstory=' + string);
      }).catch((napaka) => {
        var string = "napakaPriDodajanjuUporabniskeZgodbe";
      res.redirect('/project/' + projectId + '?error=' + string);
  
      });
    }
  };

  /* PUT - updating user story basic info */
  const updateUserStoryInfo = (req, res) => {
    var projectId = req.params.id;
    var storyId = req.params.idStory;
    if (!req.body.name || !req.body.aboutText || !req.body.priority || !req.body.businessValue  || !req.body.size || !req.body.sprint) {
        
    } else {
      axios({
        method: 'put',
        url: apiParametri.streznik + '/api/projects/' + projectId + '/userStory/' + storyId + '/edit-info',
        data: {
            name: req.body.name,
            aboutText: req.body.aboutText,
            priority: req.body.priority,
            businessValue: req.body.businessValue,
            size: req.body.size,
            sprint: req.body.sprint,
        }
      }).then((odgovor) => {
        var name = odgovor.name;
        var string = "successfully edited";
        res.redirect('/project/' + projectId + '?edited=' + string);
      }).catch((napaka) => {
        var string = "napakaPriPosodabljanjuUporabniskeZgodbe";
      res.redirect('/project/' + projectId + '?error=' + string);
  
      });
    }
  };

  /* POST - Add subtask to a story */
const addSubtask = (req, res) => {
  var projectId = req.params.id;
  var storyId = req.params.idStory;
  if (!req.body.name || !req.body.subtaskOwnerUsername) {
      
  } else {
    axios({
      method: 'post',
      url: apiParametri.streznik + '/api/projects/' + projectId + '/userStory/' + storyId + '/add-subtask',
      data: {
        name: req.body.name,
        subtaskOwnerUsername: req.body.subtaskOwnerUsername,
      }
    }).then((odgovor) => {
      var name = odgovor.name;
      var string = "successfully added";
      res.redirect('/project/' + projectId + '?error=' + string);
    }).catch((napaka) => {
      var string = "napakaPriDodajanjuSubtaska";
    res.redirect('/project/' + projectId + '?error=' + string);

    });
  }
};

/* PUT - updating subtask owner */
const addSubtaskOwner = (req, res) => {
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
      }
    }).then((odgovor) => {
      var name = odgovor.name;
      var string = "successfully added";
      res.redirect('/project/' + projectId + '?error=' + string);
    }).catch((napaka) => {
      var string = "napakaPriPosodabljanjuUporabniskeZgodbe";
    res.redirect('/project/' + projectId + '?error=' + string);

    });
  }
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
      var string = "successfully added";
      res.redirect('/project/' + projectId + '?error=' + string);
    }).catch((napaka) => {
      var string = "napakaPriDodajanjuSubtaska";
    res.redirect('/project/' + projectId + '?error=' + string);

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
      var string = "successfully added";
      res.redirect('/project/' + projectId + '?error=' + string);
    }).catch((napaka) => {
      var string = "napakaPriDodajanjuSubtaska";
    res.redirect('/project/' + projectId + '?error=' + string);

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
      res.redirect('/project/' + projectId + '?error=' + string);
    }).catch((napaka) => {
      var string = "napakaPriDodajanjuSubtaska";
    res.redirect('/project/' + projectId + '?error=' + string);

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
      var string = "successfully added";
      res.redirect('/project/' + projectId + '?error=' + string);
    }).catch((napaka) => {
      var string = "napakaPriPosodabljanjuUporabniskeZgodbe";
    res.redirect('/project/' + projectId + '?error=' + string);

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
      res.redirect('/project/' + projectId + '?removed=' + string);
    }).catch((napaka) => {
      var string = "napakaPriPosodabljanjuUporabniskeZgodbe";
    res.redirect('/project/' + projectId + '?error=' + string);

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
    deleteStory
};