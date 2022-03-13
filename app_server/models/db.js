const mongoose = require("mongoose");

const dbURI = "mongodb://localhost/mongodb-community";
mongoose.connect(dbURI);

mongoose.connection.on("connected", () => {
    console.log(`Mongoose je povezan na ${dbURI}.`);
  });
  
  mongoose.connection.on("error", (napaka) => {
    console.log("Mongoose napaka pri povezavi: ", napaka);
  });
  
  mongoose.connection.on("disconnected", () => {
    console.log("Mongoose ni povezan.");
  });


  const pravilnaUstavitev = (sporocilo, povratniKlic) => {
    mongoose.connection.close(() => {
      console.log(`Mongoose je zaprl povezavo preko '${sporocilo}'.`);
      povratniKlic();
    });
  };
  
  // Ponovni zagon nodemon
  process.once("SIGUSR2", () => {
    pravilnaUstavitev("nodemon ponovni zagon", () => {
      process.kill(process.pid, "SIGUSR2");
    });
  });
  
  // Izhod iz aplikacije
  process.on("SIGINT", () => {
    pravilnaUstavitev("izhod iz aplikacije", () => {
      process.exit(0);
    });
  });

//   reference na sheme

require("./user");
