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
 

 /* Adding a collaborator to a project */

 const addCollaboratorToAProject = (req, res) => {
    const idProject = req.params.idProject;
    if (idProject) {
      Project.findById(idProject)
        .select("collaborators")
        .exec((napaka, project) => {
          if (napaka) {
            res.status(400).json(napaka);
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
      project.collaborators.push({
        username: req.body.username,
        project_role: req.body.project_role,
      });
      project.save((napaka, project) => {
        if (napaka) {
          res.status(400).json(napaka);
        } else {
          const addedCollaborator = project.collaborators.slice(-1).pop();
          res.status(201).json(addedCollaborator);
        }
      });
    }
  };



  /* Editing a collaborator role on a project */

  // const collaboratorPreberiIzbranega = (req, res) => {
  //   Project.findById(req.params.idProject)
  //     .select("collaborators")
  //     .exec((napaka, projekt) => {
  //       if (!projekt) {
  //         return res.status(404).json({
  //           sporočilo:
  //             "Ne najdem projekta s podanim enoličnim identifikatorjem idProjekt.",
  //         });
  //       } else if (napaka) {
  //         return res.status(500).json(napaka);
  //       }
  //       if (projekt.collaborators && projekt.collaborators.length > 0) {
  //         const collaborator = projekt.collaborators.id(req.params.idCollaborator);
  //         if (!collaborator) {
  //           return res.status(404).json({
  //             sporočilo:
  //               "Ne najdem collaboratorja s podanim enoličnim identifikatorjem idCollaborator.",
  //           });
  //         } else {
  //           res.status(200).json({
  //             projekt: { naziv: lokacija.naziv, id: req.params.idLokacije },
  //             collaborator: collaborator,
  //             "status": "uspešno"
  //           });
  //         }
  //       } else {
  //         return res
  //           .status(404)
  //           .json({ sporočilo: "Ne najdem nobenega collaboratorja." });
  //       }
  //     });
  // };

   /* Removing collaborator from the project */



   module.exports = {
       projectInfo,
       usersList,
       addCollaboratorToAProject
};