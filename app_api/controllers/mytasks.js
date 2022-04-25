const mongoose = require("mongoose");
const Project = mongoose.model("Project");


//v bazo zapišem začetni čas dela na nalogi za današnji dan, ter označim nalogo kot aktivno tako da atribut active na nalogi podam na true
const startTask = (req, res) => {
  var projectId = req.params.idProject;
  var storyId = req.params.idStory;
  var taskId = req.params.idTask;
  var startDate = req.body.startDate;
  console.log("pridem v api")
  //deluje zdaj moram samo še shraniti
  //najdem ta task z podanim idjem
  Project.findById(projectId)
    .select("userStories")
    .exec((napaka, project) => {
      if (!project) {
        return res.status(404).json({ sporočilo: "Ne najdem projekta." });
      }
      else if (napaka) {
        return res.status(500).json(napaka);
      }

      if (project.userStories && project.userStories.length > 0) {
        const userStory = project.userStories.id(
          storyId
        );
            if (!userStory) {
              res.status(404).json({ sporočilo: "Ne najdem zgodbe." });
            }
            else {
                  //pridobim še taske
                  if (userStory.subtasks && userStory.subtasks.length > 0) {
                    const task = userStory.subtasks.id(
                      taskId
                    );
                    if (!task) {
                      res.status(404).json({ sporočilo: "Ne najdem naloge." });
                    } else {
                      //današnji datum
                      var date = new Date();
                      console.log(date)
                      //pridobim tabelo working hours
                      var workingHours = task.workingHours;
                      var jeZe = false;
                      //v tabeli pogledam če je že shranjen kakšen element z današnjim datumom in če je samo dodam start date
                      if(workingHours.length !=0){
                          for(var i=0; i<workingHours.length; i++){
                            var datum = workingHours[i].datum;
                            if(date.toISOString().split("T")[0] == datum.toISOString().split("T")[0]){
                              workingHours[i].startTime = new Date(startDate);
                              jeZe = true;
                            }
                          }
                          if(jeZe == false){
                            task.allWorkingSeconds = 0;
                            userStory.allWorkingSeconds = 0;
                            workingHours.push({
                              datum: date,
                              startTime: new Date(startDate),
                              workingSeconds: 0
                            })
                          }
                      }
                      //če še ni v tabelo pusham element z današnjim datumom
                      else{
                          task.allWorkingSeconds = 0;
                          userStory.allWorkingSeconds = 0;
                          workingHours.push({
                            datum: date,
                            startTime: new Date(startDate),
                            workingSeconds: 0
                          })
                      }
                      task.active = true;
                      task.save((napaka, user) => {
                        if (napaka) {
                        res.status(400).json(napaka);
                        } else {
                        //res.status(201).json(user);
                      }
                      });
                      userStory.save((napaka, user) => {
                        if (napaka) {
                        res.status(400).json(napaka);
                        } else {
                        //res.status(201).json(user);
                      }
                      });
                        project.save((napaka, project) => {
                          if (napaka) {
                            res.status(404).json(napaka);
                          } else {
                            res.status(200).json(project);
                          }
                        });
                  }
                }
              }
            }
            else {
             return res.status(404).json({ sporočilo: "Ni obstojecih sprintov." });
           }
          });
        }


//v bazo pri podani nalogi za današnji dan shranim število delovnih ur
const stopTask = (req, res) => {
  var projectId = req.params.idProject;
  var storyId = req.params.idStory;
  var taskId = req.params.idTask;
  var endDate = req.body.endDate;
  console.log("pridem v api")
  //deluje zdaj moram samo še shraniti
  //najdem ta task z podanim idjem
  Project.findById(projectId)
    .select("userStories")
    .exec((napaka, project) => {
      if (!project) {
        return res.status(404).json({ sporočilo: "Ne najdem projekta." });
      }
      else if (napaka) {
        return res.status(500).json(napaka);
      }

      if (project.userStories && project.userStories.length > 0) {
        const userStory = project.userStories.id(
          storyId
        );
            if (!userStory) {
              res.status(404).json({ sporočilo: "Ne najdem zgodbe." });
            }
            else {
                  //pridobim še taske
                  if (userStory.subtasks && userStory.subtasks.length > 0) {
                    const task = userStory.subtasks.id(
                      taskId
                    );
                    if (!task) {
                      res.status(404).json({ sporočilo: "Ne najdem naloge." });
                    } else {
                      //današnji datum
                      var date = new Date();
                      console.log(date)
                      //pridobim tabelo working hours
                      var workingHours = task.workingHours;
                      //v tabeli pogledam če je že shranjen kakšen element z današnjim datumom in če je samo prištejem sekunde k podanim
                      if(workingHours.length !=0){
                          for(var i=0; i<workingHours.length; i++){
                            var datum = workingHours[i].datum;
                            if(date.toISOString().split("T")[0] == datum.toISOString().split("T")[0]){
                              //zračunam število sekund za working seconds in prištejem k zapisu in shranim še end time
                              var startTime = workingHours[i].startTime;
                              console.log("start time")
                              console.log(startTime)
                              console.log("end time")
                              console.log(new Date(endDate))
                              var dif = startTime.getTime() - (new Date(endDate)).getTime();
                              var sec1 = dif / 1000;
                              var sec2 = Math.abs(sec1);
                              console.log("razlika v sekundah")
                              console.log(parseInt(sec2))
                              workingHours[i].workingSeconds = workingHours[i].workingSeconds + parseInt(sec2);
                              task.allWorkingSeconds = task.allWorkingSeconds + parseInt(sec2);
                              userStory.allWorkingSeconds = userStory.allWorkingSeconds + parseInt(sec2);
                              console.log(workingHours[i])
                              workingHours[i].endTime = endDate;
                            }
                          }
                      }
                      task.active = false;
                      task.save((napaka, user) => {
                        if (napaka) {
                        res.status(400).json(napaka);
                        } else {
                        //res.status(201).json(user);
                      }
                      });
                      userStory.save((napaka, user) => {
                        if (napaka) {
                        res.status(400).json(napaka);
                        } else {
                        //res.status(201).json(user);
                      }
                      });
                        project.save((napaka, project) => {
                          if (napaka) {
                            res.status(404).json(napaka);
                          } else {
                            res.status(200).json(project);
                          }
                        });
                  }
                }
              }
            }
            else {
             return res.status(404).json({ sporočilo: "Ni obstojecih sprintov." });
           }
          });
        }


