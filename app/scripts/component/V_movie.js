define([
  'backbone',
  'text!tpl/tpl_movie.html'
], function(Backbone,tpl) {
  var V_movie= Backbone.View.extend({
    className: 'tpl_movie',
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
    },
    slide:function () {
       var mySwiper = new Swiper('.tpl_movie .swiper-container',{
         pagination: '.pagination',
         paginationClickable: true,
         slidesPerView: 3,
         spaceBetween:10
      
      });
    }

   
  });

  return V_movie;
});