const API_URL = "https://j01t3d-github-io.onrender.com";
let pageNumber = 1;
let table, search, filters, availabilityValue;

// Listen for the click
document.getElementById('searchBtn').addEventListener('click', async () => {
    const query = document.getElementById('searchInput').value;
    
    // Basic validation
    if (!query) return;

    createFilter();

    // Update UI to show loading
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '<p>Searching archives...</p>';

    try {
        // Call the Render Backend
        search = `${API_URL}/search?q=${query}`;
        const response = await fetch(search);
        
        // Check if the response is okay
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Display the results
        table = ''; // clear table
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

    // Update UI to show loading
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '<p>Searching archives...</p>';
    pageNumber += 1;

    try {
        // Call the Render Backend
        pageField = `&page=${pageNumber}`;
        search = (`${API_URL}/search?q=${query}` + pageField);

        const response = await fetch(search);
        console.log(search);
        
        // Check if the response is okay
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Display the results
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
    } else {

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
        } else {
            console.log(matchFilters(book));
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

function createFilter() {
    availabilityValue = document.getElementById('availabilityFilter').value;
    if (availabilityValue != 'all') { // there IS a filter
        filters = new Filters(availabilityValue);
    } else {filters = 0;} // there is NOT a filter
}

function matchFilters(book) {
    if (filters == 0) {return true;}
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