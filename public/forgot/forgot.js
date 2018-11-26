$( document ).ready( function() {

    const params = getVars();

    const stage1 = $('form#stage1');
    const stage2 = $('form#stage2');
    // 2nd stage
    if(params.token){
      stage1.hide();
      $("#emailCode").val(params.token);
      $("#loginPassword").removeAttr("disabled");

      stage2.on('submit', function (e) {
        e.preventDefault();
        const spinner = stage2.find('button .fa-spinner');
        const button =stage2.find('button');
  
        spinner.removeClass('d-none');
        button.attr('disabled', true);
  
        return API.post('password/resetWithToken', {
            token:stage2.find('input[name="emailCode"]').val(),
            password:stage2.find('input[name="password"]').val(),
          })
          .done(function(){
            window.location = "/login/"
          })
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

      return;
    }
    stage2.hide();
    // stage 1
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


/** helpers */
function getVars() {
  let vars = {};
  window.location.href.replace(location.hash, '').replace(
    /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
    function (m, key, value) { // callback
      vars[key] = value !== undefined ? value : '';
    },
  );
  return vars;
}