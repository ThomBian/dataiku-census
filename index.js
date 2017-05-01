var express = require('express');
var DAO = require('./modules/dao/dao.js');
var path    = require("path");
var app = express();
app.use(express.static(path.join(__dirname, '/public/views')));
app.use('/js', express.static(path.join(__dirname, './public/js')));
app.use('/js', express.static(path.join(__dirname, './node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, './node_modules/jquery/dist')));
app.use('/js', express.static(path.join(__dirname, './node_modules/angular')));
app.use('/css', express.static(path.join(__dirname, './public/css')));
app.use('/css', express.static(path.join(__dirname, './node_modules/bootstrap/dist/css')));

app.set('port', 5000);

app.get('/', function(req, res){
  res.sendFile("index.html");
});

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

app.listen(app.get('port'), function(){
  DAO.loadDB('dbs/us-census.db').then(()=>{console.log("database is loaded");});
  console.log('Server listening on port ' + app.get('port') + "!");
});
