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

    const books = data.results;

    if (!books || books.length === 0) {
        container.innerHTML = '<p class="placeholder">No books found.</p>';
        return;
    }

    // 1. Create the Table and Header
    const table = document.createElement('table');
    table.id = "resultsTable";

    table.innerHTML = `
        <thead>
            <tr>
                <th style="width: 60px;">Cover</th>
                <th>Title</th>
                <th>Author</th>
                <th style="width: 100px;">Action</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = table.querySelector('tbody');

    // 2. Loop through books and add a row for each
    books.forEach(book => {
        const row = document.createElement('tr');

        // Handle the Cover Image
        let coverHtml = '<span style="color:#ccc;">No Cover</span>';
        if (book.cover) {
            coverHtml = `<img src="${book.cover}" class="book-cover" alt="Cover">`;
        }

        // Safety checks for data
        const title = book.title || "No Title";
        const author = book.author || "Unknown Author";
        const link = book.link || "#";

        row.innerHTML = `
            <td>${coverHtml}</td>
            <td><strong>${title}</strong></td>
            <td>${author}</td>
            <td><a href="${link}" target="_blank" class="read-link">Read</a></td>
        `;

        tbody.appendChild(row);
    });

    // 3. Add the finished table to the page
    container.appendChild(table);
}