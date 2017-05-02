var DatabaseListController = function ($http) {
  var self = this;

  self.databases = [];

  $http.get("http://localhost:5000/api/databases").then(function(response){
    self.databases = response.data;
  });

  self.setDatabase = function () {
    var dbName = self.selectedDB;
    self.onSelected();
    $http.get('http://localhost:5000/api/database/'+dbName).then(function(response){
      if (response.data.loaded){
        self.onLoaded({dbName: response.data.dbName});
      }
    });
  }
}

angular.module('databaseList')
.component('databaseList', {
  templateUrl: "../js/database-list/database-list.template.html",
  controller: DatabaseListController,
  bindings: {
    onLoaded: "&",
    onSelected : "&"
  }
});
