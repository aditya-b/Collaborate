from django.contrib.auth.models import Group
from rest_framework.serializers import ModelSerializer


class GroupSerializer(ModelSerializer):
    class Meta:
        model = Group
        exclude = []

    def __str__(self):
        return self.data
