function ValuesTableController(){
  var self = this;
  self.values = [];
  self.divOuts = $("#outsInformations")[0];

  self.change = function(values, outs) {
    $("#loader").addClass("hidden");
    $("#values").removeClass("hidden");
    self.setOutsInformation(outs);
    self.values = values;
  }

  self.setOutsInformation = function (outs){
    $("#outsInformations").removeClass("hidden");
    var str = outs == 0 ? "Every values have been displayed !" : "<strong>" + outs + "</strong> values have not been displayed";
    var outsClass = outs == 0 ? "alert alert-success" : "alert alert-warning";
    $(self.divOuts).removeClass();
    $(self.divOuts).addClass(outsClass);
    self.divOuts.innerHTML = str;
  }
}

angular.module('valuesTable')
.component('valuesTable', {
  templateUrl: "../js/values-table/values-table.template.html",
  controller: ValuesTableController
});
