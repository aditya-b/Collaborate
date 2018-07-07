from rest_framework.serializers import ModelSerializer

from CollaborateApp.models import Files


class FileSerializer(ModelSerializer):
    class Meta:
        model = Files
        exclude = []

    def __str__(self):
        return self.data
