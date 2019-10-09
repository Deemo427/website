$(document).ready(function($) {
  var totalResponsivesImages = 0,
    currentResponsiveImagesLoaded = 0,
    $initialImages = $(document.body)
      .find('.extra-responsive-image-wrapper')
      .not('.extra-responsive-custom-loading');
  function init($container) {
    var isLazy = $container.hasClass('.extra-responsive-image-lazy'),
      isCustom = $container.hasClass('.extra-responsive-image-custom-loading'),
      $placeholderImage = $container.find(
        '.extra-responsive-image-placeholder',
      ),
      $placeholderCanvas = $container.find(
        '.extra-responsive-image-placeholder-canvas',
      );
    if (
      $placeholderImage.length > 0 &&
      $placeholderCanvas.length > 0 &&
      typeof stackBlurImage === 'function'
    ) {
      stackBlurImage($placeholderImage[0], $placeholderCanvas[0], 20);
    }
    if (isLazy && !isCustom) {
      startFollowScroll(null, $container);
    } else if (!isLazy) {
      $window.on('extra:resize:responsive', function() {
        load($container);
      });
      load($container);
    }
  }
  function load($imageWrapper) {
    var datas = $imageWrapper.find('noscript'),
      altTxt = datas.data('alt'),
      itemProp = datas.data('img-itemprop'),
      size = extra.getImageVersion();
    if ($imageWrapper.data('size') == size) {
      return;
    }
    $imageWrapper.data('size', size);
    var imgSrc = datas.data('src-' + size);
    if (!imgSrc || imgSrc == '') {
      currentResponsiveImagesLoaded++;
      $imageWrapper.trigger('extra:responsiveImage:error', [
        currentResponsiveImagesLoaded,
        totalResponsivesImages,
      ]);
      checkCompleteState($imageWrapper);
      return;
    }
    var imgElement = $('<img />');
    imgElement
      .on('error', function() {
        currentResponsiveImagesLoaded++;
        $imageWrapper.trigger('extra:responsiveImage:load', [
          currentResponsiveImagesLoaded,
          totalResponsivesImages,
        ]);
        checkCompleteState($imageWrapper);
      })
      .on('load', function() {
        imgElement.attr({ width: this.width, height: this.height });
        if (itemProp) {
          imgElement.attr('itemprop', itemProp);
        }
        if ($imageWrapper.hasClass('extra-responsive-image-background')) {
          $imageWrapper.css('background-image', "url('" + imgSrc + "')");
        } else if ($imageWrapper.hasClass('extra-responsive-image-svg')) {
          $imageWrapper
            .find('>svg')
            .find('image')
            .attr({ 'xlink:href': imgSrc });
        } else {
          $imageWrapper.append(imgElement);
          $imageWrapper
            .find('img')
            .not(imgElement)
            .remove();
        }
        setTimeout(function() {
          $imageWrapper
            .find('.extra-responsive-image-placeholder-canvas')
            .remove();
        }, 500);
        currentResponsiveImagesLoaded++;
        $imageWrapper.addClass('extra-responsive-image-loaded');
        $imageWrapper.trigger('extra:responsiveImage:load', [
          currentResponsiveImagesLoaded,
          totalResponsivesImages,
        ]);
        checkCompleteState($imageWrapper);
      })
      .attr({ alt: altTxt, src: imgSrc });
  }
  function startFollowScroll(event, $container) {
    var $image = $container.hasClass('extra-responsive-image-wrapper')
      ? $container
      : $container.find('.extra-responsive-image-wrapper');
    if (!$image.length) {
      console.warn('Nothing to follow');
      return !1;
    }
    $container.fracs(function(fracs, previousFracs) {
      if (fracs.visible > 0) {
        $image.each(function() {
          load($(this));
        });
        $container.fracs('unbind');
      }
    });
    $container.fracs('check');
  }
  $window.on('extra:responsiveImage:startFollowScroll', startFollowScroll);
  function checkCompleteState($imageWrapper) {
    if (currentResponsiveImagesLoaded === totalResponsivesImages) {
      $imageWrapper.trigger('extra:responsiveImage:complete', [
        currentResponsiveImagesLoaded,
        totalResponsivesImages,
      ]);
    }
  }
  $window.on('extra:responsiveImage:init', function(event, $container) {
    if (!$container || !$container.length) {
      console.warn('Nothing to init');
      return !1;
    }
    $container.each(function() {
      var $elem = $(this),
        $images = $elem.hasClass('extra-responsive-image-wrapper')
          ? $elem
          : $elem.find('.extra-responsive-image-wrapper');
      if (!$images.length) {
        $elem.trigger('extra:responsiveImage:error');
        console.warn('No responsive images to process');
      }
      totalResponsivesImages += $images.length;
      $images.each(function(index, element) {
        var $image = $(element);
        $image.data('size', '');
        init($image);
      });
    });
  });
  if ($initialImages.length) {
    totalResponsivesImages = $initialImages.length;
    $initialImages.each(function() {
      init($(this));
    });
  }
});
