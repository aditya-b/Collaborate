from random import randint
from smtplib import SMTP

from django.contrib.auth import authenticate
from django.contrib.auth.models import User, Group
from django.core.exceptions import ObjectDoesNotExist
from django.db import IntegrityError
from django.http import JsonResponse
from django.utils.timezone import now
from rest_framework.views import APIView
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from CollaborateApp.models import PasswordResetStats
from CollaborateApp.serializers import UserDetailsSerializer, UserSerializer
from CollaborateApp.views import log_out


class GetUserDetails(APIView):
    def get(self, request, *args, **kwargs):
        user_details = User.objects.get(username=kwargs['username'])
        user_details = UserDetailsSerializer(user_details)
        return JsonResponse(user_details.data, status=200)


class AddUser(APIView):
    def post(self,request, *args, **kwargs):
        try:
            user = User.objects.get(email=request.POST['email'])
            return JsonResponse({'message': 'User with this email already exists!'}, status=404)
        except ObjectDoesNotExist:
            try:
                user = User.objects.create_user(last_name=request.POST['last_name'], first_name=request.POST['first_name'],
                                            email=request.POST['email'], username=request.POST['username'],
                                            password=request.POST['password'])
                user.save()
                group = Group(name=request.POST['username']+'_Personal')
                group.save()
                group.user_set.add(user)
                return JsonResponse({'message': 'Success'}, status=201)
            except IntegrityError:
                return JsonResponse({'message': 'User exists'}, status=404)


class ChangePassword(APIView):
    def get(self, request, *args, **kwargs):
        user = authenticate(username=request.user.username,password=request.GET['old_password'])
        if user is not None:
            user.set_password(request.GET['new_password'])
            user.save()
            log_out(request)
            return JsonResponse({'message': 'Success'}, status=200)
        else:
            return JsonResponse({'message': 'Wrong Credentials!'}, status=404)


class EmailResetCode(APIView):
    def get(self, request, *args, **kwargs):
        try:
            user = User.objects.get(email=request.GET['email'])
            reset_code = randint(10000,99999)
            try:
                existing_request = PasswordResetStats.objects.get(email=request.GET['email'])
                existing_request.reset_code = reset_code
                existing_request.save()
            except ObjectDoesNotExist:
                PasswordResetStats.objects.create(email=request.GET['email'], reset_code=reset_code)
            server = SMTP('smtp.gmail.com', 587)
            server.ehlo()
            server.starttls()
            server.login('collaborate.app.service@gmail.com', 'CollaborateApp@123')
            msg = MIMEMultipart()
            msg['From'] = 'collaborate.app.service@gmail.com'
            msg['To'] = request.GET['email']
            msg['Subject'] = 'Request for password reset for Collaborate'
            mail_text = '<h3>Hello Mr./Mrs. {0}</h3><br><p>There has been a request for a resetting you password at {1}. We use reset code to verify that you have ' \
                       'really requested for the password change. You can reset your password by using the reset code. Please do understand that this ' \
                       'is a one-time reset code and expires as soon as you use it.</p><br><p><h3>Reset Code:<b>{2}</b></h3></p><br><br><br><b>Note:</b>' \
                        ' This is an auto-generated email and please do not reply to this. If you have not requested for a reset code please report the issue' \
                        ' to secure your account.'
            mail_text = mail_text.format(user.first_name + ' ' + user.last_name, str(now()), str(reset_code))
            mail_text = MIMEText(mail_text, 'html')
            msg.attach(mail_text)
            response = server.sendmail(msg['From'], msg['To'], msg.as_string())
            if (response.__len__() == 0):
                return JsonResponse({'message':'Reset code emailed to <b>{0}</b>.'.format(msg['To'])}, status=200)
        except ObjectDoesNotExist:
            return JsonResponse({'message': 'No user with the email id found!'}, status=404)


class ResetPassword(APIView):
    def get(self, request, *args, **kwargs):
        try:
            request_for_reset = PasswordResetStats.objects.get(email=request.GET['email'])
            if str(request_for_reset.reset_code) == request.GET['reset_code']:
                user = User.objects.get(email=request.GET['email'])
                user.set_password(request.GET['password'])
                user.save()
                request_for_reset.delete()
                return JsonResponse({'message': 'Success!'}, status=200)
            else:
                return JsonResponse({'message': 'Invalid reset code!'}, status=404)
        except ObjectDoesNotExist:
            return JsonResponse({'message': 'Invalid reset code!'}, status=404)


class GetUsersByKeyword(APIView):
    def get(self, request, *args, **kwargs):
        keyword = request.GET['keyword']
        users = User.objects.values('username').filter(username__icontains=keyword)
        data = dict()
        data['users'] = []
        for user in users:
            if not user['username'] == request.user.username:
                user_details = User.objects.get(username=user['username'])
                user_details = UserSerializer(user_details).data
                data['users'].append(user_details)
        return JsonResponse(data,status=200)