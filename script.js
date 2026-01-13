const API_URL = "https://j01t3d-github-io.onrender.com";
let pageNumber = 1;
let table;
let filters;

// Listen for the click
document.getElementById('searchBtn').addEventListener('click', async () => {
    const query = document.getElementById('searchInput').value;
    
    // Basic validation
    if (!query) return;

    // Create filters based on settings

    filters = new Filters("public"); // PLACEHOLDER filter to filter by public books

    // need to change search bar size, add dropdown box for availability, then add check to READ from that dropdown box here

    // Update UI to show loading
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '<p>Searching archives...</p>';

    try {
        // Call the Render Backend
        const response = await fetch(`${API_URL}/search?q=${query}`);
        
        // Check if the response is okay
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Display the results
        displayResults(data);

        document.getElementById('viewMoreBtn').style.display = "block";

    } catch (error) {
        console.error('Error:', error);
        resultsContainer.innerHTML = '<p style="color: red;">Error fetching results. Is the backend awake?</p>';
    }
});

document.getElementById('viewMoreBtn').addEventListener('click', async () => {
    const query = document.getElementById('searchInput').value;

    // Basic validation
    if (!query) return;

    // 1. Update UI to show loading

    try {
        // 2. Call the Render Backend
        const response = await fetch(`${API_URL}/search?q=${query}&page=${pageNumber+1}`);
        pageNumber += 1;
        
        // 3. Check if the response is okay
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // 4. Display the results
        displayResults(data);

    } catch (error) {
        console.error('Error:', error);
        resultsContainer.innerHTML = '<p style="color: red;">Error fetching more results. Is the backend awake?</p>';
    }

})

// Helper function to show data on the page
function displayResults(data) {
    const container = document.getElementById('resultsContainer');

    const books = data.results;

    if (!books || books.length === 0) {
        container.innerHTML = '<p class="placeholder">No books found.</p>';
        return;
    }

    // 1. Create the Table and Header
    
    if (!table) { // First results
    table = document.createElement('table');
        container.innerHTML = ''; // Clear for parity
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
    }

    const tbody = table.querySelector('tbody');

    // 2. Loop through books and add a row for each
    books.forEach(book => {
        if (matchFilters(book) == true) { // check if the book matches the filters
            const row = document.createElement('tr');

            // Handle the Cover Image
            let coverHtml = '<span style="color:#ccc;">No Cover</span>';
            if (book.cover) {
                coverHtml = `<img src="${book.cover}" class="book-cover" alt="Cover" style="max-width: 50px; max-height: 75px;">`;
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
        }
    });

    // 3. Add the finished table to the page
    container.appendChild(table);
}

class Filters { // filters class!
    constructor(viewable) {
        this.viewable = viewable;
    }
}

function matchFilters(book) {
    if ( // match filters against the ones grabbed from user's selected filters
        book.viewable == filters.viewable // &&
        // book.(other filters) == filters.(other filters) &&
        // book.(other filters) == filters.(other filters)
    ) { // if all filters match
        return true; 
    } else { // if NOT all filters match
        return false;
    }
}