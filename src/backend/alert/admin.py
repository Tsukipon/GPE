from django.contrib import admin

from alert.models import Alert


class AlertAdmin(admin.ModelAdmin):
    """ Handle Alert instances display on admin console. """
    pass


admin.site.register(Alert)
