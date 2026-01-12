import os
from flask import Flask

app = Flask(__name__)

# Render sets the PORT environment variable
port = int(os.environ.get("PORT", 80))

@app.route('/')
def home():
    return "Backend is running!"

if __name__ == '__main__':
    # 0.0.0.0 makes it accessible publicly (not just localhost)
    app.run(host='0.0.0.0', port=port)