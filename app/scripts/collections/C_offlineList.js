define(['backbone','models/M_productItem'], function(Backbone,model){
  var C_productList = Backbone.Collection.extend({
  	model:model
  });

  return C_productList;
});