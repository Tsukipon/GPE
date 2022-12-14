# Generated by Django 3.2.4 on 2022-01-21 11:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('register', '0012_auto_20220121_0957'),
    ]

    operations = [
        migrations.CreateModel(
            name='FollowUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('follower_id', models.IntegerField()),
                ('followed_id', models.IntegerField()),
            ],
            options={
                'unique_together': {('follower_id', 'followed_id')},
            },
        ),
        migrations.CreateModel(
            name='BlockedUsers',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('blocker_user_id', models.IntegerField()),
                ('blocked_user_id', models.IntegerField()),
            ],
            options={
                'unique_together': {('blocker_user_id', 'blocked_user_id')},
            },
        ),
    ]
