# pyright: reportMissingImports=false, reportUnknownVariableType=false, reportUnknownMemberType=false

import os
from pathlib import Path

from corsheaders.defaults import default_headers, default_methods

from fxsociety_drf.env import load_runtime_config

BASE_DIR = Path(__file__).resolve().parent.parent

RUNTIME_CONFIG = load_runtime_config()

SECRET_KEY = RUNTIME_CONFIG["SECRET_KEY"]
DEBUG = RUNTIME_CONFIG["ENVIRONMENT"].lower() in ("development", "dev")
ALLOWED_HOSTS = (
    os.environ.get("ALLOWED_HOSTS", "").split(",")
    if os.environ.get("ALLOWED_HOSTS")
    else (["*"] if DEBUG else [])
)
ENVIRONMENT = RUNTIME_CONFIG["ENVIRONMENT"]
ADMIN_USERNAME = RUNTIME_CONFIG["ADMIN_USERNAME"]
ADMIN_PASSWORD = RUNTIME_CONFIG["ADMIN_PASSWORD"]
ALGORITHM = RUNTIME_CONFIG["ALGORITHM"]
ACCESS_TOKEN_EXPIRE_MINUTES = RUNTIME_CONFIG["ACCESS_TOKEN_EXPIRE_MINUTES"]
JWT_ISSUER = RUNTIME_CONFIG["JWT_ISSUER"]
JWT_AUDIENCE = RUNTIME_CONFIG["JWT_AUDIENCE"]

INSTALLED_APPS = [
    "django.contrib.contenttypes",
    "corsheaders",
    "rest_framework",
    "legacydb",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
]

ROOT_URLCONF = "fxsociety_drf.urls"

TEMPLATES = []

WSGI_APPLICATION = "fxsociety_drf.wsgi.application"
ASGI_APPLICATION = "fxsociety_drf.asgi.application"

DATABASES = RUNTIME_CONFIG["DATABASES"]

CORS_ALLOWED_ORIGINS = RUNTIME_CONFIG["CORS_ALLOWED_ORIGINS"]
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = list(default_headers) + ["x-requested-with"]
CORS_ALLOW_METHODS = list(default_methods)

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

APPEND_SLASH = False

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "api.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
    ],
    "DEFAULT_PARSER_CLASSES": [
        "rest_framework.parsers.JSONParser",
        "rest_framework.parsers.FormParser",
    ],
    "UNAUTHENTICATED_USER": None,
}
