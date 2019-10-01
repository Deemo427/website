var SelectionArchive = ExtraView.extend({
    namespace: 'selection-archive'
    , extraOnEnter: function ($container) {
        var _this = this;
        initHeaderTitle($container);
        selectionInitClouds($container);
        selectionInitSlider($container);
        initSectionTitle($container);
        this.imagesLoaded = !0;
        $window.trigger("extra:responsiveImage:init", [$container])
    }
    , getTimelineIn: function () {
        var deferred = Barba.Utils.deferred()
            , $container = $(this.container)
            , timeline = new TimelineMax();
        timeline.add(function () {
            transitionIn($container)
        });
        timeline.staggerFrom($container.find('.header .cloud'), 1.2, {
            yPercent: 20
            , opacity: 0
            , ease: Back.easeOut.config(1)
        }, 0.2, 0);
        timeline.call(function () {
            deferred.resolve()
        });
        return {
            deferred: deferred.promise
            , timeline: timeline
        }
    }
    , getTimelineOut: function () {
        return transitionOut()
    }
});
SelectionArchive.init();

function selectionInitClouds($container) {
    var isActive = !0
        , allowUpdate = !0
        , $window = $(window)
        , scrollTop = 0
        , lastScroll = 0
        , $cloud = $container.find('.header .cloud')
        , $wrapper = $container.find('.header-wrapper')
        , wWidth = 0
        , wHeight = 0
        , material = new THREE.MeshPhongMaterial({
            transparent: !0
            , opacity: 0.98
            , color: 0xffffff
            , shading: THREE.FlatShading
        })
        , fov = 30
        , url = $cloud.data("url")
        , renderer, scene, camera, cloud, loader = new THREE.OBJLoader();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(fov, wWidth / wHeight);
    camera.position.z = 30;
    renderer = new THREE.WebGLRenderer({
        resolution: 1
        , alpha: !0
        , antialias: !0
    });
    renderer.setSize(wWidth, wHeight);
    renderer.setPixelRatio(1);
    $cloud.append(renderer.domElement);
    var light = new THREE.HemisphereLight(0xFFFFFF, 0x69a070, 1);
    light.position.set(5, 5, 2);
    scene.add(light);
    var pointLight = new THREE.PointLight(0x63b06d, 1.4, 8);
    pointLight.position.set(3, 4, 3);
    pointLight.castShadow = !1;
    scene.add(pointLight);

    function init() {
        scene.add(cloud);
        cloud.material = material;
        cloud.castShadow = !1;
        cloud.receiveShadow = !1;
        renderer.clear();
        render()
    }

    function render() {
        if (!isActive) {
            return
        }
        requestAnimationFrame(render);
        if (!allowUpdate) {
            return
        }
        var percent = ((((lastScroll - scrollTop) / wHeight)) * 5);
        cloud.rotateY(Math.sin(percent));
        renderer.render(scene, camera);
        lastScroll = scrollTop
    }
    loader.load(url, function (object) {
        object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                var scale = 1.8;
                child.scale.set(scale, scale, scale);
                child.material = material
            }
        });
        cloud = object;
        init()
    });

    function scrollHandler() {
        scrollTop = $window.scrollTop();
        allowUpdate = !0
    }
    $window.on("scroll", scrollHandler);

    function resizeHandler(event) {
        if (cloud) {
            cloud.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    var scale = window.innerWidth / 1920 + 1;
                    child.scale.set(scale, scale, scale);
                    child.material = material
                }
            })
        }
        wWidth = $wrapper.outerWidth();
        wHeight = $wrapper.outerHeight();
        renderer.setSize(wWidth, wHeight);
        camera.aspect = wWidth / wHeight;
        camera.updateProjectionMatrix()
    }
    $window.on("extra:resize", resizeHandler);
    resizeHandler();

    function destroy() {
        if (!isActive || app.currentContainer === $container[0]) {
            return
        }
        isActive = !1;
        cloud.parent.remove(cloud);
        cloud = null;
        scene = null;
        renderer = null;
        camera = null;
        $window.off("extra:resize", resizeHandler);
        $window.off("scroll", scrollHandler)
    }
    Barba.Dispatcher.on("transitionCompleted", destroy)
}

