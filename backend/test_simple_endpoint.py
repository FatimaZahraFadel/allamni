#!/usr/bin/env python3
"""
Test simple classes endpoint
"""

import requests

def test_simple_endpoint():
    base_url = "http://localhost:8000"
    
    print("🧪 Testing simple classes test endpoint...")
    try:
        response = requests.get(f"{base_url}/api/v1/classes/test")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Simple endpoint working!")
        else:
            print("❌ Simple endpoint failed")
            
    except Exception as e:
        print(f"❌ Request failed: {e}")

if __name__ == "__main__":
    test_simple_endpoint()
