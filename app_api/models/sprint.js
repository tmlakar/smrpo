const mongoose = require("mongoose");



const sprintShema = new mongoose.Schema({
    name: { type: String, unique: true  },
    info: {type: String}
});


mongoose.model('Sprint', sprintShema, 'Sprints');
