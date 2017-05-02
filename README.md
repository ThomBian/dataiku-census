# dataiku-census

This repository holds the exercice given by dataiku.
This exercice is described [here](http://dev.dataiku.com/~cstenac/dev-recruiting/README).

## Technologies :
- nodeJS (backend)
- sqlite (database)
- angular/boostrap (frontend)
- mocha/chai (backend tests)

## Try it :
- You need an internet connection to install dependencies
- Download and install NodeJS, it includes npm [dowload page](https://nodejs.org/en/).
- Clone the repository
- When downloaded, cd "theClonedRepository" in your shell
- Type in "mkdir dbs", you should add the SQLite database files you want to test in the folder "dbs"
- Type "npm install" and wait for the end of the process
- Type "node index.js", it should write the connection port for the server
- [Link to the website](http://localhost:5000)
- If everything have worked so far and you do have some databases files in the "dbs" folder, you should see the database files name in the selected list. Choose one.
- It should display another select list with all the columns of the table. Choose one.
- After loading it displays the values and some extra informations if applicable.

## Server tests :
- make sure to add us-census.db in the dbs directory. Tests need this database file to run.
- some server tests have been written under the /test/test-server.js
- At the root of the project, type "npm test" to launch them.

Thank you for your consideration and attention.
