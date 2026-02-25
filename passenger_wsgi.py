import os
import sys

# Add the project root to the Python path
sys.path.insert(0, os.path.dirname(__file__))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "fxsociety_drf.settings")

from django.core.wsgi import get_wsgi_application  # noqa: E402

application = get_wsgi_application()
