const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const activeProjects = new mongoose.Schema({
  name: {type: String, unique: true},
  idOfProject: {type: String}
});

const userShema = new mongoose.Schema({
    name: { type: String },
    surname: { type: String},
    username: { type: String, unique: true},
    email: { type: String},
    nakljucnaVrednost: {type: String, required: true},
    zgoscenaVrednost: {type: String, required: true},
    role: { type: String,
        default: 'user',
        enum: ["user", "admin"]
      },
    accessToken: {type: String},
    isNotDeleted: {type: Boolean, default: true},
    activeProjects: [activeProjects]
});


/* Sifriranje uporabniskega gesla */


userShema.methods.nastaviGeslo = function (password) {
  this.nakljucnaVrednost = crypto.randomBytes(16).toString("hex");
  this.zgoscenaVrednost = crypto
    .pbkdf2Sync(password, this.nakljucnaVrednost, 1000, 64, "sha512")
    .toString("hex");
};


/* Preverjanje uporabniskega gesla, ko se uporabnik prijavlja v sistem */


userShema.methods.preveriGeslo = function (password) {
  let zgoscenaVrednost = crypto
    .pbkdf2Sync(password, this.nakljucnaVrednost, 1000, 64, "sha512")
    .toString("hex");
  return this.zgoscenaVrednost == zgoscenaVrednost;
};



/* Generiranje zetona JWT - iz koristnih podatkov o uporabniku in skritega gesla, datum poteka nastavljen na 7 dni */

var zeton;

userShema.methods.generirajJwt = function () {
  const datumPoteka = new Date();
  const date1 = new Date();
  datumPoteka.setDate(datumPoteka.getDate() + 7);
  
  zeton = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      surname: this.surname,
      username: this.username,
      email: this.email,
      role: this.role,
      isNotDeleted: this.isNotDeleted,
      activeProjects: this.activeProjects,
      date: date1,
      exp: parseInt(datumPoteka.getTime() / 10),
    },
    process.env.JWT_GESLO); 
    
    console.log({žeton: zeton});
    
    return zeton;


};




// ko zacnemo razmisljati o projektih/sprintih/karticah razsirimo shemo v
// shemo z odvisnimi dokumenti in modeliramo tudi ostale podatkovne strukture

mongoose.model('User', userShema, 'Users');