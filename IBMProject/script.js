async function fetchStockData() {
    const apiKey = 'demo'; // Replace with your Alpha Vantage API key
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayMetaData(data['Meta Data']);
        displayStockData(data['Time Series (Daily)']);
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

function displayStockData(timeSeries) {
    const tableBody = document.getElementById('tableBody');
    const dates = [];
    const closes = [];

    for (const date in timeSeries) {
        const row = timeSeries[date];
        tableBody.innerHTML += `
            <tr>
                <td>${date}</td>
                <td>${parseFloat(row['1. open']).toFixed(2)}</td>
                <td>${parseFloat(row['2. high']).toFixed(2)}</td>
                <td>${parseFloat(row['3. low']).toFixed(2)}</td>
                <td>${parseFloat(row['4. close']).toFixed(2)}</td>
                <td>${parseInt(row['5. volume']).toLocaleString()}</td>
            </tr>
        `;
        dates.push(date);
        closes.push(parseFloat(row['4. close']));
    }

    const ctx = document.getElementById('stockChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates.reverse(),
            datasets: [{
                label: 'Closing Price',
                data: closes.reverse(),
                borderColor: '#10b981',
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Price (USD)'
                    }
                }
            }
        }
    });
}

fetchStockData();