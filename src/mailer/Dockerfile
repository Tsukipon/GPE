FROM python:3
WORKDIR /app
RUN mkdir templates
# COPY src/mailer/templates/*.html /app/templates/
# COPY src/mailer/static/css/mail.css /app/static/css/
# COPY ["src/mailer/app.py","src/mailer/requirements.txt","/app/"]
COPY . /app/
RUN pip install -r requirements.txt
CMD ["python", "app.py"]
