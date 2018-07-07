from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.views.generic.base import View

from CollaborateApp.forms import LoginForm
from CollaborateApp.forms.signup_form import SignupForm


class LoginView(View):
    def get(self,request,*args,**kwargs):
        form = LoginForm()
        return render(request,'login.html',{'form':form,'message':None})

    def post(self,request,*args,**kwargs):
        form = LoginForm(request.POST)
        if form.is_valid():
            values = list(form.cleaned_data.values())
            user=authenticate(request,username=values[0],password=values[1])
            if user is not None:
                login(request,user)
                return redirect('collaborate:ui_workspace_groups', username=request.user.username)
            else:
                return render(request, 'login.html', {'form': form,'message': 'Invalid credentials!'})


class SignupView(View):
    def get(self,request,*args,**kwargs):
        form = SignupForm()
        return render(request, 'signup.html', {'form':form,'errors':None})


def log_out(request):
    logout(request)
    return redirect('collaborate:home')

