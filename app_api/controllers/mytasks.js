const mongoose = require("mongoose");
const Project = mongoose.model("Project");


/* Če član sprejme nalogo se v bazi posodobi atribut pending na false */
const acceptTask = (req, res) => {
  console.log("apiii")
  if (!req.params.idProject || !req.params.idStory || !req.params.idTask) {
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
                  //pridobim še taske
                  if (userStory.subtasks && userStory.subtasks.length > 0) {
                    const task = userStory.subtasks.id(
                      req.params.idTask
                    );
                    if (!task) {
                      res.status(404).json({ sporočilo: "Ne najdem naloge." });
                    } else {
                    //updejtam pending atribut - to bo pokazalo da je član skupine nalogo sprejel
                    task.pending = false;
                    task.save((napaka, user) => {
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
                }
              }
       else {
        return res.status(404).json({ sporočilo: "Ni obstojecih sprintov." });
      }
    });
}


module.exports = {
    acceptTask
};
