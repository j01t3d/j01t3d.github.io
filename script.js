// Add this at the top
const API_URL = "https://j01t3d-github-io.onrender.com";

// Listen for the click
document.getElementById('searchBtn').addEventListener('click', async () => {
    const query = document.getElementById('searchInput').value;
    
    // Basic validation
    if (!query) return;

    // 1. Update UI to show loading
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '<p>Searching archives...</p>';

    try {
        // 2. Call your Render Backend
        // NOTE: We will need to create the '/search' route in your Python next!
        const response = await fetch(`${API_URL}/search?q=${query}`);
        
        // 3. Check if the response is okay
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // 4. Display the results
        displayResults(data);

    } catch (error) {
        console.error('Error:', error);
        resultsContainer.innerHTML = '<p style="color: red;">Error fetching results. Is the backend awake?</p>';
    }
});

// Helper function to show data on the page
function displayResults(books) {
    const container = document.getElementById('resultsContainer');
    container.innerHTML = ''; // Clear previous results

    if (books.length === 0) {
        container.innerHTML = '<p>No books found.</p>';
        return;
    }

    // Loop through books and create HTML cards
    books.forEach(book => {
        const card = document.createElement('div');
        card.className = 'book-card';
        
        // We'll use book.title and book.author (we define this structure in Python later)
        card.innerHTML = `
            <h3>${book.title}</h3>
            <p>Author: ${book.author}</p>
            <a href="${book.link}" target="_blank">Read / Download</a>
        `;
        
        container.appendChild(card);
    });
}