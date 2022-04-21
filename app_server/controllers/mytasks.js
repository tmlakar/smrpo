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
  //v primeru da uspešno zavrnemo nalogo, moram pridobit project id, story id in task id iz parametrov da lahko pošljemo komentar
    console.log(req.url)
    var parameter = "";
    if(req.url.includes('?')){
      parameter = req.query.add;
      var id1 = req.query.id1;
      var id2 = req.query.id1;
      var id3 = req.query.id1;
    }
    var accepted = false;
    if(parameter == "success"){
      accepted = true;
    }
    var declined = false;
    if(parameter == "declined"){
      declined = true;
    }
    var finished = false;
    if(parameter == "finished"){
      finished = true;
    }
    console.log(parameter)
    var tokenParts = req.cookies.authcookie['žeton'].split('.');
    var encodedPayload = tokenParts[1];
    //var rawPayload = window.atob(encodedPayload);
    var rawPayload = Buffer.from(encodedPayload, 'base64').toString('ascii');
    var user = JSON.parse(rawPayload);
    var username = user.username;
    //tukaj moram iz apija pridobit array taskov, ki so mi assginani in ki so v karticah, ki so v sprintih, ki so tekoči
    //najprej pridobim array projektov
    axios
        .get(apiParametri.streznik + '/api/projects')
        .then((odgovor) => {
          var myAssignedTasks = [];
          var myAcceptedTasks = [];
          var myfinishedTasks = [];
          var stolpecTask = 0;
          var stolpecZgodba = 1;
          var vrstica = 0;
          var projekti = odgovor.data;
          var zgodbe = [];
          var tasks = [];
          var myStories = [];
          var prvic = true;
          var prvic2 = true;
          var prvic3 = true;
          var projectId;
          var storyId;
          for(var i= 0; i < projekti.length; i++){
            projectId = projekti[i]._id;
            zgodbe = projekti[i].userStories
            for(var j=0; j < zgodbe.length; j++){
              storyId = zgodbe[j]._id;
              if(zgodbe[j].sprint != 0){
                tasks = zgodbe[j].subtasks;
                for(var k=0; k<tasks.length; k++){
                    //nalogo se lahko sploh prikaže, če je prijavljen uporabnik subtask owner, če je pending in če je v aktivnem sprintu
                    if(tasks[k].subtaskOwnerUsername == username && tasks[k].pending == "true" && tasks[k].isDeleted == false && tasks[k].finished == false){
                      if(prvic){
                        myAssignedTasks = [[tasks[k], zgodbe[j].name, projectId, storyId]];
                        prvic = false;
                      }
                      else{
                        myAssignedTasks.push([tasks[k],zgodbe[j].name, projectId, storyId]);
                      }
                    }
                    //naloge, ki so že od uporabnika, ker jih je že sprejel se shranijo, to so tiste ki imajo pending false in username enak
                    if(tasks[k].subtaskOwnerUsername == username && tasks[k].pending == "false" && tasks[k].isDeleted == false && tasks[k].finished == false){
                      if(prvic2){
                        myAcceptedTasks = [[tasks[k], zgodbe[j].name, projectId, storyId]];
                        prvic2 = false;
                      }
                      else{
                        myAcceptedTasks.push([tasks[k],zgodbe[j].name, projectId, storyId]);
                      }
                    }
                    //naloge, ki jih je uporabnik končal
                    if(tasks[k].subtaskOwnerUsername == username && tasks[k].finished == true && tasks[k].pending == "false" && tasks[k].isDeleted == false){
                      if(prvic3){
                        myfinishedTasks = [[tasks[k], zgodbe[j].name, projectId, storyId]];
                        prvic3 = false;
                      }
                      else{
                        myfinishedTasks.push([tasks[k],zgodbe[j].name, projectId, storyId]);
                      }
                    }
                }
            }
          }
          }
          res.render('mytasks', {
            layout: 'layout-user',
            myAssignedTasks: myAssignedTasks,
            myAcceptedTasks: myAcceptedTasks,
            myfinishedTasks: myfinishedTasks,
            accepted: accepted,
            declined: declined,
            finished: finished,
            projectId: id1,
            storyId: id2,
            taskId: id3
          });
          console.log("ali dela")
          console.log(id1)
          console.log(myAcceptedTasks)
        })
};

var acceptTask = (req, res) => {
  //pokličem api, da posodobim atribut v bazi
  var projectId = req.params.projectId;
  var storyId = req.params.storyId;
  var taskId = req.params.taskId;
  axios({
    method: 'put',
    url: apiParametri.streznik + '/api/mytasks/accept/' + projectId + '/' + storyId + '/' +  taskId
    })
    .then(() => {
      console.log("uspešno sprejeta naloga")
      var string = "success";
      res.redirect('/mytasks/' + '?add=' + string);
    }).catch((error) => {
      console.log("napaka")
    });
}

var declineTask = (req, res) => {
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
  var taskId = req.params.taskId;
  var komentar = req.body.comment;
  console.log("komentar")
  console.log(req.query.neki)
  axios({
    method: 'put',
    url: apiParametri.streznik + '/api/mytasks/decline/' + projectId + '/' + storyId + '/' +  taskId,
    data: {
      komentar: komentar,
      username: user.username
    }
    })
    .then(() => {
      console.log("uspešno zavrnjena naloga")
      //odgovor.data.projectId
      var string = "declined";
      res.redirect('/mytasks/' + '?add=' + string);
    }).catch((error) => {
      console.log("napaka")
    });
}

var finishTask = (req, res) => {
  //pokličem api, da posodobim atribut v bazi
  var projectId = req.params.projectId;
  var storyId = req.params.storyId;
  var taskId = req.params.taskId;
  axios({
    method: 'put',
    url: apiParametri.streznik + '/api/mytasks/finish/' + projectId + '/' + storyId + '/' +  taskId
    })
    .then(() => {
      console.log("uspešno končana naloga")
      var string = "finished";
      res.redirect('/mytasks/' + '?add=' + string);
    }).catch((error) => {
      console.log("napaka")
    });
}




module.exports = {
    prikaz,
    acceptTask,
    declineTask,
    finishTask
};
