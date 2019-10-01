var FrontPage = ExtraView.extend({
    namespace: 'front-page'
    , extraOnEnter: function ($container) {
        var _this = this;
//        initHeaderTitle($container);
//        frontPageInitClouds($container);
       frontPageInitSelection($container);
       frontPageInitEvents($container);
       initSectionTitle($container);
       frontPageInitNews($container);
        this.imagesLoaded = !0;
        // $window.trigger("extra:responsiveImage:init", [$container])
    }
    , getTimelineIn: function () {
        var deferred = Barba.Utils.deferred()
            , $container = $(this.container)
            , $partnersLink = $container.find('.partners-wrapper .partner-link')
            , timeline = new TimelineMax();
        timeline.add(function () {
            transitionIn($container)
        });
        timeline.add(function () {
            frontPageInitJury($container)
            console.log('frontPageInitJury_first');
        });
        timeline.staggerFrom($container.find('.header .cloud'), 1.2, {
            yPercent: 20
            , opacity: 0
            , ease: Back.easeOut.config(1)
        }, 0.2, 0);
        timeline.add(function () {
            deferred.resolve()
        });
        timeline.set($partnersLink, {
            opacity: 0
            , color: 'transparent'
            , immediateRender: !0
        }, 0);
        timeline.set($partnersLink, {
            clearProps: 'all'
        }, '-=0.3');
        timeline.call(function () {
            $partnersLink.addClass('intro')
        });
        timeline.call(function () {
            $partnersLink.removeClass('intro')
        }, null, null, '+=0.6');
        return {
            deferred: deferred.promise
            , timeline: timeline
        }
    }
    , getTimelineOut: function () {
        return transitionOut()
    }
});
FrontPage.init();

