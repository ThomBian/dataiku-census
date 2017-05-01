var fileUtils = require('../utils/fileUtils.js');
var sqlite3 = require('sqlite3').verbose();

var daoModule = module.exports;

var DBObject = null;

/*QUERIES*/
var allColumnsName = "PRAGMA table_info(census_learn_sql)";


/*
* function that load a sqlite3 file
* @param fileNamePath : has to the path to the file,
* if the file path
*/
daoModule.loadDB = function(fileNamePath){
  return new Promise((resolve, reject) => {
    fileUtils.isFileExist(fileNamePath).then(() => {
      if(DBObject != null){
        closeDB();
      }
      DBObject = new sqlite3.Database(fileNamePath);
      resolve(DBObject);
    }).catch(err => {
      reject(err);
    });
  });
}

//get all column's names
daoModule.getAllColumnsName = function() {
  return new Promise((resolve, reject) => {
    if (DBObject == null){
      reject("No Databse found, make sure to call load before...");
    } else {
      DBObject.all(allColumnsName, function(err, rows){
        if (err){
          reject(err);
        } else {
          var names = [];
          rows.forEach(row => {
            names.push(row.name);
          });
          var toJSON = JSON.stringify(names);
          resolve(toJSON);
        }
      });
    }
  });
}

//get value for a dedicated field

//close database
function closeDB () {
  if (DBObject != null){
    DBObject.close();
    DBObject = null;
  } else {
    console.error("Operation not permitted, trying to close a null database object");
  }
}
