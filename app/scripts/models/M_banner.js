define(['backbone'], function(Backbone){
  var M_banner = Backbone.Model.extend({
    defaults:function(){
      return {
        data:[
          {
            "imageSrc":AppW.BannerPlaceHolder,
            "link":"",
            "imageWords":"",
            "point":JSON.stringify({"eventid":"约影票","label":"约影票首页_点击_banner","param":{"banner名称":""}})
          },
          {
            "imageSrc":AppW.BannerPlaceHolder,
            "link":"",
            "imageWords":"",
            "point":JSON.stringify({"eventid":"约影票","label":"约影票首页_点击_banner","param":{"banner名称":""}})
          },
          {
            "imageSrc":AppW.BannerPlaceHolder,
            "link":"",
            "imageWords":"",
            "point":JSON.stringify({"eventid":"约影票","label":"约影票首页_点击_banner","param":{"banner名称":""}})
          }
        ]
      }

    },
    initialize: function() {

    },
    validate: function(attrs, options) {

    }
  });

  return M_banner;
});