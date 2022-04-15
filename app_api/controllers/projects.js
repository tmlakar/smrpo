const mongoose = require("mongoose");
const Project = mongoose.model("Project");


/* Projects list */
const projectsList = (req, res) => {
    Project.find().exec(function(err, projects) {
        if (err) {
            console.log(err);
            res.status(404).json({ "sporočilo": "Napaka pri poizvedbi: " + err });
        } else {
            res.status(200).json(projects);
        }
    });
};


/* Creating new project */

const projectCreate = (req, res) => {
    //var collaboratorsR = [{username: "anja", project_role: "Team Member"}];
    console.log(req.body.name, req.body.info);
    var nameL = req.body.name;
    nameL = nameL.toLowerCase();

    Project.find().exec(function(err, projects) {
        if (err) {
            console.log(err);
            res.status(404).json({ "sporočilo": "Napaka pri poizvedbi: " + err });
        } else {
            for (var i = 0; i < projects.length; i++) {
                if (projects[i].name.toLowerCase() == nameL) {
                    return res.status(400).json();
                }
            }

            Project.create({

                name: req.body.name,
                info: req.body.info
        
            }, (napaka, project) => {
                if (napaka) {
                    console.log("Prislo je do napake");
                    res.status(400).json(napaka);
                } else {
                    res.status(201).json();
                }
            });
            
            
        }
    });
    

    
};

/* Just for developing purposes - deleting a project */
const deleteProject = (req, res) => {
    const { idProject } = req.params;
    if (idProject) {
        Project.findByIdAndRemove(idProject).exec((napaka) => {
            if (napaka) {
                return res.status(500).json(napaka);
            }
            res.status(204).json("uspešno");
        });
    } else {
        res.status(404).json({
            sporočilo: "Ne najdem projekta, idProject je obvezen parameter.",
        });
    }
};

/* D E T A I L S */

/* Particular project info */

const projectInfo = (req, res) => {
    Project.findById(req.params.idProject).exec((napaka, project) => {
        if (!project) {
            return res
                .status(404)
                .json({
                    sporočilo: "Ne najdem projekta s podanim enoličnim identifikatorjem idProject.",
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
            
        var nameL = req.body.name;
        nameL = nameL.toLowerCase();
            

        Project.find().exec(function(err, projects) {
                    if (err) {
                        console.log(err);
                        res.status(404).json({ "sporočilo": "Napaka pri poizvedbi: " + err });
                    } else {
                        for (var i = 0; i < projects.length; i++) {
                            if (projects[i].name.toLowerCase() == nameL) {
                                return res.status(400).json();
                            } 
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
                        
                        
                    }
            });

    
};

module.exports = {
    projectsList,
    projectCreate,
    deleteProject,
    projectInfo,
    projectUpdate,
    deleteProject

};