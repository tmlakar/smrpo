const mongoose = require("mongoose");
const Project = mongoose.model("Project");
const User = mongoose.model("User");


/* Posodabljanje uporabniske dokumentacije - besedilo */

const updateUserStoryDocumentation = (req, res) => {
  if (!req.params.idProject) {
      return res.status(404).json({
          sporočilo: "Ne najdem projekta, idProject je obvezen parameter.",
      });
  }
    
    console.log("tuk");
      
    Project.find().exec(function(err, projects) {
                  if (err) {
                      console.log(err);
                      res.status(404).json({ "sporočilo": "Napaka pri poizvedbi: " + err });
                  } else {
                      Project.findById(req.params.idProject)
                          .exec((napaka, project) => {
                              if (!project) {
                                  return res.status(404).json({ sporočilo: "Ne najdem projekta." });
                              } else if (napaka) {
                                  return res.status(500).json(napaka);
                              }

                              


                              project.documentation = req.body.documentation;
                              

                              project.save((napaka, project) => {
                                  if (napaka) {
                                      res.status(404).json(napaka);
                                  } else {
                                      res.status(200).json(project);
                                  }
                              });
                          });
                      
                      
                  }
          });

  
};

module.exports = {
   updateUserStoryDocumentation
};