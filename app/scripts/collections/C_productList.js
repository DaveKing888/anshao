define(['backbone','models/M_productItem'], function(Backbone,model){
  var C_productList = Backbone.Collection.extend({
  	model:model,
  	total:'0',
  	offset:''
  });

  return C_productList;
});