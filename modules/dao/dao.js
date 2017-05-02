var fileUtils = require('../utils/fileUtils.js');
var sqlite3 = require('sqlite3').verbose();

var daoModule = module.exports;

var DBObject = null;

/*QUERIES*/
var allColumnsName = "PRAGMA table_info(census_learn_sql)";
var ageAlias = "age";
var countAlias = "count";
var maxValuesDisplayed = 100;
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
      reject("No Database found, make sure to call load before...");
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
daoModule.getColumnInfos = function(columnName){
  return new Promise((resolve, reject) => {
    if (DBObject == null) {
      reject("No Database found, make sure to call load before...");
    } else {
      var query = "SELECT \"" + columnName + "\", COUNT(*) as "+ countAlias +
      ", AVG(age) as " + ageAlias +
      " FROM census_learn_sql GROUP BY \"" + columnName +"\""+
      " ORDER BY COUNT(*) DESC";
      DBObject.all(query, function(err, rows){
        if (err){
          reject(err);
        } else {
          var counter = rows.length <= maxValuesDisplayed ? rows.length : maxValuesDisplayed;
          var clippedOutRowsNumber = counter == maxValuesDisplayed ? rows.length - maxValuesDisplayed : 0;
          var rowsJSON = getValues(rows, counter, columnName);
          var returnObject = {
            data: rowsJSON,
            outs: clippedOutRowsNumber
          }
          resolve(JSON.stringify(returnObject));
        }
      });
    }
  });
}

function getValues(rows, counter, columnName){
  var rowsJSON = [];
  var i = 0;
  var added = 0;
  while (i < rows.length && added < counter){
    var row = rows[i];
    if (row[columnName]){
      var rowObj = {
        columnValue: row[columnName],
        age: parseFloat(row["age"]).toFixed(2),
        count: row["count"]
      }
      rowsJSON.push(rowObj);
      added++;
    }
    i++;
  }
  return rowsJSON;
}

//close database
function closeDB () {
  if (DBObject != null){
    DBObject.close();
    DBObject = null;
  } else {
    console.error("Operation not permitted, trying to close a null database object");
  }
}
