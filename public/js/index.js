// form submit button

$(document).ready(function () {
  var focus = function (e) {
    $(e.target).closest('.form-group').addClass('active_field');
  };
  var blur = function (e) {
    if (!$(e.target).val().length)
      $(e.target).closest('.form-group').removeClass('active_field');
  };
  $('form input').each(function (e) {
    $(this).val().length ? focus(this) : false;
  })
  $('form input').on('focus', focus);
  $('form input').on('blur', blur);

  $('#loginModal form').on('submit', function (e) {
    e.preventDefault();
    const spinner = $('#loginModal form button .fa-spinner');
    const button = $('#loginModal form button');
    $("#loginModal .alert").addClass('d-none');
    const error_message = function (msg) {
      $("#loginModal .alert").removeClass('d-none').text(msg);
    }

    spinner.removeClass('d-none');
    button.attr('disabled', true);

    API.post('sign/in/', {
        email: $('#loginModal form input[type="email"]').val(),
        password: $('#loginModal form input[type="password"]').val()
      })
      .done(function (response) {
        redirectTo('/alert/');
      })
      .fail(function errorHandler(xhr, status, errorThrown) {
        spinner.addClass('d-none');
        button.attr('disabled', false);
        switch (xhr.status) {
          case 403:
            error_message('אין התאמה בין סיסמה לאי מייל');
            break;

          default:
            errorMessage("Sorry, there was a problem!\n" + xhr.status);
            console.log("Error: " + errorThrown);
            console.log("Status: " + status);
            console.dir(xhr);
            break;
        }
      });
    return false;
  });

  $('form.hpForm').on('submit', function submitHandler(e) {
    e.preventDefault();
    $('.hpForm button').attr('disabled', true);
    API.post('sign/up/', {
        email: $('form.hpForm input[type="email"]').val(),
        password: $('form.hpForm input[type="password"]').val()
      })
      .done(function (response) {
        alert("שלחנו לכם אי מייל עם לינק לסיום ההרשמה.");
      })
      .fail(function errorHandler(xhr, status, errorThrown) {
        switch (xhr.status) {
          case 409:
            errorMessage('כתובת המייל כבר קיימת.');
            break;

          default:
            errorMessage("Sorry, there was a problem!\n"+xhr.responseJSON.data);
            console.log("Error: " + errorThrown);
            console.log("Status: " + status);
            console.dir(xhr);
            break;
        }
      })
      .always(function () {
        $('.hpForm button').attr('disabled', false);
      });
    return false;
  });

  // show login

});