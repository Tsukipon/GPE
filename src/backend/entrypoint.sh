#!/bin/bash
echo "UPDATE MIGRATIONS"
python manage.py makemigrations
echo "DOING MIGRATIONS"
python manage.py migrate
echo "POPULATE DATABASE WITH CURRENCIES"
python alert/currencies.py
python manage.py loaddata fixtures/seed.json
echo "LAUNCH DEVELOPEMENT SERVER"
python manage.py runserver 0.0.0.0:$BACKEND_PORT
