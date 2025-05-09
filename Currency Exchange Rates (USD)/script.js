async function fetchExchangeRates() {
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        if (!response.ok) {
            throw new Error('Failed to fetch exchange rates');
        }
        const data = await response.json();
        displayExchangeRates(data);
    } catch (error) {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('error').classList.remove('hidden');
        document.getElementById('error').textContent = `Error: ${error.message}`;
    }
}

function displayExchangeRates(data) {
    // Update info section
    document.getElementById('date').textContent = data.date;
    document.getElementById('provider').href = data.provider;
    document.getElementById('provider').textContent = data.provider;
    document.getElementById('terms').href = data.terms;

    // Populate table
    const ratesBody = document.getElementById('ratesBody');
    ratesBody.innerHTML = '';
    const rates = Object.entries(data.rates);
    rates.sort((a, b) => a[0].localeCompare(b[0])); // Sort alphabetically by currency code

    rates.forEach(([currency, rate]) => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-100 dark:hover:bg-gray-700';
        row.innerHTML = `
            <td class="p-4 text-gray-800 dark:text-gray-200">${currency}</td>
            <td class="p-4 text-gray-800 dark:text-gray-200">${rate.toFixed(4)}</td>
        `;
        ratesBody.appendChild(row);
    });

    // Show table and hide loading
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('ratesTable').classList.remove('hidden');
}

// Search functionality
document.getElementById('searchInput').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#ratesBody tr');
    rows.forEach(row => {
        const currency = row.cells[0].textContent.toLowerCase();
        row.style.display = currency.includes(searchTerm) ? '' : 'none';
    });
});

// Initialize theme based on saved preference or system setting
function setTheme() {
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
    localStorage.setItem('theme', savedTheme);
}

// Apply theme on load
setTheme();

// Fetch data on page load
fetchExchangeRates();