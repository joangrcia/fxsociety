from sqlalchemy.orm import Session

from app.models.crm import ActivityLog


def log_activity(
    db: Session,
    customer_id: int,
    type: str,
    reference_id: str = None,
    metadata: dict = None,
):
    """
    Log an activity for a customer.
    type: order_created, order_status_updated, ticket_created, ticket_updated, note_added, tag_added, tag_removed
    """
    log = ActivityLog(
        customer_id=customer_id,
        type=type,
        reference_id=reference_id,
        metadata_json=metadata,
    )
    db.add(log)
    # We assume db.commit() is called by the caller transaction
