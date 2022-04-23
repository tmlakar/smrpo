const mongoose = require("mongoose");
const Project = mongoose.model("Project");
const User = mongoose.model("User");

//product owner sprejme nalogo iz acceptance ready kot sprejto - se ji posodobi accepted na true
const acceptStory = (req, res) => {
  console.log("apiii")
  if (!req.params.idProject || !req.params.idStory) {
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
                    //updejtam accepted atribut kar bo pomenilo da je zgodba sprejeta
                    userStory.accepted = true;
                    //shranim še komentar v tabelo komentarjev taska
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
       else {
        return res.status(404).json({ sporočilo: "Ni obstojecih sprintov." });
      }
    });
}

//product owner lahko declina nalogo
const declineStory = (req, res) => {
  console.log("apiii")
  if (!req.params.idProject || !req.params.idStory) {
    return res.status(404).json({
      sporočilo:
        "Ne najdem projekta oziroma zgodbe, " +
        "idProject in idStory sta obvezna parametra."
    });
  }
  var projectId = req.params.idProject;
  var storyId = req.params.idStory;
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
                    //updejtam pending atribut - to bo pokazalo da je član skupine nalogo sprejel
                    userStory.finished = false;
                    userStory.save((napaka, user) => {
                      if (napaka) {
                        res.status(400).json(napaka);
                      } else {
                        //res.send({projectId: projectId, storyId: storyId, taskId: taskId})

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
       else {
        return res.status(404).json({ sporočilo: "Ni obstojecih sprintov." });
      }
    });
}

/* Particular project info */

const projectInfo = (req, res) => {
    Project.findById(req.params.idProject).exec((napaka,project) => {
      if (!project) {
        return res
          .status(404)
          .json({
            sporočilo:
              "Ne najdem projekta s podanim enoličnim identifikatorjem idProject.",
          });
      } else if (napaka) {
        return res.status(500).json(napaka);
      }
      res.status(200).json(project);
    });
};

 /* Adding an userStory to a project */

 const addUserStoryToAProject = (req, res) => {
    const idProject = req.params.idProject;
    if (idProject) {
      Project.findById(idProject)
        .exec((napaka, project) => {
          if (napaka) {
            res.status(400).json(napaka);
            console.log("napaka 400");
          } else {
            addUserStory(req, res, project);
            //res.status(200).json({ status: "uspešno" });
          }
        });
    } else {
      res.status(400).json({
        sporočilo: "Ne najdem projekta, idProject je obvezen parameter.",
      });
    }
  };

  const addUserStory = (req, res, project) => {
    if (!project) {
      res.status(404).json({ sporočilo: "Ne najdem projekta." });
    } else {
      console.log(project);
      // zacetni podatki ko dodajamo user story
      //preveri kok je user storijev ze notr za zaporedno stevilko # xx
      var number = 1;
      if (project.userStories && project.userStories.length > 0) {
        console.log(project.userStories);
        for (var i = 0; i < project.userStories.length; i++) {
          var nameOfStory = project.userStories[i].name;
          nameOfStory = nameOfStory.substring(3, nameOfStory.length);
          console.log(nameOfStory);
          if (nameOfStory.toLowerCase() == req.body.name.toLowerCase()) {
            return res.status(401).json("Ime ze obstaja");
          }
        }
        var currentLast = project.userStories.length;
        number = currentLast + 1;
      }


      project.userStories.push({
        name: "#" + number + " " + req.body.name,
        aboutText: req.body.aboutText,
        priority: req.body.priority,
        businessValue: req.body.businessValue,
        flags: ["Unassigned", "Unfinished"]
      });
      project.save((napaka, project) => {
        if (napaka) {
          res.status(400).json(napaka);
        } else {
          const addedUserStory = project.userStories.slice(-1).pop();

          res.status(201).json(addedUserStory);
        }
      });
    }
  };

  /* Editing a userStory project */

  const userStoryInfo = (req, res) => {
    Project.findById(req.params.idProject)
      .select("userStories")
      .exec((napaka, project) => {
        if (!project) {
          return res.status(404).json({
            sporočilo:
              "Ne najdem projekta s podanim enoličnim identifikatorjem idProject.",
          });
        } else if (napaka) {
          return res.status(500).json(napaka);
        }
        if (project.userStories && project.userStories.length > 0) {
          const userStory = project.userStories.id(req.params.idUserStory);
          if (!userStory) {
            return res.status(404).json({
              sporočilo:
                "Ne najdem uporabniske zgodbe s podanim enoličnim identifikatorjem idUserStory.",
            });
          } else {
            res.status(200).json({
              userStory
            });
          }
        } else {
          return res
            .status(404)
            .json({ sporočilo: "Ne najdem nobene uporabniske zgodbe." });
        }
      });
  };

  /* Updating basic userStory info - name, description, priority, bussiness value */

  const updateUserStoryInfo = (req, res) => {

    if (!req.params.idProject || !req.params.idUserStory) {
      return res.status(404).json({
        sporočilo:
          "Ne najdem projekta oziroma uporabniske zgodbe, " +
          "idProject in idUserStory sta obvezna parametra.",
      });
    }
    Project.findById(req.params.idProject)
      .select("userStories")
      .exec((napaka, project) => {
        if (!project) {
          return res.status(404).json({ sporočilo: "Ne najdem projekta." });
        } else if (napaka) {
          return res.status(500).json(napaka);
        }
        // najprej pogledamo index od trenutne zgodbe k jo hocmo uredit
        if (project.userStories && project.userStories.length > 0) {
          var currentName = req.body.originalname;
          var currentIndex = 0;
          for (var i = 0; i < project.userStories.length; i++) {
            var nameOfStory = project.userStories[i].name;
            if (nameOfStory == currentName) {
              currentIndex = i;
            }
          }
          console.log(currentIndex);

          //1. moznost: spreminja trenutno pa ne spremeni imena
          var newName = req.body.name;
          var oldPrefix = req.body.prefix;
          var newFullName = oldPrefix + newName;
          for (var i = 0; i < project.userStories.length; i++) {
            var nameOfStory = project.userStories[i].name;
            if (nameOfStory.toLowerCase() == newFullName.toLowerCase()) {
              if (i == currentIndex) {

              } else {
                return res.status(401).json({ sporočilo: "Ne." });
              }
            }
          }
          //2. moznost: prefix ostane enak, gledat mors da se sam req.body.name ne podvaja
          for (var i = 0; i < project.userStories.length; i++) {
            var nameOfStory = project.userStories[i].name;
            nameOfStory = nameOfStory.substring(3, nameOfStory.length);
            if (newName.toLowerCase() == nameOfStory.toLowerCase()) {
              if (i != currentIndex) {
                return res.status(401).json({ sporočilo: "Ne." });
              }
            }

          }
          const currentUserStory = project.userStories.id(
            req.params.idUserStory
          );
          if (!currentUserStory) {
            res.status(404).json({ sporočilo: "Ne najdem uporabniske zgodbe." });
          } else {


            //console.log(req.body.name, req.body.aboutText, req.body.priority, req.body.businessValue,req.body.size, req.body.sprint);
            var currentUserStoryName = currentUserStory.name;
            var prefixCurrentUserStory = currentUserStoryName.substring(0, 3);
            currentUserStory.name = prefixCurrentUserStory + req.body.name;
            currentUserStory.aboutText = req.body.aboutText;
            currentUserStory.priority = req.body.priority;
            currentUserStory.businessValue = req.body.businessValue;


            // currentUserStory.sprint = req.body.sprint;
            // var sprintString;
            // // posodbimo se flags
            // if (req.body.sprint != 0) {
            //   sprintString = "Sprint " + req.body.sprint;
            //   currentUserStory.flags[0] = sprintString;
            // }
            // //posodobimo flags za priority

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

/* Adding subtaks to userStory */

const updateUserStoryAddSubtask = (req, res) => {
  if (!req.params.idProject || !req.params.idUserStory) {
    return res.status(404).json({
      sporočilo:
        "Ne najdem projekta oziroma uporabniske zgodbe, " +
        "idProject in idUserStory sta obvezna parametra.",
    });
  }
  Project.findById(req.params.idProject)
    .select("userStories")
    .exec((napaka, project) => {
      if (!project) {
        return res.status(404).json({ sporočilo: "Ne najdem projekta." });
      } else if (napaka) {
        return res.status(500).json(napaka);
      }
      if (project.userStories && project.userStories.length > 0) {
        const currentUserStory = project.userStories.id(
          req.params.idUserStory
        );
        if (!currentUserStory) {
          res.status(404).json({ sporočilo: "Ne najdem uporabniske zgodbe." });
        } else {
          //tle pushas na
          currentUserStory.subtasks.push({
            name: req.body.name,
            hours: req.body.hours
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

/* Adding  userStory to current sprint */
const updateUserStoryAddToSprint = (req, res) => {
  if (!req.params.idProject || !req.params.idUserStory) {
    return res.status(404).json({
      sporočilo:
        "Ne najdem projekta oziroma uporabniske zgodbe, " +
        "idProject in idUserStory sta obvezna parametra.",
    });
  }
  Project.findById(req.params.idProject)
    .select("userStories")
    .exec((napaka, project) => {
      if (!project) {
        return res.status(404).json({ sporočilo: "Ne najdem projekta." });
      } else if (napaka) {
        return res.status(500).json(napaka);
      }
      if (project.userStories && project.userStories.length > 0) {
        const currentUserStory = project.userStories.id(
          req.params.idUserStory
        );
        if (!currentUserStory) {
          res.status(404).json({ sporočilo: "Ne najdem uporabniske zgodbe." });
        } else {

          currentUserStory.allSprints.push(req.body.sprint);
          currentUserStory.sprint = req.body.sprint;

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

const updateUserStoryAddSize = (req, res) => {
  if (!req.params.idProject || !req.params.idUserStory) {
    return res.status(404).json({
      sporočilo:
        "Ne najdem projekta oziroma uporabniske zgodbe, " +
        "idProject in idUserStory sta obvezna parametra.",
    });
  }
  Project.findById(req.params.idProject)
    .select("userStories")
    .exec((napaka, project) => {
      if (!project) {
        return res.status(404).json({ sporočilo: "Ne najdem projekta." });
      } else if (napaka) {
        return res.status(500).json(napaka);
      }
      if (project.userStories && project.userStories.length > 0) {
        const currentUserStory = project.userStories.id(
          req.params.idUserStory
        );
        if (!currentUserStory) {
          res.status(404).json({ sporočilo: "Ne najdem uporabniske zgodbe." });
        } else {


          currentUserStory.size = req.body.size;

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

/* Editing subtask of a story */
const updateUserStoryEditSubtask = (req, res) => {
  if (!req.params.idProject || !req.params.idUserStory || !req.params.idSubtask) {
    return res.status(404).json({
      sporočilo:
        "Ne najdem projekta oziroma uporabniske zgodbe, " +
        "idProject in idUserStory sta obvezna parametra.",
    });
  }
  Project.findById(req.params.idProject)
    .select("userStories")
    .exec((napaka, project) => {
      if (!project) {
        return res.status(404).json({ sporočilo: "Ne najdem projekta." });
      } else if (napaka) {
        return res.status(500).json(napaka);
      }
      if (project.userStories && project.userStories.length > 0) {
        const currentUserStory = project.userStories.id(
          req.params.idUserStory
        );
        if (!currentUserStory) {
          res.status(404).json({ sporočilo: "Ne najdem uporabniske zgodbe." });
        } else {

          if (currentUserStory.subtasks && currentUserStory.subtasks.length > 0) {
            const currentSubtask = currentUserStory.subtasks.id(
              req.params.idSubtask
            );
            if (!currentSubtask) {
              res.status(404).json({ sporočilo: "Ne najdem subtaksa." });
            } else {

              currentSubtask.name = req.body.name;
              currentSubtask.hours = req.body.hours;


              project.save((napaka, project) => {
                if (napaka) {
                  res.status(404).json(napaka);
                } else {
                  res.status(200).json(project);
                }
              });
            }
          }

        }}
       else {
        return res.status(404).json({ sporočilo: "Ni obstojecih uporabniskih zgodb." });
      }
    });
};

/* Removing subtask from a story - lahko pa sam da se da na deleted flag subtask */
const updateUserStoryRemoveSubtask = (req, res) => {
  if (!req.params.idProject || !req.params.idUserStory || !req.params.idSubtask) {
    return res.status(404).json({
      sporočilo:
        "Ne najdem projekta oziroma uporabniske zgodbe, " +
        "idProject in idUserStory sta obvezna parametra.",
    });
  }
  Project.findById(req.params.idProject)
    .select("userStories")
    .exec((napaka, project) => {
      if (!project) {
        return res.status(404).json({ sporočilo: "Ne najdem projekta." });
      } else if (napaka) {
        return res.status(500).json(napaka);
      }
      if (project.userStories && project.userStories.length > 0) {
        const currentUserStory = project.userStories.id(
          req.params.idUserStory
        );
        if (!currentUserStory) {
          res.status(404).json({ sporočilo: "Ne najdem uporabniske zgodbe." });
        } else {

          if (currentUserStory.subtasks && currentUserStory.subtasks.length > 0) {
            const currentSubtask = currentUserStory.subtasks.id(
              req.params.idSubtask
            );
            if (!currentSubtask) {
              res.status(404).json({ sporočilo: "Ne najdem subtaksa." });
            } else {
              currentUserStory.subtasks.id(req.params.idSubtask).remove()



              project.save((napaka, project) => {
                if (napaka) {
                  res.status(404).json(napaka);
                } else {
                  res.status(200).json(project);
                }
              });
            }
          }

        }}
       else {
        return res.status(404).json({ sporočilo: "Ni obstojecih uporabniskih zgodb." });
      }
    });
};

/* Updating owner of subtask */
const updateUserStoryAddOwnerToSubtask = (req, res) => {
  if (!req.params.idProject || !req.params.idUserStory) {
    return res.status(404).json({
      sporočilo:
        "Ne najdem projekta oziroma uporabniske zgodbe, " +
        "idProject in idUserStory sta obvezna parametra.",
    });
  }
  Project.findById(req.params.idProject)
    .select("userStories")
    .exec((napaka, project) => {
      if (!project) {
        return res.status(404).json({ sporočilo: "Ne najdem projekta." });
      } else if (napaka) {
        return res.status(500).json(napaka);
      }
      if (project.userStories && project.userStories.length > 0) {
        const currentUserStory = project.userStories.id(
          req.params.idUserStory
        );
        if (!currentUserStory) {
          res.status(404).json({ sporočilo: "Ne najdem uporabniske zgodbe." });
        } else {


          //tle glede na id subtaksa updejtas owner username -> ce je sploh kej subtaskov
          if (currentUserStory.subtasks && currentUserStory.subtasks.length > 0) {
            const currentSubtask = currentUserStory.subtasks.id(
              req.params.idSubtask
            );
            if (!currentSubtask) {
              res.status(404).json({ sporočilo: "Ne najdem subtaksa." });
            } else {
              //ce je izbran username enak temu ki je prijavljen damo pending na false, ker se smatra kot da je že sprejel
              currentSubtask.subtaskOwnerUsername = req.body.subtaskOwnerUsername;
              if(req.body.subtaskOwnerUsername == req.body.currentUsername){
                console.log("sta enaka")
                currentSubtask.pending = false;
              }
              else{
                currentSubtask.pending = true;
              }
              project.save((napaka, project) => {
                if (napaka) {
                  res.status(404).json(napaka);
                } else {
                  res.status(200).json(project);
                }
              });
            }
          }



        }}
       else {
        return res.status(404).json({ sporočilo: "Ni obstojecih uporabniskih zgodb." });
      }
    });
};

/* Adding acceptance tests to userStory */

const updateUserStoryAddAcceptanceTests = (req, res) => {
  if (!req.params.idProject || !req.params.idUserStory) {
    return res.status(404).json({
      sporočilo:
        "Ne najdem projekta oziroma uporabniske zgodbe, " +
        "idProject in idUserStory sta obvezna parametra.",
    });
  }
  Project.findById(req.params.idProject)
    .select("userStories")
    .exec((napaka, project) => {
      if (!project) {
        return res.status(404).json({ sporočilo: "Ne najdem projekta." });
      } else if (napaka) {
        return res.status(500).json(napaka);
      }
      if (project.userStories && project.userStories.length > 0) {
        const currentUserStory = project.userStories.id(
          req.params.idUserStory
        );
        if (!currentUserStory) {
          res.status(404).json({ sporočilo: "Ne najdem uporabniske zgodbe." });
        } else {
          //tle dodas en acceptance task
          currentUserStory.tests.push('# ' + req.body.tests);
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

/* Adding a footnote / comment from specific collaborator to userStory */
const updateUserStoryAddAComment = (req, res) => {
  if (!req.params.idProject || !req.params.idUserStory) {
    return res.status(404).json({
      sporočilo:
        "Ne najdem projekta oziroma uporabniske zgodbe, " +
        "idProject in idUserStory sta obvezna parametra.",
    });
  }
  Project.findById(req.params.idProject)
    .select("userStories")
    .exec((napaka, project) => {
      if (!project) {
        return res.status(404).json({ sporočilo: "Ne najdem projekta." });
      } else if (napaka) {
        return res.status(500).json(napaka);
      }
      if (project.userStories && project.userStories.length > 0) {
        const currentUserStory = project.userStories.id(
          req.params.idUserStory
        );
        if (!currentUserStory) {
          res.status(404).json({ sporočilo: "Ne najdem uporabniske zgodbe." });
        } else {
          //tle dodas comment
          currentUserStory.comments.push({
            comment: req.body.comment,
            commentOwnerUsername: req.body.commentOwnerUsername
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

/* Adding a flag (dodeljena/nedodeljena, v katerem sprintu je, ...) */
const updateUserStoryAddFlags = (req, res) => {
  if (!req.params.idProject || !req.params.idUserStory) {
    return res.status(404).json({
      sporočilo:
        "Ne najdem projekta oziroma uporabniske zgodbe, " +
        "idProject in idUserStory sta obvezna parametra.",
    });
  }
  Project.findById(req.params.idProject)
    .select("userStories")
    .exec((napaka, project) => {
      if (!project) {
        return res.status(404).json({ sporočilo: "Ne najdem projekta." });
      } else if (napaka) {
        return res.status(500).json(napaka);
      }
      if (project.userStories && project.userStories.length > 0) {
        const currentUserStory = project.userStories.id(
          req.params.idUserStory
        );
        if (!currentUserStory) {
          res.status(404).json({ sporočilo: "Ne najdem uporabniske zgodbe." });
        } else {
          //tle dodas en acceptance task
          currentUserStory.flags.push(req.body.flag);
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

/* Adding owner  */
const updateUserStoryAddOwner = (req, res) => {
  if (!req.params.idProject || !req.params.idUserStory) {
    return res.status(404).json({
      sporočilo:
        "Ne najdem projekta oziroma uporabniske zgodbe, " +
        "idProject in idUserStory sta obvezna parametra.",
    });
  }
  Project.findById(req.params.idProject)
    .select("userStories")
    .exec((napaka, project) => {
      if (!project) {
        return res.status(404).json({ sporočilo: "Ne najdem projekta." });
      } else if (napaka) {
        return res.status(500).json(napaka);
      }
      if (project.userStories && project.userStories.length > 0) {
        const currentUserStory = project.userStories.id(
          req.params.idUserStory
        );
        if (!currentUserStory) {
          res.status(404).json({ sporočilo: "Ne najdem uporabniske zgodbe." });
        } else {
          //tle dodas en acceptance task
          currentUserStory.userStorieOwnerUsername = req.body.userStorieOwnerUsername;
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


/* Delete userStory - at least for developing purposes  */
const deleteUserStory = (req, res) => {
  const { idProject, idUserStory } = req.params;
  if (!idProject || !idUserStory) {
    return res.status(404).json({
      sporočilo:
        "Ne najdem projekta oz. uporabniske zgodbe, " +
        "idProject in idUserStory sta obvezna parametra.",
    });
  }
  Project.findById(idProject)
    .select("userStories")
    .exec((napaka, project) => {
      if (!project) {
        return res.status(404).json({ sporočilo: "Ne najdem projekta." });
      } else if (napaka) {
        return res.status(500).json(napaka);
      }
      if (project.userStories && project.userStories.length > 0) {
        if (!project.userStories.id(idUserStory)) {
          return res.status(404).json({ sporočilo: "Ne najdem uporabniske zgodbe." });
        } else {

          project.userStories.id(idUserStory).remove();
          project.save((napaka) => {
            if (napaka) {
              return res.status(500).json(napaka);
            } else {
              res.status(204).json(project);
            }
          });
        }
      } else {
        res.status(404).json({ sporočilo: "Ni uporabniske zgodbe za brisanje." });
      }
    });
};


module.exports = {
    projectInfo,
    addUserStoryToAProject,
    userStoryInfo,
    updateUserStoryInfo,
    updateUserStoryAddSubtask,
    updateUserStoryAddOwnerToSubtask,
    updateUserStoryEditSubtask,
    updateUserStoryRemoveSubtask,
    updateUserStoryAddAcceptanceTests,
    updateUserStoryAddAComment,
    updateUserStoryAddFlags,
    updateUserStoryAddOwner,
    deleteUserStory,
    updateUserStoryAddToSprint,
    updateUserStoryAddSize,
    acceptStory,
    declineStory
};
