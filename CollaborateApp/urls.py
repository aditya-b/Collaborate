from django.conf.urls.static import static
from django.views.decorators.csrf import csrf_exempt

from CollaborateApp.views import *
from CollaborateApp.rest_apis import *
from django.urls import path

from CollaborateApp.views.authentication import LoginView, SignupView, log_out

app_name = 'collaborate'

urlpatterns = [
    path('api/get_user/<str:username>', GetUserDetails.as_view(), name='get_user'),
    path('api/add_user/', AddUser.as_view(), name='add_user'),
    path('upload_file/<int:groupid>', model_form_upload, name='file_form'),
    path('api/files/<int:group>/', GetFiles.as_view(), name='group_files'),
    path('api/groups/<int:group>/', GroupDetails.as_view(), name='group_details'),
    path('api/groups/add/', AddGroup.as_view(), name='add_group'),
    path('api/groups/delete/<int:group>/', DeleteGroup.as_view(), name='delete_group'),
    path('api/users/user_details/', load_groups, name='load_user_details'),
    path('api/file/get/<int:fileid>/', GetFileData.as_view(), name='get_file_data'),
    path('api/file/edit/<int:fileid>/', csrf_exempt(EditFile.as_view()), name='edit_file'),
    path('api/file/delete/<int:fileid>/', DeleteFile.as_view(), name='delete_file'),
    path('api/file/download/<int:fileid>/', DownloadFile.as_view(), name='download_file'),
    path('api/file/url/<int:fileid>/', FileUrl.as_view(), name='get_file_url'),
    path('api/<int:group>/add_user/', AddToGroup.as_view(), name='add_to_group'),
    path('api/<int:group>/remove_user/<str:user>', DeleteFromGroup.as_view(), name='delete_from_group'),
    path('<str:username>/workspace/', DisplayGroups.as_view(), name='ui_workspace_groups'),
    path('login/', LoginView.as_view(), name='login'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('logout/', log_out, name='logout'),
    path('sample/', sampleview, name='college_details_rest'),
    path(r'', homeview, name='home',),
    path('userhome/', load_user_home, name='user_home'),
    path('change_password_page/', fetch_change_password_page, name='fetch_change_password_page'),
    path('edit_profile_page/', fetch_edit_profile_page, name='fetch_edit_profile_page'),
    path('change_password/', ChangePassword.as_view(), name='change_password'),
    path('edit_profile/', fetch_edit_profile_page, name='edit_profile'),
    path('reset_password/', ResetPassword.as_view(), name='reset_password'),
    path('send_reset_code/', EmailResetCode.as_view(), name='send_reset_code'),
    path('api/get_users_by_keyword/', GetUsersByKeyword.as_view(), name='get_users_by_keyword'),
]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)