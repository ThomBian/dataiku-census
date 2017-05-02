function ColumnListController($scope, $http){
  var self = this;
  self.columns = [];

  $scope.$on("dbChange", function() {
    self.columns = [];
    self.columnsSelect = "";
    $http.get('http://localhost:5000/api/columns').then(function(response){
      self.columns = response.data;
    });
  });

  self.getValues = function() {
    var columnChosen = self.columnsSelect;
    self.onSelectRequest();
    $("#loader").removeClass("hidden");
    $http.get('http://localhost:5000/api/column/'+columnChosen).then(function(response){
      self.onChange({
        values : response.data.data,
        valuesOut: response.data.valuesOut,
        rowsOut: response.data.rowsOut
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
    onSelectRequest: '&'
  }
});
