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


hbs.registerHelper('formatirajInfo', function (value) {
  var l = value.length;
  var trimmedString = value.substring(0, 49);
  if (l >= 50) {
    var dots = " ...";
    var trimmedString = trimmedString.concat(dots);
  }
  
  return trimmedString;

});



hbs.registerHelper('formatirajZapisAcceptanceTestov', function (value) {
  var tests = value;
  for (var i = 0; i < tests.length; i++) {
    var string = tests[i];
    string = '# ' + string;
    tests[i] = string;
  } 

  return tests;

});


/* 
pogoji za urejanje in izbris kartic 
- lahko jo samo scrum master al pa product manager
- nesme pripadat katermu koli sprintu
- nesme bit realizirana 
*/

// se pokaze, ampak disabled -> seprav mora bit vedno true;
hbs.registerHelper('karticeNemoresUrejat', function (value1, value2, value3, value4) {
  // value 3 - pripada sprintu
  // value 4 - finished?
  //je finished
  console.log(value1, value2, value3, value4);
  if (value4 == true) {
    return true;
  }
  //pripada sprintu
  if (value3 != 0) {
    return true;
  }
  //nesme bit scrum master al pa 
  if (value1 != true && value2 != true) {
    return true;
  }

  
  return false;

});

hbs.registerHelper('karticaSeLahkoUreja', function (value1, value2, value3, value4) {
  // value 3 - pripada sprintu
  // value 4 - finished?
  //ni finished
  //ne pripada sprintu
  //je scrum master al pa product manager
  console.log(value1, value2, value3, value4);
  if (value1 == true || value2 == true) {
    if (value3 == 0 && value4 == false) {
      return true;
    } else {
      return false;
    }
    

  }

  return false;

});
/* da vidm ce loh object parsam */
hbs.registerHelper('json', function(context) {
  return JSON.stringify(context);
});


// stolpci product backlog

hbs.registerHelper('columnFirst', function(value1, value2, value3) {
  //value 1 - finished oz unfinished
  //value 2 - pripada sprintu?
  if (value3 == "Won't have this time") {
    return false;
  }

  if (value1 == false) {
    return true;
  }
  
  return false;
  
});

hbs.registerHelper('columnSecond', function(value1, value2) {
  //value 1 - finished oz unfinished
  //value 2 - pripada sprintu?

  if (value1 == true) {
    return true;
  }
  return false;
  
});

hbs.registerHelper('columnThird', function(value1, value2, value3) {
  //value 1 - finished oz unfinished
  //value 2 - pripada sprintu?

  if (value3 == "Won't have this time") {
    return true;
  }
  return false;
  
});






hbs.registerHelper('missingData', function(value1, value2, value3) {
  if (value1 == true && value2 == true && value3 == true) {
    return false;
  }
  return true;

  
});



hbs.registerHelper('canAddComment', function(value1) {
  if (value1 == "user") {
    return true;
  } else {
    return false;
  }

  
});


hbs.registerHelper('formatRole', function(value1) {
  if (value1 == "Product Manager") {
    return "Product Owner";
  }

  
});



