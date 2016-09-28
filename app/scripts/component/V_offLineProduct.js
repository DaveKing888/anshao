define([
  'backbone',
  'text!tpl/tpl_offLineProduct.html'
], function(Backbone,tpl) {
  return Backbone.View.extend({
    tagName:'li',
    events: {

    },
    template: _.template(tpl),
    initialize: function(){
      /*监听事件*/
      this.listenTo(this.model, 'change', this.render);
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
   
  });
});