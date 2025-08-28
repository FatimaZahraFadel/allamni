#!/usr/bin/env python3
"""
Test teacher API endpoints
"""

import requests
import json

def test_teacher_api():
    base_url = "http://localhost:8000"
    
    # First, login as teacher
    login_data = {
        "email": "ahmed.hassan@3allamni.com",
        "password": "password123"
    }
    
    print("🔐 Testing teacher login...")
    try:
        login_response = requests.post(f"{base_url}/api/v1/auth/login", json=login_data)
        print(f"Login status: {login_response.status_code}")
        
        if login_response.status_code == 200:
            login_result = login_response.json()
            access_token = login_result.get('access_token')
            print(f"✅ Login successful! Token: {access_token[:20]}...")
            
            # Set up headers with token
            headers = {
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json"
            }
            
            # Test teacher dashboard endpoint
            print("\n📊 Testing teacher dashboard...")
            try:
                dashboard_response = requests.get(f"{base_url}/api/v1/stats/dashboard/teacher", headers=headers)
                print(f"Dashboard status: {dashboard_response.status_code}")
                if dashboard_response.status_code == 200:
                    print("✅ Dashboard endpoint working!")
                    print(f"Dashboard data: {json.dumps(dashboard_response.json(), indent=2)}")
                else:
                    print(f"❌ Dashboard error: {dashboard_response.text}")
            except Exception as e:
                print(f"❌ Dashboard request failed: {e}")
            
            # Test classes endpoint
            print("\n🏫 Testing classes endpoint...")
            try:
                classes_response = requests.get(f"{base_url}/api/v1/classes/", headers=headers)
                print(f"Classes status: {classes_response.status_code}")
                if classes_response.status_code == 200:
                    print("✅ Classes endpoint working!")
                    print(f"Classes data: {json.dumps(classes_response.json(), indent=2)}")
                else:
                    print(f"❌ Classes error: {classes_response.text}")
            except Exception as e:
                print(f"❌ Classes request failed: {e}")
            
            # Test assignments endpoint
            print("\n📝 Testing assignments endpoint...")
            try:
                assignments_response = requests.get(f"{base_url}/api/v1/assignments/", headers=headers)
                print(f"Assignments status: {assignments_response.status_code}")
                if assignments_response.status_code == 200:
                    print("✅ Assignments endpoint working!")
                    print(f"Assignments data: {json.dumps(assignments_response.json(), indent=2)}")
                else:
                    print(f"❌ Assignments error: {assignments_response.text}")
            except Exception as e:
                print(f"❌ Assignments request failed: {e}")
                
        else:
            print(f"❌ Login failed: {login_response.text}")
            
    except Exception as e:
        print(f"❌ Login request failed: {e}")

if __name__ == "__main__":
    test_teacher_api()
