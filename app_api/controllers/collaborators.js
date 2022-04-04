const mongoose = require("mongoose");
const Project = mongoose.model("Project");
const User = mongoose.model("User");


/* Need this for adding people to a project */
const usersList = (req, res) => {
    User.find().exec(function (err, users) {
        if (err) {
            console.log(err);
            res.status(404).json({"sporočilo": "Napaka pri poizvedbi: " + err});
        } else {
            res.status(200).json(users);
        }
    });
  };


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
 

 /* Adding a collaborator to a project + adding a project to users activeProjects list */

 const addCollaboratorToAProject = (req, res) => {
    const idProject = req.params.idProject;
    if (idProject) {
      Project.findById(idProject)
        .exec((napaka, project) => {
          if (napaka) {
            res.status(400).json(napaka);
            console.log("napaka 400");
          } else {
            addCollaborator(req, res, project);
            //res.status(200).json({ status: "uspešno" });
          }
        });
    } else {
      res.status(400).json({
        sporočilo: "Ne najdem projekta, idProject je obvezen parameter.",
      });
    }
  };

  const addCollaborator = (req, res, project) => {
    if (!project) {
      res.status(404).json({ sporočilo: "Ne najdem projekta." });
    } else {
      var userUsername = req.body.username;
      project.collaborators.push({
        username: req.body.username,
        project_role: req.body.project_role,
      });
      project.save((napaka, project) => {
        if (napaka) {
          res.status(400).json(napaka);
        } else {
          const addedCollaborator = project.collaborators.slice(-1).pop();
          /* project se shrani se uporabniku v podatkovno bazo: 
          njegovo ime + njegov id, ki se bo uporabljal za prikazovanje in navigiranje na same uporabniske zgodbe projekta */
          
          // najprej poiscemo userja glede na njegov username - userUsername
          User.findOne({username: userUsername})
          .select("activeProjects")
          .exec((napaka, user) => {
            if (!user) {
              return res.status(404).json({
                sporočilo:
                  "Ne najdem uporabnika z uporabniskim imenom userUsername",
              });
            } else if (napaka) {
              return res.status(500).json(napaka);
            }  
            // shranimo notr ime od projekta + idprojekta
            user.activeProjects.push({
              name: project.name,
              idOfProject: project._id,
            });

            user.save((napaka, user) => {
              if (napaka) {
                res.status(400).json(napaka);
              } else {
                //res.status(201).json(user);
              }
            });
          });

          
          res.status(201).json(addedCollaborator);
        }
      });
    }
  };


  /* Editing a collaborator role on a project */

  const collaboratorInfo = (req, res) => {
    Project.findById(req.params.idProject)
      .select("collaborators")
      .exec((napaka, project) => {
        if (!project) {
          return res.status(404).json({
            sporočilo:
              "Ne najdem projekta s podanim enoličnim identifikatorjem idProject.",
          });
        } else if (napaka) {
          return res.status(500).json(napaka);
        }
        if (project.collaborators && project.collaborators.length > 0) {
          const collaborator = project.collaborators.id(req.params.idCollaborator);
          if (!collaborator) {
            return res.status(404).json({
              sporočilo:
                "Ne najdem collaboratorja s podanim enoličnim identifikatorjem idCollaborator.",
            });
          } else {
            res.status(200).json({
              project: { ime: project.name, id: req.params.idProject },
              collaborator: collaborator,
              "status": "uspešno"
            });
          }
        } else {
          return res
            .status(404)
            .json({ sporočilo: "Ne najdem nobenega collaboratorja." });
        }
      });
  };

  const updateCollaboratorsRoleProject = (req, res) => {
    if (!req.params.idProject || !req.params.idCollaborator) {
      return res.status(404).json({
        sporočilo:
          "Ne najdem projekta oziroma kolaboratorja, " +
          "idProject in idCollaborator sta obvezna parametra.",
      });
    }
    Project.findById(req.params.idProject)
      .select("collaborators")
      .exec((napaka, project) => {
        if (!project) {
          return res.status(404).json({ sporočilo: "Ne najdem projekta." });
        } else if (napaka) {
          return res.status(500).json(napaka);
        }
        if (project.collaborators && project.collaborators.length > 0) {
          const currentCollaborator = project.collaborators.id(
            req.params.idCollaborator
          );
          if (!currentCollaborator) {
            res.status(404).json({ sporočilo: "Ne najdem kolaboratorja." });
          } else {
            currentCollaborator.project_role = req.body.project_role;
            project.save((napaka, project) => {
              if (napaka) {
                res.status(404).json(napaka);
              } else {
                res.status(200).json(project);
              }
            });
          }
        }
      });
  };

   /* Removing collaborator from the project + removing the project from users list of activeProjects */

   const deleteCollaborator = (req, res) => {
    const { idProject, idCollaborator } = req.params;
    if (!idProject || !idCollaborator) {
      return res.status(404).json({
        sporočilo:
          "Ne najdem projekta oz. kolaboratorja, " +
          "idProject in idCollaborator sta obvezna parametra.",
      });
    }
    Project.findById(idProject)
      .select("collaborators")
      .exec((napaka, project) => {
        if (!project) {
          return res.status(404).json({ sporočilo: "Ne najdem projekta." });
        } else if (napaka) {
          return res.status(500).json(napaka);
        }
        if (project.collaborators && project.collaborators.length > 0) {
          if (!project.collaborators.id(idCollaborator)) {
            return res.status(404).json({ sporočilo: "Ne najdem collaboratorja." });
          } else {
            var currentUserUsername = project.collaborators.id(idCollaborator).username;
            console.log(project.collaborators.id(idCollaborator).username);
            //izbrisi se njemu iz podatkovne baze tole

            project.collaborators.id(idCollaborator).remove();
            project.save((napaka) => {
              if (napaka) {
                return res.status(500).json(napaka);
              } else {
                User.findOne({username: currentUserUsername})
                .select("activeProjects")
                .exec((napaka, user) => {
                  if (!user) {
                      return res.status(404).json({
                          sporočilo:
                          "Ne najdem uporabnika z uporabniskim imenom currentUserUsername",
                        });
                      } else if (napaka) {
                        return res.status(500).json(napaka);
                      }  
                    // odstranimo projekt z idjem 
                    let activeP = user.activeProjects.find(o => o.idOfProject === idProject);
                    console.log(activeP)
                    let projectIdActive = activeP.id;
                    console.log(projectIdActive);
                    user.activeProjects.id(projectIdActive).remove();
                    user.save((napaka, user) => {
                        if (napaka) {
                        res.status(400).json(napaka);
                        } else {
                        //res.status(201).json(user);
                      }
                  });
              });
                res.status(204).json(project);
              }
            });
          }
        } else {
          res.status(404).json({ sporočilo: "Ni collaboratorja za brisanje." });
        }
      });
  };


  const deleteCollaboratorsActiveProject = (req, res, project) => {
  
  
  };

   module.exports = {
       projectInfo,
       usersList,
       addCollaboratorToAProject,
       collaboratorInfo,
       updateCollaboratorsRoleProject,
       deleteCollaborator,
       deleteCollaboratorsActiveProject
};