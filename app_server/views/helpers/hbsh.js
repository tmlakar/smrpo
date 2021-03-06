const hbs = require("hbs");
const { type } = require("jquery");
const { bus } = require("nodemon/lib/utils");


hbs.registerHelper("jeDanasnjiDatum", function(value) {
  //value je neformatiran datum, moramo preveriti če je enak današnjemu, ne glede na ure in če je vrnemo true
  var now = new Date();
  if(now.toISOString().split("T")[0] == new Date(value).toISOString().split("T")[0]){
    return true;
  }
  else{
    return false;
  }
});

hbs.registerHelper("pridobiUre", function(value) {
    if (value == null) {
        return "00:00"
    }
    const sec = parseInt(value, 10); // convert value to number if it's string
    //console.log(sec)
    let hours = Math.floor(sec / 3600); // get hours
    let minutes = Math.floor((sec - (hours * 3600)) / 60);
    if (hours != 0) {
        if (hours < 10) { hours = "0" + hours; }
    }
    if (minutes < 10) { minutes = "0" + minutes; }
    return hours + ':' + minutes;
});

hbs.registerHelper("jeActive", function(value) {
    if (value == true) {
        return true;
    } else {
        return false;
    }
});

hbs.registerHelper("formatirajSekunde", function(value) {
    const sec = parseInt(value, 10); // convert value to number if it's string
    let hours = Math.floor(sec / 3600); // get hours
    let minutes = Math.floor((sec - (hours * 3600)) / 60); // get minutes
    let seconds = sec - (hours * 3600) - (minutes * 60); //  get seconds
    // add 0 if value < 10; Example: 2 => 02
    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return hours + ':' + minutes + ':' + seconds; // Return is HH : MM : SS
});

hbs.registerHelper("inc", function(value, options) {
    return parseInt(value) + 1;
});

hbs.registerHelper('isDeleted1', function(value) {
    if (value === "false") {
        return true;
    }
    return false;
});

/* logged in user cannot delete themselves */
hbs.registerHelper('isTheSame', function(value, value2) {
    if (value !== value2) {
        return true;
    }
    return false;
});

hbs.registerHelper('isTheSameAsLoggedIn', function(value, value2) {
    if (value == value2) {
        return true;
    }
    return false;
});

/* showing project collaborators as circles with different colors, depending on project_role */

hbs.registerHelper('isTeamMember', function(value) {
    if (value == "Team Member") {
        return true;
    }
    return false;
});

hbs.registerHelper('isScrumMaster', function(value) {
    if (value == "Scrum Master") {
        return true;
    }
    return false;
});

hbs.registerHelper('isProductManager', function(value) {
    if (value == "Product Manager") {
        return true;
    }
    return false;
});

hbs.registerHelper('firstLetterOfUsername', function(value) {
    if (value == null) {
        value = "nul";
    }
    let letter = value.charAt(0);
    letter = letter.toUpperCase();
    return letter;
});

/* if available collaborator is user, not admin */
hbs.registerHelper('isUser', function(value) {
    if (value == "user") {
        return true;
    }
    return false;
});

/* formatiranje datuma */

hbs.registerHelper('formatirajDatum', function(value) {
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

    var hour = d.getUTCHours() + 2;
    if (hour < 10) {
        hour = "0" + hour;
    }
    var minute = d.getUTCMinutes();
    if (minute < 10) {
        minute = "0" + minute;
    }

    var datum = day + '.' + month + '.' + year;
    return datum;
});


hbs.registerHelper('formatirajInfo', function(value) {
    var l = value.length;
    var trimmedString = value.substring(0, 49);
    if (l >= 50) {
        var dots = " ...";
        var trimmedString = trimmedString.concat(dots);
    }

    return trimmedString;

});



hbs.registerHelper('formatirajZapisAcceptanceTestov', function(value) {
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
hbs.registerHelper('karticeNemoresUrejat', function(value1, value2, value3, value4) {
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

hbs.registerHelper('karticaSeLahkoUreja', function(value1, value2, value3, value4) {
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

hbs.registerHelper('isnotPO', function(value1, value2, value3) {
    if ((value1 == true || value2 == true) && value3 == false) {
        return true;
    } else {
        return false;
    }

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
    } else {
        return value1;
    }


});

hbs.registerHelper('isInCurrentSprint', function(value1, value2) {
    if (value1 == value2 && value1 != 0) {
        return "Current sprint";
    } else {
        return "Unassigned";
    }


});

hbs.registerHelper('InCurrentSprint', function(value1, value2) {
    value1 = value1.toString();
    value2 = value2.toString();
    if (value1 == value2) {
        return true;
    } else {
        return false;
    }


});

hbs.registerHelper('InSprint', function(value1, value2) {
    console.log(typeof value1);
    if (value1 == '') {
        return false;
    }
    value1 = value1.replace(/"/g, '');
    value1 = value1.replace(/'/g, '');
    value1 = value1.replace(/]/g, '');
    value1 = value1.replace(/\[/g, '');

    value1 = value1.split(",");

    //console.log(value1);
    for (var i = 0; i < value1.length; i++) {
        var value = value1[i].toString();
        var value3 = value2.toString();

        if (value == value3) {
            console.log(value, value3);
            return true;
        }

    }

    return false;


});

//formatiraj seznama nalog
hbs.registerHelper('taskIndex', function(value1) {
    var index = value1;
    index = index + 1;

    return index;

});


//zbriši napis na kartici
hbs.registerHelper('taskNone', function(value1) {
    var subtask = value1;
    if (subtask.length != 0) {
        return true;
    }
    return false;

});


//inProgress - beleženje časa
hbs.registerHelper('taskInProgress', function(value1, value2) {

    //console.log(value2)
    const sec = parseInt(value1, 10);
    //console.log(sec)
    if (value2 == true) {
        return false
    }
    if (value1 == 0 || value1 == NaN || value1 == null || value1 == '') {
        return false
    }
    return true
});
