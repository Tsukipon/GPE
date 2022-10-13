import datetime
from django.db import models


class CurrencyPair(models.Model):
    """
    Model of the Forex pair currencies that allow us to retrived stock market price
    for each one of them and configure alerts.
    """
    symbol = models.CharField(max_length=10, primary_key=True)
    # ask_average = models.FloatField(default=0.0)
    # bid_average = models.FloatField(default=0.0)
    # spread = models.FloatField(default=0.0)
    # ask_market_closure = models.FloatField(default=0.0)
    # bid_market_closure = models.FloatField(default=0.0)
    # last_refresh = models.DateTimeField(
    #     default=datetime.datetime.now())
    # ask_pip_variation = models.FloatField(default=0.0)
    # bid_pip_variation = models.FloatField(default=0.0)
    # ask_pip_variation_value = models.FloatField(default=0.0)
    # bid_pip_variation_value = models.FloatField(default=0.0)
    # ask_percentage_variation = models.FloatField(default=0.0)
    # bid_percentage_variation = models.FloatField(default=0.0)
    # description = models.CharField(max_length=100)
    # tradeable = models.BooleanField(default=1)


class CurrencyPairOrders(models.Model):
    """
    Order book ask/bid for each currency
    """
    ORDER_TYPE = (
        ('ask', 'ask'),
        ('bid', 'bid'),
    )
    symbol = models.ForeignKey(
        CurrencyPair, on_delete=models.CASCADE, null=False
    )
    order_type = models.CharField(
        max_length=3, choices=ORDER_TYPE, null=False, default="ask"
    )
    liquidity = models.IntegerField(null=False, default=0)
    price = models.FloatField(null=False, default=0.0)
    closeout_ask = models.FloatField(null=False, default=0.0)
    closeout_bid = models.FloatField(null=False, default=0.0)
    timestamp = models.DateTimeField(null=True)


class Alert(models.Model):
    """Model of alerts."""
    DEVICE_CHOICE = (
        ('e-mail', 'e-mail'),
        ('sms', 'sms'),
        ('notification', 'notification')
    )
    PROTECTION_LEVEL = (
        ('private', 'private'),
        ('limited', 'limited'),
        ('public', 'public')
    )
    alert_name = models.CharField(max_length=50, null=False)
    currency_pair = models.ForeignKey(
        CurrencyPair, on_delete=models.CASCADE, null=False)
    expire = models.BooleanField(null=False)
    expiration_date = models.DateTimeField(null=True)
    alerting_device = models.CharField(
        max_length=20, choices=DEVICE_CHOICE, default='notification')
    is_active = models.BooleanField(null=False, default=True)
    description = models.CharField(max_length=255, null=True)
    protection_level = models.CharField(
        max_length=15, choices=PROTECTION_LEVEL, null=False, default='private')


class AlertTrigger(models.Model):
    """Table that create a configuration for combined alerts"""
    TRIGGER_TYPE = (
        ('ask', 'ask'),
        ('bid', 'bid'),
    )
    TRIGGER_CONDITION = (
        ('crossing', 'crossing'),
        ('upcrossing', 'upcrossing'),
        ('downcrossing', 'downcrossing'),
        ('bigger than', 'bigger than'),
        ('lesser than', 'lesser than'),
        ('percentage increase', 'percentage increase'),
        ('percentage decrease', 'percentage decrease'),
        ('pip increase', 'pip increase'),
        ('pip decrease', 'pip decrease')
    )
    alert = models.ForeignKey(
        Alert, on_delete=models.CASCADE, null=False
    )
    trigger_type = models.CharField(
        max_length=50, choices=TRIGGER_TYPE, null=False)
    trigger_condition = models.CharField(
        max_length=50, choices=TRIGGER_CONDITION, null=False)
    value = models.FloatField(null=False)
    is_active = models.BooleanField(null=False, default=True)


class UserAlert(models.Model):
    """Table that bounds the user and the alerts to keep track of the property of each alert."""
    user_id = models.IntegerField(null=False)
    alert_id = models.IntegerField(null=False)
