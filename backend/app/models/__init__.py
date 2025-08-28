# Database models package

# Import all models to ensure proper relationship resolution
from .user import User
from .school import School
from .class_model import Class, StudentClass
from .assignment import Assignment
from .submission import Submission
from .progress import ProgressStats
from .quest import Quest, QuestAttempt
from .correction import Correction
from .subscription import Subscription

# Export all models
__all__ = [
    "User",
    "School",
    "Class",
    "StudentClass",
    "Assignment",
    "Submission",
    "ProgressStats",
    "Quest",
    "QuestAttempt",
    "Correction",
    "Subscription"
]
