# pyright: reportUnknownVariableType=false, reportUnknownMemberType=false

from . import settings as base_settings

ALGORITHM = base_settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = base_settings.ACCESS_TOKEN_EXPIRE_MINUTES
ADMIN_PASSWORD = base_settings.ADMIN_PASSWORD
ADMIN_USERNAME = base_settings.ADMIN_USERNAME
ALLOWED_HOSTS = base_settings.ALLOWED_HOSTS
APPEND_SLASH = base_settings.APPEND_SLASH
ASGI_APPLICATION = base_settings.ASGI_APPLICATION
BASE_DIR = base_settings.BASE_DIR
CORS_ALLOWED_ORIGINS = base_settings.CORS_ALLOWED_ORIGINS
CORS_ALLOW_CREDENTIALS = base_settings.CORS_ALLOW_CREDENTIALS
CORS_ALLOW_HEADERS = base_settings.CORS_ALLOW_HEADERS
CORS_ALLOW_METHODS = base_settings.CORS_ALLOW_METHODS
DEBUG = base_settings.DEBUG
DEFAULT_AUTO_FIELD = base_settings.DEFAULT_AUTO_FIELD
ENVIRONMENT = base_settings.ENVIRONMENT
INSTALLED_APPS = [*base_settings.INSTALLED_APPS]
JWT_AUDIENCE = base_settings.JWT_AUDIENCE
JWT_ISSUER = base_settings.JWT_ISSUER
LANGUAGE_CODE = base_settings.LANGUAGE_CODE
MIDDLEWARE = base_settings.MIDDLEWARE
REST_FRAMEWORK = base_settings.REST_FRAMEWORK
ROOT_URLCONF = base_settings.ROOT_URLCONF
SECRET_KEY = base_settings.SECRET_KEY
TEMPLATES = base_settings.TEMPLATES
TIME_ZONE = base_settings.TIME_ZONE
USE_I18N = base_settings.USE_I18N
USE_TZ = base_settings.USE_TZ
WSGI_APPLICATION = base_settings.WSGI_APPLICATION

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
    }
}
