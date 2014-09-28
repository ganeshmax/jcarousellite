/**
 * jCarouselLite - jQuery plugin to navigate images/any content in a carousel style widget.
 * @requires jQuery v1.1.2
 *
 * http://gmarwaha.com/jquery/jcarousellite/
 *
 * Copyright (c) 2007 Ganeshji Marwaha (gmarwaha.com)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Version: 0.3.0
 */

/**
 * Creates a carousel-style navigation widget for images/any content from a simple HTML markup.
 *
 * The HTML markup that is used to build the carousel can be as simple as...
 *
 *  <div class="carousel">
 *      <ul>
 *          <li><img src="image/1.jpg" alt="1"></li>
 *          <li><img src="image/2.jpg" alt="2"></li>
 *          <li><img src="image/3.jpg" alt="3"></li>
 *      </ul>
 *  </div>
 *
 * As you can see, this snippet is nothing but a simple div containing an unordered list of images.
 * You don't need any special class attribute, or special css file for this plugin.
 * I am using a class attribute just for the sake of explanation here.
 *
 * To navigate the elements of the carousel, you need some kind of navigation buttons.
 * For example, you will need a "previous" button to go backward, and a "next" button to go forward.
 * This need not be part of the carousel itself. It can be any element in your page.
 * Lets assume that the following elements in your document can be used as next, and prev buttons...
 *
 * <button class="prev"><<</button>
 * <button class="next">>></button>
 *
 * Now, all you need to do is call the carousel component on the div element that represents it, and pass in the
 * navigation buttons.
 *
 * $(".carousel").jCarouselLite({
 *      btnNext: ".next",
 *      btnPrev: ".prev"
 * });
 *
 * That's it, you would have now converted your raw div, into a magnificient carousel.
 *
 * There are quite a few other options that you can use to customize it though.
 * Each will be explained with an example below.
 *
 * @param an options object - You can specify all the options shown below as an options object param.
 *
 * @option btnPrev, btnNext - no defaults
 * @example
 * $(".carousel").jCarouselLite({
 *      btnNext: ".next",
 *      btnPrev: ".prev"
 * });
 * @desc Creates a basic carousel. Clicking "btnPrev" navigates backwards and "btnNext" navigates forward.
 *
 * @option btnGo - no defaults
 * @example
 * $(".carousel").jCarouselLite({
 *      btnNext: ".next",
 *      btnPrev: ".prev",
 *      btnGo: [".0", ".1", ".2"]
 * });
 * @desc If you don't want next and previous buttons for navigation, instead you prefer custom navigation based on
 * the item number within the carousel, you can use this option. Just supply an array of selectors for each element
 * in the carousel. The index of the array represents the index of the element. What i mean is, if the
 * first element in the array is ".0", it means that when the element represented by ".0" is clicked, the carousel
 * will slide to the first element and so on and so forth. This feature is very powerful. For example, i made a tabbed
 * interface out of it by making my navigation elements styled like tabs in css. As the carousel is capable of holding
 * any content, not just images, you can have a very simple tabbed navigation in minutes without using any other plugin.
 * The best part is that, the tab will "slide" based on the provided effect. :-)
 *
 * @option speed - 200 is default
 * @example
 * $(".carousel").jCarouselLite({
 *      btnNext: ".next",
 *      btnPrev: ".prev",
 *      speed: 800
 * });
 * @desc Specifying a speed will slow-down or speed-up the sliding speed of your carousel. Try it out with
 * different speeds like 800, 600, 1500 etc. Providing 0, will remove the slide effect.
 * 
 * @option easing - no easing effects by default.
 * @example
 * $(".carousel").jCarouselLite({
 *      btnNext: ".next",
 *      btnPrev: ".prev",
 *      easing: "bounceout"
 * }); 
 * @desc You can specify any easing effect. Note: You need easing plugin for that. Once specified,
 * the carousel will slide based on the provided easing effect. 
 *
 * @option vertical - default is false
 * @example
 * $(".carousel").jCarouselLite({
 *      btnNext: ".next",
 *      btnPrev: ".prev",
 *      vertical: true
 * });
 * @desc Determines the direction of the carousel. true, means the carousel will display vertically. The next and
 * prev buttons will slide the items vertically as well. The default is false, which means that the carousel will
 * display horizontally. The next and prev items will slide the items from left-right in this case.
 * 
 * @option circular - default is true
 * @example
 * $(".carousel").jCarouselLite({
 *      btnNext: ".next",
 *      btnPrev: ".prev",
 *      circular: false
 * });
 * @desc Setting it to true enables circular navigation. This means, if you click "next" after you reach the last
 * element, you will automatically slide to the first element and vice versa. If you set circular to false, then
 * if you click on the "next" button after you reach the last element, you will stay in the last element itself
 * and similarly for "previous" button and first element.
 * 
 * @option visible - default is 3
 * @example
 * $(".carousel").jCarouselLite({
 *      btnNext: ".next",
 *      btnPrev: ".prev",
 *      visible: 4
 * });
 * @desc This specifies the number of items visible at all times within the carousel. The default is 3.
 * You are even free to experiment with real numbers. Eg: "3.5" will have 3 items fully visible and the
 * last item half visible. This gives you the effect of showing the user that there are more images to the right.
 *
 * @option start - default is 0
 * @example
 * $(".carousel").jCarouselLite({
 *      btnNext: ".next",
 *      btnPrev: ".prev",
 *      start: 2
 * });
 * @desc You can specify from which item the carousel should start. Remember, the first item in the carousel
 * has a start of 0, and so on. 
 * 
 * @option beforeStart, afterEnd callbacks  
 * @example
 * $(".carousel").jCarouselLite({
 *      btnNext: ".next",
 *      btnPrev: ".prev",
 *      beforeStart: function(a) {
 *          alert("Before animation starts:" + a);
 *      },
 *      afterEnd: function(a) {
 *          alert("After animation ends:" + a);
 *      }
 * });
 * @desc If you wanted to do some logic in your page before the slide starts and after the slide ends, you can
 * register these 2 callbacks. The functions will be passed an argument that represents an array of elements that
 * are visible at the time of callback. 
 *
 *
 * @cat Plugins/Image Gallery
 * @author Ganeshji Marwaha/ganeshread@gmail.com
 */
