function ValuesTableController(){
  var self = this;
  self.values = [];
  self.column = "";
  self.change = function(values, column) {
    self.values = values;
  }
}

angular.module('valuesTable')
.component('valuesTable', {
  templateUrl: "../js/values-table/values-table.template.html",
  controller: ValuesTableController
});
