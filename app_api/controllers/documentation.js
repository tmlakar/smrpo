const mongoose = require("mongoose");
const Project = mongoose.model("Project");
const User = mongoose.model("User");


/* Posodabljanje uporabniske dokumentacije - besedilo */

const updateUserStoryDocumentation = (req, res) => {
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
            
            
            currentUserStory.documentation = req.body.documentation;
              
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
   updateUserStoryDocumentation
};