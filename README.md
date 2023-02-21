
## SCRUMLY

Scrumly aplikacija nastaja v sklopu magisterskega programa na Fakulteti za računalništvo in informatiko pri predmetu Sodobne
metode razvoja programske opreme. Je ogrodje v pomoč razvoju programske opreme po metodi Scrum.


## Navodila za lokalni zagon aplikacije:

```bash
$ git clone https://github.com/tmlakar/smrpo
$ npm install
$ sudo npm install -g nodemon
```

Ustvarite .env datoteko v korenski mapi in vanjo shrani "JWT_GESLO=toleNašeGeslo".

```bash
$ nodemon
```

Za uvoz lokalnih podatkov podatkovne baze dodajte se naslednja ukaza v nov terminal:

```bash
$ mongoimport app_server/models/user.json -d mongodb-community --jsonArray -c Users
$ mongoimport app_server/models/project.json -d mongodb-community --jsonArray -c Projects
```

Aplikacija se odpira v brskalniku na naslovu http://localhost:3000/.

Pred vstopom dodajte novega uporabnika z vpisanjem naslednjega ukaza v terminal:

```bash
curl -X POST \
       "http://localhost:3000/api/registracija" \
       -H "Content-Type: application/x-www-form-urlencoded" \
       -d "name=Aleksej&surname=Zitnik&username=aleksej&email=aleksej@krompir.si&password=zatvojvsakdan.&role=admin"
```
V tem primeru so podatki za prijavo z adminom sledeci:
- username: aleksej
- pass: zatvojvsakdan.


