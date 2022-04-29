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

function sprintDatesValid(sprintStart, sprintEnd){
  var start = new Date(sprintStart);
  var end = new Date(sprintEnd);
  start.setHours(0,0,0,0);
  end.setHours(0,0,0,0);
  var now = new Date();
  now.setHours(0,0,0,0);
  if((start <= now) && (end >= now)){
    return true;
  }
  else{
    return false;
  }
}

var startActiveTask = (req, res) => {
  //ko pritisnem na gumb start aktivne naloge, se na api pošlje start time, ki se zabeleži in hkrati se bo zabeležilo tudi da je ta naloga aktivna
  var projectId = req.params.projectId;
  var storyId = req.params.storyId;
  var taskId = req.params.taskId;
  var startDate = req.query.startDate;
  console.log(startDate)
  axios({
    method: 'post',
    url: apiParametri.streznik + '/api/time-log/save-work-hours/start-task/' +  projectId + '/' + storyId + '/' + taskId,
    data: {
      startDate: startDate
    }
    })
    .then(() => {
      console.log("uspešno shranjen začetni čas na nalogi za današen dan")
      //odgovor.data.projectId
      var string = "saved time log";
      res.redirect('/time-log/' + taskId +  '?add=' + string);
    }).catch((error) => {
      console.log("napaka")
    });
}

//v bazo shranim število sekund za delo na nalogi kar se je zmerilo s counterjem za današnji datum
var stopTask = (req, res) => {
  var projectId = req.params.projectId;
  var storyId = req.params.storyId;
  var taskId = req.params.taskId;
  var endDate = req.query.endDate;
  axios({
    method: 'post',
    url: apiParametri.streznik + '/api/time-log/save-work-hours/stop-task/' +  projectId + '/' + storyId + '/' + taskId,
    data: {
      endDate: endDate
    }
    })
    .then(() => {
      console.log("uspešno shranjen delovni čas za današnji dan")
      //odgovor.data.projectId
      var string = "saved time log";
      res.redirect('/time-log/' + taskId +  '?add=' + string);
    }).catch((error) => {
      console.log("napaka")
    });
}


