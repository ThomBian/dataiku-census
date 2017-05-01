var express = require('express');
var DAO = require('./modules/dao/dao.js');



var app = express();
app.set('port', 5000);

app.get('/', function(req, res){
  DAO.getAllColumnsName()
  .then(data => {
    var dataArr = JSON.parse(data);
    DAO.getColumnInfos(dataArr[1])
    .then(data => {
      console.log(data);
    }).catch(err => console.error(err));
  }).catch(err => {
    console.error(err);
  });
});

app.listen(app.get('port'), function(){
  DAO.loadDB('dbs/us-census.db')
  .then(DBObject => {
    console.log(DBObject);
  }).catch(err => {
    console.error(err);
  });
  console.log('Server listening on port ' + app.get('port') + "!");
});
