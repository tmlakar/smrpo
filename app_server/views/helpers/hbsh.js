const hbs = require("hbs");

var Handlebars = require('handlebars');

Handlebars.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});

Handlebars.registerHelper('isDeleted1', function (value) {
  if (value === "false") {
    return true;
  } 
  return false;
});
