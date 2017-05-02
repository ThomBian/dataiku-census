function ValuesTableController(){
  var self = this;
  self.values = [];
  self.divOuts = $("#outsInformations")[0];

  self.change = function(values, valuesOut, rowsOut) {
    self.displayInfos();
    self.setOutsInformation(valuesOut, rowsOut);
    self.values = values;
  }

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

  self.formatInfosString = function (outs , dataType) {
    return "<strong>" + outs + "</strong> " + dataType +" have not been displayed";
  }

  self.displayInfos = function() {
    $("#loader").addClass("hidden");
    $("#values").removeClass("hidden");
    $("#outsInformations").removeClass("hidden");
  }

  self.hideInfos = function() {
    $("#loader").removeClass("hidden");
    $("#values").addClass("hidden");
    $("#outsInformations").addClass("hidden");
  }
}

angular.module('valuesTable')
.component('valuesTable', {
  templateUrl: "../js/values-table/values-table.template.html",
  controller: ValuesTableController
});
