//form submit button
$("form.hpForm").on("submit", function () {
    var form = $("form.hpForm");
    API.post('sign/up/', {
        email: $('#homeAddress').val(),
        password: parseInt($('#radiusRange').val())
      })
      .done(function (response) {
        $("#alertTable").trigger("addAlert", [response.data])
      })
      .fail(errorHandler);
    return false;
  });