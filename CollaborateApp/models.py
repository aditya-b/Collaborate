from django.contrib.auth.models import Group
from django.db import models

# Create your models here.
from django.db.models import ForeignKey, CASCADE, DateTimeField, FileField, EmailField, IntegerField
from django.utils.timezone import now


def get_path(instance, filename):

    return '{0}/{1}'.format(instance.group.id,filename)

class Files(models.Model):
    group = ForeignKey(Group,on_delete=CASCADE)
    last_modified = DateTimeField(default=now())
    url = FileField(upload_to=get_path)


class PasswordResetStats(models.Model):
    email = EmailField()
    reset_code = IntegerField()