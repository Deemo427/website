$(document).ready(function () {
    var isAdmin = undefined;
    Barba.Dispatcher.on('newPageReady', function (currentStatus, prevStatus, container, newRawHtml) {
        var $container = $(container)
            , $newHtml = $(newRawHtml);
        if (isAdmin === undefined) {
            isAdmin = $('#wpadminbar').length > 0
        }
        $("#sidebar").find('.site-title').replaceWith($newHtml.find("#sidebar").find(".site-title"));
        $("#menu-content").replaceWith($newHtml.find("#menu-content"));
        $("#footer-menu-container").replaceWith($newHtml.find("#footer-menu-container"));
        $("#languages-switcher").replaceWith($newHtml.filter("#languages-switcher").removeClass('preloader'));
        if (isAdmin) {
            var $newbar = $newHtml.filter("#wpadminbar");
            if ($newbar.length) {
                $("#wpadminbar").replaceWith($newHtml.filter("#wpadminbar"))
            }
        }
        extraPreInitFancybox($newHtml, $container)
    });
    Barba.Dispatcher.on("transitionCompleted", function () {
        if ($(app.currentContainer).find('.wp-audio-shortcode, .wp-video-shortcode').length && window.wp.mediaelement) {
            TweenMax.delayedCall(0.5, function () {
                window.wp.mediaelement.initialize()
            })
        }
    });
    Barba.Dispatcher.on("newPageReady", function (currentStatus, prevStatus, container, currentHTML) {
        updateAnalytics(currentStatus.url, $(currentHTML).filter('title').html())
    });
    Barba.Dispatcher.on("initStateChange", extraBlockUI);
    Barba.Dispatcher.on("transitionCompleted", extraReleaseUI)
});

function updateAnalytics(link, title) {
    link = link.trimRight('/');
    link = link.replace(extra_common_params.site_url, '');
    if (link !== app.lastTrackedUrl) {
        console.log(link);
        app.lastTrackedUrl = link;
        ga('set', {
            page: link
            , title: title
        });
        ga('send', 'pageview')
    }
}

function extraBlockUI(element, event) {
    app.isTransitioning = !0;
    $('html').addClass('extra-transition-freeze').on("scroll touchmove mousewheel", blockScroll)
}

function extraReleaseUI(element, event) {
    app.isTransitioning = !1;
    $('html').removeClass('extra-transition-freeze').off("scroll touchmove mousewheel", blockScroll)
}

function blockScroll(event) {
    event.preventDefault();
    event.stopPropagation();
    return !1
}

function extraPreInitFancybox($newHtml, $container) {
    var $fancyMeta = $('meta[name="extra:fancybox_title"]')
        , $title = $newHtml.find('h1');
    if ($fancyMeta.length > 0 && $title.length > 0) {
        $fancyMeta.attr('content', $title.text())
    }
    extraInitFancybox($container)
}
$(window).on("extra:preloader:complete", function () {
    fluidvids.init({
        selector: ['.main-content iframe', '.main-content object']
    });
    Barba.Dispatcher.on('newPageReady', function (currentStatus, prevStatus, container, newRawHtml) {
        fluidvids.render()
    })
});
$(window).on("extra:preloader:complete", function () {
    $(document).on("focus", '.content .wpcf7 .wpcf7-form-control', function () {
        $(this).closest('.field').addClass("field-focused")
    }).on("blur change", '.content .wpcf7 .wpcf7-form-control', function () {
        $(this).closest('.field').toggleClass("field-focused", $(this).val() !== '')
    });
    Barba.Dispatcher.on('newPageReady', function (currentStatus, prevStatus, container, newRawHtml) {
        var $forms = $(container).find('form');
        if ($forms.length) {
            $forms.each(function () {
                wpcf7.initForm(this)
            });
            $forms.find('.wpcf7-form-control').trigger("blur")
        }
    })
});

