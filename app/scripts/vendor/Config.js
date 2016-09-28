 /**
  * 常量定义
 */
 define([],function(){
 	window.AppW = {};
 	var ua = navigator.userAgent.toUpperCase();
	// 当前环境是否为Android平台
	AppW.IS_ANDROID = ua.indexOf('ANDROID') != -1;
	// 当前环境是否为IOS平台
	AppW.IS_IOS = ua.indexOf('IPHONE OS') != -1;
	// 当前环境是否为WP平台
	AppW.IS_WP = ua.indexOf('WINDOWS') != -1 && ua.indexOf('PHONE') != -1;
	// 是否为m站
	AppW.M = location.href.indexOf('m.pingan.com')!=-1;
	// 本地开发环境
	AppW.DEV = location.href.indexOf('127.0.0.1')!=-1 || location.href.indexOf('localhost')!=-1 || location.href.indexOf('file')!=-1|| location.href.indexOf('0.0.0.0')!=-1;
	// 预发环境
	AppW.PRE_B= location.href.indexOf('res-b')!=-1;
	// 生产环境
	AppW.PRE= location.href.indexOf('mgw')!=-1;
	// 测试环境
	AppW.TEST = location.href.indexOf('dmzstg')!=-1;

	AppW.is_login = false;
	// 商铺默认图片
	AppW.SHOPIMAGE = "images/shopICon@2.png";
	// banner的占位图片 1*1 
	AppW.BannerPlaceHolder = "images/placeholderPic.jpg" ;
	// 默认上海
	AppW.GPS = {
		"cityId":"310000",
		"lat": "31.2158",
		"lng": "121.4510"
	}
	// 线上和线下详情页跳转地址
	if(AppW.TEST||AppW.DEV){
		AppW.shopUrl="https://toa-gp-dmzstg1.pingan.com.cn:58443/res/h5/info/creditcard/activity_v2/pages/view.html#detail/isshop=1/";
		AppW.actUrl="https://toa-gp-dmzstg1.pingan.com.cn:58443/res/h5/info/creditcard/activity_v2/pages/view.html#detail/";
		
	}else{
		AppW.shopUrl="https://mgw.pingan.com.cn/res/h5/info/creditcard/activity_v2/pages/view.html#detail/isshop=1/";
		AppW.actUrl="https://mgw.pingan.com.cn/res/h5/info/creditcard/activity_v2/pages/view.html#detail/";
	}
	
	// 接口地址配置
	var url = "";
	if(location.href.indexOf('0.0.0.0')>-1||location.href.indexOf('127.0.0.1')>-1){
		url = '../data/';
		window.interface = {
			'anshaoBanner':url+'anshaoBanner.json', //安少Banner接口
			'fondOnlineActive' :url+ 'fondOnlineActive.json',// 猜你喜欢
			'anshaoFavorable':url+'anshaoFavorable.json',    //周边优惠
			'fivediScountOnline':url+'fivediScountOnline.json', //五折的猜你喜欢
			'fivediScountOffline':url+'fivediScountOffline.json',   //五折的小编精选  
			'mamcLogin':url+'mamcLogin.json'        //登录接口
		}
	}else{
		url = '/toa-mgw/rest/webgateway'; //生产
		if(location.href.indexOf('mgw')>-1&&location.href.indexOf('res-b')>-1){
			url = '/toa-mgw/rest/webgateway?reqflag=2'; //预发接口地址
		}
		window.interface = {
			'anshaoBanner':url,  //安少Banner接口
			'fondOnlineActive':url ,   // 猜你喜欢
			'anshaoFavorable':url,    //周边优惠
			'fivediScountOnline':url,    //五折的猜你喜欢
			'fivediScountOffline':url,    //五折的小编精选
			'mamcLogin':url             //登录接口  
		}
	}
 })

