import os
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS # IMPORTANT: This allows your GitHub Page to talk to Render

app = Flask(__name__)

# Enable CORS (Cross-Origin Resource Sharing)
# This is required because your GitHub Page (github.io) is a different domain 
# than your Render API (onrender.com)
CORS(app)

# --- CONFIGURATION ---
# We will add the Database logic later, but let's get the API working first.
OPEN_LIBRARY_URL = "https://openlibrary.org/search.json"

# --- ROUTES ---

@app.route('/', methods=['GET'])
def home():
    return "Backend is running! Try the /search endpoint."

@app.route('/search', methods=['GET'])
def search_books():
    # 1. Get the search term from the URL (e.g., ?q=Harry+Potter)
    query = request.args.get('q')
    
    if not query:
        return jsonify({"error": "No query provided"}), 400

    try:
        # 2. Call the Open Library API
        # We limit results to 10 for now to keep it fast
        response = requests.get(f"{OPEN_LIBRARY_URL}?q={query}&limit=10")
        
        # Check if Open Library replied successfully
        if response.status_code != 200:
            return jsonify({"error": "Open Library API failed"}), 502

        data = response.json()

        # 3. Clean up the data for your Frontend
        # Open Library sends a LOT of data. We only want what we need.
        formatted_results = []
        
        # 'docs' is the key in the JSON that holds the list of books
        docs = data.get("docs", [])

        for book in docs:
            # Safety check: Sometimes data is missing
            title = book.get("title", "Unknown Title")
            
            # Get the first author listed (sometimes it's a list, sometimes string)
            authors = book.get("author_name", ["Unknown Author"])
            author_name = authors[0] if authors else "Unknown Author"

            # Get the cover image (Open Library uses 'OLID' for covers)
            cover_id = book.get("cover_i")
            cover_url = f"https://covers.openlibrary.org/b/id/{cover_id}-M.jpg" if cover_id else None

            # Try to construct a link to the book page
            # Open Library uses 'key' for the unique ID (e.g., "/works/OL1234W")
            book_key = book.get("key")
            book_url = f"https://openlibrary.org{book_key}" if book_key else "#"

            formatted_results.append({
                "title": title,
                "author": author_name,
                "cover": cover_url,
                "link": book_url
            })

        # 4. Send the clean data back to your JavaScript
        return jsonify({
            "source": "Open Library",
            "count": len(formatted_results),
            "results": formatted_results
        })

    except Exception as e:
        # Catch any errors (like internet going down)
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

# --- RUN THE APP ---
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 80))
    app.run(host='0.0.0.0', port=port)