function initHeaderTitle($container) {
    var $window = $(window)
        , $wrapper = $container.find('.header')
        , $inner = $container.find('.header-wrapper')
        , $title = $container.find('.header .title')
        , $lines = $title.find('.part')
        , lines = []
        , scrollTop = 0
        , scrollPercent = 0
        , allowRepaint = !1
        , wInnerWidth = window.innerWidth
        , wWidth = 0
        , wHeight = 0
        , isActive = !0;
    $lines.each(function (index, element) {
        lines.push({
            element: $(this)
            , offset: $(this).data("offset") ? $(this).data("offset") : -(Math.random() * 200 + 150)
            , letters: $(this).find('.letter')
        })
    });
    $inner.extraSticky({
        container: $container.find('.header')
        , offset: 0
        , limit: !0
        , keepChildWidth: !0
        , minSize: 690
    });

    function windowResizeHandler(event) {
        wWidth = $wrapper.outerWidth();
        wHeight = $wrapper.outerHeight();
        wInnerWidth = window.innerWidth;
        if (wInnerWidth < 690) {
            for (var lineIndex in lines) {
                TweenMax.set(lines[lineIndex].element, {
                    y: 0
                });
                lines[lineIndex].letters.each(function (index, letter) {
                    TweenMax.set(letter, {
                        y: 0
                    })
                })
            }
        }
    }

    function scrollHandler() {
        scrollTop = $window.scrollTop();
        scrollPercent = Math.clamp(scrollTop / wHeight, 0, 1);
        allowRepaint = !0
    }

    function render() {
        if (isActive) {
            window.requestAnimationFrame(render)
        }
        if (!allowRepaint || wInnerWidth < 690) {
            return
        }
        allowRepaint = !1;
        for (var lineIndex in lines) {
            TweenMax.set(lines[lineIndex].element, {
                y: scrollPercent * lines[lineIndex].offset
            });
            lines[lineIndex].letters.each(function (index, letter) {
                TweenMax.set(letter, {
                    y: ((index % 2) ? (scrollPercent * (lines[lineIndex].offset / 2)) : -(scrollPercent * lines[lineIndex].offset / 3))
                })
            })
        }
    }
    $window.on("extra:resize", windowResizeHandler);
    $window.on("scroll", scrollHandler);
    $container.on("extra:transition:out:start", function () {
        $inner.trigger("extra:sticky:destroy");
        isActive = !1
    });
    windowResizeHandler();
    render()
}
$(document).ready(function () {
    if (isIEorEDGE()) {
        $('html').addClass('ie')
    }
});

function initLinks($container) {
    $container.find('.post-header').each(function () {
        var $wrap = $(this);
        $wrap.find('.post-header-title a').on("mouseenter touchstart", function () {
            $wrap.addClass("post-header-title-hover")
        }).on("mouseleave touchend", function () {
            $wrap.removeClass("post-header-title-hover")
        })
    })
}
$(document).ready(function () {
    var $window = $(window)
        , wWidth = 0
        , $html = $('html')
        , $menuWrapper = $("#menu-wrapper")
        , $menu = $("#menu-container")
        , $menuInner = $menu.find('.menu-container-inner')
        , $switch = $("#menu-switch-manager")
        , menuHeight = 0
        , menuWidth = 0
        , scrollTop = 0
        , isOpen = !1
        , isAnimating = !1
        , allowUpdate = !1
        , timeline, timelineScroll = 0;
    $("#menu-wrapper .menu-item").each(function () {
        $(this).children().first().attr('data-text', function () {
            return $(this).text()
        })
    });

    function resizeHandler(event) {
        wWidth = window.innerWidth;
        menuHeight = $menuInner.outerHeight();
        menuWidth = $menuInner.outerWidth();
        setTimeline();
        scrollHandler()
    }

    function setTimeline() {
        timelineScroll = scrollTop;
        if (timeline) {
            timeline.progress(0).kill()
        }
        TweenMax.set($menu, {
            clearProps: 'all'
        });
        timeline = new TimelineMax({
            paused: !0
            , onComplete: function () {
                isAnimating = !1
            }
            , onReverseComplete: function () {
                isAnimating = !1
            }
        });
        timeline.fromTo($menu, 0.2, {
            height: function () {
                return wWidth <= 690 ? 0 : Math.max(0, Math.min(menuHeight, menuHeight - scrollTop))
            }
        }, {
            height: menuHeight
            , ease: Quad.easeIn
        });
        timeline.fromTo($menu, 0.3, {
            width: 80
        }, {
            width: menuWidth
            , ease: Quad.easeOut
        })
    }

    function scrollHandler(event) {
        scrollTop = $window.scrollTop();
        allowUpdate = !0
    }

    function switchHandler(event) {
        if ($switch.prop("checked")) {
            isOpen = !0;
            $html.addClass('extra-menu-open');
            open()
        }
        else {
            isOpen = !1;
            $html.removeClass('extra-menu-open');
            close()
        }
    }

    function open() {
        isAnimating = !0;
        if (timelineScroll !== scrollTop) {
            setTimeline();
            window.requestAnimationFrame(function () {
                timeline.play()
            })
        }
        else {
            timeline.play()
        }
    }

    function close() {
        isAnimating = !0;
        timeline.reverse()
    }

    function render() {
        window.requestAnimationFrame(render);
        if (allowUpdate && !isOpen && !isAnimating) {
            allowUpdate = !1;
            TweenMax.set($menu, {
                height: wWidth <= 690 ? 0 : Math.max(0, Math.min(menuHeight, menuHeight - scrollTop))
            })
        }
    }
    $(window).on("extra:preloader:complete", function () {
        $window.on("scroll", scrollHandler);
        $window.on("extra:resize", resizeHandler);
        $switch.on("change", switchHandler);
        resizeHandler();
        render()
    });
    $menuWrapper.extraSticky({
        container: $("#wrapper")
        , minSize: 690
    })
});

