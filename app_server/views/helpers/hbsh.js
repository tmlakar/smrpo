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

/* showing project collaborators as circles with different colors, depending on project_role */

hbs.registerHelper('isTeamMember', function (value) {
  if (value == "Team Member") {
    return true;
  } 
  return false;
});

hbs.registerHelper('isScrumMaster', function (value) {
  if (value == "Scrum Master") {
    return true;
  } 
  return false;
});

hbs.registerHelper('isProductManager', function (value) {
  if (value == "Product Manager") {
    return true;
  } 
  return false;
});

hbs.registerHelper('firstLetterOfUsername', function (value) {
  let letter = value.charAt(0);
  letter = letter.toUpperCase();
  return letter;
});

/* if available collaborator is user, not admin */
hbs.registerHelper('isUser', function (value) {
  if (value == "user") {
    return true;
  } 
  return false;
});

