

var seznam = (req, res) => {
    res.render('login', {
        layout: 'layout-noNavbar'
    });
};


module.exports = {
    seznam,
};


