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
function displayResults(data) {
    const container = document.getElementById('resultsContainer');
    container.innerHTML = ''; // Clear previous results

    // FIX: Access the 'results' array inside the data object
    const books = data.results; 

    // Check if we actually have results
    if (!books || books.length === 0) {
        container.innerHTML = '<p>No books found.</p>';
        return;
    }

    // Now loop through the ACTUAL list of books
    books.forEach(book => {
        const card = document.createElement('div');
        card.className = 'book-card';
        
        // Safety check for missing data
        const title = book.title || "No Title";
        const author = book.author || "Unknown Author";
        const link = book.link || "#";
        let coverHtml = '';

        if (book.cover) {
            coverHtml = `<img src="${book.cover}" alt="${title}" style="max-width:100px; float:left; margin-right:10px;">`;
        }

        card.innerHTML = `
            ${coverHtml}
            <h3>${title}</h3>
            <p>Author: ${author}</p>
            <a href="${link}" target="_blank">Read / Download</a>
            <div style="clear:both;"></div>
        `;
        
        container.appendChild(card);
    });
}