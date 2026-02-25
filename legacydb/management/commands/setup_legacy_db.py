from django.core.management.base import BaseCommand
from django.db import connection


class Command(BaseCommand):
    help = (
        "Creates the legacy database tables (because they are managed=False in models)"
    )

    def handle(self, *args, **options):
        self.stdout.write("Setting up legacy database tables...")

        with connection.cursor() as cursor:
            # Users
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS "users" (
                "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
                "email" varchar(255) NOT NULL UNIQUE,
                "password_hash" varchar(255) NOT NULL,
                "full_name" varchar(255) NULL,
                "is_active" bool NOT NULL,
                "created_at" datetime NOT NULL
            );
            """)

            # Products
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS "products" (
                "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
                "slug" varchar(100) NOT NULL UNIQUE,
                "title" varchar(200) NOT NULL,
                "description_short" varchar(500) NOT NULL,
                "description_full" text NULL,
                "price_idr" integer NOT NULL,
                "category" varchar(50) NOT NULL,
                "badges" text NULL,
                "images" text NULL,
                "is_active" bool NOT NULL
            );
            """)

            # Orders
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS "orders" (
                "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
                "order_code" varchar(20) NOT NULL UNIQUE,
                "product_id" integer NOT NULL REFERENCES "products" ("id") DEFERRABLE INITIALLY DEFERRED,
                "user_id" integer NULL REFERENCES "users" ("id") DEFERRABLE INITIALLY DEFERRED,
                "amount_idr" integer NOT NULL,
                "status" varchar(20) NOT NULL,
                "payment_proof_url" varchar(500) NULL,
                "notes" text NULL,
                "created_at" datetime NOT NULL,
                "updated_at" datetime NULL
            );
            """)
            cursor.execute(
                'CREATE INDEX IF NOT EXISTS "orders_product_id" ON "orders" ("product_id");'
            )
            cursor.execute(
                'CREATE INDEX IF NOT EXISTS "orders_user_id" ON "orders" ("user_id");'
            )

            # Tickets
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS "tickets" (
                "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
                "user_id" integer NOT NULL REFERENCES "users" ("id") DEFERRABLE INITIALLY DEFERRED,
                "title" varchar(200) NOT NULL,
                "message" text NOT NULL,
                "status" varchar(20) NOT NULL,
                "created_at" datetime NOT NULL,
                "updated_at" datetime NULL
            );
            """)
            cursor.execute(
                'CREATE INDEX IF NOT EXISTS "tickets_user_id" ON "tickets" ("user_id");'
            )

            # Customer Tags
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS "customer_tags" (
                "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
                "customer_id" integer NOT NULL REFERENCES "users" ("id") DEFERRABLE INITIALLY DEFERRED,
                "tag" varchar(50) NOT NULL,
                "created_at" datetime NOT NULL
            );
            """)
            cursor.execute(
                'CREATE INDEX IF NOT EXISTS "customer_tags_customer_id" ON "customer_tags" ("customer_id");'
            )

            # Customer Notes
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS "customer_notes" (
                "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
                "customer_id" integer NOT NULL REFERENCES "users" ("id") DEFERRABLE INITIALLY DEFERRED,
                "note" text NOT NULL,
                "created_by_admin" varchar(100) NOT NULL,
                "created_at" datetime NOT NULL
            );
            """)
            cursor.execute(
                'CREATE INDEX IF NOT EXISTS "customer_notes_customer_id" ON "customer_notes" ("customer_id");'
            )

            # Activity Logs
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS "activity_logs" (
                "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
                "customer_id" integer NOT NULL REFERENCES "users" ("id") DEFERRABLE INITIALLY DEFERRED,
                "type" varchar(50) NOT NULL,
                "reference_id" varchar(50) NULL,
                "metadata_json" text NULL,
                "created_at" datetime NOT NULL
            );
            """)
            cursor.execute(
                'CREATE INDEX IF NOT EXISTS "activity_logs_customer_id" ON "activity_logs" ("customer_id");'
            )

        self.stdout.write(self.style.SUCCESS("Successfully created all legacy tables!"))
