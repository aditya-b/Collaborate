from django.contrib.auth.models import Group, AnonymousUser
from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse, HttpResponse
from rest_framework.views import APIView

from Collaborate import settings
from CollaborateApp.models import Files
from CollaborateApp.serializers import FileSerializer

import boto3
s3client = boto3.client(
        's3',
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    )


def get_data_from_s3(url):
    global s3client
    s3response = s3client.get_object(
            Bucket=settings.AWS_STORAGE_BUCKET_NAME,
            Key='documents/' + url
        )
    return s3response['Body'].read().decode('ascii')


def set_data_to_s3(url, data):
    global s3client
    s3client.put_object(Body=data.encode('ascii'), Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key='documents/' + url)


class GetFiles(APIView):
    def get(self, request, *args, **kwargs):
        if type(request.user) == AnonymousUser:
            return JsonResponse({'message': 'Restricted Access'}, status=403)
        try:
            group = Group.objects.get(id=kwargs['group'])
            users = group.user_set.values('username')
            for user in users:
                if user['username'] == request.user.username:
                    files = Files.objects.filter(group__id=kwargs['group'])
                    data = FileSerializer(files, many=True)
                    data = data.data
                    return JsonResponse(data, status=200, safe=False)
            return JsonResponse({'message': 'Restricted Access'}, status=403)
        except ObjectDoesNotExist:
            return JsonResponse({'message': 'Group not found!'}, status=404)


class EditFile(APIView):
    def get(self, request, *args, **kwargs):
        if type(request.user) == AnonymousUser:
            return JsonResponse({'message': 'Restricted Access'}, status=403)
        try:
            files = Files.objects.get(id=kwargs['fileid'])
            group = files.group
            users = group.user_set.values('username')
            for user in users:
                if user['username'] == request.user.username:
                    try:
                        set_data_to_s3(files.url.name, request.GET['content'])
                        return JsonResponse({'message': 'Success'}, status=200)
                    except Exception as e:
                        return JsonResponse({'message': 'Error: '+ e.__str__() + '\n Try downloading the file instead.'}, status=404)
            return JsonResponse({'message': 'Restricted Access'}, status=403)
        except ObjectDoesNotExist:
            return JsonResponse({'message': 'File not found!'}, status=404)


class DeleteFile(APIView):
    def get(self, request, *args,**kwargs):
        if type(request.user) == AnonymousUser:
            return JsonResponse({'message': 'Restricted Access'}, status=403)
        try:
            files = Files.objects.get(id=kwargs['fileid'])
            group = files.group
            users = group.user_set.values('username')
            for user in users:
                if user['username'] == request.user.username:
                    try:
                        file = Files.objects.get(id=kwargs['fileid'])
                        name = file.url.name
                        file.delete()
                        global s3client
                        s3client.delete_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key='documents/' + name)
                        return JsonResponse({'message': 'Success'}, status=200)
                    except ObjectDoesNotExist:
                        return JsonResponse({'message': 'File not found!'}, status=404)
            return JsonResponse({'message': 'Restricted Access'}, status=403)
        except ObjectDoesNotExist:
            return JsonResponse({'message': 'File not found!'}, status=404)


class GetFileData(APIView):
    def get(self, request, *args, **kwargs):
        if type(request.user) == AnonymousUser:
            return JsonResponse({'message': 'Restricted Access'}, status=403)
        try:
            files = Files.objects.get(id=kwargs['fileid'])
            group = files.group
            users = group.user_set.values('username')
            for user in users:
                if user['username'] == request.user.username:
                    try:
                        data = dict()
                        data['data'] = get_data_from_s3(files.url.name)
                        return JsonResponse(data, status=200)
                    except Exception as e:
                        return JsonResponse({
                            'message': 'Error: ' + e.__str__() + '\n Try downloading the file instead.',
                            'url': files.url},
                        status=404)
            return JsonResponse({'message': 'Restricted Access'}, status=403)
        except ObjectDoesNotExist:
            return JsonResponse({'message': 'File data not found!'}, status=404)


class DownloadFile(APIView):
    def get(self, request, *args, **kwargs):
        if type(request.user) == AnonymousUser:
            return JsonResponse({'message': 'Restricted Access'}, status=403)
        try:
            file = Files.objects.get(id=kwargs['fileid'])
            group = file.group
            users = group.user_set.values('username')
            for user in users:
                if user['username'] == request.user.username:
                    try:
                        filename = file.url.name.split('/')[-1]
                        response = HttpResponse(file.url, content_type='text/plain')
                        response['Content-Disposition'] = 'attachment; filename=%s' % filename
                        return response
                    except FileNotFoundError:
                        return JsonResponse({'message': 'File not found!'}, status=404)
            return JsonResponse({'message': 'Restricted Access'}, status=403)
        except ObjectDoesNotExist:
            return JsonResponse({'message': 'File not found!'}, status=404)
