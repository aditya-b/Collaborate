"""
Django settings for Collaborate project.

Generated by 'django-admin startproject' using Django 2.1a1.

For more information on this file, see
https://docs.djangoproject.com/en/dev/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/dev/ref/settings/
"""

import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/dev/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'b9$50&^v_^ujx0d40rx^n%h4_#*wa5+twzsu7m%3b2qo^b-#fk'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['collaborate-app.us-east-2.elasticbeanstalk.com', 'localhost']

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'CollaborateApp.apps.CollaborateappConfig',
    'corsheaders'
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'Collaborate.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.media'
            ],
        },
    },
]

WSGI_APPLICATION = 'Collaborate.wsgi.application'

CORS_ORIGIN_ALLOW_ALL = True

# Database
# https://docs.djangoproject.com/en/dev/ref/settings/#databases
if 'RDS_DB_NAME' in os.environ:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': os.environ['RDS_DB_NAME'],
            'USER': os.environ['RDS_USERNAME'],
            'PASSWORD': os.environ['RDS_PASSWORD'],
            'HOST': os.environ['RDS_HOSTNAME'],
            'PORT': os.environ['RDS_PORT'],
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': 'collaborate',
            'HOST': 'localhost',
            'PORT': '3306',
            'USER': 'django',
            'PASSWORD': 'django'
        }
    }



# Password validation
# https://docs.djangoproject.com/en/dev/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/dev/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/dev/howto/static-files/
AWS_ACCESS_KEY_ID = 'AKIAIXWOIFOKG744Q2SA '
AWS_SECRET_ACCESS_KEY = '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'
AWS_STORAGE_BUCKET_NAME = 'elasticbeanstalk-us-east-2-761812765230'
AWS_DOMAIN = 's3.amazonaws.com'
AWS_S3_CUSTOM_DOMAIN = '{0}.{1}'.format(AWS_STORAGE_BUCKET_NAME,AWS_DOMAIN)

AWS_S3_OBJECT_PARAMETERS = {
    'CacheControl': 'max-age=86400',
}
MEDIA_ROOT = os.path.join(BASE_DIR, 'documents')
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
AWS_LOCATION = 'static'
STATICFILES_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
STATIC_URL = "https://%s/%s/static/" % (AWS_S3_CUSTOM_DOMAIN, AWS_LOCATION)
MEDIA_URL = "https://{0}/{1}/documents/".format(AWS_DOMAIN,AWS_STORAGE_BUCKET_NAME)
DEFAULT_FILE_STORAGE = 'Collaborate.storage_backends.DocumentStorage'
