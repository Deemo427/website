(function ($) {
    'use strict';
    var $window = $(window);
    $.fn.extraSticky = function (options) {
        var opt = $.extend({
            'class': 'sticky'
            , 'container': null
            , 'offset': 0
            , 'limit': !0
            , 'limitOffset': 0
            , 'limitClass': 'limited'
            , 'shy': !1
            , 'shyOffset': -100
            , 'shyClass': 'shy'
            , 'unshyClass': 'unshy'
            , 'keepContainerHeight': !1
            , 'keepChildWidth': !1
            , 'minSize': 0
        }, options);
        this.each(function () {
            var $this = $(this)
                , $window = $(window)
                , $container = opt.container ? opt.container : $this.parent()
                , windowWidth = window.innerWidth
                , windowHeight = window.innerHeight
                , containerHeight, containerOuterHeight, outerHeight, offsetTop, allowStick = !0
                , isFixed = !1
                , isLimited = !1
                , isActive = !0
                , allowRepaint = !1
                , isShy = !1
                , scrollTop = 0
                , previousScrollTop = -1
                , diffStart = 0
                , diffStop = 0
                , diffStartShy = 0
                , diffStopShy = 0;

            function resize() {
                $window.off('scroll', scrollHandler);
                TweenMax.set($this, {
                    clearProps: 'position,bottom'
                });
                $this.removeClass(opt.class);
                $this.removeClass(opt.limitClass);
                if (opt.keepContainerHeight) {
                    TweenMax.set($container, {
                        clearProps: 'height'
                    })
                }
                if (opt.keepChildWidth) {
                    TweenMax.set($this, {
                        clearProps: 'width'
                    })
                }
                isFixed = !1;
                isLimited = !1;
                previousScrollTop = -1;
                windowWidth = window.innerWidth;
                windowHeight = window.innerHeight;
                if (windowWidth <= opt.minSize) {
                    return
                }
                offsetTop = $container.offset().top;
                containerHeight = $container.height();
                containerOuterHeight = $container.outerHeight();
                outerHeight = $this.outerHeight();
                allowStick = outerHeight <= windowHeight && (outerHeight <= containerOuterHeight || !opt.limit);
                $window.on('scroll', scrollHandler);
                scrollHandler()
            }

            function scrollHandler() {
                var tmpScrollTop = $window.scrollTop();
                if (tmpScrollTop === previousScrollTop) {
                    return
                }
                previousScrollTop = scrollTop;
                scrollTop = tmpScrollTop;
                diffStart = offsetTop - scrollTop - opt.offset;
                diffStop = offsetTop + containerHeight - outerHeight - scrollTop - opt.offset;
                diffStartShy = offsetTop - scrollTop - opt.shyOffset;
                diffStopShy = offsetTop + containerHeight - outerHeight - scrollTop - opt.shyOffset;
                allowRepaint = !0
            }

            function repaint() {
                if (allowRepaint) {
                    if (allowStick) {
                        if (isFixed) {
                            if (diffStart >= 0) {
                                isFixed = !1;
                                $this.removeClass(opt.class);
                                if (opt.keepContainerHeight) {
                                    TweenMax.set($container, {
                                        clearProps: 'height'
                                    })
                                }
                                if (opt.keepChildWidth) {
                                    TweenMax.set($this, {
                                        clearProps: 'width'
                                    })
                                }
                                $this.trigger("extra:sticky:unstick")
                            }
                        }
                        else {
                            if (diffStart < 0) {
                                isFixed = !0;
                                $this.addClass(opt.class);
                                if (opt.keepContainerHeight) {
                                    $container.height(containerOuterHeight)
                                }
                                if (opt.keepChildWidth) {
                                    $this.innerWidth($container.innerWidth())
                                }
                                $this.trigger("extra:sticky:stick")
                            }
                        }
                        if (opt.limit) {
                            if (isLimited) {
                                if (diffStop > opt.limitOffset) {
                                    isLimited = !1;
                                    TweenMax.set($this, {
                                        clearProps: 'position,bottom'
                                    });
                                    $this.removeClass(opt.limitClass);
                                    if (!isFixed) {
                                        if (opt.keepContainerHeight) {
                                            TweenMax.set($container, {
                                                clearProps: 'height'
                                            })
                                        }
                                        if (opt.keepChildWidth) {
                                            TweenMax.set($this, {
                                                clearProps: 'width'
                                            })
                                        }
                                    }
                                }
                            }
                            else {
                                if (diffStop <= opt.limitOffset) {
                                    isLimited = !0;
                                    $this.css({
                                        'position': 'absolute'
                                        , 'bottom': opt.limitOffset
                                    });
                                    $this.addClass(opt.limitClass);
                                    if (opt.keepContainerHeight) {
                                        $container.height(containerOuterHeight)
                                    }
                                    if (opt.keepChildWidth) {
                                        $this.innerWidth($container.innerWidth())
                                    }
                                }
                            }
                        }
                    }
                    if (opt.shy === !0) {
                        if (diffStartShy < 0 && scrollTop > previousScrollTop && !isShy) {
                            isShy = !0;
                            $this.addClass(opt.shyClass);
                            $this.removeClass(opt.unshyClass);
                            $this.trigger("extra:sticky:shy")
                        }
                        else if (scrollTop < previousScrollTop && isShy) {
                            isShy = !1;
                            $this.removeClass(opt.shyClass);
                            $this.addClass(opt.unshyClass);
                            $this.trigger("extra:sticky:unshy")
                        }
                    }
                    allowRepaint = !1
                }
                if (isActive) {
                    window.requestAnimationFrame(repaint)
                }
            }

            function update(event, options) {
                opt = $.extend(opt, options);
                resize()
            }

            function destroyHandler() {
                isActive = !1;
                $window.off('extra:sticky:resize', resize);
                $window.off('extra:resize', resize);
                $this.off("extra:sticky:update", update);
                $this.off('extra:sticky:destroy', destroyHandler)
            }
            $window.on('extra:sticky:resize', resize);
            $window.on('extra:resize', resize);
            $this.on("extra:sticky:update", update);
            $this.on("extra:sticky:destroy", destroyHandler);
            resize();
            repaint()
        });
        return this
    }
}(jQuery))