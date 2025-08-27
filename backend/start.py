"""
Startup script for 3allamni backend
"""

import subprocess
import sys
import os

def install_dependencies():
    """Install required dependencies"""
    print("📦 Installing dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Dependencies installed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing dependencies: {e}")
        return False
    return True

def initialize_database():
    """Initialize database with tables and seed data"""
    print("🗄️ Initializing database...")
    try:
        subprocess.check_call([sys.executable, "scripts/init_db.py"])
        print("✅ Database initialized successfully!")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error initializing database: {e}")
        return False
    return True

def start_server():
    """Start the FastAPI server"""
    print("🚀 Starting 3allamni backend server...")
    try:
        subprocess.check_call([
            sys.executable, "-m", "uvicorn", 
            "main:app", 
            "--host", "0.0.0.0", 
            "--port", "8000", 
            "--reload"
        ])
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error starting server: {e}")

def main():
    """Main startup function"""
    print("🎓 Welcome to 3allamni Backend Setup!")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not os.path.exists("main.py"):
        print("❌ Please run this script from the backend directory")
        return
    
    # Install dependencies
    if not install_dependencies():
        return
    
    # Initialize database
    if not initialize_database():
        return
    
    print("\n🎉 Setup completed successfully!")
    print("📖 API Documentation will be available at: http://localhost:8000/docs")
    print("🔄 Redoc Documentation will be available at: http://localhost:8000/redoc")
    print("\n" + "=" * 50)
    
    # Start server
    start_server()

if __name__ == "__main__":
    main()
