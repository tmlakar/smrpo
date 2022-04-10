const mongoose = require("mongoose");
const Project = mongoose.model("Project");



 /* Adding a new sprint to a project */

 const addSprintToAProject = (req, res) => {
   console.log("pridem do apija")
   console.log(req.params.id)
   console.log(req.body.sprintSize)
   console.log(req.body.startDate)
    const idProject = req.params.id;
    if (idProject) {
      Project.findById(idProject)
        .exec((napaka, project) => {
          if (napaka) {
            res.status(400).json(napaka);
          } else {
            addSprint(req, res, project);
          }
        });
    } else {
      res.status(400).json({
        sporočilo: "Ne najdem projekta, idProject je obvezen parameter.",
      });
    }
  };

  const addSprint = (req, res, project) => {
    if (!project) {
      res.status(404).json({ sporočilo: "Ne najdem projekta." });
    } else {
      //tuki so podatki undefined iz req.body
      //za sprint size je uredu in se tudi shrnai in ga tuki prikaže, za startDate je pa undefined
      console.log(req.body.sprintSize)
      console.log(req.body.startDate)
      console.log(req.body.number)
      project.sprints.push({
        number: req.body.number,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        sprintSize: req.body.sprintSize,
      });
      project.save((napaka, project) => {
        if (napaka) {
          res.status(400).json(napaka);
        } else {
          res.status(201).json(project);
        }
      });
    }
  };

//update sprint
  const updateSprintInProcess = (req, res) => {
    if (!req.params.idProject || !req.params.idSprint) {
      return res.status(404).json({
        sporočilo:
          "Ne najdem projekta oziroma sprinta, " +
          "idProject in idSprint sta obvezna parametra.",
      });
    }
    Project.findById(req.params.idProject)
      .select("sprints")
      .exec((napaka, project) => {
        if (!project) {
          return res.status(404).json({ sporočilo: "Ne najdem projekta." });
        } else if (napaka) {
          return res.status(500).json(napaka);
        }
        if (project.sprints && project.sprints.length > 0) {
          const currentSprint = project.sprints.id(
            req.params.idSprint
          );
          if (!currentSprint) {
            res.status(404).json({ sporočilo: "Ne najdem sprinta." });
          } else {
              //updejtam sprint size
              currentSprint.sprintSize = req.body.sprintSize;
              currentSprint.save((napaka, user) => {
                if (napaka) {
                res.status(400).json(napaka);
                } else {
                //res.status(201).json(user);
              }
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
          return res.status(404).json({ sporočilo: "Ni obstojecih sprintov." });
        }
      });
  };

  //update sprint
    const updateFutureSprint = (req, res) => {
      if (!req.params.idProject || !req.params.idSprint) {
        return res.status(404).json({
          sporočilo:
            "Ne najdem projekta oziroma sprinta, " +
            "idProject in idSprint sta obvezna parametra.",
        });
      }
      Project.findById(req.params.idProject)
        .select("sprints")
        .exec((napaka, project) => {
          if (!project) {
            return res.status(404).json({ sporočilo: "Ne najdem projekta." });
          } else if (napaka) {
            return res.status(500).json(napaka);
          }
          if (project.sprints && project.sprints.length > 0) {
            const currentSprint = project.sprints.id(
              req.params.idSprint
            );
            if (!currentSprint) {
              res.status(404).json({ sporočilo: "Ne najdem sprinta." });
            } else {
                //updejtam sprint
                currentSprint.startDate = req.body.startDate;
                currentSprint.endDate = req.body.endDate;
                currentSprint.sprintSize = req.body.sprintSize;
                currentSprint.save((napaka, sprint) => {
                  if (napaka) {
                  res.status(400).json(napaka);
                  } else {
                }
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
            return res.status(404).json({ sporočilo: "Ni obstojecih sprintov." });
          }
        });
    };

  //delete sprint
  const deleteSprint = (req, res) => {
    const { idProject, idSprint } = req.params;
    if (!idProject || !idSprint) {
      return res.status(404).json({
        sporočilo:
          "Ne najdem projekta oz. sprinta, " +
          "idProject in idSprint sta obvezna parametra.",
      });
    }
    Project.findById(idProject)
      .select("sprints")
      .exec((napaka, project) => {
        if (!project) {
          return res.status(404).json({ sporočilo: "Ne najdem projekta." });
        } else if (napaka) {
          return res.status(500).json(napaka);
        }
        if (project.sprints && project.sprints.length > 0) {
          if (!project.sprints.id(idSprint)) {
            return res.status(404).json({ sporočilo: "Ne najdem sprinta." });
          } else {
            project.sprints.id(idSprint).remove();
            project.save((napaka) => {
              if (napaka) {
                return res.status(500).json(napaka);
              } else {
                res.status(204).json(project);
              }
            });
          }
        } else {
          res.status(404).json({ sporočilo: "Ni sprinta za brisanje." });
        }
      });
  };




   module.exports = {
       addSprintToAProject,
       updateSprintInProcess,
       deleteSprint,
       updateFutureSprint
};
