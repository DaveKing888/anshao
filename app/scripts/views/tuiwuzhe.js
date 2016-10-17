define([
    'backbone',
    'models/M_banner',
    'collections/C_productList',
    'component/V_banner',
    'component/V_tab',
    'component/V_offLineProductList',
    'component/V_onLineProductList',
    'component/V_errorPic',
    'text!tpl/tpl_tuiwuzhe.html'
], function(Backbone, M_banner, C_productList, V_banner, V_tab, V_offLineProductList, V_onLineProductList, V_errorPic,tpl) {
    var tuiwuzhe = Backbone.View.extend({
        className: 'mod_twz',
        events: {
            'click .tpl_tab': 'test',
            'click .tab1': 'tab1',
            'click .tab2': 'tab2'
        },
        template: _.template(tpl),
        initialize: function() {
            this.load = true;
            this.tab_index = "1";
            /*创建数据模型*/
            this.M_banner = new M_banner();
            this.C_onLineList = new C_productList();
            this.C_OffLineList = new C_productList();

            /*创建视图实例*/
            this.Banner = new V_banner({
                model: this.M_banner
            });
            var point = [{eventid:"五折天",label:"五折天首页_点击_周边半价",param:{}},{eventid:"五折天",label:"五折天首页_点击_小编优选",param:{}}]
            this.Tab = new V_tab({
                "tab1": "周边半折",
                'tab2': "小编精选",
                "active": '1',
                point:point
            });
            this.onLineList = new V_onLineProductList({
                collection: this.C_onLineList
            });
            this.offLineList = new V_offLineProductList({
                collection: this.C_OffLineList
            });
            this.errorView = new V_errorPic();
            /*监听*/

            /* 渲染*/
            this.render();
            /*获取数据*/
            this.getAdDate();
            //周边半价
            this.getGuessLickData();
            $(document).bind('scroll', function(e) {
            
                var scrollH = $(e.currentTarget).scrollTop();
                var windowH = $(window).height();
                
                    
                switch (this.tab_index) {
                    case "1":
                        if(this.C_OffLineList.loading){ return ;}
                        var $ele = $(".tab1_com .tpl_List li:last");
                        var liH = $ele[0].offsetTop + $ele.height();
                         var availScrollH = liH-windowH;
                         if (availScrollH>0&&(scrollH>availScrollH)) {
                           
                                this.getGuessLickData()
                        }
                        break;
                    case "2":
                        if(this.C_onLineList.loading){return;}
                        var $ele = $(".tab2_com .tpl_List li:last");
                        var liH = $ele[0].offsetTop + $ele.height();
                        var availScrollH = liH-windowH;
                         if (availScrollH>0&&(scrollH>availScrollH)) {
            
                                this.getGoodSelection()
                        }
                        break;
                    default:

                }
                
            }.bind(this));
        },
        render: function() {
            $("#container").html(this.$el.html(this.template()));
            $('#banner').html(this.Banner.el);
            this.Banner.render();
            $('#tab').html(this.Tab.render().el);
            $('#list .tab1_com').html(this.offLineList.el);
            $('#list .tab2_com').html(this.onLineList.el);
            return this

        },
        errorView: function(argument) {
            this.$el.find('.error').show();
        },
        //获取广告位数据
        getAdDate: function() {
            var thisView = this;
            var reqData = [{
                "osType": "3"
            }, {
                module: "1"
            }];
            Backbone.gp_ajax('anshaoBanner', reqData, {
                url: interface.anshaoBanner,
                success: function(data) {
                    if (data.resultStatus == 1000) {
                        if (typeof data.result.banner != 'undefined' && data.result.banner.length > 0) {
                            var ModelData = [],
                                banner = data.result.banner;
                            $.each(banner, function(index, el) {
                                var obj = {};
                                obj.imageSrc = el.image;
                                obj.link = el.link;
                                obj.imageWords = el.imageWords||"";
                                obj.point = JSON.stringify({"eventid":"五折天","label":"五折天首页_点击_banner","param":{"banner名称":obj.imageWords}});
                                ModelData.push(obj);
                            });
                            thisView.M_banner.set({
                                data: ModelData
                            })


                        }
                    } else {
                        Router.toast(data.memo || data.msg);
                    }



                },
                error: function(jqXHR, textStatus, errorThrown) {
                    Router.toast(textStatus);
                }

            });
        }, //小编精选（线上）依赖从native拿到的关注银行
        getGoodSelection: function() {
            var thisView = this;
            $("#error").html("");
            $("body").removeClass("bgColor");
             if ( thisView.C_onLineList.hasmore=="0") {
                    Router.toast("已加载全部数据");
                    return;
            }
            Router.getFocusBank(function(banks) {
                thisView.C_onLineList.loading = true;
                var offset = thisView.C_onLineList.length;
                var reqData = [{
                    "osType": 3
                }, {       
                    "offset": offset,
                    "limit": "10",
                    "banks":AppW.focusBanks==""?"SPABANK,UN":AppW.focusBanks
                }];
                Backbone.gp_ajax('fivediScountOnline', reqData, {
                    url: interface.fivediScountOnline,
                    success: function(data) {
                        if (data.resultStatus == 1000) {
                            if (data.result.total == 0) {
                                $("#error").html(thisView.errorView.el);
                                $("body").addClass("bgColor");
                                return;
                            }
                            if (typeof data.result.actList != "undefined") {
                                thisView.C_onLineList.total = data.result.total;
                                var models = [];
                                _.each(data.result.actList,function(el) {
                                   var model = {};
                                   model.actId = el.actId;
                                   model.bankName = el.bankName?el.bankName.substr(0,2):"";
                                   model.category = el.category ? el.category[0]: "广告";
                                   model.g_place = el.category ? "" : "g_place";
                                   model.discts =  Backbone.setMapPng((el.discts? el.discts[0]:""));
                                   model.images = el.images[0];
                                   model.caption = el.caption;
                                   model.point = JSON.stringify({"eventid":"五折天","label":"五折天首页_点击_优惠活动","param":{"活动ID":el.actId,"优惠分类":model.category}});
                                   model.href = "patoa://pingan.com/discount/detail?url=" + encodeURIComponent(AppW.actUrl + el.actId);
                                   models.push(model);

                                });
                                thisView.C_onLineList.add(models);
                            }

                            thisView.C_onLineList.hasmore = data.result.hasmore;
                        } else {
                            Router.toast(data.memo || data.msg);
                        }

                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        Router.toast(textStatus);
                    },
                    complete:function(){
                        
                        thisView.C_onLineList.loading = false;
                    }
                })


            }.bind(this));


        }, //周边半价（线下）
        getGuessLickData: function() {
            var thisView = this;
            $("#error").html("");
            var offset = thisView.C_OffLineList.length;
            if (thisView.C_OffLineList.hasmore=="0") {
                    Router.toast("已加载全部数据");
                    return;
            }
            Router.getLocation(function(nativeData) {
                var reqData = [{
                    "osType": 3
                }, {
                    "cityId": nativeData.cityId || AppW.GPS.cityId,
                    "destLat": nativeData.lat || AppW.GPS.lat,
                    "destLnt": nativeData.lnt || nativeData.lng || AppW.GPS.lng,
                    "banks": "",
                    "onLine": "0",
                    "offset":offset,
                    "limit": "10"
                }];
                Router.getFocusBank(function(banks) {
                    thisView.C_OffLineList.loading = true;
                    reqData[1].banks = AppW.focusBanks==""?"SPABANK,UN":AppW.focusBanks;
                    Backbone.gp_ajax('fivediScountOffline', reqData, {
                        url: interface.fivediScountOffline,
                        success: function(data) {
                            if (data.resultStatus == 1000 && typeof data.result.shopList != "undefined") {
                                if (data.result.total == 0) {
                                    $("#error").html(thisView.errorView.el);
                                    $("body").addClass('bgColor');
                                    return;
                                }
                                var models = [];
                                _.each(data.result.shopList,function(el,index) {
                                    var model = {};
                                    var acts = [];
                                    model.shopName = el.shopName;
                                    model.shopId = el.shopId;
                                    model.shopLogo = el.shopLogo==""?AppW.SHOPIMAGE:el.shopLogo;
                                    var distance = (el.distance/1000).toFixed(1);
                                    model.distance = distance>100?'>100km':distance+"km";
                                    model.acts = [];
                                    model.category = [];
                                    model.href = "patoa://pingan.com/discount/detail?url=" + encodeURIComponent(AppW.shopUrl + el.shopId );
                                    model.point = JSON.stringify({"eventid":"五折天","label":"五折天首页_点击_优惠商户","param":{"商户ID":el.shopId}});
                                    _.each(el.acts,function(_el){
                                        var actObj = {};
                                        actObj.bankName = _el.bankName.substr(0,2);
                                        actObj.caption = _el.caption;
                                        model.category.push((_el.category ? _el.category[0]: "广告"));
                                        actObj.g_place = _el.category ? "" : "g_place";
                                        actObj.discts = Backbone.setMapPng((_el.discts? _el.discts[0]:""));

                                        acts.push(actObj);
                                    })
                                    model.acts = acts.slice();
                                    models.push(model);
                                });
                                thisView.C_OffLineList.total  = data.result.total;
                                thisView.C_OffLineList.hasmore = data.result.hasmore;
                                thisView.C_OffLineList.add(models);

                            }else {
                                Router.toast(data.memo || data.msg);
                            }

                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            Router.toast(textStatus);
                        },
                        complete:function(){
                            thisView.C_OffLineList.loading = false;
                        }
                    })
                })

            }.bind(this))

        },
        tab1: function(e) {
            $("body").removeClass('bgColor');
            if(this.tab_index == "1"){
                return ;
            }
            this.Tab.select("1");
            this.tab_index = "1";
            $(".tab1_com").show();
            $(".tab2_com").hide();
            $("#error").html("");
            if (this.C_OffLineList.length == 0) {
                 Router.showLoading();
                this.getGuessLickData();
            }

        },
        tab2: function(e) {
            $("body").removeClass('bgColor');
            if(this.tab_index == "2"){
                return ;
            }

            this.Tab.select("2");
            this.tab_index = "2";
            $(".tab2_com").show();
            $(".tab1_com").hide();
            $("#error").html("");
            if (this.C_onLineList.length == 0) {
                Router.showLoading();
                this.getGoodSelection();
            }

        },



    });

    return tuiwuzhe;
});