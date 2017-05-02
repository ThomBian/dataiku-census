function ColumnListController($scope, $http){
  var self = this;

  //all columns available for the database
  self.columns = [];

  //call when a database has been chosen
  $scope.$on("dbChange", function() {
    self.columns = [];
    self.columnsSelect = "";
    $http.get('http://localhost:5000/api/columns').then(function(response){
      self.columns = response.data;
    }).catch(err => {
      self.onError({
        error : err
      });
    });
  });

  //get all columns available, number of values, rows cropped
  self.getValues = function() {
    var columnChosen = self.columnsSelect;
    self.onSelectRequest();
    $("#loader").removeClass("hidden");
    $http.get('http://localhost:5000/api/column/'+columnChosen).then(function(response){
      if (response.status == 200) {
        self.onChange({
          values : response.data.data,
          valuesOut: response.data.valuesOut,
          rowsOut: response.data.rowsOut
        });
      }
    }).catch(err => {
      $("#loader").addClass("hidden");
      self.onError({
        error : err
      });
    });
  }
}

angular.module('columnList')
.component('columnList', {
  templateUrl: "../js/column-list/column-list.template.html",
  controller: ColumnListController,
  bindings: {
    onChange: '&',
    onSelectRequest: '&',
    onError: '&'
  }
});
