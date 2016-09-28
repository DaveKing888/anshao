define([
  'backbone',
  'text!tpl/tpl_banner.html'
], function(Backbone,tpl) {
  var V_selectCard = Backbone.View.extend({
    className: 'tpl_banner',
    events: {
    },
    template: _.template(tpl),
    initialize: function(){
      /*监听事件*/
      this.listenTo(this.model, 'change', this.render);
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.slide()
      return this;
    },
    slide:function () {
      var mySwiper = new Swiper('.tpl_banner .swiper-container',{
        pagination: '.pagination',
        paginationClickable: true
        
      })
    }

   
  });

  return V_selectCard;
});