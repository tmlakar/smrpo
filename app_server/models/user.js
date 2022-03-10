const mongoose = require("mongoose");

const userShema = new mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: String,
    role: { type: String, required: true },
  });

// ko zacnemo razmisljati o projektih/sprintih/karticah razsirimo shemo v
// shemo z odvisnimi dokumenti in modeliramo tudi ostale podatkovne strukture

mongoose.model('User', userShema, 'Users');