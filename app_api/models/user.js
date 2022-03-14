const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");


const userShema = new mongoose.Schema({
    name: { type: String },
    surname: { type: String},
    username: { type: String, unique: true},
    email: { type: String, unique: true},
    nakljucnaVrednost: {type: String, required: true},
    zgoscenaVrednost: {type: String, required: true},
    role: { type: String },
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



userShema.methods.generirajJwt = function () {
  const datumPoteka = new Date();
  datumPoteka.setDate(datumPoteka.getDate() + 7);
  
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      name: this.name,
      exp: parseInt(datumPoteka.getTime() / 1000),
    },
    process.env.JWT_GESLO
  );
};



// ko zacnemo razmisljati o projektih/sprintih/karticah razsirimo shemo v
// shemo z odvisnimi dokumenti in modeliramo tudi ostale podatkovne strukture

mongoose.model('User', userShema, 'Users');