function initScrollContent($container) {
    var isActive = !0
        , timeline = new TimelineMax()
        , scrollAnimator, $selector = $container.find('.main-content').children().not('.mask').not('.columns-wrapper');
    $selector = $selector.add($container.find('.columns-wrapper').children());
    $selector.each(function (index, item) {
        timeline.from(item, 1, {
            y: 100
            , ease: Linear.easeNone
        }, '-=0.5')
    });
    scrollAnimator = new ExtraScrollAnimator({
        target: $container.find('.main-content')
        , tween: timeline
        , speed: 0
        , min: 0
        , max: 0.5
        , minSize: 690
        , ease: Linear.easeNone
    });

    function destroy() {
        if (!isActive || app.currentContainer === $container[0]) {
            return
        }
        isActive = !1;
        scrollAnimator.destroy()
    }
    Barba.Dispatcher.on("transitionCompleted", destroy)
}
$(document).ready(function () {
    var $html = $("html")
        , $input = $("#s");
    $input.on("focus", open).on("blur", close).on("keyup", escape);

    function open() {
        $html.toggleClass("extra-search-closed", !1)
    }

    function close() {
        $html.toggleClass("extra-search-closed", !0)
    }

    function escape(event) {
        if (event.which === 27 && !$html.hasClass("extra-search-closed")) {
            close()
        }
    }
    close();
    $html.addClass("extra-search-ready")
});

function initSectionTitle($container) {
    var $sections = $container.find('.section-title-wrapper');
    $sections.each(function () {
        var $section = $(this)
            , $inner = $section.children()
            , $separator = $section.find('.separator')
            , tween, height = $inner.height()
            , scrollAnimator;
        tween = new TimelineMax({
            onUpdate: function () {}
        });
        tween.set($separator, {
            width: height * 2
            , right: '100%'
            , immediateRender: !0
        }).set($inner, {
            color: 'transparent'
            , immediateRender: !0
        }).to($separator, 1, {
            width: 30
            , right: 0
        }).set($inner, {
            color: 'black'
        }, '-=0.6');
        scrollAnimator = new ExtraScrollAnimator({
            target: $section
            , tween: tween
            , defaultProgress: 0
            , speed: 0
            , min: 0.2
            , max: 0.4
        });
        $section.on("extra:scrollanimator:update", function (event) {
            event.stopPropagation()
        })
    })
}
$(document).ready(function () {
    $('#sidebar').extraSticky({
        'minSize': 690
    })
});
var styleLog1 = "padding: 0; color:#000000; line-height:30px; font-size: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen-Sans', 'Ubuntu', 'Cantarell', 'Helvetica Neue', sans-serif;"
    , styleLog2 = styleLog1 + " color: red;"
    , styleLog3 = styleLog1 + " font-weight: 700;";
console.log("%c\n          Made by www.lesanimals.digital    \n \n ", styleLog1);
$(document).ready(function () {
    $.get(extra_common_params.theme_url + "/extra/assets/img/sprite.svg", function (data) {
        var div = document.createElement("div");
        div.innerHTML = new XMLSerializer().serializeToString(data.documentElement);
        document.body.insertBefore(div, document.body.childNodes[0]);
        $(div).addClass('extra-sprite');
        $("html").addClass("extra-svg-loaded")
    })
});
$(document).ready(function () {
    $('.button-top').on("click", function (event) {
        event.preventDefault();
        TweenMax.to(window, 3, {
            scrollTo: 0
            , autoKill: !1
            , ease: Quad.easeInOut
        })
    })
});
$(window).on('beforeunload', function () {
    $(window).scrollTop(0)
});

