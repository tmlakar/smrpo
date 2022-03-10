var users = require("../models/user.json");

var seznam = (req, res) => {

    res.render('users-admin', {
        users: users

    });
};


module.exports = {
    seznam,
};