var showTimeLog = (req, res) => {
  var tokenParts = req.cookies.authcookie['žeton'].split('.');
  var encodedPayload = tokenParts[1];
  //var rawPayload = window.atob(encodedPayload);
  var rawPayload = Buffer.from(encodedPayload, 'base64').toString('ascii');
  var user = JSON.parse(rawPayload);
  var username = user.username;
  //pridobiti podatke o izbrani nalogi za katero kažemo logiranje časa
  var opozorilo = req.query.add;
  var logTime = false;
  if(opozorilo=="log time"){
    logTime = true;
  }
  var taskId = req.params.taskId;
  var projectId;
  var storyId;
  var taskName;
  var userStoryName;
  var taskEstimatedHours;
  var sprints;
  var sprint;
  var sprintStart;
  var sprintEnd;
  var workingHours;
  var isActive = false;
  var noActive = false;
  var anotherActive = false;
  axios
      .get(apiParametri.streznik + '/api/projects')
      .then((odgovor) => {
        var projekti = odgovor.data;
        for(var i=0; i<projekti.length; i++){
          var stories = projekti[i].userStories;
          for(var j=0; j<stories.length; j++){
              var tasks = stories[j].subtasks;
              for(var k=0; k<tasks.length; k++){
                if(tasks[k].active == true){
                  if(tasks[k].subtaskOwnerUsername == username){
                    isActive = true;
                    activeTaskId = tasks[k]._id;
                  }
                }
                if(tasks[k]._id == taskId){
                  //najdli taprav task
                  taskName = tasks[k].name;
                  userStoryName = stories[j].name;
                  taskEstimatedHours = tasks[k].hours;
                  sprints = projekti[i].sprints;
                  sprint = stories[j].sprint;
                  projectId = projekti[i]._id;
                  storyId = stories[j]._id;
                  workingHours = tasks[k].workingHours;
                }
              }
          }
        }
        //najdl smo eno aktivno nalogo
        if(isActive == true){
          isActive = false;
          //pogledamo če je ta trenutna aktivna ali katera druga
          if(activeTaskId == taskId){
            isActive = true;
          }
          else{
            anotherActive = true;
          }
        }
        else{
          //ni aktivnih nalog
          noActive = true;
        }
        console.log(workingHours)
        //pridobim start in end date iz sprinta kjer je naloga
        for(var i=0; i<sprints.length; i++){
          if(sprints[i].number == sprint){
            //imamo taprav sprint
            sprintStart = sprints[i].startDate;
            sprintEnd = sprints[i].endDate;
          }
        }
        //naredim tabelo datumov od začetnega datuma sprinta do končnega
        var datumi = [];
        var seUjema = false;
        var prvic = true;
        var danasnji = false;
        var razlika = taskEstimatedHours * 60 * 60;
        for(var i = new Date(sprintStart); i<= new Date(sprintEnd); i.setDate(i.getDate()+1)){
          danasnji = false;
          //pogledam še če je današnji datum
          if(i.toISOString().split("T")[0] == (new Date()).toISOString().split("T")[0]){
            danasnji = true;
          }
          var workingSeconds = 0;
          var estimatedSeconds = taskEstimatedHours*60*60;
          seUjema = false;
          //pogledam še v tabelo working hours če se kje ujema datum, da dodam število sekund
          for(var j=0; j<workingHours.length; j++){
            if(i.toISOString().split("T")[0] == (new Date(workingHours[j].datum)).toISOString().split("T")[0]){
              workingSeconds = workingHours[j].workingSeconds;
              if(prvic){
                razlika = estimatedSeconds-workingSeconds;
                datumi.push([new Date(i), workingSeconds, estimatedSeconds-workingSeconds, danasnji]);
                prvic = false;
              }
              else{
                datumi.push([new Date(i), workingSeconds, razlika, danasnji]);
              }
              seUjema = true;
            }
          }
          //če ni še nič zapisano o working seconds:
          if(seUjema == false){
            datumi.push([new Date(i), 0, razlika, danasnji]);
          }
        }
        console.log(datumi)
        //renderiram stran s pravimi podatki
        res.render('time-log',{
          layout: 'layout-user',
          name: taskName,
          userStoryName: userStoryName,
          taskEstimatedHours: taskEstimatedHours,
          datumi: datumi,
          taskId: taskId,
          projectId: projectId,
          storyId: storyId,
          isActive: isActive,
          noActive: noActive,
          anotherActive: anotherActive,
          logTime: logTime
        })
      })
}

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
                  var sprint = zgodbe[j].sprint;
                  var sprints = projekti[i].sprints;
                  for(var l=0; l<sprints.length; l++){
                    if(sprints[l].number == sprint){
                      var sprintStart = sprints[l].startDate;
                      var sprintEnd = sprints[l].endDate;
                    }
                  }
                  //se preveri če je naloga v sprintu ki je v teku
                  var sprintVTeku = false;
                  if(sprintDatesValid(sprintStart, sprintEnd)){
                    sprintVTeku = true;
                  }
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
                    if(tasks[k].subtaskOwnerUsername == username && tasks[k].pending == "false" && tasks[k].isDeleted == false && tasks[k].finished == false && sprintVTeku == true){
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
                        //seštejem čas za vse dneve dela na nalogi
                        var sumTime = 0;
                        var workingHours = tasks[k].workingHours;
                        for(var m=0; m<workingHours.length; m++){
                          sumTime = sumTime + workingHours[m].workingSeconds;
                        }
                        myfinishedTasks = [[tasks[k], zgodbe[j].name, projectId, storyId, sumTime]];
                        prvic3 = false;
                      }
                      else{
                        //seštejem čas za vse dneve dela na nalogi
                        var sumTime = 0;
                        var workingHours = tasks[k].workingHours;
                        for(var m=0; m<workingHours.length; m++){
                          sumTime = sumTime + workingHours[m].workingSeconds;
                        }
                        myfinishedTasks.push([tasks[k],zgodbe[j].name, projectId, storyId, sumTime]);
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
    finishTask,
    showTimeLog,
    stopTask,
    startActiveTask
};
