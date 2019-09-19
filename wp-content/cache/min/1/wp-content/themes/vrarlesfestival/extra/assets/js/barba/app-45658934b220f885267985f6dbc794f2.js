var app={previousUrl:Barba.Utils.getCurrentUrl(),preloaded:!1,isTransitioning:!1,hasInitInfinitePostLoading:null,currentView:!1,previousView:!1,currentContainer:$(".barba-container")[0],previousContainer:null,lastClickedLink:null,init:function(){extraBlockUI();this.initLinks();this.initBarba();extraPreloader.init()},initLinks:function(){extraBlockUI();Barba.Pjax.originalPreventCheck=Barba.Pjax.preventCheck;Barba.Pjax.preventCheck=function(event,element){if(!element){return!1}
if(app.currentView.namespace==='404'){return!1}
if($(element).hasClass("extra-ajax-navigation-next-button")||$(element).hasClass("extra-ajax-navigation-previous-button")){return!1}
var href=Barba.Pjax.getHref(element);if(href===undefined||Barba.Utils.cleanLink(href)===Barba.Utils.cleanLink(location.href)){event.preventDefault();return!1}
if(href.indexOf("wp-admin")>0||href.indexOf("wp-login")>0){return!1}
if(!Barba.Pjax.originalPreventCheck(event,element)){return!1}
if(app.isTransitioning){event.preventDefault();return!1}
app.lastClickedLink=element;return!0}},initBarba:function(){Barba.Pjax.start()}};$(document).ready(function(){app.init()})