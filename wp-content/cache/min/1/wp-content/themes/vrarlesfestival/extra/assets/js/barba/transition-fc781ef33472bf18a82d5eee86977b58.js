var ExtraTransition=Barba.BaseTransition.extend({start:function(){var _this=this;app.previousContainer=this.oldContainer;app.previousUrl=Barba.Utils.getCurrentUrl();Promise.all([_this.newContainerLoading,_this.transitionOut()]).then(function(){app.currentContainer=_this.newContainer;_this.transitionIn()})},transitionOut:function(){var
deferred=Barba.Utils.deferred(),timeline=new TimelineMax(),screenTimeline=app.currentView.getTimelineOut(),$menuCheckbox=$("#menu-switch-manager"),isMenuOpen=$menuCheckbox.prop("checked");timeline.eventCallback("onComplete",function(){deferred.resolve()});if(isMenuOpen){$menuCheckbox.prop("checked",!1).trigger("change")}
timeline.add(screenTimeline.play(),isMenuOpen?0.2:0);timeline.play();return deferred.promise},transitionIn:function(){var _this=this;Promise.all([app.currentView.readyState()]).then(function(){var screenTimelineParameters=app.currentView.getTimelineIn();screenTimelineParameters.timeline.pause().progress(0);screenTimelineParameters.timeline.eventCallback("onComplete",function(){app.isTransitioning=!1;_this.deferred.resolve()});screenTimelineParameters.timeline.play()})}});Barba.Pjax.getTransition=function(){return ExtraTransition}