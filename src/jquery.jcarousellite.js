(function($) {                                          // Compliant with jquery.noConflict()
    $.jCarouselLite = {
        version: '1.1-alpha',
        curr: 0
    };

    $.fn.jCarouselLite = function(options) {

        options = $.extend({}, $.fn.jCarouselLite.options, options || {});

        return this.each(function() {   // Returns the element collection. Chainable.

            var running,
                animCss, sizeCss,
                div = $(this), ul, initialLi, li,
                liSize, ulSize, divSize,
                numVisible, initialItemLength, itemLength, calculatedTo;

            initVariables();                    // Set the above variables after initial calculations
            initStyles();                       // Set the appropriate styles for the carousel div, ul and li
            initSizes();                        // Set appropriate sizes for the carousel div, ul and li
            attachEventHandlers();              // Attach event handlers for carousel to respond

            function go(to) {
                if(!running) {

                    calculatedTo = to;

                    // Call the beforeStart() callback
                    if(options.beforeStart) {
                        options.beforeStart.call(this, visibleItems());
                    }

                    // If circular, and we are in first or last item, then goto the other end
                    if(options.circular) {
                        adjustPositionWhenOutOfBounds(to);
                    }

                    // If non-circular and to points to first or last, we just return.
                    else {
                        if(to < 0 || to > itemLength - numVisible) {
                            return false;
                        }
                    } // If neither overrides it, the curr will still be "to" and we can proceed.

                    animateToPosition();

                    // Disable buttons when the carousel reaches the last/first, and enable when not
                    if(!options.circular) {
                        disableButtonsIfNecessary();
                    }

                }
                return false;
            }

            function initVariables() {
                running = false;
                animCss = options.vertical ? "top" : "left";
                sizeCss = options.vertical ? "height" : "width";
                ul = $("ul", div);
                initialLi = $("li", ul);
                initialItemLength = initialLi.size();
                numVisible = options.visible;

                if(options.circular) {
                    var $lastItemSet = initialLi.slice(initialItemLength-numVisible).clone();
                    var $firstItemSet = initialLi.slice(0,numVisible).clone();

                    ul.prepend($lastItemSet)        // Prepend the lis with final items so that the user can click the back button to start with
                        .append($firstItemSet);     // Append the lis with first items so that the user can click the next button even after reaching the end

                    options.start += numVisible;    // Since we have a few artificial lis in the front, we will have to move the pointer to point to the real first item
                }

                li = $("li", ul);
                itemLength = li.size();
                calculatedTo = options.start;
            }

            function initStyles() {
                div.css("visibility", "visible");   // If the div was set to hidden in CSS, make it visible now

                li.css({
                    overflow: "hidden",
                    float: options.vertical ? "none" : "left"
                });

                ul.css({
                    margin: "0",
                    padding: "0",
                    position: "relative",
                    "list-style-type": "none",
                    "z-index": "1"
                });

                div.css({
                    overflow: "hidden",
                    position: "relative",
                    "z-index": "2",
                    left: "0px"
                });
            }

            function initSizes() {

                liSize = options.vertical ? height(li) : width(li);     // Full li size(incl margin)-Used for animation
                ulSize = liSize * itemLength;                           // size of full ul(total length, not just for the visible items)
                divSize = liSize * numVisible;                          // size of entire div(total length for just the visible items)

                li.css({
                    width: li.width(),
                    height: li.height()
                });

                ul.css(sizeCss, ulSize+"px")
                    .css(animCss, -(calculatedTo * liSize));

                div.css(sizeCss, divSize+"px");                     // Width of the DIV. length of visible images

            }

            function attachEventHandlers() {
                if(options.btnPrev) {
                    $(options.btnPrev).click(function() {
                        return go(calculatedTo - options.scroll);
                    });
                }

                if(options.btnNext) {
                    $(options.btnNext).click(function() {
                        return go(calculatedTo + options.scroll);
                    });
                }

                if(options.btnGo) {
                    $.each(options.btnGo, function(i, val) {
                        $(val).click(function() {
                            return go(options.circular ? options.visible + i : i);
                        });
                    });
                }

                if(options.mouseWheel && div.mousewheel) {
                    div.mousewheel(function(e, d) {
                        return d > 0 ?
                            go(calculatedTo - options.scroll) :
                            go(calculatedTo + options.scroll);
                    });
                }

                if(options.auto) {
                    setInterval(function() {
                        go(calculatedTo + options.scroll);
                    }, options.auto + options.speed);
                }
            }

            function visibleItems() {
                return li.slice(calculatedTo).slice(0,numVisible);
            }

            function adjustPositionWhenOutOfBounds(to) {

                console.log("To: " + to);
                var newPosition;

                // If first, then goto last
                if(to <= options.start - numVisible - 1) {
                    newPosition = to + initialItemLength + options.scroll;
                    ul.css(animCss, -(newPosition * liSize) + "px");
                    calculatedTo = newPosition - options.scroll;

                    console.log("Before - Positioned at: " + newPosition + " and Moving to: " + calculatedTo);
                }

                // If last, then goto first
                else if(to >= itemLength - numVisible + 1) {
                    newPosition = to - initialItemLength - options.scroll;
                    ul.css(animCss, -(newPosition * liSize) + "px");
                    calculatedTo = newPosition + options.scroll;

                    console.log("After - Positioned at: " + newPosition + " and Moving to: " + calculatedTo);
                }
            }

            function disableButtonsIfNecessary() {
                $(options.btnPrev + "," + options.btnNext).removeClass("disabled");
                $( (calculatedTo-options.scroll<0 && options.btnPrev)
                    ||
                    (calculatedTo+options.scroll > itemLength-numVisible && options.btnNext)
                    ||
                    []
                ).addClass("disabled");
            }

            function animateToPosition() {
                running = true;

                ul.animate(
                    animCss == "left" ?
                    { left: -(calculatedTo*liSize) } :
                    { top: -(calculatedTo*liSize) },

                    options.speed,
                    options.easing,

                    function() {
                        if(options.afterEnd) {
                            options.afterEnd.call(this, visibleItems());
                        }
                        running = false;
                    }
                );
            }
        });
    };

    function css(el, prop) {
        return parseInt($.css(el[0], prop)) || 0;
    }
    function width(el) {
        return  el[0].offsetWidth + css(el, 'marginLeft') + css(el, 'marginRight');
    }
    function height(el) {
        return el[0].offsetHeight + css(el, 'marginTop') + css(el, 'marginBottom');
    }

    $.fn.jCarouselLite.options = {
        btnPrev: null,              // CSS Selector for the previous button
        btnNext: null,              // CSS Selector for the next button
        btnGo: null,                // CSS Selector for the go button
        mouseWheel: false,          // Set "true" if you want the carousel scrolled using mouse wheel
        auto: null,                 // Set to a numeric value (800) in millis. Time period between auto scrolls

        speed: 200,                 // Set to a numeric value in millis. Speed of scroll
        easing: null,               // Set to easing (bounceout) to specify the animation easing

        vertical: false,            // Set to "true" to make the carousel scroll vertically
        circular: true,             // Set to "true" to make it an infinite carousel
        visible: 3,                 // Set to a numeric value to specify the number of visible elements at a time
        start: 0,                   // Set to a numeric value to specify which item to start from
        scroll: 1,                  // Set to a numeric value to specify how many items to scroll for one scroll event

        beforeStart: null,          // Set to a function to receive a callback before every scroll start
        afterEnd: null              // Set to a function to receive a callback after every scroll end
    };

})(jQuery);