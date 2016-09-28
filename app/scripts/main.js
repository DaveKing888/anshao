/*global require*/
'use strict';

require.config({
    paths: {
        'jquery': 'vendor/jquery.min',
        'underscore': 'vendor/underscore-min',
        'backbone': 'vendor/backbone',
        'swiper':'vendor/swiper.jquery.min',
        'text':'vendor/text',
        'Router' : 'routers/router',
        'Config':'vendor/Config',
        'native_h5':'vendor/native_h5'
    },
    shim: {
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        underscore: {
            exports: '_'
        },
        swiper:{
            deps:['jquery'],
            exports:'Swiper'
        }
    }
});

require([
    'backbone',
    'underscore',
    'jquery',
    'swiper',
    'native_h5',
    'Config',
    'Router'
], function (Backbone,_,$,Swiper,native,Config,Router) {
    
    window.Router = new Router();
    Backbone.history.start();

});
