FROM python:3.10

ENV PYTHONUNBUFFERED 1
ENV DJANGO_SETTINGS_MODULE gam.settings

WORKDIR /gam

COPY . /gam

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

EXPOSE 8000

RUN python manage.py migrate
RUN python manage.py create_default_admin
RUN python manage.py collectstatic --noinput

CMD ["gunicorn", "gam.wsgi:application", "--bind", "0.0.0.0:8000"]