function frontPageInitEvents($container) {
    
    console.log('frontPageInitEvents');
    var scrollAnimator, isActive = !0;
    $container.find('.events-wrapper .event-title').each(function () {
        var $clone = $('<span class="clone"></span>').text($(this).text());  
        // console.log($clone , ' clone ');
        $clone.insertAfter($(this))
    });
    if (!$container.find('.events-wrapper').length) {
        return
    }
    scrollAnimator = new ExtraScrollAnimator({
        target: $container.find('.events-wrapper')
        , tween: new TimelineMax().staggerFrom($container.find('.events-wrapper .event-link'), 1, {
            y: 200
            , ease: Quad.easeOut
        }, 0.2)
        , speed: 0.6
        , min: 0
        , max: 0.1
        , minSize: 690
        , ease: Quad.easeOut
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

function frontPageInitJury($container) {
    var $wrapper = $container.find('.jury-list')
        , $items = $wrapper.find('.jury-item')
        , scrollAnimators = []
        , isActive = !0;
    $items.not('.fixed').shuffle();
    $items = $wrapper.find('.jury-item');
    $items.slice(4).remove();
    $items.each(function (index, item) {
        var tween = new TimelineMax()
            , $item = $(this)
            , $metas = $item.find('.jury-metas')
            , $image = $item.find('.jury-image')
            , $separator = $metas.find('.separator')
            , isEven = !(index % 2);
        tween.from($item, 3, {
            y: 120
            , ease: Quad.easeOut
        }, 0).from($metas, 3, {
            ease: Quad.easeIn
            , x: isEven ? 80 : -80
        }, 0.4).from($image, 1.5, {
            ease: Quad.easeOut
            , y: 120
        }, 0.3).from($separator, 1, {
            ease: Quad.easeIn
            , scaleX: 0
        }, 3);
        scrollAnimators.push(new ExtraScrollAnimator({
            target: $item
            , tween: tween
            , min: 0
            , max: 0.2
            , speed: 0.3
            , minSize: 690
            , ease: Quad.easeOut
        }))
    });

    console.log('frontPageInitJury_onload');
    function destroy() {
        if (!isActive || app.currentContainer === $container[0]) {
            return
        }
        isActive = !1;
        scrollAnimators.forEach(function (scrollAnimator) {
            scrollAnimator.destroy()
            console.log('frontPageInitJury_fail');
        })
    }
    Barba.Dispatcher.on("transitionCompleted", destroy)
}

function frontPageInitNews($container) {
    var $newsContainer = $container.find('.news-list-wrapper')
        , $news = $container.find('.news-content')
        , isActive = !0
        , scrollAnimator, timeline = new TimelineMax();
    if (!$news.length) {
        return
    }
    timeline.staggerFrom($news, 1, {
        y: 120
        , ease: Quad.easeOut
    }, 0.2);
    scrollAnimator = new ExtraScrollAnimator({
        target: $newsContainer
        , tween: timeline
        , min: 0
        , max: 0.2
        , speed: 0.3
        , minSize: 690
        , ease: Quad.easeOut
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

function frontPageInitSelection($container) {
    var $window = $(window)
        , $wrapper = $container.find('.selection-wrapper')
        , $slider = $wrapper.find(".selection-slider")
        , $sliderInner = $wrapper.find(".selection-slider-inner")
        , $items = $sliderInner.children()
        , $dragger = $wrapper.find('.dragger')
        , $handle = $dragger.find('.handle')
        , slider, sliderSnap = []
        , draggerSnap = []
        , viewableItems = 1
        , sliderWidth = 0
        , sliderInnerWidth = 0
        , itemWidth = 0
        , dragger, handleWidth = 40
        , tmpSliderX = 0
        , items = []
        , draggerWidth = 0
        , isActive = !0;
    if (!$items.length) {
        return
    }
    
    $.fn.randomize = function (selector) {
        var $elems = selector ? $(this).find(selector) : $(this).children();
        for (var i = $elems.length; i >= 0; i--) {
            $(this).append($elems[Math.random() * i | 0])
        }
        return this
    };  

    slider = Draggable.create($sliderInner, {
        type: 'x'
        , dragClickables: !0
        , bounds: $slider
        , throwProps: !0
        , onDrag: sliderUpdateHandler
        , onThrowUpdate: sliderUpdateHandler
    })[0];

    function sliderUpdateHandler() {
        tmpSliderX = this.x;
        updateEverything(-(this.x / (sliderInnerWidth - sliderWidth)), 'slider')
    }
    dragger = Draggable.create($handle, {
        type: 'x'
        , dragClickables: !0
        , bounds: $dragger
        , throwProps: !0
        , maxDuration: 3
        , onDrag: draggerUpdateHandler
        , onThrowUpdate: draggerUpdateHandler
    })[0];

    function draggerUpdateHandler() {
        updateEverything(this.x / (draggerWidth - handleWidth), 'dragger')
    }

    function updateEverything(percent, source) {
        if (source !== 'dragger') {
            var handleTargetX = (draggerWidth - handleWidth) * -percent;
            TweenMax.set($handle, {
                x: -handleTargetX
            })
        }
        if (source !== 'slider') {
            tmpSliderX = -(((sliderInnerWidth - (itemWidth * viewableItems))) * percent);
            TweenMax.set($sliderInner, {
                x: tmpSliderX
            })
        }
        updateItems()
    }

    function updateItems() {
        items.forEach(function (item, index) {
            if (-Math.floor(item.offset + itemWidth) >= Math.ceil(tmpSliderX) && !item.isLeft) {
                item.isLeft = !0;
                TweenMax.to(item.element, 0.3, {
                    x: -50
                    , ease: Strong.easeIn
                })
            }
            else if (-(item.offset + itemWidth) < tmpSliderX && item.isLeft) {
                item.isLeft = !1;
                TweenMax.to(item.element, 0.3, {
                    x: 0
                    , ease: Strong.easeOut
                })
            }
        })
    }

    function windowResizeHandler() {
        sliderWidth = $slider.width();
        sliderInnerWidth = $sliderInner.width();
        draggerWidth = $dragger.width();
        var wWidth = window.innerWidth;
        if (wWidth > 1800) {
            viewableItems = 4
        }
        else if (wWidth > 1280) {
            viewableItems = 3
        }
        else if (wWidth > 960) {
            viewableItems = 2
        }
        else if (wWidth > 690 && wWidth <= 960) {
            viewableItems = 1
        }
        else {
            viewableItems = 1
        }
        itemWidth = sliderWidth / viewableItems;
        TweenMax.set($items, {
            width: itemWidth
            , x: 0
        });
        TweenMax.set($sliderInner, {
            x: 0
        });
        TweenMax.set($handle, {
            x: 0
        });
        var sliderOffset = $slider.offset().left;
        items = [];
        $items.each(function () {
            items.push({
                element: $(this)
                , offset: $(this).offset().left - sliderOffset
                , isLeft: !1
                , isRight: !1
            })
        });
        sliderSnap = [];
        draggerSnap = [];
        var sliderRatio = ((draggerWidth - handleWidth) / (sliderInnerWidth - sliderWidth));
        $sliderInner.children('.movie').each(function (index, item) {
            var itemLeft = $(item).offset().left - sliderOffset;
            sliderSnap.push(-Math.min(itemLeft, sliderInnerWidth - sliderWidth));
            draggerSnap.push(Math.min(draggerWidth - handleWidth - 1, itemLeft * sliderRatio))
        });
        slider.vars.snap = sliderSnap;
        dragger.vars.snap = draggerSnap;
        tmpSliderX = slider.x
    }
    $window.on("extra:resize", windowResizeHandler);
    windowResizeHandler();
    var scrollAnimator = new ExtraScrollAnimator({
        target: $container.find('.selection-wrapper')
        , tween: new TimelineMax().staggerFrom($container.find('.selection-wrapper .movie').slice(0, viewableItems + 1).get().reverse(), 1, {
            y: 120
            , ease: Linear.easeNone
        }, 0.2)
        , speed: 0.6
        , min: 0
        , max: 0.2
        , minSize: 690
        , ease: Quad.easeOut
    });

    function destroy() {
        if (!isActive || app.currentContainer === $container[0]) {
            return
        }
        isActive = !1;
        $window.off("extra:resize", windowResizeHandler);
        scrollAnimator.destroy()
    }
    Barba.Dispatcher.on("transitionCompleted", destroy)
}

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

// $(document).ready(function () {
//     $('.button-top').on("click", function (event) {
//         event.preventDefault();
//         TweenMax.to(window, 3, {
//             scrollTo: 0
//             , autoKill: !1
//             , ease: Quad.easeInOut
//         })
//     })
// });
// $(window).on('beforeunload', function () {
//     $(window).scrollTop(0)
// });

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

function blockScroll(event) {    event.preventDefault();    event.stopPropagation();    return !1}

function extraBlockUI(element, event) {
    app.isTransitioning = !0;
    $('html').addClass('extra-transition-freeze').on("scroll touchmove mousewheel", blockScroll)
}

function extraReleaseUI(element, event) {
    app.isTransitioning = !1;
    $('html').removeClass('extra-transition-freeze').off("scroll touchmove mousewheel", blockScroll)
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