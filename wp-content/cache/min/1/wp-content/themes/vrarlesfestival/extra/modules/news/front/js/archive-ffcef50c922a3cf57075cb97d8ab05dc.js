var NewsArchive = ExtraView.extend({
  namespace: 'news-archive',
  extraOnEnter: function($container) {
    var _this = this;
    initHeaderTitle($container);
    newsInitClouds($container);
    initSectionTitle($container);
    initNewsScroll($container);
    this.imagesLoaded = !0;
    $window.trigger('extra:responsiveImage:init', [$container]);
  },
  getTimelineIn: function() {
    var deferred = Barba.Utils.deferred(),
      $container = $(this.container),
      timeline = new TimelineMax();
    timeline.add(function() {
      transitionIn($container);
    });
    timeline.staggerFrom(
      $container.find('.header .cloud'),
      1.2,
      { yPercent: 20, opacity: 0, ease: Back.easeOut.config(1) },
      0.2,
      0,
    );
    timeline.call(function() {
      deferred.resolve();
    });
    return { deferred: deferred.promise, timeline: timeline };
  },
  getTimelineOut: function() {
    return transitionOut();
  },
});
NewsArchive.init();
function newsInitClouds($container) {
  var $window = $(window),
    scrollTop = 0,
    $clouds = $container.find('.header .cloud'),
    $wrapper = $container.find('.header-wrapper'),
    wWidth = 0,
    wHeight = 0,
    material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      shading: THREE.FlatShading,
    }),
    renderers = [],
    clouds = [],
    fov = 30,
    isActive = !0;
  $clouds.each(function(index, item) {
    var $container = $(this),
      url = $container.data('url'),
      renderer,
      scene,
      camera,
      cloud,
      loader = new THREE.OBJLoader(),
      blur = $container.data('blur'),
      y = $container.data('y'),
      z = $container.data('z'),
      rotate = parseFloat($container.data('rotate')),
      minX = $container.data('min-x'),
      maxX = $container.data('max-x'),
      randX = (Math.random() / 100) * ((30 + z) / 30),
      randY = (Math.random() / 100) * ((30 + z) / 30),
      randXMult = ((0.5 - Math.random()) / 100) * ((30 + z) / 30),
      randYMult = ((0.5 - Math.random()) / 100) * ((30 + z) / 30);
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(fov, wWidth / wHeight);
    camera.position.z = 30;
    renderer = new THREE.WebGLRenderer({
      resolution: 1,
      alpha: !0,
      antialias: !0,
    });
    renderer.setSize(wWidth, wHeight);
    renderer.setPixelRatio(1);
    $container.append(renderer.domElement);
    renderers.push({ renderer: renderer, camera: camera });
    var light = new THREE.HemisphereLight(0xffffff, 0x69a070, 1);
    light.position.set(5, 5, 2);
    scene.add(light);
    var pointLight;
    if (index === 0) {
      pointLight = new THREE.PointLight(0x63b06d, 1.4, 6);
      pointLight.position.set(3, -4, 10);
    } else if (index === 1) {
      pointLight = new THREE.PointLight(0x63b06d, 1.4, 20);
      pointLight.position.set(6, 10, 20);
    } else {
      pointLight = new THREE.PointLight(0x63b06d, 0.5, 8);
      pointLight.position.set(1, 6, -8);
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
      cloud.rotateZ(5 * THREE.Math.DEG2RAD);
      var scale = Math.min(1, 0.5 + wWidth / 2000);
      cloud.scale.set(scale, scale, scale);
      renderer.clear();
      render();
    }
    function render() {
      if (!isActive) {
        return;
      }
      randX += randXMult / 10;
      randY += randYMult / 10;
      cloud.position.setX(
        3 * Math.sin(randX) + ((scrollTop / wHeight) * (maxX - minX) + minX),
      );
      cloud.position.setY(y + Math.sin(randY));
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }
    loader.load(url, function(object) {
      cloud = object;
      clouds.push(cloud);
      init();
    });
  });
  function resizeHandler(event) {
    wWidth = $wrapper.outerWidth();
    wHeight = $wrapper.outerHeight();
    renderers.forEach(function(renderer) {
      renderer.renderer.setSize(wWidth, wHeight);
      renderer.camera.aspect = wWidth / wHeight;
      renderer.camera.updateProjectionMatrix();
    });
    var scale = Math.min(1, 0.5 + wWidth / 2000);
    clouds.forEach(function(cloud) {
      cloud.scale.set(scale, scale, scale);
    });
  }
  function scrollHandler() {
    scrollTop = $window.scrollTop();
  }
  $window.on('extra:resize', resizeHandler);
  $window.on('scroll', scrollHandler);
  function destroy() {
    if (!isActive || app.currentContainer === $container[0]) {
      return;
    }
    isActive = !1;
    clouds.forEach(function(cloud) {
      cloud.parent.remove(cloud);
      cloud = null;
    });
    clouds = null;
    renderers.forEach(function(renderer) {
      renderer.renderer = null;
      renderer.camera = null;
      renderer = null;
    });
    renderers = null;
    $window.off('extra:resize', resizeHandler);
    $window.off('scroll', scrollHandler);
  }
  Barba.Dispatcher.on('transitionCompleted', destroy);
}
function initNewsScroll($container) {
  var isActive = !0,
    $newsContainer = $container.find('.news-list-wrapper'),
    $news = $container.find('.news-content'),
    timeline = new TimelineMax(),
    scrollAnimator;
  timeline.staggerFrom($news, 1, { y: 100, ease: Linear.easeNone }, 0.5);
  scrollAnimator = new ExtraScrollAnimator({
    target: $newsContainer,
    tween: timeline,
    min: 0,
    max: 0,
    speed: 0,
    minSize: 690,
    ease: Linear.easeNone,
  });
  function destroy() {
    if (!isActive || app.currentContainer === $container[0]) {
      return;
    }
    isActive = !1;
    scrollAnimator.destroy();
  }
  Barba.Dispatcher.on('transitionCompleted', destroy);
}
