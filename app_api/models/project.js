const mongoose = require("mongoose");

const collaboratorShema = new mongoose.Schema({
    username: { type: String, unique: true},
    project_role: { type: String,
        default: 'Team Member',
        enum: ["Team Member", "Product Manager", "Scrum Master"]
      }
});

const userStoriesShema = new mongoose.Schema({
    name: {type: String},
    aboutText: {type: String},
    priority: {type: String,
        default: "Must have",
        enum: ["Must have", "Should have", "Could have", "Won't have this time"]
    },
    tests: [{type: String}],
    businessValue: {type: String},
    flags: [{type: String}]

});

const sprintShema = new mongoose.Schema({
    sprintName: {type: String},
    sprintSize: {type: Number},
    sprintStartDate: {type: Date},
    sprintEndDate: {type: Date}
});

const projectShema = new mongoose.Schema({
    name: { type: String, unique: true  },
    info: {type: String},
    projectID: {type: Number},
    collaborators: [collaboratorShema],
    userStories: [userStoriesShema],
    sprints: [sprintShema]

});


mongoose.model('Project', projectShema, 'Projects');