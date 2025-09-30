import json
from flask import Flask, render_template, request, jsonify

# Initialize the Flask application
app = Flask(__name__)

# --- Data Loading ---
def load_data():
    """Loads the review data from the JSON file."""
    try:
        with open('data.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print("Error: data.json not found. Returning empty list.")
        return []

# Global variable to store the loaded data
ITEMS_DATA = load_data()

# --- Routes ---

# 1. Main Index Page Route (Renders the initial list)
@app.route('/')
def index():
    """Renders the main page with all items."""
    # Flask serves the initial list of items directly via Jinja2
    return render_template('index.html', items=ITEMS_DATA)

# 2. Review Detail Page Route (Renders the individual review details)
@app.route('/review')
def review():
    """Renders the individual review page for a specific ID."""
    # Get the ID from the URL query parameters (e.g., /review?id=1)
    review_id = request.args.get('id')
    
    # Use a generator expression to find the matching item
    item = next((i for i in ITEMS_DATA if str(i.get('id')) == review_id), None)
    
    if item:
        # Pass the found item object to the template
        return render_template('review.html', item=item)
    else:
        return "Review not found", 404

# 3. API Endpoint for Filtering/Searching (Used by client-side JavaScript)
@app.route('/api/items')
def get_items():
    """API endpoint to get filtered/searched items based on URL query parameters."""
    query = request.args.get('search', '').lower()
    filter_type = request.args.get('filter', 'all')

    filtered_items = []

    # Apply both filters
    for item in ITEMS_DATA:
        title = item.get('title', '').lower()
        item_type = item.get('type')
        
        matches_search = query in title
        matches_filter = filter_type == 'all' or item_type == filter_type
        
        if matches_search and matches_filter:
            filtered_items.append(item)

    # Return the filtered list as a JSON response
    return jsonify(filtered_items)

# --- Run the Application ---
if __name__ == '__main__':
    # Flask serves static files from the 'static' folder and templates from 'templates'
    app.run(debug=True)