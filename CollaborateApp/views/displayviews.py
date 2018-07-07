from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import render
from django.urls import reverse_lazy
from django.views.generic import View
from requests import get as GET


class DisplayGroups(LoginRequiredMixin, View):
    login_url = 'collaborate:login'

    def get(self, request, *args, **kwargs):
        host = request.get_host()
        protocol = ''
        if request.is_secure():
            protocol = 'https://'
        else:
            protocol = 'http://'
        url = protocol + host + str(reverse_lazy('collaborate:get_user', kwargs=kwargs))
        data = GET(url).json()
        groups = data['groups']
        personal_index = 0
        for group in groups:
            if 'personal' in group['name'].lower():
                break
            personal_index += 1
        personal = None
        try:
            personal = groups.pop(personal_index)
        finally:
            return render(
                request,
                template_name='work_area.html',
                context={
                    'groups': groups,
                    'personal': personal
                }
            )

    def post(self, request, *args, **kwargs):
        return self.get(request, *args, **kwargs)