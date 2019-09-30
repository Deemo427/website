var ExtraView = Barba.BaseView.extend({
    namespace: 'extra-default-view'
    , imagesLoaded: !1
    , onEnter: function () {
        app.currentView = this;
        if (this.namespace !== 'post' && app.hasInitInfinitePostLoading !== null) {
            app.hasInitInfinitePostLoading.destroy();
            app.hasInitInfinitePostLoading = null
        }
        var $container = $(this.container);
        this.extraOnEnter($container);
        // $window.trigger('resize')
    }
    , extraOnEnter: function () {}
    , onLeave: function () {
        app.previousView = this;
        this.extraOnLeave()
    }
    , extraOnLeave: function () {}
    , readyState: function () {
        var _this = this
            , deferred = Barba.Utils.deferred();
        if (this.imagesLoaded) {
            Promise.all([_this.extraWaitingChecker()]).then(function () {
                deferred.resolve()
            })
        }
        else {
            $window.one("extra:responsiveImage:complete", function () {
                Promise.all([_this.extraWaitingChecker()]).then(function () {
                    deferred.resolve()
                })
            })
        }
        return deferred.promise
    }
    , extraWaitingChecker: function () {
        var deferred = Barba.Utils.deferred();
        deferred.resolve();
        return deferred.promise
    }
});
ExtraView.init()