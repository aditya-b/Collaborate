from django.forms import Form, CharField, TextInput, PasswordInput


class LoginForm(Form):
    username=CharField(
        required=True,
        widget=TextInput(attrs={'class': 'form-control', 'placeholder': 'Username', 'required': 'true'})
    )
    password=CharField(
        required=True,
        widget=PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Password', 'required': 'true', 'minlength': '8'})
    )