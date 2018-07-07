from django.contrib.auth.models import User, Group
from rest_framework.serializers import ModelSerializer

from CollaborateApp.serializers.group_Serializers import GroupSerializer


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('last_name', 'first_name', 'username')

    def __str__(self):
        return self.data


class UserDetailsSerializer(ModelSerializer):
    groups = GroupSerializer(many=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'groups')

    def __str__(self):
        return self.data


class GroupDetailsSerializer(ModelSerializer):
    user_set = UserSerializer(many=True)

    class Meta:
        model = Group
        fields = ('id', 'name', 'user_set')

    def __str__(self):
        return self.data
