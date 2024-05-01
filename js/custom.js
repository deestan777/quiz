$(document).ready(function () {
  "use strict";
  $(".btn-start").click(function () {
    $(this).parents(".test-step").fadeOut(),
      $(this).parents(".test-step").next().fadeIn();
  }),
    $(".test-step .btn-next").on("click", function (t) {
      $(this).parents(".test-step").fadeOut(),
        $(this).parents(".test-step").next().fadeIn();
    }),
    $(".test-step .radio:not(.last-btn):not(.sad1):not(.sad2)").on(
      "click",
      function (t) {
        $(this).addClass("active"),
          $(this).parents(".test-step").fadeOut(),
          $(this).parents(".test-step").next().fadeIn();
      }
    ),
    $(".test-step .last").on("click", function (t) {
      $(this).addClass("active"),
        $(this).parents(".test-step").fadeOut(),
        $(this).parents(".test-step").next().fadeIn();
    }),
    $(".radio.sad1").click(function () {
      $(this).parents(".test-step").fadeOut(), $("#sad1").fadeIn();
    }),
    $(".radio.sad2").click(function () {
      $(this).parents(".test-step").fadeOut(), $("#sad2").fadeIn();
    });
});
