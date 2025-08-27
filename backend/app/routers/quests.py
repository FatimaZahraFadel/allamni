"""
Quests router - Mini-games and exercises for students
"""

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional

from ..core.database import get_db
from ..core.security import require_student, require_teacher, get_current_active_user
from ..core.utils import save_uploaded_file, mock_ocr_processing, mock_ai_feedback
from ..models.user import User
from ..models.quest import Quest, QuestAttempt
from ..models.correction import Correction
from ..models.progress import ProgressStats
from ..schemas.quest import (
    QuestCreate, QuestUpdate, QuestResponse, QuestAttemptCreate,
    QuestAttemptResponse, QuestAttemptResult, QuestProgress
)
from ..schemas.correction import CorrectionCreate, CorrectionResponse, CorrectionResult, DictationCheck, DictationResult

router = APIRouter()

# Quest Management (Teachers)
@router.post("/", response_model=QuestResponse, status_code=status.HTTP_201_CREATED)
async def create_quest(
    quest_data: QuestCreate,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Create a new quest (teachers only)"""
    quest = Quest(
        title=quest_data.title,
        description=quest_data.description,
        quest_type=quest_data.quest_type,
        difficulty=quest_data.difficulty,
        subject=quest_data.subject,
        grade_level=quest_data.grade_level,
        content_json=quest_data.content_json,
        points_reward=quest_data.points_reward
    )
    
    db.add(quest)
    db.commit()
    db.refresh(quest)
    
    return QuestResponse.from_orm(quest)

@router.get("/", response_model=List[QuestResponse])
async def get_quests(
    quest_type: Optional[str] = None,
    difficulty: Optional[str] = None,
    subject: Optional[str] = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get available quests"""
    query = db.query(Quest).filter(Quest.is_active == True)
    
    if quest_type:
        query = query.filter(Quest.quest_type == quest_type)
    if difficulty:
        query = query.filter(Quest.difficulty == difficulty)
    if subject:
        query = query.filter(Quest.subject == subject)
    
    quests = query.all()
    return [QuestResponse.from_orm(quest) for quest in quests]

@router.get("/{quest_id}", response_model=QuestResponse)
async def get_quest(
    quest_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get quest by ID"""
    quest = db.query(Quest).filter(Quest.id == quest_id, Quest.is_active == True).first()
    
    if not quest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quest not found"
        )
    
    return QuestResponse.from_orm(quest)

# Quest Attempts (Students)
@router.post("/attempt", response_model=QuestAttemptResult)
async def attempt_quest(
    attempt_data: QuestAttemptCreate,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db)
):
    """Attempt a quest"""
    quest = db.query(Quest).filter(Quest.id == attempt_data.quest_id, Quest.is_active == True).first()
    
    if not quest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quest not found"
        )
    
    # Simple validation logic (would be more complex in production)
    is_correct = False
    points_earned = 0
    
    if quest.quest_type == "fill_in_blank":
        correct_answers = quest.content_json.get("correct_answers", [])
        user_answers = attempt_data.answer_data.get("answers", [])
        is_correct = user_answers == correct_answers
    elif quest.quest_type == "multiple_choice":
        correct_answer = quest.content_json.get("correct_answer")
        user_answer = attempt_data.answer_data.get("selected_option")
        is_correct = user_answer == correct_answer
    elif quest.quest_type == "reorder":
        correct_order = quest.content_json.get("correct_order", [])
        user_order = attempt_data.answer_data.get("order", [])
        is_correct = user_order == correct_order
    
    if is_correct:
        points_earned = quest.points_reward
    
    # Save attempt
    attempt = QuestAttempt(
        quest_id=attempt_data.quest_id,
        student_id=current_user.id,
        answer_data=attempt_data.answer_data,
        is_correct=is_correct,
        points_earned=points_earned
    )
    
    db.add(attempt)
    
    # Update student progress
    progress = db.query(ProgressStats).filter(ProgressStats.student_id == current_user.id).first()
    if progress:
        progress.quests_completed += 1
        progress.stars_earned += points_earned
        if is_correct:
            progress.streak_days = max(progress.streak_days, 1)  # Simplified streak logic
    
    db.commit()
    db.refresh(attempt)
    
    return QuestAttemptResult(
        is_correct=is_correct,
        points_earned=points_earned,
        correct_answer=quest.content_json.get("correct_answers", quest.content_json.get("correct_answer")),
        explanation=quest.content_json.get("explanation", "Good job!")
    )

@router.get("/attempts", response_model=List[QuestAttemptResponse])
async def get_quest_attempts(
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db)
):
    """Get student's quest attempts"""
    attempts = db.query(QuestAttempt).filter(QuestAttempt.student_id == current_user.id).all()
    return [QuestAttemptResponse.from_orm(attempt) for attempt in attempts]

@router.get("/progress", response_model=QuestProgress)
async def get_quest_progress(
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db)
):
    """Get student's quest progress"""
    total_quests = db.query(Quest).filter(Quest.is_active == True).count()
    attempts = db.query(QuestAttempt).filter(QuestAttempt.student_id == current_user.id).all()
    
    completed_quests = len(set(attempt.quest_id for attempt in attempts))
    total_points = sum(attempt.points_earned for attempt in attempts)
    correct_attempts = len([a for a in attempts if a.is_correct])
    accuracy_rate = correct_attempts / len(attempts) if attempts else 0
    
    return QuestProgress(
        total_quests=total_quests,
        completed_quests=completed_quests,
        total_points=total_points,
        accuracy_rate=accuracy_rate
    )

# Write & Fix Feature
@router.post("/write-fix/upload", response_model=CorrectionResult)
async def upload_image_for_correction(
    file: UploadFile = File(...),
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db)
):
    """Upload image for OCR and correction"""
    # Save uploaded file
    file_content = await file.read()
    file_path = save_uploaded_file(file_content, file.filename)
    
    # Mock OCR processing
    ocr_result = mock_ocr_processing(file_path)
    
    # Mock AI feedback
    ai_feedback = mock_ai_feedback(ocr_result["extracted_text"], ocr_result["corrections"])
    
    # Save correction record
    correction = Correction(
        student_id=current_user.id,
        uploaded_image_url=file_path,
        original_text=ocr_result["extracted_text"],
        corrected_text=ocr_result["extracted_text"],  # Would be corrected in production
        corrections_data=ocr_result["corrections"],
        feedback=ai_feedback["feedback"],
        ai_score=ai_feedback["score"],
        mini_lesson_data=ai_feedback["mini_lesson"]
    )
    
    db.add(correction)
    
    # Update student progress
    progress = db.query(ProgressStats).filter(ProgressStats.student_id == current_user.id).first()
    if progress:
        progress.lessons_completed += 1
        progress.stars_earned += 5  # Points for completing correction
    
    db.commit()
    db.refresh(correction)
    
    return CorrectionResult(
        original_text=ocr_result["extracted_text"],
        corrected_text=ocr_result["extracted_text"],
        corrections=ocr_result["corrections"],
        feedback=ai_feedback["feedback"],
        score=ai_feedback["score"],
        mini_lesson=ai_feedback["mini_lesson"],
        suggestions=ai_feedback["suggestions"]
    )

