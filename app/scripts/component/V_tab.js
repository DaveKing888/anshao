define([
  'backbone'
], function(Backbone) {
  return Backbone.View.extend({
    className: 'tpl_tab',
    tagName:'ul',
    events: {

    },
    template: _.template('<li class="<%= active=="1"? "active":""%> tab1" data-point=<%= JSON.stringify(point[0]) %> data-index="1"><%= tab1 %></li><li class="<%= active=="2"? "active":"" %> tab2" data-point=<%= JSON.stringify(point[1]) %> data-index="2"><%= tab2 %></li>'),
    initialize: function(data){
      /*监听事件*/
      this.data  = $.extend(data,{}); 
      this.listenTo(this,'active',this.render);
    },
    render: function() {
      this.$el.html(this.template(this.data));
      return this;
    },
    select:function(index) {
      if(this.data.active != index){
        this.data.active = index;
        this.trigger('active');
      }
    }

   
  });
});