var extraPreloader = {
    init: function () {
        TweenMax.set(window, {
            scrollTo: 0
        });
        $('html').addClass('extra-transition-freeze');
        Promise.all([this.firstAnimation(), app.currentView.readyState()]).then(function () {
            var timeline = new TimelineMax()
                , $preloader = $("#preloader")
                , transitionInParams = app.currentView.getTimelineIn();
            Promise.all([transitionInParams.deffered]).then(function () {
                app.preloaded = !0;
                $(window).trigger("extra:preloader:complete")
            });
            timeline.set(window, {
                scrollTo: 0
            });
            timeline.add(transitionOut());
            timeline.call(function () {
                $preloader.remove()
            });
            timeline.add(transitionInParams.timeline, '+=0.2');
            timeline.add(function () {
                extraReleaseUI()
            })
        })
    }
    , firstAnimation: function () {
        var deffered = Barba.Utils.deferred()
            , timeline = new TimelineMax({
                paused: !0
            })
            , $preloader = $("#preloader")
            , $sidebar = $('#sidebar')
            , $logo = $sidebar.find('.site-title')
            , $menuSwitcher = $("#menu-switcher")
            , $menu = $("#menu-wrapper");
        timeline.set(window, {
            scrollTo: 0
        });
        timeline.set($preloader, {
            zIndex: 90
        });
        timeline.staggerFrom(shuffleArray($logo.find("g > *").get()), 0.6, {
            cycle: {
                yPercent: function (index) {
                    return ((index % 2) ? -110 : 110)
                }
            }
            , clearProps: 'transform'
        }, 0.05);
        if (window.innerWidth <= 690) {
            timeline.set($menu, {
                height: 0
                , immediateRender: !0
            }, 0)
        }
        timeline.from([$menuSwitcher, $menu], 0.3, {
            width: 0
            , clearProps: 'all'
        });
        timeline.call(function () {
            deffered.resolve()
        });
        timeline.staggerFrom($sidebar.find('.social-link'), 0.6, {
            scale: 0
            , clearProps: 'all'
        }, 0.1);
        timeline.staggerFrom($menuSwitcher.find('.line'), 0.3, {
            width: 0
            , clearProps: 'all'
        }, 0.1);
        timeline.from($menu.find('.toggle-button'), 0.3, {
            scale: 0
            , rotation: -90
            , clearProps: 'all'
        }, '-=0.2');
        timeline.call(function () {
            $('#languages-switcher').removeClass('preloader')
        });
        timeline.call(function () {
            $('.ticketing').removeClass('preloader')
        }, null, null, '+=1');
        timeline.play();
        return deffered.promise
    }
}