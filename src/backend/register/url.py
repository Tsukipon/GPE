from . import views
from django.urls import path

urlpatterns = [
    path("register/", views.register),
    path("login/", views.CustomAuthToken.as_view()),
    path("logout/", views.logout),
    path("refresh/", views.RefreshAuthToken.as_view()),
    path("user/", views.user_detail),
    path("check_account/uuid=<str:uuid>/", views.check_account),
    path("ask_reset_password/", views.ask_reset_password),
    path("reset_password/uuid=<str:uuid>/", views.reset_password),
    path("change_password/", views.change_password),
    path("change_skill_level/", views.modify_user_experience),
    path("update_user/", views.update_user),
    path("users/", views.user_list),
    path("ask_secret/", views.ask_secret),
    path("get_followers/", views.get_followers),
    path("get_followed/", views.get_followed),
    path("get_follower_requests/", views.get_follower_requests),
    path("share_secret/", views.share_secret),
    path("follow/", views.follow),
    path("block_user/", views.block_user),
    path("unblock_user/", views.unblock_user),
    path("blocked_users/",views.get_blocked_users)
]
