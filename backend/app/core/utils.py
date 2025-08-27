"""
Utility functions
"""

import os
import uuid
from typing import Optional
from datetime import datetime
import json

def generate_unique_filename(original_filename: str) -> str:
    """Generate unique filename with UUID"""
    file_extension = os.path.splitext(original_filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    return unique_filename

def save_uploaded_file(file_content: bytes, filename: str, upload_dir: str = "uploads") -> str:
    """Save uploaded file and return file path"""
    os.makedirs(upload_dir, exist_ok=True)
    unique_filename = generate_unique_filename(filename)
    file_path = os.path.join(upload_dir, unique_filename)
    
    with open(file_path, "wb") as f:
        f.write(file_content)
    
    return file_path

def mock_ocr_processing(image_path: str) -> dict:
    """Mock OCR processing for Write & Fix feature"""
    # In production, this would use actual OCR service
    return {
        "extracted_text": "This is a sample text extracted from the image with some spelling mistakes.",
        "corrections": [
            {"original": "mistakse", "corrected": "mistakes", "position": 65}
        ],
        "confidence": 0.95
    }

def mock_ai_feedback(text: str, corrections: list) -> dict:
    """Mock AI feedback generation"""
    # In production, this would use actual AI service
    return {
        "feedback": "Good effort! You made 1 spelling mistake. Remember to double-check your spelling.",
        "suggestions": [
            "Practice spelling common words",
            "Read more to improve vocabulary"
        ],
        "score": 85,
        "mini_lesson": {
            "title": "Spelling Tips",
            "content": "When writing, try to sound out words slowly and think about their spelling patterns."
        }
    }

def mock_auto_grading(submission_content: str, assignment_type: str = "essay") -> dict:
    """Mock auto-grading for assignments"""
    # In production, this would use actual AI grading service
    return {
        "grade": 85,
        "feedback": "Well-structured response with good use of vocabulary. Consider adding more examples to support your points.",
        "rubric_scores": {
            "grammar": 90,
            "vocabulary": 85,
            "structure": 80,
            "content": 85
        },
        "suggestions": [
            "Add more supporting examples",
            "Check punctuation in paragraph 2"
        ]
    }

def calculate_streak(last_activity_date: Optional[datetime]) -> int:
    """Calculate user's activity streak"""
    if not last_activity_date:
        return 0
    
    today = datetime.utcnow().date()
    last_date = last_activity_date.date()
    
    if last_date == today:
        return 1  # Simplified for demo
    elif (today - last_date).days == 1:
        return 1  # Would need to track actual streak in database
    else:
        return 0

def format_progress_data(stats: dict) -> dict:
    """Format progress data for frontend consumption"""
    return {
        "lessons_completed": stats.get("lessons_completed", 0),
        "quests_completed": stats.get("quests_completed", 0),
        "streak_days": stats.get("streak_days", 0),
        "stars_earned": stats.get("stars_earned", 0),
        "level": min(stats.get("stars_earned", 0) // 100 + 1, 10),  # Level based on stars
        "progress_percentage": min((stats.get("lessons_completed", 0) * 10), 100)
    }
