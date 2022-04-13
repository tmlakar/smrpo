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
    var username = user.username;


    //tukaj moram iz apija pridobit array taskov, ki so mi assginani in ki so v karticah, ki so v sprintih, ki so tekoči
    //najprej pridobim array projektov
    axios
        .get(apiParametri.streznik + '/api/projects')
        .then((odgovor) => {
          var myTasks = [];
          var stolpecTask = 0;
          var stolpecZgodba = 1;
          var vrstica = 0;
          var projekti = odgovor.data;
          var zgodbe = [];
          var tasks = [];
          var myStories = [];
          var prvic = true;
          for(var i= 0; i < projekti.length; i++){
            zgodbe = projekti[i].userStories
            for(var j=0; j < zgodbe.length; j++){
              if(zgodbe[j].flags[0] != "Unassigned" && zgodbe[j].flags[1] == "Unfinished"){
                tasks = zgodbe[j].subtasks;
                for(var k=0; k<tasks.length; k++){
                    //nalogo se lahko sploh prikaže, če je prijavljen uporabnik subtask owner, če je pending in če je v aktivnem sprintu
                    if(tasks[k].subtaskOwnerUsername == username && tasks[k].pending == "true"){
                      if(prvic){
                        myTasks = [[tasks[k], zgodbe[j].name]];
                        prvic = false;
                    }
                    else{
                      myTasks.push([tasks[k],zgodbe[j].name]);
                    }
                    }
                }
            }
          }
          }
          res.render('mytasks', {
            layout: 'layout-user',
            myTasks: myTasks

          });
          console.log(myTasks)
        })


};


module.exports = {
    prikaz
};
