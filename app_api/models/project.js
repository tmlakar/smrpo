const mongoose = require("mongoose");

const collaboratorShema = new mongoose.Schema({
    username: { type: String },
    project_role: { type: String,
        default: 'Team Member',
        enum: ["Team Member", "Product Manager", "Scrum Master"]
      }
});

const projectShema = new mongoose.Schema({
    name: { type: String, unique: true  },
    info: {type: String},
    collaborators: [collaboratorShema]
});


mongoose.model('Project', projectShema, 'Projects');