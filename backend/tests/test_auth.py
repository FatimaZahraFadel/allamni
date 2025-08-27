"""
Authentication tests
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.database import Base, get_db
from main import app

# Test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_register_teacher():
    """Test teacher registration"""
    response = client.post(
        "/api/v1/auth/register",
        json={
            "name": "Test Teacher",
            "email": "teacher@test.com",
            "password": "testpass123",
            "role": "teacher",
            "language_preference": "ar"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["user"]["email"] == "teacher@test.com"
    assert data["user"]["role"] == "teacher"
    assert "access_token" in data

def test_register_student():
    """Test student registration"""
    response = client.post(
        "/api/v1/auth/register",
        json={
            "name": "Test Student",
            "email": "student@test.com",
            "password": "testpass123",
            "role": "student",
            "language_preference": "ar",
            "parent_email": "parent@test.com"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["user"]["email"] == "student@test.com"
    assert data["user"]["role"] == "student"

def test_login():
    """Test user login"""
    # First register a user
    client.post(
        "/api/v1/auth/register",
        json={
            "name": "Login Test",
            "email": "login@test.com",
            "password": "testpass123",
            "role": "teacher",
            "language_preference": "ar"
        }
    )
    
    # Then login
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "login@test.com",
            "password": "testpass123"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "login@test.com"

def test_invalid_login():
    """Test invalid login"""
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "nonexistent@test.com",
            "password": "wrongpass"
        }
    )
    assert response.status_code == 401

def test_get_current_user():
    """Test getting current user info"""
    # Register and login
    register_response = client.post(
        "/api/v1/auth/register",
        json={
            "name": "Current User Test",
            "email": "current@test.com",
            "password": "testpass123",
            "role": "teacher",
            "language_preference": "ar"
        }
    )
    token = register_response.json()["access_token"]
    
    # Get current user
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "current@test.com"
