from django.core.management.base import BaseCommand
from django.db import connection
from django.apps import apps

class Command(BaseCommand):
    help = 'Creates the legacy database tables matching exactly models.py'

    def handle(self, *args, **options):
        self.stdout.write("Setting up legacy database tables dynamically...")

        app_models = apps.get_app_config('legacydb').get_models()

        with connection.schema_editor() as schema_editor:
            for model in app_models:
                # Temporarily make it managed to let Django generate SQL
                model._meta.managed = True
                
                try:
                    schema_editor.create_model(model)
                    self.stdout.write(f"Created table for {model.__name__}")
                except Exception as e:
                    self.stdout.write(self.style.WARNING(f"Table for {model.__name__} might already exist or error: {e}"))
                finally:
                    # Revert to unmanaged
                    model._meta.managed = False

        self.stdout.write(self.style.SUCCESS("Successfully created all legacy tables!"))