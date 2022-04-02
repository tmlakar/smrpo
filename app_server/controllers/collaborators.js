var apiParametri = {
    streznik: "http://localhost:" + (process.env.PORT || 3000),
  };
  if (process.env.NODE_ENV === "production") {

  }
  const axios = require("axios").create({
    baseURL: apiParametri.streznik,
    timeout: 5000,
  });

  /* seznam userjev */
  var availableCollaboratorsList = (req, res) => {

    var tokenParts = req.cookies.authcookie['žeton'].split('.');
    var encodedPayload = tokenParts[1];
    //var rawPayload = window.atob(encodedPayload);
    var rawPayload = Buffer.from(encodedPayload, 'base64').toString('ascii');
    var user = JSON.parse(rawPayload);
  
    axios
        .get (apiParametri.streznik + '/api/users', {})
        .then((odgovor) => {
            prikaziStran(req, res, odgovor.data)
          })
  };


/* Add project collaborators */

/* GET metoda (prikaz) - Dodajanje uporabnikov na projekt in določitev projektnih vlog
  s strani admina na /projects/unikaten_id_projekta/add-collaborators */
  // prikazovanje vseh userjev z role user iz sistema, med katerimi lahko admin izbere
//   const addCollaboratorsDisplay = (req, res) => {
//     var tokenParts = req.cookies.authcookie['žeton'].split('.');
//     var encodedPayload = tokenParts[1];
//     //var rawPayload = window.atob(encodedPayload);
//     var rawPayload = Buffer.from(encodedPayload, 'base64').toString('ascii');
//     var user = JSON.parse(rawPayload);
//       var projectId = req.params.id;
//       var napaka = req.query.error;
//       var jeNapaka = false;
//       if(napaka == "napaka"){
//         jeNapaka = true;
//       }
  
//       var users;
  
  
//       axios
//           .get (apiParametri.streznik + '/api/projects/' + projectId)
//           .then((odgovor) => {
//               res.render('project-add-collaborators',
//               { name: odgovor.data.name,
//                 info: odgovor.data.info,
//                 collaborators: odgovor.data.users,
//                 id: odgovor.data._id,
//                 napaka: jeNapaka,
//                 users: users
//               });
//           });
  
//   }
  
//   /* PUT metoda - Dodajanje uporabnikov na projekt in določitev projektnih vlog
//   s strani admina na /projects/unikaten_id_projekta/add-collaborators */
  
//   /* Edit project collaborators */
  
//   /* GET metoda (prikaz) - Urejanje uporabnikov oziroma njihovih projektnih vlog
//     s strani admina na /projects/unikaten_id_projekta/edit-collaborator-roles */
//     const editCollaboratorsDisplay = (req, res) => {
//       var tokenParts = req.cookies.authcookie['žeton'].split('.');
//       var encodedPayload = tokenParts[1];
//       //var rawPayload = window.atob(encodedPayload);
//       var rawPayload = Buffer.from(encodedPayload, 'base64').toString('ascii');
//       var user = JSON.parse(rawPayload);
//         var projectId = req.params.id;
//         var napaka = req.query.error;
//         var jeNapaka = false;
//         if(napaka == "napaka"){
//           jeNapaka = true;
//         }
//         axios
//             .get (apiParametri.streznik + '/api/projects/' + projectId)
//             .then((odgovor) => {
//                 res.render('project-edit-collaborator-roles',
//                 { name: odgovor.data.name,
//                   info: odgovor.data.info,
//                   collaborators: odgovor.data.users,
//                   id: odgovor.data._id,
//                   napaka: jeNapaka
//                 });
//             });
  
//     }
  
//     /* PUT metoda  - Urejanje uporabnikov oziroma njihovih projektnih vlog
//     s strani admina na /projects/unikaten_id_projekta/edit-collaborator-roles */
  
//   /* Delete project collaborators */
  
//   /* GET metoda (prikaz) - Brisanje uporabnikov s projekta
//     s strani admina na /projects/unikaten_id_projekta/delete-collaborators */
//     const deleteCollaboratorsDisplay = (req, res) => {
//       var tokenParts = req.cookies.authcookie['žeton'].split('.');
//       var encodedPayload = tokenParts[1];
//       //var rawPayload = window.atob(encodedPayload);
//       var rawPayload = Buffer.from(encodedPayload, 'base64').toString('ascii');
//       var user = JSON.parse(rawPayload);
//         var projectId = req.params.id;
//         var napaka = req.query.error;
//         var jeNapaka = false;
//         if(napaka == "napaka"){
//           jeNapaka = true;
//         }
//         axios
//             .get (apiParametri.streznik + '/api/projects/' + projectId)
//             .then((odgovor) => {
//                 res.render('project-delete-collaborators',
//                 { name: odgovor.data.name,
//                   info: odgovor.data.info,
//                   collaborators: odgovor.data.users,
//                   id: odgovor.data._id,
//                   napaka: jeNapaka
//                 });
//             });
  
//     }
  
    /* PUT metoda  - Brisanje uporabnikov s projekta
    s strani admina na /projects/unikaten_id_projekta/delete-collaborators */
  
    module.exports = {
      availableCollaboratorsList
        
    };
    