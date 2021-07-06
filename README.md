### SparAPI

**Info**  
Uses the 2019.1 version of the Spar API. SPAR (Statens person­adress­register) is a service used to fetch information about all registered citizens in Sweden.


**Prerequisites**  
A working node.js installation, for example latest LTS (14.17.0 as of today)

**Install Deps**  
```bash
$ npm i
```

**Run Tests**  
```bash
$ npm run test
```

**Add Credentials**  
Add valid tls key and cert, add credentials to .env file. To generate the certificates read up on [SPARs homepage](https://www.statenspersonadressregister.se/master/start/teknisk-info/kundtestmiljo/)

**Start Application**  
```bash
$ npm run start
```

**Interact with the API**  
Test all the supported formats:  

```bash
$ curl localhost:8000/personsok?sid=197911072390
$ curl localhost:8000/personsok?sid=7911072390
$ curl localhost:8000/personsok?sid=791107-2390
```