/* Če član sprejme nalogo se v bazi posodobi atribut pending na false */
const acceptTask = (req, res) => {
  console.log("apiii")
  if (!req.params.idProject || !req.params.idStory || !req.params.idTask) {
    return res.status(404).json({
      sporočilo:
        "Ne najdem projekta oziroma zgodbe, " +
        "idProject in idStory sta obvezna parametra."
    });
  }
  Project.findById(req.params.idProject)
    .select("userStories")
    .exec((napaka, project) => {
      if (!project) {
        return res.status(404).json({ sporočilo: "Ne najdem projekta." });
      }
      else if (napaka) {
        return res.status(500).json(napaka);
      }

      if (project.userStories && project.userStories.length > 0) {
        const userStory = project.userStories.id(
          req.params.idStory
        );
            if (!userStory) {
              res.status(404).json({ sporočilo: "Ne najdem zgodbe." });
            }
            else {
                  //pridobim še taske
                  if (userStory.subtasks && userStory.subtasks.length > 0) {
                    const task = userStory.subtasks.id(
                      req.params.idTask
                    );
                    if (!task) {
                      res.status(404).json({ sporočilo: "Ne najdem naloge." });
                    } else {
                    //updejtam pending atribut - to bo pokazalo da je član skupine nalogo sprejel
                    task.pending = false;
                    //shranim še komentar v tabelo komentarjev taska
                    task.save((napaka, user) => {
                      if (napaka) {
                      res.status(400).json(napaka);
                      } else {
                      //res.status(201).json(user);
                    }
                    });
                    //ali moram dodati še user story.save
                      project.save((napaka, project) => {
                        if (napaka) {
                          res.status(404).json(napaka);
                        } else {
                          res.status(200).json(project);
                        }
                      });
                    }
                  }
                }
              }
       else {
        return res.status(404).json({ sporočilo: "Ni obstojecih sprintov." });
      }
    });
}

/* Če član sprejme nalogo se v bazi posodobi atribut pending na false */
const declineTask = (req, res) => {
  console.log("apiii")
  if (!req.params.idProject || !req.params.idStory || !req.params.idTask) {
    return res.status(404).json({
      sporočilo:
        "Ne najdem projekta oziroma zgodbe, " +
        "idProject in idStory sta obvezna parametra."
    });
  }
  var projectId = req.params.idProject;
  var storyId = req.params.idStory;
  var taskId = req.params.idTask;
  Project.findById(req.params.idProject)
    .select("userStories")
    .exec((napaka, project) => {
      if (!project) {
        return res.status(404).json({ sporočilo: "Ne najdem projekta." });
      }
      else if (napaka) {
        return res.status(500).json(napaka);
      }

      if (project.userStories && project.userStories.length > 0) {
        const userStory = project.userStories.id(
          req.params.idStory
        );
            if (!userStory) {
              res.status(404).json({ sporočilo: "Ne najdem zgodbe." });
            }
            else {
                  //shranim komentar k user story
                  console.log("v apiju")
                  console.log(req.body.komentar)
                  userStory.comments.push({
                      comment: req.body.komentar,
                      commentOwnerUsername: req.body.username
                  });
                  //pridobim še taske
                  if (userStory.subtasks && userStory.subtasks.length > 0) {
                    const task = userStory.subtasks.id(
                      req.params.idTask
                    );
                    if (!task) {
                      res.status(404).json({ sporočilo: "Ne najdem naloge." });
                    } else {
                    //updejtam pending atribut - to bo pokazalo da je član skupine nalogo sprejel
                    task.subtaskOwnerUsername = null;
                    task.pending = true;
                    task.save((napaka, user) => {
                      if (napaka) {
                        res.status(400).json(napaka);
                      } else {
                        //res.send({projectId: projectId, storyId: storyId, taskId: taskId})

                    }
                    });
                    //ali moram dodati še user story.save
                      project.save((napaka, project) => {
                        if (napaka) {
                          res.status(404).json(napaka);
                        } else {
                          res.status(200).json(project);
                        }
                      });
                    }
                  }
                }
              }
       else {
        return res.status(404).json({ sporočilo: "Ni obstojecih sprintov." });
      }
    });
}

