//modules
var express   = require('express');
var DAO       = require('./modules/dao/dao.js');
var FileUtils = require('./modules/utils/fileUtils.js');
var path      = require("path");

//express configuration
var app = express();
app.use(express.static(path.join(__dirname, '/public/views')));
app.use('/js', express.static(path.join(__dirname, './public/js')));
app.use('/js', express.static(path.join(__dirname, './node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, './node_modules/jquery/dist')));
app.use('/js', express.static(path.join(__dirname, './node_modules/angular')));
app.use('/css', express.static(path.join(__dirname, './public/css')));
app.use('/css', express.static(path.join(__dirname, './node_modules/bootstrap/dist/css')));
app.use('/img', express.static(path.join(__dirname, './public/img/')));
app.set('port', 5000);
app.set('dbPath', "dbs");
/* routing */

//home
app.get('/', function(req, res){
  res.sendFile("index.html");
});

//get column infos
app.get('/api/column/:columnName', function(req, res){
  var value = req.params["columnName"];
  DAO.getColumnInfos(value).then(data => {
    res.writeHead(200, {'Content-Type':'application/json'});
    res.end(data);
  }).catch(err => {
    res.writeHead(500, {'Content-Type':'application/json'});
    var errObj = {"error" : err};
    res.end(JSON.stringify(errObj));
  });
});

//get all columns
app.get('/api/columns', function(req, res){
  DAO.getAllColumnsName().then(data => {
    res.writeHead(200, {'Content-Type':'application/json'});
    res.end(data);
  }).catch(err => {
    res.writeHead(500, {'Content-Type':'application/json'});
    var errObj = {"error" : err};
    res.end(JSON.stringify(errObj));
  });
});

app.get('/api/databases', function(req, res){
  FileUtils.getVisiblesFilesInFolder(app.get("dbPath"))
  .then(data => {
    res.writeHead(200, {'Content-Type':'application/json'});
    res.end(JSON.stringify(data));
  }).catch(err => {
    res.writeHead(500, {'Content-Type':'application/json'});
    var errObj = {"error" : err};
    res.end(JSON.stringify(errObj));
  });
});

app.get('/api/database/:databaseName', function(req, res){
  var dbName = req.params["databaseName"];
  var dbPath = path.join(app.get("dbPath"), dbName);
  DAO.loadDB(dbPath)
  .then(()=>{
    console.log(dbName + " is loaded");
    res.writeHead(200, {'Content-Type':'application/json'});
    var obj = {
      "dbName" : dbName,
      "loaded": true
    };
    res.end(JSON.stringify(obj));
  })
  .catch(err=>{
    console.error(err);
    var obj = {
      "error": err
    };
    res.writeHead(500, {'Content-Type':'application/json'});
    res.end(JSON.stringify(obj));
  });
});

/* end routing */


//starting server with a default database
app.listen(app.get('port'), function(){
  console.log('Server listening on port ' + app.get('port') + "!");
});