@router.post("/write-fix/text", response_model=CorrectionResult)
async def submit_text_for_correction(
    correction_data: CorrectionCreate,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db)
):
    """Submit text for correction"""
    if not correction_data.text_content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Text content is required"
        )
    
    # Mock AI feedback
    ai_feedback = mock_ai_feedback(correction_data.text_content, [])
    
    # Save correction record
    correction = Correction(
        student_id=current_user.id,
        original_text=correction_data.text_content,
        corrected_text=correction_data.text_content,  # Would be corrected in production
        feedback=ai_feedback["feedback"],
        ai_score=ai_feedback["score"],
        mini_lesson_data=ai_feedback["mini_lesson"]
    )
    
    db.add(correction)
    
    # Update student progress
    progress = db.query(ProgressStats).filter(ProgressStats.student_id == current_user.id).first()
    if progress:
        progress.lessons_completed += 1
        progress.stars_earned += 5
    
    db.commit()
    db.refresh(correction)
    
    return CorrectionResult(
        original_text=correction_data.text_content,
        corrected_text=correction_data.text_content,
        corrections=[],
        feedback=ai_feedback["feedback"],
        score=ai_feedback["score"],
        mini_lesson=ai_feedback["mini_lesson"],
        suggestions=ai_feedback["suggestions"]
    )

# Dictation Feature
@router.post("/dictation", response_model=DictationResult)
async def check_dictation(
    dictation_data: DictationCheck,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db)
):
    """Check dictation text for spelling and grammar"""
    # Mock dictation checking
    errors = [
        {"word": "mistakse", "correction": "mistakes", "position": 10, "type": "spelling"},
        {"word": "there", "correction": "their", "position": 25, "type": "grammar"}
    ]
    
    corrected_text = dictation_data.text
    for error in errors:
        corrected_text = corrected_text.replace(error["word"], error["correction"])
    
    score = max(0, 100 - len(errors) * 10)
    
    # Update student progress
    progress = db.query(ProgressStats).filter(ProgressStats.student_id == current_user.id).first()
    if progress:
        progress.lessons_completed += 1
        progress.stars_earned += max(1, score // 20)
    
    db.commit()
    
    return DictationResult(
        original_text=dictation_data.text,
        corrected_text=corrected_text,
        errors=errors,
        score=score,
        feedback=f"You scored {score}%. {'Great job!' if score >= 80 else 'Keep practicing!'}"
    )

@router.get("/corrections", response_model=List[CorrectionResponse])
async def get_corrections(
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db)
):
    """Get student's correction history"""
    corrections = db.query(Correction).filter(Correction.student_id == current_user.id).all()
    return [CorrectionResponse.from_orm(correction) for correction in corrections]
