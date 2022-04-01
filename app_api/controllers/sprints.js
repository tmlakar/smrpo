// const mongoose = require("mongoose");
// const Sprint = mongoose.model("Sprint");
//
// /* Creating new sprint */
//
// const sprintCreate = (req, res) => {
//     Sprint.create({
//
//       name: req.body.name,
//       info: req.body.info
//
//   }, (napaka, sprint) => {
//       if(napaka) {
//           res.status(400).json(napaka);
//       }  else {
//           res.status(201).json(sprint);
//       }
//     });
// };
//
// module.exports = {
//     sprintCreate
// };
