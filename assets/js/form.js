$(document).ready(function () {
  let allParams = new URLSearchParams(document.location.search);
  let currentGeo = window.autoResolvedGeo || allParams.get("country_code");
  currentGeo = (currentGeo === null || currentGeo === undefined) ? "md" : currentGeo.toLocaleLowerCase();
  $.validator.addMethod(
    "emailrgx",
    function (value, element) {
      return this.optional(element) || /^[a-zA-Zа-яёА-ЯЁ0-9._@-]+$/.test(value);
    },
    "Incorrect email"
  );
  jQuery.validator.addMethod(
    "lettersonly",
    function (value, element) {
      return (
        this.optional(element) ||
        /^[a-zA-Zа-яА-ЯёЁàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœğüşöçİĞÜŞÖÇ\.]+$/.test(
          value
        )
      );
    },
    "Вводите только буквы"
  );
  let forms = $("form");
  forms.each(function () {
    let form = $(this);
    form
      .submit(function (e) {
        e.preventDefault();
      })
      .validate({
        rules: {
          name: {
            required: true,
            minlength: 2,
            lettersonly: true,
          },
          last: {
            required: true,
            minlength: 2,
            lettersonly: true,
          },
          phone_no_code: {
            required: true,
            minlength: () => {
              return (
                form.find("input[name=phone_no_code]").attr("placeholder")
                  .length - 2
              );
            },
          },
          email: {
            required: true,
          },
        },
        messages: {
          name: {
            required: "Обязательное поле",
            minlength: "Слишком короткое имя",
          },
          last: {
            required: "Обязательное поле",
            minlength: "Слишком короткая фамилия",
          },
          email: {
            required: "Обязательное поле",
          },
          phone_no_code: {
            required: "Обязательное поле",
            minlength: "Введите корректный номер",
          },
        },
        submitHandler: function (form) {
          var data = serializeForm(form);
          $.ajax({
            url: "api.php",
            type: "post",
            dataType: "json",
            data: data,
            beforeSend: disableCreateBtn(),
            success: function (response) {
              if (response.status) {
                activateCreateBtn(form);
                if (response.description.url) {
                  window.location.href = response.description.url;
                } else {
                  let queryParams = new URLSearchParams(window.location.search);
                  queryParams.get("trafficsource") === "Bigo"
                    ? (window.location.href = `https://${queryParams.get(
                        "domain"
                      )}/thank-you.php?${queryParams}`)
                    : (window.location.href = "success.php");
                }
              } else if (
                typeof response.status !== "undefined" &&
                typeof response.status !== null
              ) {
                activateCreateBtn(form);
                if (
                  response.description === "phone_regexp-not-passed" ||
                  response.description === "phone_too-short"
                ) {
                  const phoneInput = form.querySelector(
                    "input[name=phone_no_code]"
                  );
                  phoneInput.classList.remove("valid");
                  phoneInput.classList.add("error");
                }
              }
            },
          });
        },
      });
  });
  function serializeForm(form) {
    var inputs = form.elements;
    var query = [];
    for (var i = 0; i < inputs.length; i++) {
      var input = inputs[i];
      if (input.name) {
        let name = encodeURIComponent(input.name);
        let value = "";
        if (input.name === "phone") {
          value = (
            form.getElementsByClassName("iti__selected-dial-code")[0]
              .innerText +
            form.querySelector('input[name="phone_no_code"]').value
          ).replace(/\D/g, "");
        } else {
          value = encodeURIComponent(input.value);
        }
        query.push(name + "=" + value);
      }
    }
    return query.join("&");
  }
  function disableCreateBtn() {
    const submitBtns = document.querySelectorAll("button[type=submit]");
    submitBtns.forEach((item) => {
      item.setAttribute("disabled", "");
      item.style.pointerEvents = "none";
      item.querySelector("img").style.display = "flex";
      item.querySelector("span").style.display = "none";
    });
  }
  function activateCreateBtn(form) {
    const submitBtns = form.querySelectorAll("button[type=submit]");
    submitBtns.forEach((item) => {
      item.removeAttribute("disabled");
      item.style.pointerEvents = "";
      item.querySelector("img").style.display = "none";
      item.querySelector("span").style.display = "";
    });
  }
  let ary = Array.prototype.slice.call(
    document.querySelectorAll("input[name=phone_no_code]")
  );
  ary.forEach(function (el) {
    PhoneDisplay(el);
  });
  function PhoneDisplay(input) {
    //AlterCPA code
    var iti = window.intlTelInput(input, {
      initialCountry: currentGeo,
      onlyCountries: [currentGeo],
      nationalMode: false,
      autoPlaceholder: "aggressive",
      autoHideDialCode: false,
      allowDropdown: false,
      formatOnDisplay: true,
      separateDialCode: true,
      hiddenInput: "phone",
      utilsScript:
        "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/18.1.4/js/utils.min.js",
    });
    // Valid number
    $(input).on("change keyup", function () {
      $.validator.addMethod(
        "phone_no_code",
        function (value, element) {
          if (iti.isValidNumber()) {
            return true;
          } else {
            return false;
          }
        },
        ""
      );
    });
    $("input[name=phone_no_code]").on("change keyup", function () {
      var mask_regex = $("input[name=phone_no_code]")
        .attr("placeholder")
        .replace(/[0-9]/g, 0);
      $("input[name=phone_no_code]").mask(mask_regex);
    });
    $("input[name=phone_no_code]").on(
      "countrychange",
      function (e, countryData) {
        $("input[name=phone_no_code]").val("");
      }
    );
  }
});