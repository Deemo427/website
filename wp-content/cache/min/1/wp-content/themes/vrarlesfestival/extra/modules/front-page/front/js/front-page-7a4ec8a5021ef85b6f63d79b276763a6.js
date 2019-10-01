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
//        $window.trigger("extra:responsiveImage:init", [$container])
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

function frontPageInitClouds($container) {
    var $window = $(window)
        , scrollTop = 0
        , $clouds = $container.find('.header .cloud')
        , $wrapper = $container.find('.header-wrapper')
        , wWidth = 0
        , wHeight = 0
        , material = new THREE.MeshPhongMaterial({
            color: 0xffffff
            , shading: THREE.FlatShading
        })
        , renderers = []
        , clouds = []
        , fov = 30
        , isActive = !0;
    $clouds.each(function (index, item) {
        var $container = $(this)
            , url = $container.data("url")
            , renderer, scene, camera, cloud, loader = new THREE.OBJLoader()
            , blur = $container.data("blur")
            , y = $container.data("y")
            , z = $container.data("z")
            , rotate = parseFloat($container.data("rotate"))
            , minX = $container.data("min-x")
            , maxX = $container.data("max-x")
            , randX = (Math.random() / 100) * ((30 + z) / 30)
            , randY = (Math.random() / 100) * ((30 + z) / 30)
            , randXMult = ((0.5 - Math.random()) / 100) * ((30 + z) / 30)
            , randYMult = ((0.5 - Math.random()) / 100) * ((30 + z) / 30);
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(fov, wWidth / wHeight);
        camera.position.z = 30;
        renderer = new THREE.WebGLRenderer({
            resolution: window.devicePixelRatio
            , alpha: !0
            , antialias: !0
        });
        renderer.setSize(wWidth, wHeight);
        $container.append(renderer.domElement);
        renderers.push({
            renderer: renderer
            , camera: camera
        });
        var light = new THREE.HemisphereLight(0xFFFFFF, 0x69a070, 1);
        light.position.set(5, 5, 2);
        scene.add(light);
        var pointLight;
        if (index === 0) {
            pointLight = new THREE.PointLight(0x63b06d, 1.4, 6);
            pointLight.position.set(3, -4, 10)
        }
        else if (index === 1) {
            pointLight = new THREE.PointLight(0x63b06d, 1.4, 20);
            pointLight.position.set(6, 10, 20)
        }
        else {
            pointLight = new THREE.PointLight(0x63b06d, 0.5, 8);
            pointLight.position.set(1, 6, -8)
        }
        pointLight.castShadow = !1;
        scene.add(pointLight);

        function init() {
            scene.add(cloud);
            cloud.material = material;
            cloud.castShadow = !1;
            cloud.receiveShadow = !1;
            cloud.position.set(minX, y, z);
            cloud.rotateY((rotate + 90) * THREE.Math.DEG2RAD);
            cloud.rotateZ((5) * THREE.Math.DEG2RAD);
            var scale = Math.min(1, 0.5 + wWidth / 2000);
            cloud.scale.set(scale, scale, scale);
            renderer.clear();
            render()
        }

        function render() {
            if (!isActive) {
                return
            }
            randX += randXMult / 10;
            randY += randYMult / 10;
            cloud.position.setX((3 * Math.sin(randX)) + (((scrollTop / wHeight) * (maxX - minX)) + minX));
            cloud.position.setY(y + Math.sin(randY));
            renderer.render(scene, camera);
            requestAnimationFrame(render)
        }
        loader.load(url, function (object) {
            cloud = object;
            clouds.push(cloud);
            init()
        })
    });

    function resizeHandler(event) {
        wWidth = $wrapper.outerWidth();
        wHeight = $wrapper.outerHeight();
        renderers.forEach(function (renderer) {
            renderer.renderer.setSize(wWidth, wHeight);
            renderer.camera.aspect = wWidth / wHeight;
            renderer.camera.updateProjectionMatrix()
        });
        var scale = Math.min(1, 0.5 + wWidth / 2000);
        clouds.forEach(function (cloud) {
            cloud.scale.set(scale, scale, scale)
        });
        scrollHandler()
    }

    function scrollHandler() {
        scrollTop = $window.scrollTop()
    }
    $window.on("extra:resize", resizeHandler);
    $window.on("scroll", scrollHandler);

    function destroy() {
        if (!isActive || app.currentContainer === $container[0]) {
            return
        }
        isActive = !1;
        clouds.forEach(function (cloud) {
            cloud.parent.remove(cloud);
            cloud = null
        });
        clouds = null;
        renderers.forEach(function (renderer) {
            renderer.renderer = null;
            renderer.camera = null;
            renderer = null
        });
        renderers = null;
        $window.off("extra:resize", resizeHandler);
        $window.off("scroll", scrollHandler)
    }
    Barba.Dispatcher.on("transitionCompleted", destroy)
}

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