var fileUtils = require('../utils/fileUtils.js');
var sqlite3 = require('sqlite3').verbose();

var daoModule = module.exports;

//database object
var DBObject = null;

/*QUERIES*/
var allColumnsName = "PRAGMA table_info(census_learn_sql)";

/* constants */
var ageAlias = "age";
var countAlias = "count";
var maxValuesDisplayed = 100;


/*
* promise to load a sqlite3 file
* @param fileNamePath : the file path,
* reject on : file does not exists, SQLite error
* resolve : the DBObject
* return type : DBObject (resolve), error (reject)
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

/*
* Promise to get all column's names
* reject on : no databse, SQLite error
* resolve : array of string containing all columns names
* return type : JSON (resolve), string (reject)
*/
daoModule.getAllColumnsName = function() {
  return new Promise((resolve, reject) => {
    if (DBObject == null){
      reject("No Database found, make sure to call load before...");
    } else {
      DBObject.all(allColumnsName, function(err, rows){
        if (err){
          reject(err.toString());
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

/*
* Promise that get values for a dedicated column
* @param columnName: the columnName
* reject on : No Database found, SQLite err
* resolve : array of object {data : [formated rows], valuesOut : numberOfValuesClippedOut, rowsOut : numberOfRowsOut}
* return type : JSON (resolve), string (reject)
*/
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
          reject(err.toString());
        } else {
          var counter = rows.length <= maxValuesDisplayed ? rows.length : maxValuesDisplayed;
          var rowsJSON = getValues(rows, counter, columnName);
          var nbValuesClippedOut = counter == maxValuesDisplayed ? rows.length - maxValuesDisplayed : 0;
          var nbRowsClippedOut = daoModule.getNbRowsOut(rows, counter);
          var returnObject = {
            data: rowsJSON,
            valuesOut: nbValuesClippedOut,
            rowsOut: nbRowsClippedOut
          }
          resolve(JSON.stringify(returnObject));
        }
      });
    }
  });
}

daoModule.getNbRowsOut = function(rows, counter){
  if (counter == rows.length){
    return 0;
  } else {
    return rows.splice(counter, rows.length).reduce(function(all, value){
      var nbRows = value["count"];
      return all + nbRows;
    }, 0);
  }
}

/*
* function get rows
* @param rows : raw rows from DB
* @param counter : number of rows to retrieve
* @param columnName : the columnName
* return array of {columnName : value, age : average, count : nbOfRows}
*/
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

/*
* close a the current database
*/
function closeDB () {
  if (DBObject != null){
    DBObject.close();
    DBObject = null;
  } else {
    console.error("Operation not permitted, trying to close a null database object");
  }
}
