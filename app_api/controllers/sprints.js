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





   module.exports = {
       addSprintToAProject
};
