function ValuesTableController($scope){
  var self = this;

  //values available in this database
  self.values = [];

  //informations div
  self.divOuts = $("#outsInformations")[0];

  //occurs when the value selected changes
  self.change = function(values, valuesOut, rowsOut) {
    $("#loader").addClass("hidden");
    self.displayInfos();
    self.setOutsInformation(valuesOut, rowsOut);
    self.values = values;
  }

  //set the information if necessary
  self.setOutsInformation = function (valuesOut, rowsOut){
    if (valuesOut > 0) {
      var str = self.formatInfosString(valuesOut, "values")
      + "<br>" + self.formatInfosString(rowsOut, "rows");
      var outsClass = valuesOut == 0 ? "alert alert-success" : "alert alert-warning";
      $(self.divOuts).addClass(outsClass);
      self.divOuts.innerHTML = str;
    } else {
      $("#outsInformations").addClass("hidden");
    }
  }

  self.displayErr = function (error){
    var str = error.data.error;
    $(self.divOuts).addClass("alert alert-danger");
    self.divOuts.innerHTML = str;
    $("#outsInformations").removeClass("hidden");
  }

  self.formatInfosString = function (outs , dataType) {
    return "<strong>" + outs + "</strong> " + dataType +" have not been displayed";
  }

  self.displayInfos = function() {
    $("#values").removeClass("hidden");
    $("#outsInformations").removeClass("hidden");
  }

  self.hideInfos = function() {
    $("#values").addClass("hidden");
    $("#outsInformations").addClass("hidden");
  }

  //occurs when a database has been chosen
  self.display = function(dbName) {
    self.dbName = dbName;
    $scope.$broadcast("dbChange");
    $("#valuesContainer").removeClass();
  }

  //hide and reset
  self.hide = function () {
    self.values = [];
    self.hideInfos();
    $("#valuesContainer").addClass("hidden");
  }
}

angular.module('valuesTable')
.component('valuesTable', {
  templateUrl: "../js/values-table/values-table.template.html",
  controller: ValuesTableController
});
