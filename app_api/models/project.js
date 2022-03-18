const mongoose = require("mongoose");

const userShema = new mongoose.Schema({
    ime: { type: String },
    role: { type: String,
        default: 'član razvojne skupine',
        enum: ["član razvojne skupine", "produktni vodja", "skrbnik metodologije"]
      }
});

const projectShema = new mongoose.Schema({
    name: { type: String, unique: true  },
    users: [userShema]
});


mongoose.model('Project', projectShema, 'Projects');