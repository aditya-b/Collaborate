var host_url = window.location.protocol + '//' + window.location.hostname;
var port = window.location.port;
if(port)
    host_url += ':' + window.location.port;

function signup()
{
    var email = document.getElementById('id_email').value;
    var last_name = document.getElementById('id_last_name').value;
    var first_name = document.getElementById('id_first_name').value;
    var password = document.getElementById('id_password').value;
    var username = document.getElementById('id_username').value;
    if(email.length>8 && last_name.length>3 && first_name.length>3 && password.length >7 && username.length >5)
    {
    $.ajax({
        url: host_url + "{% url 'collaborate:add_user' %}",
        type:'POST',
        data: {
            'email': document.getElementById('id_email').value,
            'last_name': document.getElementById('id_last_name').value,
            'first_name': document.getElementById('id_first_name').value,
            'password': document.getElementById('id_password').value,
            'username': document.getElementById('id_username').value
        },
        dataType: 'json',
        success:function(response){
            alert('User registered successfully!');
            window.location.replace("{% url 'collaborate:home' %}");
        },
        error:function(error){
            console.log(error);
            alert(error.responseJSON['message']);
        }
    })
    }
}