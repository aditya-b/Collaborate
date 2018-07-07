import os

from django.contrib.auth.models import Group, User
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import redirect, render
from django.template.defaultfilters import register
from django.urls import reverse_lazy
from requests import get

from Collaborate import settings
from CollaborateApp.forms import FileForm
from CollaborateApp.models import Files


@register.filter(name='split')
def split(value):
    return value.split()


def model_form_upload(request, groupid):
    group = Group.objects.get(id=groupid)
    if request.method == 'POST':
        form = FileForm(request.POST, request.FILES)
        form.instance.group = group
        filename = str(groupid) + '/' + str(request.FILES['url'])
        try:
            file = Files.objects.get(url=filename)
            name = file.url.name
            file.delete()
            os.remove(os.path.join(settings.MEDIA_ROOT, name))
        finally:
            if form.is_valid():
                form.save()
                return redirect('collaborate:ui_workspace_groups', username=request.user.username)
    else:
        form = FileForm()
    return render(request, 'model_form_upload.html', {
        'form': form,
        'name': group.name.split()[-1],
        'id': group.id
    })


def sampleview(request):
    return render(request, template_name='work_area.html')


def homeview(request):
    return render(request, template_name='home.html')


def load_user_home(request):
    return render(request, template_name='userhome.html')


def fetch_change_password_page(request):
    return render(request, template_name='change_password.html')


def fetch_edit_profile_page(request):
    data = None
    try:
        user = User.objects.get(username=request.user.username)
        data = dict()
        data['email'] = user.email
        data['first_name'] = user.first_name
        data['last_name'] = user.last_name
    finally:
        return render(request, template_name='edit_profile.html', context=data)


def load_groups(request):
    if request.user.is_authenticated:
        host = request.get_host()
        protocol = ''
        if request.is_secure():
            protocol = 'https://'
        else:
            protocol = 'http://'
        url = protocol + host + str(reverse_lazy('collaborate:get_user', kwargs={'username':request.user.username}))
        data = get(url).json()
        groups = data['groups']
        personal_index = 0
        for group in groups:
            if 'personal' in group['name'].lower():
                break
            personal_index += 1
        try:
            groups.pop(personal_index)
        finally:
            return render(
                request,
                template_name='view_groups.html',
                context={
                    'groups': groups
                }
            )
