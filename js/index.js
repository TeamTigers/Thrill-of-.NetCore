 /////////////////
/// settings: ///
/////////////////

// keys to press to scroll to next slide (seperated by spaces)
var keysForDown = "pagedown enter return down right space",
// keys to press to scroll to previous slide (seperated by spaces)
keysForUp = "pageup up left backspace",
// pixels you can scroll "beyond" a slide before you trigger the animation to the next one
scrollMargin = 20,
// when the last slide is reached, warp around to the first one
wrap = false,
// page scroll animation time
animationTime = 500,
// highlight.js languages (seperated by ", ")
hljsLangs = "javascript, html, css",
// highlight.js tab replace
hljsTabReplace = "  "; // two spaces



//////////////////////
/// your custom js ///
//////////////////////

$(function () {
  var keysD = keysForDown.split(" "),
  keysU = keysForUp.split(" ");

  $('.key-list-down').text(_.map(keysD, function (v, k) {var last = k == keysD.length - 1;return (last ? " or " : !k ? "" : ", ") + '"' + v + '"';}).join(""));

  $('.key-list-up').text(_.map(keysU, function (v, k) {var last = k == keysU.length - 1;return (last ? " or " : !k ? "" : ", ") + '"' + v + '"';}).join(""));

});



/////////////
/// magic ///
/////////////
(function () {
  hljs.configure({
    tabreplace: hljsTabReplace,
    languages: hljsLangs.split(", ") });


  $.fn.hljs = function () {
    return this.each(function (i, block) {
      hljs.highlightBlock(block);
    });
  };

  var lorem = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  $(function () {
    // other vars
    var curr = 0,
    len = $(".slide").length - 1,
    slides = $(".slide"),
    container = $(".main-container"),
    down = function down() {scroll("down");},
    up = function up() {scroll("up");},
    animating = false,animateTimeout = void 0,
    lastScrollTop = 0,
    htmlCurr = $('.curr-page'),
    htmlTotal = $('.total-page');

    function scroll(where) {
      if (typeof where === "string") {
        if (where == "down") {
          if (curr < len) {
            curr++;
          } else if (wrap) {
            curr = 0;
          } else {
            return;
          }
        } else if (where == "up") {
          if (curr > 0) {
            curr--;
          } else if (wrap) {
            curr = len;
          } else {
            return;
          }
        }
      } else if (where >= 0 && where <= len) {
        curr = where;
      } else {
        return;
      }

      scrollIntoPosition();
    }

    function scrollIntoPosition() {var px = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      clearTimeout(animateTimeout);
      animating = true;

      var currOffset = slides[curr].offsetTop;

      htmlTotal.text(len + 1);
      htmlCurr.text(curr + 1);

      container.stop().animate({
        scrollTop: currOffset },
      animationTime);

      animateTimeout = setTimeout(function () {
        animating = false;
      }, animationTime + 10);
    }

    container.on("scroll", function () {
      var nextSlide = slides[curr + 1],
      thisSlide = slides[curr],
      st = container[0].scrollTop,
      ch = container[0].clientHeight;

      if (animating) {
        lastScrollTop = st;
        return;
      }

      if (lastScrollTop < st && nextSlide) {
        // we're scrolling down

        var ot = nextSlide.offsetTop;

        if (st + ch - scrollMargin > ot) {
          down();
        }


      } else if (thisSlide) {
        // we're scrolling up

        var _ot = thisSlide.offsetTop;

        if (st + scrollMargin < _ot) {
          up();
        }
      }

      lastScrollTop = st;
    });

    $('.up-btn').click(up);
    $('.down-btn').click(down);
    Mousetrap.bind(keysForDown.split(" "), down);
    Mousetrap.bind(keysForUp.split(" "), up);
    Mousetrap.bind("1234567890".split(""), function (e, combo) {
      var input = --combo;

      if (input == -1) input = 9;

      if (input > len) input = len;

      scroll(input);
    });
    container.perfectScrollbar({
      suppressScrollX: true });


    htmlTotal.text(len + 1);
    htmlCurr.text(curr + 1);

    $('.lorem').text(lorem);
    $('pre code, p code').hljs();

    window.scroll = scroll;
  });
})();