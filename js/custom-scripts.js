function responsiveMenu() {
    $('html, .menu-wrapper').unbind();
    $('.menu-wrapper').removeClass('hovered').children('.menu').attr('style', '');
    if ($(window).width() > 1024) {
        //MENU DESKTOP
        $('.menu-wrapper').each(function () {
            var menu = $(this).children('.menu');
            var showMenu;
            var hideMenu;
            $(this).hover(function () {
                clearTimeout(hideMenu);
                showMenu = setTimeout(function () {
                    menu.parent().addClass('hovered');
                    menu.show();
                    menu.animate({
                        top: 38,
                        opacity: 1
                    }, 300);
                }, 150);
            },
            function () {
                clearTimeout(showMenu);
                hideMenu = setTimeout(function () {
                    menu.animate({
                        opacity: 0
                    }, 50);
                    menu.css('top', '64px');
                    menu.hide();
                    menu.parent().removeClass('hovered');
                }, 250);
            });
        });
    }
    else if ($(window).width() < 1025) {
        //MENU TOUCH DEVICES
        function hideMenuClick() {
            menu.parent().removeClass('hovered');
            menu.animate({
                opacity: 0
            }, 100,
            function () {
                menu.hide();
            });
        }
        function showMenuClick() {
            menu.parent().addClass('hovered');
            menu.show();
            menu.animate({
                opacity: 1
            }, 200);
        }
        $('html').click(function () {
            hideMenuClick($('.menu'));
        });
        $('.menu-wrapper, .menu').click(function (e) {
            e.stopPropagation();
        });
        var menu;
        $('.menu-wrapper').each(function () {
            menu = $(this).children('.menu');
            $(this).click(function () {
                if ($(this).hasClass('hovered')) {
                    hideMenuClick(menu);
                }
                else {
                    showMenuClick(menu);
                }
            });
        });
    }
}

function waitForCustomfonts(fonts, callback) {
    var loadedFonts = 0;
    for (var i = 0, l = fonts.length; i < l; ++i) {
        (function (font) {
            var node = document.createElement('span');
            // Characters that vary significantly among different fonts
            node.innerHTML = 'giItT1WQy@!-/#';
            // Visible - so we can measure it - but not on the screen
            node.style.position = 'absolute';
            node.style.left = '-10000px';
            node.style.top = '-10000px';
            // Large font size makes even subtle changes obvious
            node.style.fontSize = '300px';
            // Reset any font properties
            node.style.fontFamily = 'sans-serif';
            node.style.fontVariant = 'normal';
            node.style.fontStyle = 'normal';
            node.style.fontWeight = 'normal';
            node.style.letterSpacing = '0';
            document.body.appendChild(node);

            // Remember width with no applied web font
            var width = node.offsetWidth;

            node.style.fontFamily = font;

            var interval;
            function checkFont() {
                // Compare current width with original width
                if (node && node.offsetWidth != width) {
                    ++loadedFonts;
                    node.parentNode.removeChild(node);
                    node = null;
                }

                // If all fonts have been loaded
                if (loadedFonts >= fonts.length) {
                    if (interval) {
                        clearInterval(interval);
                    }
                    if (loadedFonts == fonts.length) {
                        callback();
                        return true;
                    }
                }
            };

            if (!checkFont()) {
                interval = setInterval(checkFont, 50);
            }
        })(fonts[i]);
    }
};

$(document).ready(function () {

    waitForCustomfonts(['OpenSans'], function () {
        setTimeout(function(){
            $('html').css({ visibility: 'visible' });
        }, 200);
    });

    responsiveMenu();
    
    if ($('html').hasClass('ie8')) {
        $('.menu ul li:first').prepend('<div class="before"></div>');
    }

    $('.menu-wrapper li.active a, a[href="#"]').click(function (e) {
        e.preventDefault();
    });

    //CODE
    $('.code').each(function () {
        var code = $(this).html();
        $(this).text(code);
        $(this).text($(this).text().replace('&lt;', '<'));
        $(this).text($(this).text().replace('&gt;', '>'));
        if ($(this).hasClass('div-opening')) {
            $(this).text($(this).text().replace('</div>', ''));
        }
        else if ($(this).hasClass('div-closing')) {
            $(this).text($(this).text().replace('<div>', ''));
        }
        else if ($(this).has(":contains('img')")) {
            $(this).text($(this).text().replace('>', ' />'));
        }
    });

    $(window).resize(function () {
        responsiveMenu();

        //HASLAYOUT IE7 BUG FIX
        if ($('html').hasClass('ie8')) {
            $('div').css('zoom', '1');
        }
    });
});