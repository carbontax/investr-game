$(document).ready(function() {
  $('#login-spinner').hide();
  $('#new-password-form-container').hide();
  function getParam(name){
     if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search)) {
        return decodeURIComponent(name[1]);
     }
  }
  
  var token = getParam('token');
  
  if(token === undefined) {
    $('#error-message').html("You must provide a valid token to use this form.");
  } else {
    $("#token").val(token);
    $.ajax({
      url: 'api/pwreset?token=' + token,
      dataType: 'json',
      success: function(data) {
        $("#email").html(data['email']);
        $('#new-password-form-container').show();
//        console.log(data);
      },
      error: function(xhr) {
        var message = xhr.responseText.replace(/"/g, "");
        $('#error-message').html(message);
      }
    });
  }
  
  $('#new-password-form').validate({
    rules: {
      'confirm-password': { 
        equalTo: "#password"
      }
    }
  });
});
