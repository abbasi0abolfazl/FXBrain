import sys
import os

# Add api directory to sys.path so imports work properly in serverless environments
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from main import app
