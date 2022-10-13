from alert.models import Alert, AlertTrigger
from rest_framework import serializers
from django.conf import settings
from alert.models import UserAlert
from alert.models import CurrencyPair

class AlertTriggerSerializer(serializers.ModelSerializer):
    """
    The serializer analyses the content of the json received by the api
    for the triggers and allows an easy parsing and data integrity.        
    """
    alert = serializers.PrimaryKeyRelatedField(
        queryset=Alert.objects.all(), required=False)
    trigger_type = serializers.ChoiceField(
        choices=AlertTrigger.TRIGGER_TYPE, required=True
    )
    trigger_condition = serializers.ChoiceField(
        choices=AlertTrigger.TRIGGER_CONDITION, required=True
    )
    value = serializers.FloatField(min_value=0.0, required=True)
    is_active = serializers.BooleanField(required=True)

    class Meta:
        model = AlertTrigger
        fields = '__all__'
        #fields = ['trigger_type', 'trigger_condition', 'value']

    def create(self, validated_data):
        return AlertTrigger.objects.create(**validated_data)

    def update(self, AlertTrigger, validated_data):
        AlertTrigger.trigger_type = validated_data.get(
            "trigger_type", AlertTrigger.trigger_type
        )
        AlertTrigger.trigger_condition = validated_data.get(
            "trigger_condition", AlertTrigger.trigger_condition
        )
        AlertTrigger.value = validated_data.get(
            "value", AlertTrigger.value
        )
        AlertTrigger.save()
        return AlertTrigger


class AlertSerializer(serializers.ModelSerializer):
    """
    The serializer analyses the content of the json received by the api
    for the alerts and allows an easy parsing and data integrity.        
    """
    triggers = AlertTriggerSerializer(many=True, write_only=True)
    alert_name = serializers.CharField(required=True)
    currency_pair = serializers.PrimaryKeyRelatedField(
        queryset=CurrencyPair.objects.all(), required=True)
    expire = serializers.BooleanField(required=True)
    expiration_date = serializers.DateTimeField(
        format=settings.DATE_INPUT_FORMATS, required=False)
    alerting_device = serializers.ChoiceField(
        choices=Alert.DEVICE_CHOICE, required=True)
    is_active = serializers.BooleanField(required=True)
    description = serializers.CharField(required=False)
    protection_level = serializers.ChoiceField(
        choices=Alert.PROTECTION_LEVEL, required=True
    )

    class Meta:
        model = Alert
        fields = '__all__'

    def create(self, validated_data):
        """
        Create and return a new Alert instance, given the validated data.
        """
        triggers = validated_data.pop('triggers')
        alert = Alert.objects.create(**validated_data)
        for trigger in triggers:
            AlertTrigger.objects.create(**trigger, alert=alert)
        return alert

    def update(self, Alert, validated_data):
        """
        Update and return an existing Alert instance, given the validated data.
        """
        Alert.alert_name = validated_data.get("alert_name", Alert.alert_name)
        Alert.expire = validated_data.get(
            "expire", Alert.expire)
        Alert.expiration_date = validated_data.get(
            "expiration_date", Alert.expiration_date)
        Alert.alerting_device = validated_data.get(
            "alerting_device", Alert.alerting_device)
        Alert.currency_pair = validated_data.get(
            "currency_pair", Alert.currency_pair)
        Alert.is_active = validated_data.get("is_active", Alert.is_active)
        Alert.description = validated_data.get(
            "description", Alert.description)
        Alert.protection_level = validated_data.get(
            "protection_level", Alert.protection_level
        )
        Alert.save()
        return Alert


class UserAlertSerializer(serializers.ModelSerializer):
    """
    The serializer analyses the content of the json received by the api
    for the user/alerts couples and allows an easy parsing and data integrity.        
    """
    user_id = serializers.IntegerField()
    alert_id = serializers.IntegerField()

    class Meta:
        model = UserAlert
        fields = '__all__'

    def create(self, validated_data):
        return UserAlert.objects.create(**validated_data)

    def update(self, UserAlert, validated_data):
        UserAlert.user_id = validated_data.get(
            "user_id", UserAlert.user_id)
        UserAlert.alert_id = validated_data.get(
            "alert_id", UserAlert.alert_id)
        UserAlert.save()
        return UserAlert


