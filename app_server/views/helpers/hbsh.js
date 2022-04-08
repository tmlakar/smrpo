const hbs = require("hbs");
const { bus } = require("nodemon/lib/utils");



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
  if (value == null) {
    value = "nul";
  }
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

/* formatiranje datuma */

hbs.registerHelper('formatirajDatum', function (value) {
  var date_parsed = Date.parse(value);
          var d = new Date(date_parsed);
          var month = d.getUTCMonth() + 1; //months from 1-12
          if (month < 10) {
            month = "0" + month;
          }
          var day = d.getUTCDate();
          if (day < 10) {
            day = "0" + day;
          }
          var year = d.getUTCFullYear();
          
          var hour = d.getUTCHours()+2;
          if (hour < 10) {
            hour = "0" + hour;
          }
          var minute = d.getUTCMinutes();
          if (minute < 10) {
            minute = "0" + minute;
          }

          var datum = day+ '.' + month + '.' + year;
          return datum;
});

