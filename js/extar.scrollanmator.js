function ExtraScrollAnimator(options) {
    var self = this
        , $window = $(window)
        , scrollTop = $window.scrollTop()
        , isActive = !0
        , wWidth = $window.width()
        , wHeight = $window.height()
        , isMin = null
        , isMax = null
        , isInside = null
        , isPaused = !1;
    self.init = function (_options) {
        self.options = $.extend({
            target: null
            , tween: null
            // , ease: Linear.easeNone
            , min: 0
            , max: 1
            , minSize: 0
            , speed: 0.3
            , defaultProgress: 1
            , debug: !1
            , onMin: null
            , onMax: null
            , onOutside: null
            , onInside: null
            , onUpdate: null
        }, _options);
        if (self.options.target === null || self.options.target.length < 1) {
            console.warn("Extra Scroll Animator: no target specified");
            return !1
        }
        if (self.options.tween === null) {
            console.warn("Extra Scroll Animator: no tween specified");
            return !1
        }
        self.allowScrollUpdate = !0;
        self.update();
        self.repaint()
    };
    self.updatePosition = function (fast) {
        if (!isActive) {
            return
        }
        var time = (fast === undefined || !fast) ? self.options.speed : 0
            , coords = self.options.target.data('coords')
            , percent;
        if (!coords) {
            return
        }
        percent = 1 - (scrollTop - coords.max) / (coords.min - coords.max);
        if (percent <= 0 && isMin !== !0) {
            isMin = !0;
            if (isFunction(self.options.onMin)) {
                self.options.onMin()
            }
            self.options.target.trigger("extra:scrollanimator:min")
        }
        else if (percent > 0 && isMin !== !1) {
            isMin = !1
        }
        if (percent >= 1 && isMax !== !0) {
            isMax = !0;
            if (isFunction(self.options.onMax)) {
                self.options.onMax()
            }
            self.options.target.trigger("extra:scrollanimator:max")
        }
        else if (percent <= 1 && isMax !== !1) {
            isMax = !1
        }
        if ((isMin === !0 || isMax === !0) && isInside !== !1) {
            isInside = !1;
            if (isFunction(self.options.onOutside)) {
                self.options.onOutside()
            }
            self.options.target.trigger("extra:scrollanimator:outside")
        }
        else if (percent <= 1 && percent >= 0 && isInside !== !0) {
            isInside = !0;
            if (isFunction(self.options.onInside)) {
                self.options.onInside()
            }
            self.options.target.trigger("extra:scrollanimator:inside")
        }
        if (isInside === !1) {
            if (isMax) {
                percent = 1
            }
            else {
                percent = 0
            }
        }
        percent = Math.max(0, Math.min(percent));
        debug(percent);
        TweenMax.to(self.options.tween, time, {
            progress: percent
            , ease: self.options.ease
        })
    };
    self.update = function () {
        wWidth = $window.width();
        wHeight = $window.height();
        var coords = {}
            , offsetTop = self.options.target.offset().top
            , height = self.options.target.height()
            , min = self.options.min
            , max = self.options.max;
        coords.min = offsetTop - wHeight + (wHeight * min);
        coords.max = (offsetTop - wHeight + height) + (wHeight * max);
        self.options.target.data("coords", coords);
        self.options.tween.paused(!0);
        self.options.tween.progress(self.options.defaultProgress);
        if (wWidth < self.options.minSize) {
            $window.off('scroll', scrollHandler)
        }
        else {
            $window.on('scroll', scrollHandler);
            self.updatePosition(!0)
        }
        if (isFunction(self.options.onUpdate)) {
            self.options.onUpdate(coords)
        }
        self.options.target.trigger("extra:scrollanimator:update", [coords])
    };
    $window.on('extra:resize', self.update);
    $window.on('extra:scrollanimator:resize', self.update);
    $window.on('extra:scrollanimator:tick', self.updatePosition);

    function scrollHandler(event) {
        scrollTop = $window.scrollTop();
        self.allowScrollUpdate = !0
    }
    self.repaint = function () {
        if (!isActive) {
            return
        }
        if (!self.allowScrollUpdate) {
            window.requestAnimationFrame(self.repaint);
            return
        }
        self.updatePosition();
        self.allowScrollUpdate = !1;
        window.requestAnimationFrame(self.repaint)
    };
    self.init(options);
    self.updateTween = function (tween) {
        if (self.options.tween) {
            self.options.tween.kill()
        }
        self.options.tween = tween;
        self.options.tween.paused(!0);
        self.options.tween.progress(self.options.defaultProgress);
        self.allowScrollUpdate = !0;
        self.update()
    };
    self.pause = function () {
        if (!isPaused) {
            $window.off('scroll', scrollHandler);
            $window.off('extra:resize', self.update);
            isActive = !1;
            isPaused = !0
        }
    };
    self.resume = function () {
        if (isPaused) {
            if (wWidth < self.options.minSize) {
                $window.off('scroll', scrollHandler)
            }
            else {
                $window.on('scroll', scrollHandler)
            }
            $window.on('extra:resize', self.update);
            isActive = !0;
            isPaused = !1;
            self.repaint()
        }
    };
    self.destroy = function () {
        isActive = !1;
        $window.off('scroll', scrollHandler);
        $window.off('extra:resize', self.update);
        $window.off('extra:scrollanimator:tick', self.updatePosition);
        if (self.options.tween) {
            self.options.tween.paused(!0);
            self.options.tween.progress(self.options.defaultProgress);
            self.options.tween.kill()
        }
        self.allowScrollUpdate = !1
    };

    function debug(string) {
        if (self.options.debug === !0) {
            console.log(string)
        }
    }

    function isFunction(functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]'
    }
}