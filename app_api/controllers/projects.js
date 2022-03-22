const mongoose = require("mongoose");
const Project = mongoose.model("Project");

/* Projects list */
const projectsList = (req, res) => {
    Project.find().exec(function (err, projects) {
        if (err) {
            console.log(err);
            res.status(404).json({"sporočilo": "Napaka pri poizvedbi: " + err});
        } else {
            res.status(200).json(projects);
        }
    });
};


/* Creating new project */

const projectCreate = (req, res) => {
    Project.create({

      name: req.body.name,
      info: req.body.info
      
  }, (napaka, project) => {
      if(napaka) {
          res.status(400).json(napaka);
      }  else {
          res.status(201).json(project);
      }
    });
};

/* D E T A I L S */

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

/* Updating particular project */
const projectUpdate = (req, res) => {
    if (!req.params.idProject) {
      return res.status(404).json({
        sporočilo: "Ne najdem projekta, idProject je obvezen parameter.",
      });
    }
    Project.findById(req.params.idProject)
      .exec((napaka, project) => {
        if (!project) {
          return res.status(404).json({ sporočilo: "Ne najdem projekta." });
        } else if (napaka) {
          return res.status(500).json(napaka);
        }
        project.name = req.body.name;
        project.info = req.body.info;

        project.save((napaka, project) => {
          if (napaka) {
            res.status(404).json(napaka);
          } else {
            res.status(200).json(project);
          }
        });
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
    projectsList,
    projectCreate,
    projectInfo,
    projectUpdate

};