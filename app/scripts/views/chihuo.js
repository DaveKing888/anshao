define([
    'backbone',
    'models/M_banner',
    'collections/C_productList',
    'component/V_banner',
    'component/V_offLineProductList',
    'component/V_onLineProductList',
    'component/V_errorPic',
    'text!tpl/tpl_tuiwuzhe.html'
], function(Backbone, M_banner, C_productList, V_banner, V_offLineProductList, V_onLineProductList, V_errorPic,tpl) {
    return Backbone.View.extend({
        className: 'mod_ch',
        events: {
           
        },
        template: _.template(tpl),
        initialize: function() {
            this.tab_index = "1";
            /*创建数据模型*/
            this.M_banner = new M_banner();
            this.C_onLineList = new C_productList();
            this.C_OffLineList = new C_productList();

            /*创建视图实例*/
            this.Banner = new V_banner({
                model: this.M_banner
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
            //吃货--周边商户
            this.getCircumData();
            $(document).bind('scroll', function(e) {
                if(this.C_OffLineList.loading){
                    return ;
                }
                var scrollH = $(e.currentTarget).scrollTop();
                var windowH = $(window).height();
                var liH = $(".tpl_List li:last")[0].offsetTop+$(".tpl_List li:last").height();
                var availScrollH = liH-windowH;

                if (availScrollH>0&&(scrollH>availScrollH)) {
                    this.getCircumData();
                }
            }.bind(this));
        },
        render: function() {
            $("#container").html(this.$el.html(this.template()));
            $('#banner').html(this.Banner.el);
            this.Banner.render();
            $('#list .tab1_com').html(this.offLineList.el);
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
                module: "2"
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
                                obj.point = JSON.stringify({"eventid":"吃货","label":"吃货首页_点击_banner","param":{"banner名称":obj.imageWords}});
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
                },
                complete:function(){

                }

            });
        }, //周边优选（线下）
        getCircumData: function() {
            var thisView = this;
            $("#error").html("");
            $("body").removeClass("bgColor");
            thisView.C_OffLineList.loading=true;
            if ( thisView.C_OffLineList.hasmore=="0") {
                    Router.toast("已加载全部数据");
                    return;
            }

            var offset = thisView.C_OffLineList.length;
            Router.getLocation(function(nativeData) {
                var reqData = [{
                    "osType": 3
                }, {
                     "cityId": nativeData.cityId || AppW.GPS.cityId,
                    "destLat": nativeData.lat || AppW.GPS.lat,
                    "destLnt": nativeData.lnt || nativeData.lng || AppW.GPS.lng,
                    "banks": AppW.focusBanks==""? "CN":AppW.focusBanks,
                    "onLine": "0",
                    "range":"10000000",
                    "offset":offset,
                    "limit": "10",
                    "filters":[{"grp":"分类","items":[{"caption":"美食","value":"美食"}]}]
                }];
                Router.getFocusBank(function(banks) {
                    reqData[1].banks = AppW.focusBanks;
                    Backbone.gp_ajax('anshaoFavorable', reqData, {
                        url: interface.anshaoFavorable,
                        success: function(data) {
                            if (data.resultStatus == 1000 && typeof data.result.shopList != "undefined") {
                                if (data.result.total == 0) {
                                    $("#error").html(thisView.errorView.el);
                                    $("body").addClass("bgColor");
                                    return;
                                }
                                var models = [];
                                _.each(data.result.shopList,function(el,index) {
                                    var model = {};
                                    var acts = [];
                                    model.shopName = el.shopName;
                                    model.shopId = el.shopId;
                                    model.shopLogo = el.logo==""?AppW.SHOPIMAGE:el.logo;
                                    var distance = (el.distance/1000).toFixed(1);
                                    model.distance = distance>100?'>100km':distance+"km";
                                    model.acts = [];
                                    model.category = ["美食"];
                                    model.href = "patoa://pingan.com/discount/detail?url=" + encodeURIComponent(AppW.shopUrl + el.shopId);
                                    _.each(el.acts,function(_el){
                                        var actObj = {};
                                        actObj.bankName = _el.bankName.substr(0,2);
                                        actObj.caption = _el.caption;
                                        // model.category.push((_el.category ? _el.category[0]: "广告"));
                                        actObj.g_place = _el.category ? "" : "g_place";
                                        actObj.discts = Backbone.setMapPng((_el.discts? _el.discts[0]:""));

                                        acts.push(actObj);
                                    })
                                    model.acts = acts.slice();
                                    model.point = JSON.stringify({"eventid":"吃货","label":"吃货首页_点击_优惠商户","param":{"商户ID":el.shopId}});
                                    models.push(model);
                                });
                                thisView.C_OffLineList.hasmore  = data.result.hasmore;
                                thisView.C_OffLineList.total  = data.result.total;
                                thisView.C_OffLineList.add(models);

                            }else {
                                Router.toast(data.memo || data.msg);
                            }

                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            Router.toast(textStatus);
                        },
                        complete:function(){
                            thisView.C_OffLineList.loading=false;
                        }
                    })
                })

            }.bind(this))

        }
    });
});