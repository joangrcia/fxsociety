from sqlalchemy import create_engine, text, inspect
from sqlalchemy.orm import sessionmaker, declarative_base
from pathlib import Path

# Database file location
DATABASE_DIR = Path(__file__).parent.parent
DATABASE_PATH = DATABASE_DIR / "fxsociety.db"
DATABASE_URL = f"sqlite:///{DATABASE_PATH}"

# SQLAlchemy engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},  # Required for SQLite
    echo=False,  # Set to True for SQL debugging
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()


def get_db():
    """Dependency for getting database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def check_and_migrate_db():
    """Simple migration to add missing columns."""
    try:
        inspector = inspect(engine)
        if "orders" in inspector.get_table_names():
            columns = [c["name"] for c in inspector.get_columns("orders")]
            if "user_id" not in columns:
                print("Migrating: Adding user_id to orders table...")
                with engine.connect() as conn:
                    # Add column
                    conn.execute(
                        text(
                            "ALTER TABLE orders ADD COLUMN user_id INTEGER REFERENCES users(id)"
                        )
                    )
                    conn.commit()
                    # Create index
                    conn.execute(
                        text("CREATE INDEX ix_orders_user_id ON orders (user_id)")
                    )
                    conn.commit()
                print("Migration complete.")
    except Exception as e:
        print(f"Migration check failed: {e}")


def init_db():
    """Initialize database tables."""
    from app.models import product, order, user  # noqa: F401

    # Create tables if not exist
    Base.metadata.create_all(bind=engine)

    # Check for migrations
    check_and_migrate_db()