function transitionIn($container) {
    $('#barba-wrapper').find('.barba-container').not($container).remove();
    var timeline = new TimelineMax();
    timeline.set($("#transition-mask2,#transition-mask1"), {
        clearProps: 'all'
    });
    timeline.set(window, {
        scrollTo: 0
    }, 0);
    timeline.set($container, {
        clearProps: 'visibility'
    });
    timeline.staggerFrom($container.find('.header .title .letter'), 0.6, {
        cycle: {
            yPercent: function (index) {
                return ((index % 2) ? -110 : 110)
            }
        }
    }, 0.05, '-=1', function () {
        $container.find('.header .title').addClass('anim-letters-completed')
    });
    timeline.add(function () {
        $(window).trigger('extra:sticky:resize');
        $(window).trigger('extra:scrollanimator:resize')
    });
    return timeline
}

function transitionOut($container) {
    var timeline = new TimelineMax()
        , $sidebar = $("#sidebar")
        , $mask1 = $("#transition-mask1")
        , $mask2 = $("#transition-mask2")
        , winWidth = window.innerWidth;
    timeline.addLabel("start");
    timeline.to($mask1, 1, {
        right: 0
        , ease: Power2.easeInOut
    }, "start");
    timeline.to($mask2, 1, {
        right: 0
        , ease: Power2.easeInOut
    }, '-=0.5');
    if (winWidth > 690) {
        timeline.to($mask2, 0.5, {
            left: 200
            , ease: Power2.easeOut
        }, '-=0.3')
    }
    timeline.to(window, 0.5, {
        scrollTo: 0
        , ease: Quad.easeOut
    });
    timeline.add(function () {
        $(window).trigger("extra:transition:transitionout")
    });
    return timeline
}
$.fn.shuffle = function () {
    var allElems = this.get()
        , getRandom = function (max) {
            return Math.floor(Math.random() * max)
        }
        , shuffled = $.map(allElems, function () {
            var random = getRandom(allElems.length)
                , randEl = $(allElems[random]).clone(!0)[0];
            allElems.splice(random, 1);
            return randEl
        });
    this.each(function (i) {
        $(this).replaceWith($(shuffled[i]))
    });
    return $(shuffled)
};
$.fn.randomize = function (selector) {
    var $elems = selector ? $(this).find(selector) : $(this).children();
    for (var i = $elems.length; i >= 0; i--) {
        $(this).append($elems[Math.random() * i | 0])
    }
    return this
};

function shuffleArray(array) {
    var currentIndex = array.length
        , temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue
    }
    return array
}

function isIEorEDGE() {
    return navigator.appName === 'Microsoft Internet Explorer' || (navigator.appName === "Netscape" && navigator.appVersion.indexOf('Edge') > -1) || (navigator.appName === "Netscape" && navigator.appVersion.indexOf('Trident') > -1)
}

function getScrollbarWidth() {
    var scrollbarWidth = 0;
    if (window.extraScrollbarWidthCache) {
        scrollbarWidth = window.extraScrollbarWidthCache
    }
    else {
        var outer = document.createElement("div");
        outer.style.visibility = "hidden";
        outer.style.width = "100px";
        outer.style.msOverflowStyle = "scrollbar";
        document.body.appendChild(outer);
        var widthNoScroll = outer.offsetWidth;
        outer.style.overflow = "scroll";
        var inner = document.createElement("div");
        inner.style.width = "100%";
        outer.appendChild(inner);
        var widthWithScroll = inner.offsetWidth;
        outer.parentNode.removeChild(outer);
        scrollbarWidth = window.extraScrollbarWidthCache = widthNoScroll - widthWithScroll
    }
    return scrollbarWidth
}
Math.clamp = function (value, min, max) {
    if (value === undefined) {
        return 0
    }
    if (min === undefined) {
        min = 0
    }
    if (max === undefined) {
        max = 1
    }
    return Math.max(min, Math.min(value, max))
}