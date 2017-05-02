var DatabaseListController = function ($http) {
  var self = this;

  //databases found on server
  self.databases = [];

  //initialise
  $http.get("http://localhost:5000/api/databases").then(function(response){
    self.databases = response.data;
  });

  //set the database on selection
  self.setDatabase = function () {
    var dbName = self.selectedDB;
    self.onSelected();
    $http.get('http://localhost:5000/api/database/'+dbName).then(function(response){
      if (response.data.loaded){
        self.onLoaded({dbName: response.data.dbName});
      }
    }).catch(err => {
      self.onError({
        error : err
      });
    });
  }
}

angular.module('databaseList')
.component('databaseList', {
  templateUrl: "../js/database-list/database-list.template.html",
  controller: DatabaseListController,
  bindings: {
    onLoaded: "&",
    onSelected : "&",
    onError: "&"
  }
});
