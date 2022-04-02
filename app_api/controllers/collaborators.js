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
       usersList
};