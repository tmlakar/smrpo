const hbs = require("hbs");



hbs.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});

hbs.registerHelper('isDeleted1', function (value) {
  if (value === "false") {
    return true;
  } 
  return false;
});

/* logged in user cannot delete themselves */
hbs.registerHelper('isTheSame', function (value, value2) {
  if (value !== value2) {
    return true;
  } 
  return false;
});

hbs.registerHelper('isTheSameAsLoggedIn', function (value, value2) {
  if (value == value2) {
    return true;
  } 
  return false;
});

