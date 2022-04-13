const mongoose = require("mongoose");
const Project = mongoose.model("Project");
const User = mongoose.model("User");


/* GET - seznam publicationov = podrobnosti projekta */
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


/* POST - dodajanje publicationa  */

const addPublicationToAProject = (req, res) => {
    const idProject = req.params.idProject;
    if (idProject) {
      Project.findById(idProject)
        .exec((napaka, project) => {
          if (napaka) {
            res.status(400).json(napaka);
            console.log("napaka 400");
          } else {
            addPublication(req, res, project);
            //res.status(200).json({ status: "uspešno" });
          }
        });
    } else {
      res.status(400).json({
        sporočilo: "Ne najdem projekta, idProject je obvezen parameter.",
      });
    }
  };

  const addPublication = (req, res, project) => {
    if (!project) {
      res.status(404).json({ sporočilo: "Ne najdem projekta." });
    } else {
      console.log(project);
    

      project.publications.push({
        text: req.body.text,
        date: req.body.date
      });
      project.save((napaka, project) => {
        if (napaka) {
          res.status(400).json(napaka);
        } else {
          const addedP = project.userStories.slice(-1).pop();

          res.status(201).json(addedP);
        }
      });
    }
  };

/* POST - dodajanje komentarja na publication  */

const addCommentToPublication = (req, res) => {
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
            currentPublication.publications.push({
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

/* DELETE - brisanje objave  */

const deletePublication = (req, res) => {
    const { idProject, idPublication } = req.params;
    if (!idProject || !idPublication) {
      return res.status(404).json({
        sporočilo:
          "Ne najdem projekta oz. objave, " +
          "idProject in idPublication sta obvezna parametra.",
      });
    }
    Project.findById(idProject)
      .select("publications")
      .exec((napaka, project) => {
        if (!project) {
          return res.status(404).json({ sporočilo: "Ne najdem projekta." });
        } else if (napaka) {
          return res.status(500).json(napaka);
        }
        if (project.publications && project.publications.length > 0) {
          if (!project.publications.id(idPublication)) {
            return res.status(404).json({ sporočilo: "Ne najdem objave." });
          } else {
            
            project.publications.id(idPublication).remove();
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

/* DELETE - brisanje komentarja na objavi */

const removeCommentFromPublication = (req, res) => {
    if (!req.params.idProject || !req.params.idPublication || !req.params.idComment) {
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
          const currentPublication = project.publication.id(
            req.params.idPublication
          );
          if (!currentPublication) {
            res.status(404).json({ sporočilo: "Ne najdem uporabniske zgodbe." });
          } else {
  
            if (currentPublication.comments && currentPublication.comments.length > 0) {
              const currentComment = currentPublication.comments.id(
                req.params.idComment
              );
              if (!currentComment) {
                res.status(404).json({ sporočilo: "Ne najdem subtaksa." });
              } else {
                currentPublication.comments.id(req.params.idComment).remove()
                
  
  
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

module.exports = {
    projectInfo,
    addPublicationToAProject,
    addCommentToPublication,
    removeCommentFromPublication,
    deletePublication
    

};