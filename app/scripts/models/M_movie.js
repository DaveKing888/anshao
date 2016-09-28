define(['backbone'], function(Backbone){
  var M_banner = Backbone.Model.extend({
    defaults:function(){
      return {
        data:[
          {
            "imageSrc":"http://hiphotos.baidu.com/%B3%F5%BC%B6%BE%D1%BB%F7%CA%D6/pic/item/929b56443840bfc6b3b7dc64.jpg",
            "score":10
          },
          {"imageSrc":"http://www.pptbz.com/pptpic/UploadFiles_6909/201203/2012031220134655.jpg"},
          {"imgaeSrc":"http://pic26.nipic.com/20130108/9252150_175323515327_2.jpg"}

          ]
      }

    },
    initialize: function() {
      
    },
    validate: function(attrs, options) {

    }
  })

  return M_banner
});