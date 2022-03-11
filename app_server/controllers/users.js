
var apiParametri = {
    streznik: "http://localhost:" + (process.env.PORT || 3000),
  };
  if (process.env.NODE_ENV === "production") {
    
  }
  const axios = require("axios").create({
    baseURL: apiParametri.streznik,
    timeout: 5000,
  });


var users = require("../models/user.json");


var seznam = (req, res) => {
    
  axios
      .get (apiParametri.streznik + '/api/users', {})
      .then((odgovor) => {
          res.render('users-admin', {
          users: odgovor.data});
      });
};


module.exports = {
    seznam,
};


