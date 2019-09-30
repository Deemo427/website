$(document).ready(function () {
  
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