define([
        'backbone'
    ],
    function(Backbone) {
        var Router = Backbone.Router.extend({
            el:'#container',
            routes: {
                'tuiwuzhe': 'tuiwuzhe',
                'yuepiao': 'yuepiao',
                'zhidemai': 'zhidemai',
                'chihuo':'chihuo'
            },
            urlParm: '',
            curentPage: '',
            initialize: function() {

                AppW.focusBanks="";//关注银行
                AppW.clientNo = "";
                /*
                    提供native的方法
                    @reloadPage
                    @param 
                */
                window.reloadPage = function () {
                    location.reload();
                }
                Backbone.setMapPng = function(str){
                    var map_png = {
                        "特价":"images/te@3.png",
                        "优惠":"images/quan@3.png",
                        "折扣":"images/zhe@3.png",
                        "免费":"images/mian@3.png",
                        "特惠":"images/hui@3.png",
                        "返现":"images/fan@3.png",
                        "礼券":"images/quan@3.png",
                        "免单":"images/mian@3.png"
                    }
                    return map_png[str];     
                }
                Backbone.gp_ajax = function(interName,reqData,options){
                    var body = {
                        'operationType':interName,
                        'requestData':JSON.stringify(reqData)
                    }
                    window.Router.showLoading();
                    $.ajax({
                        url: options.url ? options.url :"",
                        type:(function(){return location.href.indexOf("0.0.0.0")>-1? "GET":'POST'})(),
                        dataType: 'json',
                        data: body? body:"",
                        success:function(data){
                            window.Router.hideLoading();
                            options.success(data);
                        },
                        error:function(jqXHR, textStatus, errorThrown){
                            window.Router.hideLoading();
                            options.error(jqXHR, textStatus, errorThrown);
                        },
                        complete:function(){
                            options.complete&&options.complete();
                            window.Router.hideLoading();
                        }
                    });
                };

                this.login();
                setInterval(function(){
                    this.login();
                }.bind(this),600000);

                 /*埋点-事件埋点*/
                $(document).on('click', '[data-point]', function(event) {
                    var data = $(this).data('point');
                    YztApp.ubt(data.eventid || '', data.label || '', data.param || {});
                });
                

            },
            // 不是五折我不推
            tuiwuzhe: function() {
                this.setNavTitle({title:"五折天"})
                YztApp.ubt('安少头条', '五折天',{});
                require(["views/tuiwuzhe"],function(V_tuiwuzhe) {
                   
                    if(this.page){this.page.remove()}
                    this.page  = new V_tuiwuzhe();
                }.bind(this))
                 
                

            },
            // 一起约“piao”吧
            yuepiao:function() {
                this.setNavTitle({title:"约影票"});
                YztApp.ubt('安少头条', '约影票',{});
                require(["views/yuepiao"],function(V_yuepiao) {
                    if(this.page){this.page.remove()}
                     this.page  = new V_yuepiao();
                }.bind(this));
            },
            // 什么值得买
            zhidemai:function () {
                this.setNavTitle({title:"值得买"});
                YztApp.ubt('安少头条', '值得买',{});
                require(["views/zhidemai"],function(V_zhidemai) {
                    
                    if(this.page){this.page.remove()}
                     this.page  = new V_zhidemai();
                }.bind(this))
               
          
            },
            // 一个称职的吃货
            chihuo:function() {
               this.setNavTitle({title:"吃货"});
               YztApp.ubt('安少头条', '吃货',{});
                require(["views/chihuo"],function(V_chihuo) {
                    if(this.page){this.page.remove()}
                     this.page  = new V_chihuo();
                }.bind(this))
            },//登录
            login: function(callback) {
                var _this = this;
                YztApp.getSSOTicket(function(flag, Ndata) {
                    if (typeof Ndata != 'object') {
                        Ndata = JSON.parse(Ndata)
                    }
                        reqData = [{
                            osType: '3'
                        }];
                    reqData.push(Ndata);
                    $.ajax({
                        url: interface.mamcLogin,
                        type: (function() {
                            return location.href.indexOf("0.0.0.0") > -1 ? "GET" : 'POST'
                        })(),
                        dataType: 'json',
                        data: {
                            'operationType': 'mamcLogin',
                            'requestData': JSON.stringify(reqData)
                        },
                        success: function(data) {
                            if (data.resultStatus == 1000) {
                                AppW.is_login = true;

                            } else {
                                _this.IS_LOGIN = false;
                            }
                        },
                        error: function(e) {
                            AppW.is_login = false;
                        },
                        complete:function(){
                            callback&&callback();
                        }

                    })
                });
            
                
            },
            /* 关闭webview  以下调用Native方法 */
            closeWebView: function() {
                App.call(['closeNativeWebview'],
                    function() {
                        console.log("调用成功")
                    },
                    function() {
                        console.log("调用失败")
                    }, {})
            },
            showLoading: function() {
               $('#tpl_loading').show();
            },
            hideLoading: function() {
               $('#tpl_loading').hide();
            },
            showError: function(msg) {
                App.call(["showErrorMsg"], null, null, msg || {})
            }, //隐藏native头部
            NativeHeaderToggle: function(flag) {
                App.call(['showNavigationBar'], null, null, {
                    'show': flag
                });
            },/*设置native头部
                @msg obj {title:"xxx"}
                */
            setNavTitle: function(msg) {
                App.call(["setNavTitle"], null, null, msg || {
                    title: ''
                })
            }, //给native参数
            transferToNative: function(msg) {
                App.call(["applyPACreditCard"], null, null, msg || {})
            },
            hideNativeCloseBtn: function() {
                App.call(['closeBtnControl'], null, null, {
                    status: true
                })
            },//获取关注银行
            getFocusBank:function(callback) {
                App.call(["getFollowBankCodes"], function(data){
                        if(typeof data !='object'){
                            data = JSON.parse(data);
                        }
                        AppW.focusBanks = data.toString();
                        callback&&callback(data);
                    },function(error){
                        
                },{});
            },//获取app定位地址
            getLocation:function(callback){
                App.call(["getCardDiscountLocation"],function(data){
                    if(typeof data !='object'){
                            data = JSON.parse(data);
                    }
                    callback&&callback(data)
                },
                function(error){
                    alert("经纬度取不到了");
                },{});
            },//获取的gp公共参数
            getGPParams:function(){
                this.GPCommon = null;
                YztApp.getGPParams(function(tips,data){
                    if(typeof data !='object'){
                        data = JSON.parse(data);
                    }
                    this.GPCommon = data;
                }.bind(this));
            },
            /**
             * 进入Native 页面
             * @param url
             * @param func
             * @param isClearPath， 是否清理中间的路径，使回退直接回退到H5
             */
            nativeOpenH5Url: function(url, func, isClearPath) {
                App.call(['openURL'], function (data) {
                    func && func(data ? SUCCESS : ERROR, data);
                }, function (error) {
                    func && func(ERROR, error);
                }, {url: url, isClearPath: isClearPath ? true : false});
            },
            /*调用Native方法结束*/
           /* h5toast提示
            @param msg type String
            */
            toast: function(msg) {
                var div = document.getElementById('toast');
                if (!div) {
                    div = document.createElement('div');
                    div.id = 'toast';
                    div.className = 'tpl_toast';
                    
                    document.body.appendChild(div);
                }
                div.innerHTML = msg;
                div.style.opacity = 1
                setTimeout(function() {
                    div.style.opacity = 0;
                }, 1500)
            }



        });
        return Router
    });