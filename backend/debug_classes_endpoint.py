#!/usr/bin/env python3
"""
Debug classes endpoint issue
"""

import requests
import json

def debug_classes_endpoint():
    base_url = "http://localhost:8000"
    
    # Login as teacher first
    login_data = {
        "email": "ahmed.hassan@3allamni.com",
        "password": "password123"
    }
    
    print("🔐 Logging in as teacher...")
    login_response = requests.post(f"{base_url}/api/v1/auth/login", json=login_data)
    
    if login_response.status_code == 200:
        login_result = login_response.json()
        access_token = login_result.get('access_token')
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        print("🏫 Testing classes endpoint with detailed error info...")
        try:
            classes_response = requests.get(f"{base_url}/api/v1/classes/", headers=headers)
            print(f"Status Code: {classes_response.status_code}")
            print(f"Response Headers: {dict(classes_response.headers)}")
            print(f"Response Text: {classes_response.text}")
            
            if classes_response.status_code == 200:
                print("✅ Classes endpoint working!")
                data = classes_response.json()
                print(f"Classes data: {json.dumps(data, indent=2)}")
            else:
                print(f"❌ Classes endpoint error")
                
        except Exception as e:
            print(f"❌ Request failed: {e}")
    else:
        print(f"❌ Login failed: {login_response.text}")

if __name__ == "__main__":
    debug_classes_endpoint()
