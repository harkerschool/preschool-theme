(function($) {

    $(document).ready( function() {

        // initialize scope variables
        var $sections = $('.layout_63 #contentdiv section'),
            didScroll = false,
            $pagenav = $('.pagenav'),
            $pagenavParent = $pagenav.parent(),
            pagenavHeight = $pagenav.outerHeight();

        // initialize fitVids.js 
        $('#mainmiddle').fitVids(
            { customSelector: "iframe[src^='https://maps.google.com'], iframe[src^='http://maps.google.com'], iframe[src^='http://www.google.com/maps'], iframe[src^='https://www.google.com/maps']" }
        );

        // initialize FlexSlider.js
        $('.flexslider').flexslider({
            animation: "slide"
        });

        // add pagenav dropdown
        addPageNavDropdown();

        // recalculate pagenav height
        pagenavHeight = $pagenav.outerHeight();

        // add fixed pagenav behavior
        fixPageNav();

        // add "Show more" links
        addShowMoreLinks();

        // add back-to-top links
        $sections.append('<a href="#top" class="back-to-top">Back to top</a>');

        // track links
        $(document).on('click', '.flexslider .cta', function(e) {
            e.preventDefault();
            trackOutboundEvent( this, 'Preschool Slideshow Links', 'Click' );
        });
        $(document).on('click', '.primary-menu a', function(e) {
            e.preventDefault();
            trackOutboundEvent( this, 'Preschool Primary Menu Links', 'Click' );
        });

        function addSearchDropdown() {

            $('.search-menu-item a').click( function() {
                
                var $this = $(this),
                    $dropdown = $this.siblings('.awesome-search-form, form');

                if ( $this.hasClass('active') ) {
                    $this.removeClass('active');
                    $dropdown.addClass('hide');
                }
                else {
                    $this.addClass('active');
                    $dropdown.removeClass('hide');
                }

                return false;

            });
        }

        function addPageNavDropdown() {

            if ( ! $('.pagenav-select-container').length ) {

                // create the dropdown base
                $("<div class='pagenav-select-container'><select></select></div>").appendTo( $pagenav );

                // create default option "Go to..."
                $("<option />", {
                    "selected": "selected",
                    "value"   : "",
                    "text"    : "Go to..."
                }).appendTo("select", $pagenav);

                // populate dropdown with menu items
                $("a", $pagenav).each(function() {
                    var el = $(this);
                    $("<option />", {
                        "value"   : el.attr("href"),
                        "text"    : el.text()
                    }).appendTo("select", $pagenav);
                });

            }

            // add dropdown behavior
            $("select", $pagenav).change( function() {
                var id = $(this).find("option:selected").val();
                
                scrollToSection(id);
            });

            // add regular menu behavior
            $("a", $pagenav).click( function() {
                var id = $(this).attr('href');
                
                scrollToSection(id);

                return false;
            });
        }

        function addShowMoreLinks() {

            var $hiddenElements = $(),
                id = getQueryVariable('section'); // get id of section in url

            // hide everything except header and excerpt
            $sections.each( function() {

                var $section = $(this),
                    $children = $section.children();

                if( $children.is('.excerpt') ) {
                    $hiddenElements = $section.children().not('header, .excerpt').add( $hiddenElements );
                    $section.append('<a href="#" class="show more cta">Show more</a>');
                }

            });

            $hiddenElements.addClass('hide');

            setTimeout( function() {
                if ( id ) {
                    scrollToSection('#' + id);
                }
            }, 250);

            // add show more behavior
            $sections.on( 'click', '.show.more', function() {

                var $this = $(this),
                    $siblings = $this.siblings();

                $hiddenElements.filter( $siblings ).removeClass('hide');
                $this.removeClass('more').addClass('less').text('Show less');

                return false;
            });

            // add show less behavior
            $sections.on( 'click', '.show.less', function() {

                var $this = $(this),
                    $siblings = $this.siblings(),
                    $page = $('body, html'),
                    pastWindowOffsetTop = $this.offset().top - $(window).scrollTop(), // offset relative to window
                    headerOffsetTop = $this.parent().offset().top;

                $hiddenElements.filter( $siblings ).addClass('hide');
                $this.removeClass('less').addClass('more').text('Show more');

                // scroll
                var presentOffsetTop = $this.offset().top;
                $page.scrollTop( presentOffsetTop - pastWindowOffsetTop ); // make it so the button appears to not move
                $page.animate({ scrollTop: headerOffsetTop - pagenavHeight }); // scroll to top of header

                return false;
            
            });
        }

        function fixPageNav() {

            var $pagenavContainer = $('.pagenav-element'),
                $pagenav = $('.pagenav', $pagenavContainer),
                $window = $(window),
                hasScrolled = false;

            if ( ! $pagenav.length ) {
                return;
            }

            $window.scroll( function() {
                hasScrolled = true;
            });

            setInterval( function() {
                if ( ! hasScrolled ) {
                    return;
                }

                if ( $window.scrollTop() <= $pagenavContainer.offset().top ) {
                    $pagenav.removeClass('fixed');
                    $pagenavParent.height( 'auto' );
                } else {
                    $pagenavParent.height( pagenavHeight );
                    $pagenav.addClass('fixed');
                }

                hasScrolled = false;

            }, 250);

        }

        function scrollMultsiteMap() {

            var mapHeight = $('.multisite-map').outerHeight(),
                isOpen = false,
                $overlay = $('<div class="awesome-bar-overlay" />').prependTo('#bodydiv');

            $('.home-menu-item-link').click( function() {
                if ( isOpen ) {
                    $('.dropdown').css('bottom', 0).removeClass('active');
                    $overlay.removeClass('active');
                    isOpen = false;
                }
                else {
                    $('.dropdown').css('bottom', -1 * mapHeight).addClass('active');
                    $overlay.addClass('active');
                    isOpen = true;
                }

                return false;

            });

        }

        function disable() {
            return false;
        }

        function getQueryVariable(variable) {
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                if (pair[0] == variable) {
                    return pair[1];
                }
            }
            return (false);
        }

        function scrollToSection( id ) {
            var location = $(id).offset().top - pagenavHeight;
            $(window).scrollTop( location );
        }

    });

    $(window).load( function() {
        // set height of right banner
        var contentHeight = $('#contentdiv').height(),
            sidebarHeight = $('#rightbanner').height();

        if ( sidebarHeight <= contentHeight ) {
            $('#rightbanner').height( contentHeight );
        } else {
            $('#contentdiv').height( sidebarHeight );
        }
        
    });
   
})(jQuery);
