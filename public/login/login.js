$(document).ready(function () {

    const form = $('form#login');
    form.on('submit', function (e) {
    e.preventDefault();
    const spinner = form.find('button .fa-spinner');
    const button =form.find('button');
    form.find('.alert').addClass('d-none');
    const error_message = function (msg) {
        form.find('.alert').removeClass('d-none').text(msg);
    }

    spinner.removeClass('d-none');
    button.attr('disabled', true);

    API.post('sign/in/', {
        email:form.find('input[type="email"]').val(),
        password: form.find('input[type="password"]').val()
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
})