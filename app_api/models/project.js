const mongoose = require("mongoose");

const collaboratorShema = new mongoose.Schema({
    username: { type: String},
    project_role: { type: String,
        default: 'Team Member',
        enum: ["Team Member", "Product Manager", "Scrum Master"]
      }
});

const subtaskShema = new mongoose.Schema({
    name: {type: String},
    subtaskOwnerUsername: {type: String, default: null},
    pending: {type: String, default: true},
    finished: {type: Boolean, default: false}
});

const userStoryCommentsShema = new mongoose.Schema({
    comment: {type: String},
    commentOwnerUsername: {type: String}
});

const userStoriesShema = new mongoose.Schema({
    name: {type: String},
    aboutText: {type: String},
    priority: {type: String,
        default: "Must have",
        enum: ["Must have", "Should have", "Could have", "Won't have this time"]
    },
    size: {type: Number},
    businessValue: {type: Number},
    tests: [{type: String}],
    subtasks: [subtaskShema],
    comments: [userStoryCommentsShema],
    userStorieOwnerUsername: {type: String, default: null},
    flags: [{type: String}],
    pending: {type: Boolean, default: true},
    finished: {type: Boolean, default: false},
    inProgress: {type: Boolean, default: false},
    sprint: {type: Number, default: 0},


});

const sprintShema = new mongoose.Schema({
  //tukaj manjka sprint name, če kje uporabljaš
    number: {type: Number},
    startDate: {type: Date},
    endDate: {type: Date},
    sprintSize: {type: Number}
});

const projectShema = new mongoose.Schema({
    name: { type: String, unique: true},
    info: {type: String},
    projectID: {type: Number},
    collaborators: [collaboratorShema],
    userStories: [userStoriesShema],
    sprints: [sprintShema]

});


mongoose.model('Project', projectShema, 'Projects');
