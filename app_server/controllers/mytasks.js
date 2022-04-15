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
    console.log(req.url)
    var parameter = "";
    if(req.url.includes('?')){
      parameter = req.query.add;
    }
    var accepted = false;
    if(parameter == "success"){
      accepted = true;
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
          var stolpecTask = 0;
          var stolpecZgodba = 1;
          var vrstica = 0;
          var projekti = odgovor.data;
          var zgodbe = [];
          var tasks = [];
          var myStories = [];
          var prvic = true;
          var prvic2 = true;
          var projectId;
          var storyId;
          for(var i= 0; i < projekti.length; i++){
            projectId = projekti[i]._id;
            zgodbe = projekti[i].userStories
            for(var j=0; j < zgodbe.length; j++){
              storyId = zgodbe[j]._id;
              if(zgodbe[j].flags[0] != "Unassigned" && zgodbe[j].flags[1] == "Unfinished"){
                tasks = zgodbe[j].subtasks;
                for(var k=0; k<tasks.length; k++){
                    //nalogo se lahko sploh prikaže, če je prijavljen uporabnik subtask owner, če je pending in če je v aktivnem sprintu
                    if(tasks[k].subtaskOwnerUsername == username && tasks[k].pending == "true"){
                      if(prvic){
                        myAssignedTasks = [[tasks[k], zgodbe[j].name, projectId, storyId]];
                        prvic = false;
                    }
                    else{
                      myAssignedTasks.push([tasks[k],zgodbe[j].name, projectId, storyId]);
                    }
                    }
                    //naloge, ki so že od uporabnika, ker jih je že sprejel se shranijo, to so tiste ki imajo pending false in username enak
                    if(tasks[k].subtaskOwnerUsername == username && tasks[k].pending == "false"){
                      if(prvic2){
                        myAcceptedTasks = [[tasks[k], zgodbe[j].name, projectId, storyId]];
                        prvic2 = false;
                    }
                    else{
                      myAcceptedTasks.push([tasks[k],zgodbe[j].name, projectId, storyId]);
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
            accepted: accepted

          });
          console.log(myAssignedTasks)
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
    url: apiParametri.streznik + '/api/mytasks/' + projectId + '/' + storyId + '/' +  taskId
    })
    .then(() => {
      console.log("uspešno sprejeta naloga")
      var string = "success";
      res.redirect('/mytasks/' + '?add=' + string);
    }).catch((error) => {
      console.log("napaka")
    });
}



module.exports = {
    prikaz,
    acceptTask
};
