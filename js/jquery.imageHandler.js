/*
 * jQuery imageHandler v1.0
 * Licensed under the MIT license: http://opensource.org/licenses/MIT
 * Developed by Ramy Al Reedy
 */
var css3;

if (document.createElement("detect").style.backgroundSize === "") {
    css3 = true;
}
else {
    css3 = false;
}

(function ($) {
    $.fn.imageHandler = function (options) {
        var settings = $.extend({
            mode: 'fill-top',
            loader: null,
            dummy: null,
            rtl: false,
            lazy: false,
            distance: 200,
            fade: 1000,
            retina: false,
            retina_suffix: '@2x',
            before: function () { },
            afterEach: function () { },
            afterAll: function () { },
            onError: function () { }
        }, options);
        settings.before.call(this);
        var counter = $(this).length;
        function imagesLoaded() {
            counter = counter - 1;
            if (counter == 0) {
                settings.afterAll.call(this);
            }
        }
        return this.each(function () {
            var img = $(this);
            var imgClass = img.attr('class');
            var dataSrc = img.attr('data-src');
            var dataRetina = img.attr('data-retina');
            var wrapper;
            var imgWidth;
            var imgHeight;
            var imgRatio;
            var wrapperWidth;
            var wrapperHeight;
            var wrapperRatio;
            var wrapperPos;
            var winHeight = $(window).height();

            img = img.not('.handler-loading, .handler-loaded, .handler-error');

            img.css({
                position: 'absolute',
                display: 'block',
                visibility: 'hidden',
                opacity: 0,
                border: 'none',
                transition: 'none',
                zIndex: 1
            });
            img.removeClass();
            img.wrap('<div class="' + imgClass + ' handler-loading" style="padding:0;overflow:hidden;-webkit-backface-visibility:hidden;backface-visibility:hidden;"></div>');
            
            if (settings.loader != null) {
                img.after('<img src="' + settings.loader + '" class="handler-loader" style="position:absolute;top:50%;border:0;z-index:2;visibility:hidden;" />');
                img.next('.handler-loader').one('load', function () {
                    var loaderWidth = $(this).width();
                    var loaderHeight = $(this).height();
                    if (settings.rtl == true) {
                        $(this).css({
                            width: loaderWidth,
                            height: loaderHeight,
                            right: '50%',
                            marginTop: -loaderHeight / 2,
                            marginRight: -loaderWidth / 2,
                            visibility: 'visible'
                        });
                    }
                    else {
                        $(this).css({
                            width: loaderWidth,
                            height: loaderHeight,
                            left: '50%',
                            marginTop: -loaderHeight / 2,
                            marginLeft: -loaderWidth / 2,
                            visibility: 'visible'
                        });
                    }
                }).each(function () {
                    if (this.complete) $(this).load();
                });
            }
            img = $(this);
            wrapper = img.parent();
            wrapperPos = wrapper.offset().top;
            if (!(wrapper.css('position') == 'absolute' || wrapper.css('position') == 'fixed')) {
                wrapper.css('position', 'relative');
            }
            function fullWidthTop() {
                if (settings.rtl == true) {
                    img.css({
                        width: '100%',
                        height: 'auto',
                        right: '0',
                        top: '0',
                        left: 'auto',
                        visibility: 'visible',
                        //RESET OTHER STYLES
                        marginTop: '',
                        marginLeft: '',
                        marginRight: ''
                    });
                }
                else {
                    img.css({
                        width: '100%',
                        height: 'auto',
                        top: '0',
                        left: '0',
                        right: 'auto',
                        visibility: 'visible',
                        //RESET OTHER STYLES
                        marginTop: '',
                        marginLeft: '',
                        marginRight: ''
                    });
                }
            }
            function fullWidthCenter() {
                img.css({
                    width: '100%',
                    height: 'auto'
                });
                imgHeight = img.height();
                imgRatio = imgWidth / imgHeight;
                if (settings.rtl == true) {
                    img.css({
                        top: '50%',
                        right: '0',
                        left: 'auto',
                        marginTop: -imgHeight / 2,
                        visibility: 'visible',
                        //RESET OTHER STYLES
                        marginLeft: '',
                        marginRight: ''
                    });
                }
                else {
                    img.css({
                        top: '50%',
                        left: '0',
                        right: 'auto',
                        marginTop: -imgHeight / 2,
                        visibility: 'visible',
                        //RESET OTHER STYLES
                        marginLeft: '',
                        marginRight: ''
                    });
                }
            }
            function fullWidthBottom() {
                img.css({
                    width: '100%',
                    height: 'auto'
                });
                imgHeight = img.height();
                imgRatio = imgWidth / imgHeight;
                if (settings.rtl == true) {
                    img.css({
                        bottom: '0',
                        right: '0',
                        left: 'auto',
                        visibility: 'visible',
                        //RESET OTHER STYLES
                        top: 'auto',
                        marginLeft: '',
                        marginRight: ''
                    });
                }
                else {
                    img.css({
                        bottom: '0',
                        left: '0',
                        right: 'auto',
                        visibility: 'visible',
                        //RESET OTHER STYLES
                        top: 'auto',
                        marginLeft: '',
                        marginRight: ''
                    });
                }
            }
            function fullHeight() {
                img.css({
                    width: 'auto',
                    height: '100%'
                });
                imgWidth = img.width();
                if (settings.rtl == true) {
                    img.css({
                        right: '50%',
                        marginRight: -imgWidth / 2,
                        visibility: 'visible',
                        //RESET OTHER STYLES
                        left: 'auto',
                        marginLeft: '',
                        top: 'auto',
                        marginTop: ''
                    });
                }
                else {
                    img.css({
                        left: '50%',
                        marginLeft: -imgWidth / 2,
                        visibility: 'visible',
                        //RESET OTHER STYLES
                        right: 'auto',
                        marginRight: '',
                        top: 'auto',
                        marginTop: ''
                    });
                }
            }
            function fillTop() {
                if (imgRatio < wrapperRatio) {
                    fullWidthTop();
                }
                else if (imgRatio > wrapperRatio) {
                    fullHeight();
                }
                else if (imgRatio == wrapperRatio) {
                    fullHeight();
                }
            }
            function fillMiddle() {
                if (imgRatio < wrapperRatio) {
                    fullWidthCenter();
                }
                else if (imgRatio > wrapperRatio) {
                    fullHeight();
                }
                else if (imgRatio == wrapperRatio) {
                    fullHeight();
                }
            }
            function fillBottom() {
                if (imgRatio < wrapperRatio) {
                    fullWidthBottom();
                }
                else if (imgRatio > wrapperRatio) {
                    fullHeight();
                }
                else if (imgRatio == wrapperRatio) {
                    fullHeight();
                }
            }
            function fit() {
                if (imgRatio < wrapperRatio) {
                    fullHeight();
                }
                else if (imgRatio > wrapperRatio) {
                    fullWidthCenter();
                }
                else if (imgRatio == wrapperRatio) {
                    fullWidthTop();
                }
            }
            function imgError() {

                wrapper.addClass('handler-error');

                img.css('width', '100%');
                img.css('height', '100%');
                img.css('visibility', 'visible');
                img.next('.handler-loader').hide().remove();
                img.css('opacity', '');

                //DUMMY IMAGE
                if (settings.dummy != null) {
                    if (img.siblings('.handler-dummy').length == 0) {
                        img.after('<img src="' + settings.dummy + '" class="handler-dummy" style="position:absolute;top:50%;border:0;z-index:2;visibility:hidden;" />');
                        img.next('.handler-dummy').one('load', function () {
                            var loaderWidth = $(this).width();
                            var loaderHeight = $(this).height();
                            if (settings.rtl == true) {
                                $(this).css({
                                    width: loaderWidth,
                                    height: loaderHeight,
                                    right: '50%',
                                    marginTop: -loaderHeight / 2,
                                    marginRight: -loaderWidth / 2,
                                    visibility: 'visible'
                                });
                            }
                            else {
                                $(this).css({
                                    width: loaderWidth,
                                    height: loaderHeight,
                                    left: '50%',
                                    marginTop: -loaderHeight / 2,
                                    marginLeft: -loaderWidth / 2,
                                    visibility: 'visible'
                                });
                            }
                        }).each(function () {
                            if (this.complete) $(this).load();
                        });
                        img.hide();
                    }
                }

                var itemError = wrapper;

                settings.onError.call(this, itemError);

                img.unbind();
            }
            function showImage(func) {

                img = img.filter(function () {
                    return img.parent('.handler-error').length === 0;
                });

                img.one('load', function () {                    

                    imgWidth = img.width();
                    imgHeight = img.height();
                    imgRatio = imgWidth / imgHeight;
                    wrapperWidth = wrapper.width();
                    wrapperHeight = wrapper.height();
                    wrapperRatio = wrapperWidth / wrapperHeight;
                    func();
                    img.next('.handler-loader').hide().remove();

                    if (!wrapper.hasClass('handler-loaded')) {
                        img.animate({
                            opacity: 1
                        }, settings.fade, function () {
                            img.css('opacity', '');
                        });
                    }

                    imagesLoaded();

                    wrapper.removeClass('handler-loading').addClass('handler-loaded');

                    var itemLoaded = wrapper;

                    settings.afterEach.call(this, itemLoaded);
                }).each(function () {
                    if (this.complete) $(this).load();
                });
                img.error(function () {
                    imagesLoaded();
                    imgError();
                    wrapper.removeClass('handler-loading');
                });
            }
            function fillTopBackground() {
                wrapper.css({
                    backgroundSize: 'cover',
                    backgroundPosition: 'top center'
                });
            }
            function fillMiddleBackground() {
                wrapper.css({
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center'
                });
            }
            function fillBottomBackground() {
                wrapper.css({
                    backgroundSize: 'cover',
                    backgroundPosition: 'bottom center'
                });
            }
            function fitBackground() {
                wrapper.css({
                    backgroundSize: 'contain',
                    backgroundPosition: 'center center'
                });
            }
            
            function showBackgroundImage(func) {
                var imgSrc = img.attr('src');
                wrapper.not('.handler-loaded').css({
                    opacity: 1,
                    transition: 'none',
                    backgroundRepeat: 'no-repeat'
                });

                img = img.filter(function () {
                    return img.parent('.handler-error').length === 0;
                });

                img.one('load', function () {
                    img.hide();
                    func();
                    img.next('.handler-loader').hide().remove();

                    wrapper.not('.handler-loaded').css({
                        opacity: 0,
                        backgroundImage: 'url("' + imgSrc + '")'
                    });

                    wrapper.not('.handler-loaded').animate({
                        opacity: 1
                    }, settings.fade, function () {
                        wrapper.css({
                            opacity: '',
                            transition: ''
                        });
                    });
                    
                    imagesLoaded();

                    wrapper.removeClass('handler-loading').addClass('handler-loaded');

                    var itemLoaded = wrapper;
                    
                    settings.afterEach.call(this, itemLoaded);
                }).each(function () {
                    if (this.complete) $(this).load();
                });
                img.error(function () {
                    imagesLoaded();
                    imgError();
                    wrapper.removeClass('handler-loading').css({ opacity: 1 });
                });
            }
            function checkMode() {
                if (img.attr('data-mode') == undefined) {
                    if (settings.mode == 'fill-top') {
                        if (css3 == true) {
                            showBackgroundImage(fillTopBackground);
                        }
                        else {
                            showImage(fillTop);
                        }
                    }
                    else if (settings.mode == 'fill-middle') {
                        if (css3 == true) {
                            showBackgroundImage(fillMiddleBackground);
                        }
                        else {
                            showImage(fillMiddle);
                        }
                    }
                    else if (settings.mode == 'fill-bottom') {
                        if (css3 == true) {
                            showBackgroundImage(fillBottomBackground);
                        }
                        else {
                            showImage(fillBottom);
                        }
                    }
                    else if (settings.mode == 'fit') {
                        if (css3 == true) {
                            showBackgroundImage(fitBackground);
                        }
                        else {
                            showImage(fit);
                        }
                    }
                }
                else {
                    if (img.attr('data-mode') == 'fill-top') {
                        if (css3 == true) {
                            showBackgroundImage(fillTopBackground);
                        }
                        else {
                            showImage(fillTop);
                        }
                    }
                    else if (img.attr('data-mode') == 'fill-middle') {
                        if (css3 == true) {
                            showBackgroundImage(fillMiddleBackground);
                        }
                        else {
                            showImage(fillMiddle);
                        }
                    }
                    else if (img.attr('data-mode') == 'fill-bottom') {
                        if (css3 == true) {
                            showBackgroundImage(fillBottomBackground);
                        }
                        else {
                            showImage(fillBottom);
                        }
                    }
                    else if (img.attr('data-mode') == 'fit') {
                        if (css3 == true) {
                            showBackgroundImage(fitBackground);
                        }
                        else {
                            showImage(fit);
                        }
                    }
                }
            }
            function checkRetinaLazy() {
                if (settings.retina == true) {
                    if (isHighDensity()) {
                        if (settings.lazy == true) {
                            applyRetinaLazy();
                        }
                        else {
                            applyRetina();
                        }
                    }
                    else if (isRetina()) {
                        if (settings.lazy == true) {
                            applyRetinaLazy();
                        }
                        else {
                            applyRetina();
                        }
                    }
                    else {
                        if (settings.lazy == true) {
                            applyLazy();
                        }
                        else {
                            applySrc();
                        }
                    }
                }
                else {
                    if (settings.lazy == true) {
                        applyLazy();
                    }
                    else {
                        applySrc();
                    }
                }
            }
            function applySrc() {
                img.attr('src', dataSrc);
                img.removeAttr('data-src');
                checkMode();
            }
            function retina() {
                var imageType = dataSrc.substr(-4);
                var imageName = dataSrc.substr(0, dataSrc.length - 4);
                imageName += settings.retina_suffix + imageType;
                img.attr('src', imageName);
                img.removeAttr('data-src');
                checkMode();
                img.error(function () {
                    img.css('opacity', '0');

                    wrapper.removeClass('handler-error');

                    applySrc();
                    checkMode();
                });
            }
            function retinaAttr() {
                img.attr('src', dataRetina);
                img.removeAttr('data-src');
                img.removeAttr('data-retina');
                checkMode();
                img.error(function () {
                    img.css('opacity', '0');

                    wrapper.removeClass('handler-error');

                    applySrc();
                    checkMode();
                });
            }
            function isHighDensity() {
                return ((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 124dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)').matches)) || (window.devicePixelRatio && window.devicePixelRatio > 1.3));
            }
            function isRetina() {
                return ((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx), only screen and (min-resolution: 75.6dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min--moz-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2)').matches)) || (window.devicePixelRatio && window.devicePixelRatio > 2)) && /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
            }
            function applyRetina() {
                if (dataRetina != undefined) {
                    retinaAttr();
                }
                else {
                    retina();
                }
            }
            function applyRetinaLazy() {
                if ($(window).scrollTop() > wrapperPos - winHeight - settings.distance) {
                    applyRetina();
                }
                $(window).resize(function () {
                    winHeight = $(window).height();
                });
                $(window).scroll(function () {
                    if ($(window).scrollTop() > wrapperPos - winHeight - settings.distance && img.attr('src') == undefined) {
                        applyRetina();
                    }
                });
            }
            function applyLazy() {
                if ($(window).scrollTop() > wrapperPos - winHeight - settings.distance) {
                    applySrc();
                }
                $(window).resize(function () {
                    winHeight = $(window).height();
                });
                $(window).scroll(function () {
                    if ($(window).scrollTop() > wrapperPos - winHeight - settings.distance && img.attr('src') == undefined) {
                        applySrc();
                    }
                });
            }
            if (dataSrc != undefined) {
                checkRetinaLazy();
            }
            else {
                checkMode();
            }
            function updateNonhandled() {
                wrapperPos = wrapper.offset().top;
                winHeight = $(window).height();
                if (dataSrc != undefined && wrapper.hasClass('handler-loading')) {
                    checkRetinaLazy();
                }
                else {
                    checkMode();
                }
            }
            function rehandle() {
                if (css3 != false) {
                    var transition = wrapper.css('transition-duration');
                    if (transition != undefined) {
                        if (transition == '0s') {
                            wrapper.css({ transition: 'inherit' });
                            transition = wrapper.css('transition-duration');
                            transition = transition.match(/[0-9]+/g);
                            var time = Math.max.apply(Math, transition);
                            if (time > 0) {
                                time = time * 100;
                                setTimeout(function () {
                                    updateNonhandled();
                                }, time + 50);
                            }
                            else {
                                updateNonhandled();
                            }
                            wrapper.css({ transition: '' });
                        }
                        else {
                            transition = transition.match(/[0-9]+/g);
                            var time = Math.max.apply(Math, transition);
                            if (time > 0) {
                                time = time * 100;
                                setTimeout(function () {
                                    updateNonhandled();
                                }, time + 50);
                            }
                            else {
                                updateNonhandled();
                            }
                        }
                    }
                }
                else {
                    updateNonhandled();
                }
            }
            $(window).resize(function () {
                rehandle();
            });
            img.on('reHandle', function () {
                rehandle();
            });
        });
    };
}(jQuery));