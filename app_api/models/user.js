const mongoose = require("mongoose");

const userShema = new mongoose.Schema({
    name: { type: String },
    surname: { type: String},
    username: { type: String},
    email: { type: String },
    password: String,
    role: { type: String},
  });

// ko zacnemo razmisljati o projektih/sprintih/karticah razsirimo shemo v
// shemo z odvisnimi dokumenti in modeliramo tudi ostale podatkovne strukture

mongoose.model('User', userShema, 'Users');