const mongoose = require("mongoose");

const publicationCommentShema = new mongoose.Schema({
    comment: {type: String},
    commentOwner: {type: String},
    date: {type: Date}
});

const publicationShema = new mongoose.Schema({
    text: {type: String},
    date: {type: Date},
    comments: [publicationCommentShema],
    publicationOwner: {type: String}
});

const collaboratorShema = new mongoose.Schema({
    username: { type: String},
    project_role: { type: String,
        default: 'Team Member',
        enum: ["Team Member", "Product Manager", "Scrum Master"]
      }
});

const userStoryCommentsShema = new mongoose.Schema({
    comment: {type: String},
    commentOwnerUsername: {type: String}
});

const hoursShema = new mongoose.Schema({
    datum: {type: Date},
    workingSeconds: {type: Number},
    startTime: {type: Date},
    endTime: {type: Date}
});

const subtaskShema = new mongoose.Schema({
    name: {type: String},
    hours: {type: Number},
    subtaskOwnerUsername: {type: String, default: null},
    pending: {type: String, default: true},
    finished: {type: Boolean, default: false},
    isDeleted: {type: Boolean, default: false},
    comments: [publicationCommentShema],
    startTime: {type: Date},
    endTime: {type: Date},
    workingHours: [hoursShema],
    estimatedHours: [hoursShema],
    active: {type: Boolean, default: false}
});



const userStoriesShema = new mongoose.Schema({
    name: {type: String},
    aboutText: {type: String},
    priority: {type: String,
        default: "Must have",
        enum: ["Must have", "Should have", "Could have", "Won't have this time"]
    },
    size: {type: Number, default: 0},
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
    allSprints: [{type: String}],
    documentation: {type: String, default: "User manual."},
    accepted: {type: Boolean, default: false}
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
    sprints: [sprintShema],
    publications: [publicationShema],
    documentation: {type: String}

});



mongoose.model('Project', projectShema, 'Projects');