(function($) {                                          // Compliant with jquery.noConflict()
$.fn.jCarouselLite = function(o) {
    o = $.extend({
        btnPrev: null,
        btnNext: null,
        btnGo: [],

        speed: 200,
        easing: null,

        vertical: false,
        circular: true,
        visible: 3,
        start: 0,

        beforeStart: null,
        afterEnd: null
    }, o || {});

    return this.each(function() {                       // Returns the element collection. Chainable.
    var curr = o.start, animCss = o.vertical ? "top" : "left", sizeCss = o.vertical ? "height" : "width";
    var div = $(this), ul = div.find("ul"), li = div.find("li"), itemLength = li.size();                       
    div.css("visibility", "visible");

    var liSize = o.vertical ? height(li) : width(li);   // Full li size(incl margin)-Used for animation
    var ulSize = liSize * itemLength;                   // size of full ul(total length, not just for the visible items)
    var divSize = liSize * o.visible;                   // size of entire div(total length for just the visible items)

    li.css("overflow", "hidden")                        // If the list item size is bigger than required
        .css("width", li.width())                       // inner li width. this is the box model width
        .css("height", li.height())                     // inner li height. this is the box model height
        .css("float", o.vertical ? "none" : "left")     // Horizontal list
        .children().css("overflow", "hidden");          // If the item within li overflows its size, hide'em

    ul.css("position", "relative")                      // IE BUG - width as min-width
        .css(sizeCss, ulSize+"px")                      // Width of the UL is the full length for all the images
        .css(animCss, -(curr*liSize))                   // Set the starting item
        .css("list-style-type", "none")                 // We dont need any icons representing each list item.
        .css("z-index", "1");                           // IE doesnt respect width. So z-index smaller than div

    div.css("overflow", "hidden")                       // Overflows - works in FF
        .css("position", "relative")                    // position relative and z-index for IE
        .css(sizeCss, divSize+"px")                     // Width of the DIV. length of visible images
        .css("z-index", "2")                            // more than ul so that div displays on top of ul
        .css("left", "0px");                            // after creating carousel show it on screen

    $(o.btnPrev).click(function() { return go(curr-1); });
    $(o.btnNext).click(function() { return go(curr+1); });
    $.each(o.btnGo, function(i, val) {
        $(val).click(function() {
            return go(i);
        });
    });

    var vis = function() {
        var arr=[];
        li.children().each(function(i) {
            if(i>=curr && i<curr+o.visible) arr.push(this);
        });
        return arr;
    };

    var go = function(to) {
        if(o.beforeStart) o.beforeStart.call(this, vis(curr, o.visible));

        if(to<0 && curr==0) {                                               // If first, then goto last
            if(o.circular) curr=itemLength-o.visible; 
            else return;
        } else if(to>=itemLength-o.visible && curr+o.visible>=itemLength) { // If last, then goto first
            if(o.circular) curr = 0; 
            else return;
        } else curr = to;

        ul.animate(
            animCss == "left" ? { left: -(curr*liSize) } : { top: -(curr*liSize) } , o.speed, o.easing,
            function() {
                ul.css(animCss, -(curr*liSize)+"px");    // For some reason the animation was not making left:0
                if(o.afterEnd) o.afterEnd.call(this, vis(curr-1, o.visible));
            }
        );
        return false;
    };
    });
};

var css = function(el, prop) {
    return parseInt($.css(el.jquery ? el[0] : el,prop)) || 0;
};
var width = function(el) {
    return  el[0].offsetWidth + css(el, 'marginLeft') + css(el, 'marginRight');
};
var height = function(el) {
    return el[0].offsetHeight + css(el, 'marginTop') + css(el, 'marginBottom');
};

})(jQuery);