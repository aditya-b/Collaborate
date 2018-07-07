from django.forms import ModelForm

from CollaborateApp.models import Files


class FileForm(ModelForm):
    class Meta:
        model = Files
        fields = ('url', )