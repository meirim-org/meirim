// form submit button

$(document).ready(function () {
  var focus =function (e) {
    $(e.target).closest('.form-group').addClass('active_field');
  };
  var blur =function (e) {
    if (!$(e.target).val().length)
      $(e.target).closest('.form-group').removeClass('active_field');
  };
  $('form input').each(function(e){
    $(this).val().length ? focus(this) : false;
  })
  $('form input').on('focus',focus );
  $('form input').on('blur', blur);


  $("#loginModal").on("submit", function () {

    API.post('sign/in/', {
        email: $('#inputEmail').val(),
        password: $('#inputPassword"').val()
      })
      .done(function (response) {
        redirectTo('/alert/')
      })
      .fail(errorHandler);
    return false;
  });

  $('form.hpForm').on('submit', function submitHandler(e) {
    e.preventDefault();
    $('.hpForm button').prop('disabled', true);
    API.post('sign/up/', {
        email: $('#inputEmail').val(),
        password: $('#inputPassword').val()
      })
      .done(function (response) {
        alert(response.data);
      })
      .fail(function errorHandler(xhr, status, errorThrown) {
        console.log(xhr.status);
        switch (xhr.status) {
          case 409:
            errorMessage('כתובת המייל כבר קיימת.');
            break;

          default:
            errorMessage("Sorry, there was a problem!\n" + xhr.status);
            console.log("Error: " + errorThrown);
            console.log("Status: " + status);
            console.dir(xhr);
            break;
        }
      })
      .always(function () {
        $('.hpForm button').prop('disabled', false);
      });
    return false;
  });

});