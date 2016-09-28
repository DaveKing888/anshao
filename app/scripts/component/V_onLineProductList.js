define([
  'backbone',
  'component/V_onLineProduct'
  ], function(Backbone,ItemView){
    return Backbone.View.extend({
    className:'tpl_List',
    tagName:'ul',
  	initialize:function(){
        this.listenTo(this.collection,'reset',this.render)
        this.listenTo(this.collection,'add',this.renderOne)
  	},
    render: function () {
      this.renderAll();

      return this;
    },
    renderOne:function(model){
      var view = new ItemView({model:model});
      this.$el.append(view.render().el)
      return view    
    },
    renderAll:function(){
        var _this =this;
        this.$el.html("");
        this.collection.each(function(m) {
          var view = _this.renderOne(m);

        });   
      return this;
    }

  });
});