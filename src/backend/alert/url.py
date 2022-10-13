from django.urls import path
from alert import views

urlpatterns = [
    path("alert/", views.alert_manager),
    path("alerts/", views.alert_list),
    path("alerts_followed/", views.followed_alerts_list)
]