/* Če član sprejme nalogo se v bazi posodobi atribut pending na false */
const finishTask = (req, res) => {
  console.log("apiii")
  if (!req.params.idProject || !req.params.idStory || !req.params.idTask) {
    return res.status(404).json({
      sporočilo:
        "Ne najdem projekta oziroma zgodbe, " +
        "idProject in idStory sta obvezna parametra."
    });
  }
  Project.findById(req.params.idProject)
    .select("userStories")
    .exec((napaka, project) => {
      if (!project) {
        return res.status(404).json({ sporočilo: "Ne najdem projekta." });
      }
      else if (napaka) {
        return res.status(500).json(napaka);
      }

      if (project.userStories && project.userStories.length > 0) {
        const userStory = project.userStories.id(
          req.params.idStory
        );
            if (!userStory) {
              res.status(404).json({ sporočilo: "Ne najdem zgodbe." });
            }
            else {
                  //pridobim še taske
                  if (userStory.subtasks && userStory.subtasks.length > 0) {
                    const task = userStory.subtasks.id(
                      req.params.idTask
                    );
                    if (!task) {
                      res.status(404).json({ sporočilo: "Ne najdem naloge." });
                    } else {
                    //updejtam pending atribut - to bo pokazalo da je član skupine nalogo sprejel
                    task.finished = true;
                    task.save((napaka, user) => {
                      if (napaka) {
                      res.status(400).json(napaka);
                      } else {
                      //res.status(201).json(user);
                    }
                    });
                    var storyFinished = false;
                    var končane = 0;
                    //pregledam še, če so že vsi taski pri tej zgodbdi končani in če so je tudi zgodba končana
                    for(var i=0; i < userStory.subtasks.length ; i++){
                        if(userStory.subtasks[i].finished == true){
                            končane = končane + 1;
                        }
                    }
                    if(končane == userStory.subtasks.length){
                      storyFinished = true;
                    }
                    if(storyFinished == true){
                      userStory.finished = true;
                    }
                    userStory.save((napaka, user) => {
                      if (napaka) {
                      res.status(400).json(napaka);
                      } else {
                      //res.status(201).json(user);
                    }
                    });
                    //ali moram dodati še user story.save
                      project.save((napaka, project) => {
                        if (napaka) {
                          res.status(404).json(napaka);
                        } else {
                          res.status(200).json(project);
                        }
                      });
                    }
                  }
                }
              }
       else {
        return res.status(404).json({ sporočilo: "Ni obstojecih sprintov." });
      }
    });
}

//add comment when declining

const addComment = (req, res) => {
    if (!req.params.idProject || !req.params.idPublication) {
      return res.status(404).json({
        sporočilo:
          "Ne najdem projekta oziroma uporabniske zgodbe, " +
          "idProject in idPublication sta obvezna parametra.",
      });
    }
    Project.findById(req.params.idProject)
      .select("publications")
      .exec((napaka, project) => {
        if (!project) {
          return res.status(404).json({ sporočilo: "Ne najdem projekta." });
        } else if (napaka) {
          return res.status(500).json(napaka);
        }
        if (project.publications && project.publications.length > 0) {
          const currentPublication = project.publications.id(
            req.params.idPublication
          );
          if (!currentPublication) {
            res.status(404).json({ sporočilo: "Ne najdem uporabniske zgodbe." });
          } else {
            //tle dodas en acceptance task
            currentPublication.comments.push({
                comment: req.body.comment,
                commentOwner: req.body.commentOwner,
                date: req.body.date
            });
            project.save((napaka, project) => {
                if (napaka) {
                  res.status(404).json(napaka);
                } else {
                  res.status(200).json(project);
                }
              });
            }

          }
         else {
          return res.status(404).json({ sporočilo: "Ni obstojecih uporabniskih zgodb." });
        }
      });
  };



module.exports = {
    acceptTask,
    declineTask,
    finishTask,
    addComment,
    stopTask,
    startTask
};
