let chartInstance = null;
let timeSeriesData = null;

async function fetchStockData() {
    const apiKey = 'demo'; // Replace with your Alpha Vantage API key
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        timeSeriesData = data['Time Series (Daily)'];
        displayMetaData(data['Meta Data']);
        setupDateInput(timeSeriesData);
        setupControls();
        displayStockData(timeSeriesData, null);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function displayMetaData(metaData) {
    const metaDiv = document.getElementById('metaData');
    metaDiv.innerHTML = `
        <p><strong>Symbol:</strong> ${metaData['2. Symbol']}</p>
        <p><strong>Last Refreshed:</strong> ${metaData['3. Last Refreshed']}</p>
        <p><strong>Time Zone:</strong> ${metaData['5. Time Zone']}</p>
    `;
}

function setupDateInput(timeSeries) {
    const dateInput = document.getElementById('dateInput');
    dateInput.addEventListener('change', (event) => {
        const selectedDate = event.target.value;
        displayStockData(timeSeries, selectedDate);
    });
}

function setupControls() {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    themeToggleBtn.addEventListener('change', () => {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        html.setAttribute('data-theme', currentTheme === 'light' ? 'dark' : 'light');
        const selectedDate = document.getElementById('dateInput').value;
        displayStockData(timeSeriesData, selectedDate);
    });
}

function findClosestDate(targetDate, availableDates) {
    if (!targetDate) return null;
    const target = new Date(targetDate);
    return availableDates.reduce((closest, date) => {
        const current = new Date(date);
        const closestDiff = Math.abs(new Date(closest) - target);
        const currentDiff = Math.abs(current - target);
        return currentDiff < closestDiff ? date : closest;
    }, availableDates[0]);
}

function displayStockData(timeSeries, selectedDate) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    const dates = [];
    const closes = [];
    const changes = [];

    const sortedDates = Object.keys(timeSeries).sort((a, b) => new Date(b) - new Date(a));
    const displayDate = selectedDate ? findClosestDate(selectedDate, sortedDates) : null;

    const filteredDates = displayDate ? [displayDate] : sortedDates;

    for (let i = 0; i < filteredDates.length; i++) {
        const date = filteredDates[i];
        const row = timeSeries[date];
        const close = parseFloat(row['4. close']);
        let change = '-';
        let changeClass = '';

        if (!displayDate && i < filteredDates.length - 1) {
            const prevClose = parseFloat(timeSeries[filteredDates[i + 1]]['4. close']);
            change = (close - prevClose).toFixed(2);
            changeClass = change >= 0 ? 'change-positive' : 'change-negative';
            change = change >= 0 ? `+${change}` : change;
        }

        tableBody.innerHTML += `
            <tr>
                <td>${date}</td>
                <td>${parseFloat(row['1. open']).toFixed(2)}</td>
                <td>${parseFloat(row['2. high']).toFixed(2)}</td>
                <td>${parseFloat(row['3. low']).toFixed(2)}</td>
                <td>${close.toFixed(2)}</td>
                <td class="${changeClass}">${change}</td>
                <td>${parseInt(row['5. volume']).toLocaleString()}</td>
            </tr>
        `;
        dates.push(date);
        closes.push(close);
        changes.push(!displayDate && i < filteredDates.length - 1 ? parseFloat(change) : 0);
    }

    if (chartInstance) {
        chartInstance.destroy();
    }

    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    const ctx = document.getElementById('stockChart').getContext('2d');
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates.reverse(),
            datasets: [
                {
                    label: 'Closing Price',
                    data: closes.reverse(),
                    borderColor: isDarkMode ? '#68d391' : '#3182ce',
                    borderWidth: 2,
                    pointRadius: 0,
                    yAxisID: 'y',
                    fill: false,
                    tension: 0.2
                },
                {
                    label: 'Daily Change',
                    data: changes.reverse(),
                    borderColor: isDarkMode ? '#90cdf4' : '#63b3ed',
                    borderWidth: 2,
                    pointRadius: 0,
                    yAxisID: 'y1',
                    fill: false,
                    tension: 0.2,
                    hidden: !!displayDate
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date',
                        color: isDarkMode ? '#e2e8f0' : '#2d3748',
                        font: {
                            size: 12
                        }
                    },
                    ticks: {
                        color: isDarkMode ? '#e2e8f0' : '#2d3748',
                        maxTicksLimit: 8
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Price (USD)',
                        color: isDarkMode ? '#e2e8f0' : '#2d3748',
                        font: {
                            size: 12
                        }
                    },
                    position: 'left',
                    ticks: {
                        color: isDarkMode ? '#e2e8f0' : '#2d3748'
                    },
                    grid: {
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    }
                },
                y1: {
                    title: {
                        display: !displayDate,
                        text: 'Change (USD)',
                        color: isDarkMode ? '#e2e8f0' : '#2d3748',
                        font: {
                            size: 12
                        }
                    },
                    position: 'right',
                    grid: {
                        drawOnChartArea: false
                    },
                    display: !displayDate,
                    ticks: {
                        color: isDarkMode ? '#e2e8f0' : '#2d3748'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'center',
                    labels: {
                        color: isDarkMode ? '#e2e8f0' : '#2d3748',
                        font: {
                            size: 12
                        },
                        padding: 10
                    }
                },
                tooltip: {
                    backgroundColor: isDarkMode ? '#2d3748' : '#ffffff',
                    titleColor: isDarkMode ? '#e2e8f0' : '#2d3748',
                    bodyColor: isDarkMode ? '#e2e8f0' : '#2d3748',
                    borderColor: isDarkMode ? '#4a5568' : '#e2e8f0',
                    borderWidth: 1,
                    cornerRadius: 6
                }
            },
            animation: {
                duration: 500,
                easing: 'easeOutQuad'
            }
        }
    });
}

fetchStockData();