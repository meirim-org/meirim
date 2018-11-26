$(document).ready(function () {

    const stage1 = $('form#stage1');

    stage1.on('submit', function (e) {
    e.preventDefault();
    const spinner = stage1.find('button .fa-spinner');
    const button =stage1.find('button');
    stage1.find('.alert').addClass('d-none');
    const error_message = function (msg) {
        stage1.find('.alert').removeClass('d-none').text(msg);
    }

    spinner.removeClass('d-none');
    button.attr('disabled', true);

    API.post('password/sendResetToken', {
        email:stage1.find('input[type="email"]').val(),
      })
      .done()
      .fail(function errorHandler(xhr, status, errorThrown) {
        spinner.addClass('d-none');
        button.attr('disabled', false);
        switch (xhr.status) {
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