$(document).ready(function () {
    //login event
    document.getElementById('login').addEventListener('click', function(){document.querySelector('.login').style.display='block';});
    document.querySelector('.close').addEventListener('click', function(){document.querySelector('.login').style.display='none';});
   
    //menubar_hamburger_line_effect
    var $hambtn = $('#menubar_hamburger');
    var $hammenu = $('.btn_menu');
    $hammenu.click(function () {
        $hambtn.toggleClass('open');
    });
    //    $('#menubar_hamburger').on('click', function(){
    //        $('#gnb').slideToggle();
    //    });
    $(window).on('resize', function () {
        var w = $(window).width();
        //    if(w>=600 && $('#gnb').is(':hidden')){
        //        $('#gnb').removeAttr('style');
        //    }
        //   
    });
    $hammenu.on('click', function () {
        $hammenu.toggleClass('active');
        var is_active = $(this).hasClass('active');
        if (is_active) {
            $('#gnb').stop().animate({
                left: '-20px'
            }, 500, 'easeOutBack');
        }
        else {
            $('#gnb').stop().animate({
                left: '-220px'
            }, 500, 'easeInBack');
        }
    });
    
    //youtube event
    $("[data-media]").on("click", function(e) {
                e.preventDefault();
                var $this = $(this);
                var videoUrl = $this.attr("data-media");
                var popup = $this.attr("href");
                var $popupIframe = $(popup).find("iframe");
    
                $popupIframe.attr("src", videoUrl);
    
                $this.closest(".thumbnailHunting__body").addClass("show-popup");
    });

    $(".popup").on("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            $(".thumbnailHunting__body").removeClass("show-popup");});

        $(".popup > iframe").on("click", function(e) {e.stopPropagation();});
    
    //diamond grid
    $(".diamond-grid").diamonds({size : 200, gap : 5, hideIncompleteRow : false, // default: false / autoRedraw : true / default: true / itemSelector : ".item"
	});

    //submenu
    var $depth1 = $('#gnb>li');
    $depth1.on('mouseenter', function () {
        $(this).children('ul').stop(true, true).slideDown(500);
        $(this).addClass('on').siblings().removeClass('on');
    });
    $depth1.on('mouseleave', function () {
        $(this).children('ul').stop(true, true).slideUp(500);
        $depth1.removeClass('on');
    });
    
    //Season Effect
    $("section").on("mousemove", function (e) {
        var posX = e.pageX;
        var posY = e.pageY;
        $(".ss_w1_v").css({
            "right": 20 - (posX / 30)
            , "bottom": -120 - (posY / 30)
        });
        $(".ss_w2_v").css({
            "right": 0 + (posX / 20)
            , "bottom": -180 + (posY / 20)
        });
        $(".ss_w1").css({
            "right": 20 - (posX / 30)
            , "bottom": -120 - (posY / 30)
        });
        $(".ss_w2").css({
            "right": 0 + (posX / 20)
            , "bottom": -180 + (posY / 20)
        });
        $(".ss_sp1").css({
            "right": 20 - (posX / 30)
            , "bottom": -120 - (posY / 30)
        });
        $(".ss_sp2").css({
            "right": 0 + (posX / 20)
            , "bottom": -180 + (posY / 20)
        });
        $(".ss_sm1").css({
            "right": 20 - (posX / 30)
            , "bottom": -120 - (posY / 30)
        });
        $(".ss_sm2").css({
            "right": 0 + (posX / 20)
            , "bottom": -180 + (posY / 20)
        });
        $(".ss_st1").css({
            "right": 20 - (posX / 30)
            , "bottom": -120 - (posY / 30)
        });
        $(".ss_st2").css({
            "right": 0 + (posX / 20)
            , "bottom": -180 + (posY / 20)
        });
        $(".ss_w1").css({
            "right": 20 - (posX / 30)
            , "bottom": -120 - (posY / 30)
        });
        $(".ss_w2").css({
            "right": 0 + (posX / 20)
            , "bottom": -180 + (posY / 20)
        });
    });
    //swiper slide
    var swiper = new Swiper('.swiper-container', {
        effect: 'coverflow'
        , grabCursor: true
        , centeredSlides: true
        , slidesPerView: 'auto'
        , coverflowEffect: {
            rotate: 50
            , stretch: 0
            , depth: 100
            , modifier: 1
            , slideShadows: true
            , }
        , pagination: {
            el: '.swiper-pagination'
            , }
        , });
    //slider interval
    var $imgs = $('.swiper-slide'),
        $navi = $('.navi>a'),
        $prev = $('.btn_prev'),
        $next = $('.btn_next'),
        pages = $imgs.length,
        interval = 3000,
        fade = 500,
        i = 0, 
        timer;

    function startTimer(){
        timer = setInterval(function(){

            i = (i+1) % pages;
            next();
            navigation();

        }, interval);
    }
    
    function stopTimer(){
        clearInterval(timer);
    }
    
        function next(){
        
        var is_visible = $imgs.last().is(':visible');
        
        if(is_visible){
            $('.swiper-slide:visible').fadeOut(fade);
            i = $imgs.first().fadeIn(fade).index();
           
        } else{
            i = $('.swiper-slide:visible').fadeOut(fade).next('li').fadeIn(fade).index(); 
        }
    }
    
    function prev(){
        var is_visible = $imgs.first().is(':visible');
        
        if(is_visible){
            $('.imgs>li:visible').fadeOut(fade);
            i = $imgs.last().fadeIn(fade).index();
        } else{
            i = $('.imgs>li:visible').fadeOut(fade).prev('li').fadeIn(fade).index();
        }
    }
    
    
    $next.on('click', function(){
        next();    
        navigation();
    });
    

    $prev.on('click', function(){
        prev();
        navigation();
       
    });
    
    //main
    function festivalInitJury($container) {
    var $window = $(window)
        , $wrapper = $container.find('.jury-wrapper')
        , $slider = $wrapper.find(".jury-slider")
        , $sliderInner = $wrapper.find(".jury-slider-inner")
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
        , draggerWidth = 0
        , isActive = !0;
    $items.not('.fixed').shuffle();
    $items = $sliderInner.children();
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
    }

    function windowResizeHandler() {
        var wWidth = window.innerWidth
            , tmpSliderX = slider.x
            , tmpDraggerX = dragger.x;
        TweenMax.set($sliderInner, {
            x: 0
        });
        TweenMax.set($handle, {
            x: 0
        });
        sliderWidth = $slider.width();
        sliderInnerWidth = $sliderInner.width();
        draggerWidth = $dragger.width();
        if (wWidth > 1800) {
            viewableItems = 5
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
        });
        var sliderOffset = $slider.offset().left;
        sliderSnap = [];
        draggerSnap = [];
        var sliderRatio = ((draggerWidth - handleWidth) / (sliderInnerWidth - sliderWidth));
        $sliderInner.children().each(function (index, item) {
            var itemLeft = $(item).offset().left - sliderOffset;
            sliderSnap.push(-Math.min(itemLeft, sliderInnerWidth - sliderWidth));
            draggerSnap.push(Math.min(draggerWidth - handleWidth - 1, itemLeft * sliderRatio))
        });
        slider.vars.snap = sliderSnap;
        dragger.vars.snap = draggerSnap;
        tmpSliderX = 0;
        TweenMax.set($sliderInner, {
            x: tmpSliderX
        });
        TweenMax.set($handle, {
            x: tmpDraggerX
        });
        slider.update();
        dragger.update()
    }
    $window.on("extra:resize", windowResizeHandler);
    windowResizeHandler();

    function destroy() {
        if (!isActive || app.currentContainer === $container[0]) {
            return
        }
        isActive = !1;
        $window.off("extra:resize", windowResizeHandler)
    }
    Barba.Dispatcher.on("transitionCompleted", destroy)
}
});

