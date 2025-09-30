document.addEventListener("DOMContentLoaded", () => {
    // We only need to set up event listeners for the filter/search controls
    const itemsContainer = document.getElementById("items-container");
    if (itemsContainer) {
        setupEventListeners();
        // No need for a first load, as Flask handles the initial rendering
    }
    // Review page functions (loadReview) are now handled by Flask, so removed.
});

// Helper function to dynamically create and display cards from API response
function displayItems(items) {
    const container = document.getElementById("items-container");
    container.innerHTML = ""; // Clear existing items

    items.forEach(item => {
        const card = document.createElement("div");
        card.className = "card";
        card.setAttribute("data-type", item.type);
        card.innerHTML = `
        <img src="${item.image}" alt="${item.title}">
        <h3>${item.title}</h3>
        <p><strong>Genre:</strong> ${item.genre}</p>
        <a href="/review?id=${item.id}" class="btn">Read Review</a>
        `;
        container.appendChild(card);
    });
}

function setupEventListeners() {
    const searchInput = document.getElementById("search");
    const filterSelect = document.getElementById("filter");

    // Event listeners now call applyFilters, which fetches data from the Flask API
    searchInput.addEventListener("keyup", applyFilters);
    filterSelect.addEventListener("change", applyFilters);
}

// Function to call the new Flask API endpoint
function applyFilters() {
    const query = document.getElementById("search").value;
    const filter = document.getElementById("filter").value;

    // Construct the URL to call the Flask API endpoint
    const apiUrl = `/api/items?search=${encodeURIComponent(query)}&filter=${encodeURIComponent(filter)}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(filteredItems => {
            // Display the items returned by the Python backend
            displayItems(filteredItems);
        })
        .catch(error => console.error('Error fetching filtered data:', error));
}


// Rating function remains the same and relies on localStorage
function rate(event, id) {
    localStorage.setItem(`rating-${id}`, " ★★★★★ ");
    event.target.classList.add("rated");
}