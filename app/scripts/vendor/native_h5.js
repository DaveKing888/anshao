/**
 * Native H5 交互JS。
 * @since 2016-5-23
 */

;(function(window,undefined){
    var App = window.App = {
        callbacks: {}
    },
        slice = Array.prototype.slice;
    /**
     * 常量定义
     */
    var ua = navigator.userAgent.toUpperCase();
    // 当前环境是否为Android平台
    App.IS_ANDROID = ua.indexOf('ANDROID') != -1;
    // 当前环境是否为IOS平台
    App.IS_IOS = ua.indexOf('IPHONE OS') != -1;
    // 当前环境是否为WP平台
    App.IS_WP = ua.indexOf('WINDOWS') != -1 && ua.indexOf('PHONE') != -1;

    App.callbacks.__leftAction__ = function() {
        var haveLeftAction = typeof App.callbacks.leftAction === 'function',
            args = slice.call(arguments);
        if(haveLeftAction) {
            setTimeout(function() {
                App.callbacks.leftAction.apply(App.callbacks, args);
            },0);
            if(App.IS_ANDROID) {
                App.call(['called']);
            } else if(App.IS_IOS) {
                return true;
            }
        }
    };


    //=======================Native 相关================================

    var callindex = 0, toString = Object.prototype.toString;
    /**
     * 调用一个Native方法
     * @param {String} name 方法名称
     */
    App.call = function(name) {
        // 获取传递给Native方法的参数
        var args = slice.call(arguments, 1);
        var successCallback = '' , errorCallback = '' , item = null ,returnArg;
        var methodName = name[name.length-1];

        if(App.IS_ANDROID){
            if(window.HostApp){
                var _str = '', newArguments = [];
                for(var i=0;i<args.length;i++){
                    if(typeof args[i] === 'function'){
                        var callbackName = methodName+'Callback'+callindex ;
                        window[callbackName] = args[i] ;
                        newArguments.push(callbackName);
                        callindex++ ;
                    }else if(typeof args[i] === 'object'){
                        newArguments.push( JSON.stringify( args[i] ) ) ;
                    }else{
                        newArguments.push(args[i]) ;
                    }
                }
                try{
                    HostApp[methodName].apply(window.HostApp,newArguments);
                }catch(e){
                    var params = slice.call(arguments, 0);
                    setTimeout(function(){
                        App['call'].apply(window.App,params);
                    },300);
                }
            }else{
                var params = slice.call(arguments, 0);
                setTimeout(function(){
                    App['call'].apply(window.App,params);
                },1000);
            }

        }else if(App.IS_IOS){
            var newArguments = '' , tempArgument = [];
            for(var i=0;i<args.length;i++ ){
//                tempArgument = args[i];
                if(typeof args[i] === 'function'){
                    var callbackName = methodName+'Callback'+callindex ;
                    window[callbackName] = args[i] ;
                    tempArgument.push(callbackName);
                    callindex++ ;
                }else{
                    args[i] && tempArgument.push(args[i]);
                }

            }
            //newArguments = '[' + Array.prototype.join.apply(tempArgument) + ']';
            callindex++;
            var iframe = document.createElement('iframe');
            console.log('tempArgument'+tempArgument);
            var _src = 'callnative://'+methodName+'/'+ (tempArgument && tempArgument.length ? encodeURIComponent(JSON.stringify(tempArgument)) + '/' + callindex : '');
            console.log(_src);
            console.log(encodeURIComponent(_src));
            iframe.src = _src;
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            iframe.parentNode.removeChild(iframe);
            iframe= null;
        }

    }

}(window));

(function(WIN, undefined) {
    var nativeCallback = {};
    var App = WIN.App;
    var isIOS = App.IS_IOS,
        isAndroid = App.IS_ANDROID;
    var SUCCESS = 'success', ERROR = 'error';
    var YztApp = function () {

    };


    YztApp.prototype = {
        /**
         * shareData
         * isShare
         * successFn
         * errorFn
         var shareData = {
            'title":"分享活动",
            "content":"分享内容",
            "href":"http://test-events.pingan.com.cn:41080/h5/yaoyiyao/index.html",
            "imgUrl":"http://test-events.pingan.com.cn:41080/h5/yaoyiyao/images/p.png",
            'successCallback':'shareSuccessCallback',
            'failCallback':'shareFailCallback'
        };
         */
        configureShare: function(shareData, isShare, successFn, errorFn) {
            var shareEnable = [{
                'feature':'share',
                'enable': isShare ? 'true' : 'false'
            }];
            shareData = shareData || {};
            shareData.successCallback = 'yztShareSuccessFn';
            shareData.failCallback = 'yztShareFailFn';

            /**
             * Native 获取分享数据
             * @returns {string}
             */
            nativeCallback.getShareData = function() {
                if(isIOS){
                    return JSON.stringify(shareData);
                }else if(isAndroid){
                    App.call(['onGetShareData'], JSON.stringify(shareData));
                }
            };

            /**
             * Native 获取是否可以分享
             * @returns {string}
             */
            nativeCallback.getMenuVariableActions = function () {
                if(isIOS){
                    return JSON.stringify(shareEnable);
                }else if(isAndroid){
                    App.call(['onGetMenuVariableActions'],JSON.stringify(shareEnable));
                }
            };


            nativeCallback[shareData.successCallback] = function (data) {
                successFn && successFn(data);
            };

            nativeCallback[shareData.failCallback] = function (data) {
                errorFn && errorFn(data);
            };
        },

        /**
         * 分享到 某一个平台
         * @param type
         */
        callShareToFunc: function(type) {
            App.call(['shareTo'], {shareType: type || '0'});
        },

        /**
         * 进入Native 页面
         * @param url
         */
        accessNativeModule: function(url, func) {
            App.call(['openURL'], function (data) {
                func && func(SUCCESS, data);
            }, function () {
                func && func(ERROR, error);
            }, {url: url});
        },

        /**
         * 获取用户登录态
         */
        getLoginStatus: function(callback) {
            App.call(['checkLoginStatus'], function(data) {
                callback && callback(SUCCESS, data);
            }, function(err) {
                //do nothing
                callback && callback(ERROR, err);
            }, {});
        },

        /**
         *  获取设备信息， 版本号， clientNo 等
         */
        getDeviceInfo: function(callback) {
            App.call(['sendMessage'],function(data){
                callback && callback(SUCCESS, data);
            },function(error){
                callback && callback(ERROR, error);
            },['getDeviceInfo']);
        },

        /**
         * 获取请求GP的公共参数
         */
        getGPParams: function (callback) {
            App.call(['getPublicParameters'], function(data){
                callback && callback(SUCCESS, data);
            }, {});
        },

        /**
         * 设置title
         * @param title
         */
        setTitle: function (title) {
            App.call(['setNavTitle'], {title: title || ''});
        },
        /**
         * 获取登录态信息 （GP的登录接口需要） 
         */
        getSSOTicket: function(callback) {
           App.call(['sendMessage'], function(data) {
               callback && callback(SUCCESS, data);
           }, function(err) {
               callback && callback(ERROR, err);
           }, ['getSSOTicket']);
        },
        /**
         * 埋点
         * @param eventId
         * @param label
         * @param params
         */
        ubt: function (eventId, label, params) {
            App.call(['talkingData'], null, null, {
                eventId: eventId || '',
                label: label || '',
                params: params || {}
            });
        }
    };



    WIN.YztApp = new YztApp();

    WIN.nativeCallback = nativeCallback;
})(window);