$(window).on('scroll', function () {
    var scroll = $(window).scrollTop();
    var pos1 = $('#con4').offset().top - 500;
    var pos3 = $('#con6').offset().top - 300;
    var $wpimg=$('.article__list__item');
//    console.log(pos1); //position log
    if (scroll >= pos1) {
        $wpimg.addClass('on');
    }
    else {
        $wpimg.removeClass('on');
    }
    
    
    if (scroll >= pos3) {
        $('#con6').addClass('on');
    }
    else {
        $('#con6').removeClass('on');
    }
    if (scroll >= pos3) {
        
        $('.scroll-top').addClass('on');
    }
    else {
        $('.scroll-top').removeClass('on');
    }
});

//Counttime
window.onload = function () {
    countDownToTime("Sep 6, 2020 15:00:00", 'countdown1'); // ****** Change this line!
}

function countDownToTime(countTo, id) {
    countTo = new Date(countTo).getTime();
    var now = new Date()
        , countTo = new Date(countTo)
        , timeDifference = (countTo - now);
    var secondsInADay = 60 * 60 * 1000 * 24
        , secondsInAHour = 60 * 60 * 1000;
    days = Math.floor(timeDifference / (secondsInADay) * 1);
    hours = Math.floor((timeDifference % (secondsInADay)) / (secondsInAHour) * 1);
    mins = Math.floor(((timeDifference % (secondsInADay)) % (secondsInAHour)) / (60 * 1000) * 1);
    secs = Math.floor((((timeDifference % (secondsInADay)) % (secondsInAHour)) % (60 * 1000)) / 1000 * 1);
    var idEl = document.getElementById(id);
    idEl.getElementsByClassName('days')[0].innerHTML = days;
    idEl.getElementsByClassName('hours')[0].innerHTML = hours;
    idEl.getElementsByClassName('minutes')[0].innerHTML = mins;
    idEl.getElementsByClassName('seconds')[0].innerHTML = secs;
    clearTimeout(countDownToTime.interval);
    countDownToTime.interval = setTimeout(function () {
        countDownToTime(countTo, id);
    }, 1000);
}

var FrontPage = ExtraView.extend({
    namespace: 'front-page'
    , extraOnEnter: function ($container) {
        var _this = this;
//추후 추가예정(분석딜레이)
//        initHeaderTitle($container);
        frontPageInitSelection($container);
        frontPageInitEvents($container);
        initSectionTitle($container);
        frontPageInitNews($container);
        this.imagesLoaded = !0;
        $window.trigger("extra:responsiveImage:init", [$container])
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
    var scrollAnimator, isActive = !0;
    $container.find('.events-wrapper .event-title').each(function () {
        var $clone = $('<span class="clone"></span>').text($(this).text());
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
    $items.slice(3).remove();
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

    function destroy() {
        if (!isActive || app.currentContainer === $container[0]) {
            return
        }
        isActive = !1;
        scrollAnimators.forEach(function (scrollAnimator) {
            scrollAnimator.destroy()
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
    $items.parent().randomize();
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
