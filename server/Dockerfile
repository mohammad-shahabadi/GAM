FROM python:3.10

ENV PYTHONUNBUFFERED 1
ENV DJANGO_SETTINGS_MODULE gam.settings

WORKDIR /gam_backend

COPY . /gam_backend/

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

EXPOSE 8000

# Dummy values only satisfy settings at build time; real ones come from server/.env at runtime
RUN SECRET_KEY=build-only POSTGRES_USER=build POSTGRES_PASSWORD=build python manage.py collectstatic --noinput