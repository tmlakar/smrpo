const mongoose = require("mongoose");

const adminShema = new mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    username: { type: String, required: true },
    password: String
  });


mongoose.model('Admin', adminShema, 'Admins');

// mongoose je ime povezave,
// Admin je ime modela,
// adminShema je shema, ki jo uporabimo in
// Admins je (opcijsko) ime MongoDB zbirke.