
define(['backbone'],function(Backbone){
	return  Backbone.View.extend({
		className:'tpl_noDataError',
		template:_.template('<img class="errorPic" src="images/Bitmap@2x.png" width="40%"></span><span class="txt">安少未发现优惠！</span><a class="link_youhui" href="patoa://pingan.com/react?name=AppCreditCoupon&hideBar=1">去信用卡优惠看看~</a>'),
		events:{
			"click .link_youhui":"link",
			'click':"test"
		},
		initialize:function(data){
			this.render();
		},
		render:function(){
			this.$el.html(this.template());
			return this;
		}
	});
});