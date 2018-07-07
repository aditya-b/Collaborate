from django.contrib.auth.models import User, Group
from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
from django.shortcuts import render, redirect
from rest_framework.views import APIView

from CollaborateApp.serializers import GroupDetailsSerializer, UserSerializer


class AddToGroup(APIView):
    def get(self,request,*args,**kwargs):
        try:
            group = Group.objects.get(id=kwargs['group'])
            users = list(group.user_set.values('username'))
            users = [username['username'] for username in users]
            for user in users:
                if user == request.user.username:
                    if request.GET['username'] in users:
                        return JsonResponse({'message': 'User exists!'}, status=201)
                    try:
                        user_to_be_added = User.objects.get(username=request.GET['username'])
                        group.user_set.add(user_to_be_added)
                        data = UserSerializer(user_to_be_added).data
                        return JsonResponse({'message': data}, status=200)
                    except ObjectDoesNotExist:
                        return JsonResponse({'message': 'User not found!'}, status=404)
            return JsonResponse({'message': 'Restricted Access'}, status=403)
        except ObjectDoesNotExist:
            return JsonResponse({'message': 'Group not found!'}, status=404)


class DeleteFromGroup(APIView):
    def get(self, request, *args, **kwargs):
        try:
            group = Group.objects.get(id=kwargs['group'])
            users = list(group.user_set.values('username'))
            users = [username['username'] for username in users]
            for user in users:
                if user == request.user.username:
                    try:
                        user_to_be_deleted = User.objects.get(username=kwargs['user'])
                        group.user_set.remove(user_to_be_deleted)
                        return JsonResponse({'message': 'Success'}, status=200)
                    except ObjectDoesNotExist:
                        return JsonResponse({'message': 'User not found!'}, status=404)
            return JsonResponse({'message': 'Restricted Access'}, status=403)
        except ObjectDoesNotExist:
            return JsonResponse({'message': 'Group not found!'}, status=404)


class GroupDetails(APIView):
    def get(self, request, *args, **kwargs):
        group = Group.objects.get(id=kwargs['group'])
        users = list(group.user_set.values('username'))
        users = [username['username'] for username in users]
        user = request.user.username
        if user in users:
            data = GroupDetailsSerializer(group)
            return JsonResponse(data=data.data,status=200)
        return JsonResponse({'message': 'Restricted access!'},status=403)


class AddGroup(APIView):
    def post(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({'message': 'Restricted access!'}, status=403)
        group_name = request.user.username + ' ' + request.POST['group_name']
        try:
            group = Group.objects.get(name=group_name)
        except ObjectDoesNotExist:
            group = Group(name=request.user.username + ' ' + group_name)
            group.save()
            group.user_set.add(request.user)
        finally:
            return redirect('collaborate:ui_workspace_groups', username=request.user.username)

    def get(self, request, *args, **kwargs):
        return render(request, template_name='form_add_group.html')


class DeleteGroup(APIView):
    def get(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({'message': 'Restricted access!'},status=403)
        try:
            group = Group.objects.get(id=kwargs['group'])
            users = list(group.user_set.values('username'))
            for user in users:
                if user['username'] == request.user.username:
                    group.delete()
                    return JsonResponse({'message': 'Group deleted successfully!'},status=200)
            return JsonResponse({'message': 'Restricted access!'},status=403)
        except ObjectDoesNotExist:
            return JsonResponse({'message': 'Group not found!'},status=404)