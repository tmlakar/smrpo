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

  const addUserStory = (req, res, project) => {
    if (!project) {
      res.status(404).json({ sporočilo: "Ne najdem projekta." });
    } else {
      // zacetni podatki ko dodajamo user story  
      project.userStories.push({
        name: req.body.name,
        aboutText: req.body.aboutText,
        priority: req.body.priority,
        businessValue: req.body.priority,
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

  /* Updating basic userStory info */

/* Adding subtaks to userStory */

/* Adding acceptance tests to userStory */

/* Adding a footnote / comment from specific collaborator to userStory */

module.exports = {
    projectInfo,
    addUserStory,
    userStoryInfo

};