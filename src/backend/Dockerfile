FROM python:3
WORKDIR /app
COPY . /app/
RUN pip install -r requirements.txt
COPY entrypoint.sh entrypoint.sh
RUN chmod u+x entrypoint.sh
RUN chmod u+x faker.sh
CMD ["bash","/app/entrypoint.sh"]