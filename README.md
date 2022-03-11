# smrpo

SCRUMLY

Scrumly aplikacija nastaja v sklopu magisterskega programa na Fakulteti za računalništvo in informatiko pri predmetu Sodobne
metode razvoja programske opreme. 


Navodila za zagon aplikacije:

$ git clone https://github.com/tmlakar/smrpo

$ cd smrpo

$ npm install

$ sudo npm install -g nodemon

$ nodemon



Navodila za vzpostavitev podatkovne baze MongoDB:

$ mongosh      (priporoceno v novem terminalu)


+ uvoz zacetnih testnih podatkov:

$ npm run-script admini-uvoz

$ npm run-script uporabniki-uvoz


Aplikacijo odpiramo v brskalniku na naslovu http://localhost:3000/, podatke iz lokalne podatkovne baze pa http://localhost:3000/api/.