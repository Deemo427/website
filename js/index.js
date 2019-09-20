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
//        $('#menubar_hamburger').on('click', function(){
//            $('#gnb').slideToggle();
//        });
    $(window).on('resize', function () {
//        var w = $(window).width();
//            if(w>=600 && $('#gnb').is(':hidden')){
//                $('#gnb').removeAttr('style');
//            }
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
//    section-title-wrapper
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