function selectionInitSlider($container) {
    var isActive = !0
        , isDragging = !1
        , $window = $(window)
        , windowHeight = 0
        , $wrapper = $container.find('.selection-wrapper')
        , ghostOffsetTop = 0
        , ghostScreenTween, ghostScrollAnimator, $ghost = $wrapper.find('.slider-ghost')
        , $ghostInner = $ghost.find('.slider-ghost-inner')
        , slider, viewableItems = 1
        , sliderWidth = 0
        , sliderInnerWidth = 0
        , sliderInnerHeight = 0
        , sliderSnap = [0]
        , itemWidth = 0
        , tmpSliderX = 0
        , $slider = $wrapper.find(".selection-slider")
        , $sliderInner = $wrapper.find(".selection-slider-inner")
        , $items = $sliderInner.children()
        , dragger, handleWidth = 40
        , draggerWidth = 0
        , draggerSnap = [0]
        , $dragger = $wrapper.find('.dragger')
        , $handle = $dragger.find('.handle')
        , $backgroundTitle = $wrapper.find('.background-title-slider')
        , $backgroundTitleInner = $backgroundTitle.find('.background-title-slider-inner')
        , backgroundWidth = 0
        , backgroundInnerWidth = 0
        , coords = null
        , lastPercent = 0
        , isInside = !1
        , empty = {
            progress: 0
        }
        , maxVelocity = 800
        , maxSkew = 5
        , catOffsets = []
        , currentSelectedIndex = -1
        , $subMenu = $container.find('.submenu')
        , $subMenuLinks = $subMenu.find('a');
    slider = Draggable.create($sliderInner, {
        type: 'x'
        , dragClickables: !0
        , bounds: $slider
        , throwProps: !0
        , maxDuration: 1
        , minimumMovement: 0
        , lockAxis: !1
        , onDragStart: function () {
            ghostScrollAnimator.pause();
            isDragging = !0;
            app.isAnimating = !0
        }
        , onDrag: sliderUpdateHandler
        , onThrowUpdate: sliderUpdateHandler
        , onThrowComplete: function () {
            isDragging = !1;
            app.isAnimating = !1;
            TweenMax.to($sliderInner, 0.3, {
                skewX: 0
            });
            updateScroll();
            ghostScrollAnimator.resume()
        }
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
        , maxDuration: 1
        , minimumMovement: 0
        , lockAxis: !1
        , onDragStart: function () {
            ghostScrollAnimator.pause();
            isDragging = !0;
            app.isAnimating = !0
        }
        , onDrag: draggerUpdateHandler
        , onThrowUpdate: draggerUpdateHandler
        , onThrowComplete: function () {
            isDragging = !1;
            app.isAnimating = !1;
            TweenMax.to($sliderInner, 0.3, {
                skewX: 0
            });
            updateScroll();
            ghostScrollAnimator.resume()
        }
    })[0];

    function draggerUpdateHandler() {
        updateEverything(this.x / (draggerWidth - handleWidth), 'dragger')
    }

    function updateEverything(percent, source) {
        if (!percent || percent < 0 || percent > 1 || !coords) {
            return
        }
        TweenMax.set($backgroundTitleInner, {
            x: -(percent * (backgroundInnerWidth - backgroundWidth))
        });
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
        var scrollTop = $window.scrollTop()
            , selectedIndex = $subMenuLinks.length - 1
            , finded = !1;
        catOffsets.slice().reverse().forEach(function (position, index) {
            if (scrollTop - coords.min < position - 90 && !finded) {
                selectedIndex--
            }
        });
        selectedIndex = Math.max(0, selectedIndex);
        if (currentSelectedIndex !== selectedIndex) {
            currentSelectedIndex = selectedIndex;
            $subMenuLinks.removeClass("active").eq(selectedIndex).addClass("active")
        }
        lastPercent = percent;
        if (source !== 'scroll') {
            var velocity = ThrowPropsPlugin.getVelocity(slider.target, "x");
            velocity = Math.max(-maxVelocity, velocity);
            velocity = Math.min(maxVelocity, velocity);
            var percentVelocity = -(velocity / maxVelocity);
            TweenMax.to($sliderInner, 0.1, {
                skewX: (maxSkew * percentVelocity) + 'deg'
            })
        }
    }

    function updateScroll() {
        var targetScroll = ((coords.max - coords.min) * lastPercent) + coords.min;
        if (isInside) {
            TweenMax.set(window, {
                scrollTo: targetScroll
            })
        }
        else {
            ghostScrollAnimator.pause();
            if ($window.scrollTop() < ghostOffsetTop) {
                TweenMax.to(window, 0.3, {
                    scrollTo: coords.min
                    , onComplete: function () {
                        ghostScrollAnimator.resume()
                    }
                });
                TweenMax.set(window, {
                    scrollTo: targetScroll
                    , delay: 0.4
                    , onComplete: function () {}
                })
            }
            else {
                TweenMax.to(window, 0.3, {
                    scrollTo: coords.max
                    , onComplete: function () {
                        ghostScrollAnimator.resume()
                    }
                });
                TweenMax.set(window, {
                    scrollTo: targetScroll
                    , delay: 0.4
                    , onComplete: function () {}
                })
            }
        }
    }

    function windowResizeHandler(event, wWidth, wHeight) {
        TweenMax.set($sliderInner, {
            x: 0
        });
        TweenMax.set($handle, {
            x: 0
        });
        windowHeight = wHeight;
        sliderWidth = $slider.width();
        sliderInnerWidth = $sliderInner.width();
        sliderInnerHeight = $sliderInner.height();
        draggerWidth = $dragger.width();
        ghostOffsetTop = $ghost.offset().top;
        $wrapper.find('.slider-ghost-inner').css('paddingTop', (wHeight / 2) - ($slider.innerHeight() / 2));
        backgroundWidth = $backgroundTitle.width();
        backgroundInnerWidth = $backgroundTitleInner.width();
        itemWidth = $items.first().width();
        viewableItems = sliderWidth / itemWidth;
        if ($window.scrollTop() > ghostOffsetTop) {
            TweenMax.set(window, {
                scrollTo: ghostOffsetTop
            })
        }
        var sliderOffset = $slider.offset().left;
        sliderSnap = [];
        draggerSnap = [];
        var sliderRatio = ((draggerWidth - handleWidth) / (sliderInnerWidth - sliderWidth));
        $sliderInner.children('.movie').each(function (index, item) {
            var itemLeft = $(item).offset().left - sliderOffset;
            sliderSnap.push(-Math.min(itemLeft, sliderInnerWidth - sliderWidth));
            draggerSnap.push(Math.min(draggerWidth - handleWidth - 1, itemLeft * sliderRatio))
        });
        catOffsets = [];
        $sliderInner.children('.section-title-wrapper').each(function (index, item) {
            var itemLeft = $(item).offset().left - sliderOffset + 90;
            catOffsets.push(itemLeft)
        });
        slider.vars.snap = sliderSnap;
        dragger.vars.snap = draggerSnap;
        $ghost.height(sliderInnerWidth);
        ghostScreenTween = TweenMax.fromTo(empty, 10, {
            progress: 0
        }, {
            progress: 1
            , ease: Linear.easeNone
            , onUpdate: function () {
                updateEverything(empty.progress, 'scroll')
            }
        });
        ghostScrollAnimator.updateTween(ghostScreenTween);
        tmpSliderX = slider.x
    }

    function udpateScrollDimensions(_coords) {
        coords = _coords
    }
    $ghostInner.extraSticky({
        keepChildWidth: !0
    });
    ghostScreenTween = TweenMax.fromTo(empty, 10, {
        progress: 0
    }, {
        progress: 1
    });
    ghostScrollAnimator = new ExtraScrollAnimator({
        target: $ghost
        , ease: Linear.easeNone
        , defaultProgress: 0
        , tween: ghostScreenTween
        , speed: 0
        , min: 1
        , max: 0
        , onUpdate: udpateScrollDimensions
        , onInside: function () {
            isInside = !0;
            $container.removeClass('outside')
        }
        , onOutside: function () {
            isInside = !1;
            $container.addClass('outside')
        }
        , onMin: function () {
            TweenMax.to($sliderInner, 0.3, {
                x: 0
                , onComplete: function () {
                    slider.update()
                }
            });
            TweenMax.to($handle, 0.3, {
                x: 0
                , onComplete: function () {
                    dragger.update()
                }
            })
        }
        , onMax: function () {
            TweenMax.to($sliderInner, 0.3, {
                x: -(sliderInnerWidth - sliderWidth)
                , onComplete: function () {
                    slider.update()
                }
            });
            TweenMax.to($handle, 0.3, {
                x: draggerWidth - handleWidth
                , onComplete: function () {
                    dragger.update()
                }
            })
        }
    });
    $window.on("extra:resize", windowResizeHandler);
    $subMenuLinks.each(function () {
        var $link = $(this)
            , index = $link.index();
        $link.on("click", function (event) {
            event.preventDefault();
            var percent = -(-catOffsets[index] / (sliderInnerWidth - sliderWidth))
                , scroll = ((coords.max - coords.min) * percent) + coords.min;
            TweenMax.to(window, 1, {
                scrollTo: scroll
            })
        })
    });

    function destroy() {
        if (!isActive || app.currentContainer === $container[0]) {
            return
        }
        isActive = !1;
        $window.off("extra:resize", windowResizeHandler)
    }
    Barba.Dispatcher.on("transitionCompleted", destroy)
}