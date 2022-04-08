const mongoose = require("mongoose");
const Project = mongoose.model("Project");
const User = mongoose.model("User");

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
        var currentLast = project.userStories.length;
        number = currentLast + 1;
      }
      project.userStories.push({
        name: "#" + number + " " + req.body.name,
        aboutText: req.body.aboutText,
        priority: req.body.priority,
        businessValue: req.body.businessValue,
        size: req.body.size,
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
        if (project.userStories && project.userStories.length > 0) {
          const currentUserStory = project.userStories.id(
            req.params.idUserStory
          );
          if (!currentUserStory) {
            res.status(404).json({ sporočilo: "Ne najdem uporabniske zgodbe." });
          } else {
            currentUserStory.name = req.body.name;
            currentUserStory.aboutText = req.body.aboutText;
            currentUserStory.priority = req.body.priority;
            currentUserStory.businessValue = req.body.businessValue;
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
            subtaskOwnerUsername: req.body.subtaskOwnerUsername,
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
              currentSubtask.subtaskOwnerUsername = req.body.subtaskOwnerUsername;


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
          currentUserStory.tests.push('#' + req.body.tests);
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
    updateUserStoryAddAcceptanceTests,
    updateUserStoryAddAComment,
    updateUserStoryAddFlags,
    updateUserStoryAddOwner,
    deleteUserStory

};