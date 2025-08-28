#!/usr/bin/env python3
"""
Test login API directly
"""

import requests
import json

def test_login():
    url = "http://localhost:8000/api/v1/auth/login"
    
    # Test data
    login_data = {
        "email": "ahmed.hassan@3allamni.com",
        "password": "password123"
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        print("🔍 Testing login API...")
        print(f"URL: {url}")
        print(f"Data: {login_data}")
        
        response = requests.post(url, json=login_data, headers=headers, timeout=10)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            print("✅ Login successful!")
            print(f"Response: {response.json()}")
        else:
            print(f"❌ Login failed!")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection error - backend might not be running")
    except requests.exceptions.Timeout:
        print("❌ Request timeout")
    except Exception as e:
        print(f"❌ Error: {e}")

def test_student_login():
    url = "http://localhost:8000/api/v1/auth/login"
    
    # Test student data
    login_data = {
        "email": "alice.johnson@student.com",
        "password": "password123"
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        print("\n🔍 Testing student login API...")
        print(f"Data: {login_data}")
        
        response = requests.post(url, json=login_data, headers=headers, timeout=10)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Student login successful!")
            print(f"Response: {response.json()}")
        else:
            print(f"❌ Student login failed!")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_login()
    test_student_login()
