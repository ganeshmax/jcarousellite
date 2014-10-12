(function($) {                                          // Compliant with jquery.noConflict()
    $.jCarouselLite = {
        version: '1.2.0-alpha'
    };

    $.fn.jCarouselLite = function(options) {

        options = $.extend({}, $.fn.jCarouselLite.options, options || {});

        return this.each(function() {   // Returns the element collection. Chainable.

            var running,
                animCss, sizeCss,
                div = $(this), ul, initialLi, li,
                liSize, ulSize, divSize,
                numVisible, initialItemLength, itemLength, calculatedTo, autoTimeout;

            initVariables();                    // Set the above variables after initial calculations
            initStyles();                       // Set the appropriate styles for the carousel div, ul and li
            initSizes();                        // Set appropriate sizes for the carousel div, ul and li
            attachEventHandlers();              // Attach event handlers for carousel to respond

            /**
             * Navigates the carousel to an element at "to" index
             * In the process, it adjusts the carousel based on whether it circular or not, hightlights the go buttons,
             * disables/enables the next/prev buttons and so on
             * @param to
             * @returns {boolean}
             */
            function go(to) {
                if(!running) {
                    clearTimeout(autoTimeout);  // Prevents multiple clicks while auto-scrolling - edge case
                    calculatedTo = to;

                    if(options.beforeStart) {   // Call the beforeStart() callback
                        options.beforeStart.call(this, visibleItems());
                    }

                    if(options.circular) {      // If circular, and "to" is going OOB, adjust it
                        adjustOobForCircular(to);
                    } else {                    // If non-circular and "to" is going OOB, adjust it.
                        adjustOobForNonCircular(to);
                    }                           // If neither overrides "calculatedTo", we are not in edge cases.

                    animateToPosition({         // Animate carousel item to position based on calculated values.
                        start: function() {
                            running = true;
                        },
                        done: function() {
                            if(options.afterEnd) {
                                options.afterEnd.call(this, visibleItems());
                            }
                            if(options.auto) {
                                setupAutoScroll();
                            }
                            running = false;
                        }
                    });

                    highlightGoButtons();       // Highlight or Un-highlight the right external GO buttons

                    if(!options.circular) {     // Enabling / Disabling buttons is applicable in non-circular mode only.
                        disableOrEnableButtons();
                    }

                }
                return false;
            }

            /**
             * Setup the initial set of variables based on the options set by the user.
             */
            function initVariables() {
                running = false;
                animCss = options.vertical ? "top" : "left";
                sizeCss = options.vertical ? "height" : "width";
                ul = div.find(">ul");
                initialLi = ul.find(">li");
                initialItemLength = initialLi.size();

                // To avoid a scenario where number of items is just 1 and visible is 3 for example.
                numVisible = initialItemLength < options.visible ? initialItemLength : options.visible;

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

            /**
             * Gives the carousel elements some default styles so that they align well into a carousel format.
             * This method will not give any themed styles, just the bare minimum necessary to make the carousel work
             */
            function initStyles() {
                div.css("visibility", "visible");   // If the div was set to hidden in CSS, make it visible now

                li.css({
                    overflow: "hidden",
                    "float": options.vertical ? "none" : "left" // Some minification tools fail if "" is not used
                });

                ul.css({
                    margin: "0",
                    padding: "0",
                    position: "relative",
                    "list-style": "none",
                    "z-index": "1"
                });

                div.css({
                    overflow: "hidden",
                    position: "relative",
                    "z-index": "2",
                    left: "0px"
                });

                calculatedTo = options.start;

                // For a non-circular carousel, disable or enable the nav buttons
                if(!options.circular) {
                    disableOrEnableButtons();
                }

                // Highlight the GO buttons immediately after carousel initialization
                highlightGoButtons();

            }

            /**
             * Sets the size of various carousel elements based on the given user inputs like width/height
             * of the carousel element.
             */
            function initSizes() {

                liSize = options.vertical ?         // Full li size(incl margin)-Used for animation and to set ulSize
                    li.outerHeight(true) :
                    li.outerWidth(true);
                ulSize = liSize * itemLength;       // size of full ul(total length, not just for the visible items)
                divSize = liSize * numVisible;      // size of entire div(total length for just the visible items)

                // Generally, LI's dimensions should be specified explicitly in a style-sheet
                // But in the case of img (with width and height attr), we can derive LI's dimensions and set here
                // May be applicable for other types of LI children if their dimensions are explicitly specified
                // Individual LI dimensions
                li.css({
                    width: li.width(),
                    height: li.height()
                });

                // Size of the entire UL. Including hidden and visible elements
                // Will include LI's (width + padding + border + margin) * itemLength - Using outerwidth(true)
                ul.css(sizeCss, ulSize+"px")
                    .css(animCss, -(calculatedTo * liSize));

                // Width of the DIV. Only the width of the visible elements
                // Will include LI's (width + padding + border + margin) * numVisible - Using outerwidth(true)
                div.css(sizeCss, divSize+"px");

            }

            /**
             * Attach event handlers to the carousel elements based on options
             */
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
                            return go(options.circular ? numVisible + i : i);
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
                    setupAutoScroll();
                }
            }

            /**
             * Sets up auto-scroll
             */
            function setupAutoScroll() {
                autoTimeout = setTimeout(function() {
                    go(calculatedTo + options.scroll);
                }, options.auto);
            }

            /**
             * Returns a list of currently visible items in the carousel
             * @returns {*}
             */
            function visibleItems() {
                return li.slice(calculatedTo).slice(0,numVisible);
            }

            /**
             * For a circular carousel, we need to simulate the infinite mode.
             * This method adjusts the indexes of the carousel based on the current index for infinite mode.
             * @param to
             */
            function adjustOobForCircular(to) {
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

            /**
             * For a non-circular carousel, this method
             *  adjusts the calculatedTo to 0 if the carousel is at the first element.
             *  adjusts calculatedTo to a correct value when the carousel is going towards the last element.
             * The second point is a bit more complicated because, based on a combination of scroll, visible and
             * the total number of elements in the carousel the carousel will need to adjust its calculatedTo so that
             * the last element is made visible regardless of edge cases
             * @param to
             */
            function adjustOobForNonCircular(to) {
                // If user clicks "prev" and tries to go before the first element, reset it to first element.
                if(to < 0) {
                    calculatedTo = 0;
                }
                // If "to" is greater than the max index that we can use to show another set of elements
                // it means that we will have to reset "to" to a smallest possible index that can show it
                else if(to > itemLength - numVisible) {
                    calculatedTo = itemLength - numVisible;
                }

                console.log("Item Length: " + itemLength + "; " +
                    "To: " + to + "; " +
                    "CalculatedTo: " + calculatedTo + "; " +
                    "Num Visible: " + numVisible);
            }

            /**
             * Enable or disable buttons in non-circular mode.
             */
            function disableOrEnableButtons() {
                $(options.btnPrev + "," + options.btnNext).removeClass(options.disabledClass);
                $( (calculatedTo-options.scroll<0 && options.btnPrev)
                        ||
                   (calculatedTo+options.scroll > itemLength-numVisible && options.btnNext)
                        ||
                   []
                ).addClass(options.disabledClass);
            }

            /**
             * Highlight or un-highlight GO buttons based on the current item being displayed in the carousel.
             * In case of circular: true mode, we have some calculations to do, but in case of circular:false mode,
             * the calculatedTo variable is the index of the GO button to highlight
             */
            function highlightGoButtons() {
                if(options.btnGo) {         // If GO buttons have been provided, only then get into highlighting mode

                    var buttonIndex = calculatedTo;
                    $(options.btnGo.join(", ")).removeClass(options.highlightClass);

                    if(options.circular) {  // If Circular, then we have some calculations to make, none otherwise
                        if(calculatedTo < numVisible) {
                            buttonIndex = calculatedTo + initialItemLength;
                        } else if(calculatedTo >= (initialItemLength + numVisible)) {
                            buttonIndex = calculatedTo - initialItemLength
                        }
                        buttonIndex -= numVisible;
                    }

                    $(options.btnGo[buttonIndex]).addClass(options.highlightClass);
                }
            }

            /**
             * Perform animation to move item from one position to another
             * @param animationOptions
             */
            function animateToPosition(animationOptions) {
                running = true;

                ul.animate(
                        animCss == "left" ?
                    { left: -(calculatedTo*liSize) } :
                    { top: -(calculatedTo*liSize) },

                    $.extend({
                        duration: options.speed,
                        easing: options.easing
                    }, animationOptions)
                );
            }
        });
    };

    $.fn.jCarouselLite.options = {
        btnPrev: null,                  // CSS Selector for the previous button
        btnNext: null,                  // CSS Selector for the next button
        btnGo: null,                    // CSS Selector for the go button
        mouseWheel: false,              // Set "true" if you want the carousel scrolled using mouse wheel
        auto: null,                     // Set to a numeric value (800) in millis. Time period between auto scrolls

        speed: 200,                     // Set to a numeric value in millis. Speed of scroll
        easing: null,                   // Set to easing (bounceout) to specify the animation easing

        vertical: false,                // Set to "true" to make the carousel scroll vertically
        circular: true,                 // Set to "true" to make it an infinite carousel
        visible: 3,                     // Set to a numeric value to specify the number of visible elements at a time
        start: 0,                       // Set to a numeric value to specify which item to start from
        scroll: 1,                      // Set to a numeric value to specify how many items to scroll for one scroll event

        disabledClass: "disabled",      // Class for navigation buttons in disabled mode. For non-circular mode
        highlightClass: "highlight",    // Class for highlighting GO buttons when the corresponding item is displayed

        beforeStart: null,              // Set to a function to receive a callback before every scroll start
        afterEnd: null                  // Set to a function to receive a callback after every scroll end
    };

})(jQuery);