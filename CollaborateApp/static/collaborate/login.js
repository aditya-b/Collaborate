var host_url = window.location.protocol + '//' + window.location.hostname;
var port = window.location.port;
if(port)
    host_url += ':' + window.location.port;

function send_email()
{
    var ack = document.getElementById('email_ack');
    ack.style.color = 'skyblue';
    ack.innerHTML  = '<b>Sending email...</b>';
    $.ajax({
        url: host_url + send_email_url,
        type:'GET',
        data: { 'email': document.getElementById('forgot_password_email').value },
        dataType: 'json',
        success:function(response){
            ack.style.color = 'green';
            ack.innerHTML  = response['message'];
            document.getElementById('reset_password_form').style.display = 'block';
            document.getElementById('verify_email_button').setAttribute('disabled','true');
            document.getElementById('forgot_password_email').setAttribute('disabled','true');
        },
        error:function(error){
            ack.style.color = 'red';
            ack.innerHTML  = error.responseJSON['message'];
        }
    })
}

function check_match()
{
    var password1 = document.getElementById('new_password').value;
    var password2 = document.getElementById('confirm_password').value;
    var ack = document.getElementById('password_match').style;
    var submit_button = document.getElementById('reset_password_button');
    if(password1 == password2)
    {
        ack.display = 'none';
        submit_button.removeAttribute('disabled');
    }
    else
    {
        ack.display = 'table-cell';
        submit_button.setAttribute('disabled','true');
    }
}

function reset_password()
{
    var ack = document.getElementById('pass_ack');
    ack.style.color = 'skyblue';
    ack.innerHTML  = '<b>Resetting password...</b>';
    $.ajax({
        url: host_url + reset_password_url,
        type:'GET',
        data: {
            'email': document.getElementById('forgot_password_email').value,
            'password': document.getElementById('new_password').value,
            'reset_code': document.getElementById('reset_code').value
        },
        dataType: 'json',
        success:function(response){
            reset_form();
            ack.style.color = 'green';
            ack.innerHTML  = response['message'];
            ack.style.display = 'block';
        },
        error:function(error){
            ack.style.color = 'red';
            ack.innerHTML  = error.responseJSON['message'];
            ack.style.display = 'block';
        }
    })
    return false;
}

function reset_form()
{
    document.getElementById('reset_password_form').style.display = 'none';
    document.getElementById('verify_email_button').removeAttribute('disabled');
    document.getElementById('forgot_password_email').removeAttribute('disabled');
    document.getElementById('forgot_password_email').value = '';
    document.getElementById('reset_code').value = '';
    document.getElementById('new_password').value = '';
    document.getElementById('confirm_password').value = '';
    document.getElementById('password_match').style.display = 'none';
    document.getElementById('pass_ack').style.display = 'none';
    document.getElementById('email_ack').style.display = 'none';
}