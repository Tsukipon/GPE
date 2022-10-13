from django.apps import AppConfig


class AlertConfig(AppConfig):
    """
    Define the name of the Django service
    and the itegrated field type defined for this model if needed.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'alert'
