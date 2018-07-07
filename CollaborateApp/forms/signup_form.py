from django import forms


class SignupForm(forms.Form):
    first_name=forms.CharField(
        max_length=20,
        required=True,
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'First Name', 'required': 'true', 'minlength': '4'})
    )
    last_name = forms.CharField(
        max_length=20,
        required=True,
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Last Name', 'required': 'true', 'minlength': '4'})
    )
    username = forms.CharField(
        max_length=20,
        required=True,
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Username', 'required': 'true', 'minlength': '6'})
    )
    password = forms.CharField(
        max_length=20,
        required=True,
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Password', 'required': 'true', 'minlength': '8'})
    )
    email = forms.EmailField(
        max_length=80,
        required=True,
        widget=forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Email ID', 'required': 'true', 'minlength': '8'})
    )
