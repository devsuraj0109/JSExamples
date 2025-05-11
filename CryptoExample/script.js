const requestOptions = {
    method: "GET",
    redirect: "follow"
};

function fetchData() {
    const search = document.getElementById('search').value.toLowerCase();
    const pageSize = document.getElementById('pageSize').value;
    const pageNum = document.getElementById('pageNum').value;

    fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=current_price&per_page=${pageSize}&page=${pageNum}`, requestOptions)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('crypto-container');
            container.innerHTML = '';
            data
                .filter(coin => coin.name.toLowerCase().includes(search) || coin.symbol.toLowerCase().includes(search))
                .forEach(coin => {
                    const card = document.createElement('div');
                    card.className = 'crypto-card';
                    card.innerHTML = `
                        <img src="${coin.image}" alt="${coin.name}">
                        <h2>${coin.name} (${coin.symbol.toUpperCase()})</h2>
                        <p>Price: $${coin.current_price.toLocaleString()}</p>
                        <p>Market Cap: $${coin.market_cap.toLocaleString()}</p>
                        <p>24h Change: ${coin.price_change_percentage_24h.toFixed(2)}%</p>
                        <p>Circulating Supply: ${coin.circulating_supply.toLocaleString()}</p>
                        <p>Total Supply: ${coin.total_supply ? coin.total_supply.toLocaleString() : 'N/A'}</p>
                        <p>All Time High: $${coin.ath.toLocaleString()} (${coin.ath_change_percentage.toFixed(2)}% from ATH)</p>
                        <p>Last Updated: ${new Date(coin.last_updated).toLocaleString()}</p>
                        <p>ATH Date: ${new Date(coin.ath_date).toLocaleDateString()}</p>
                        <p>ATL: $${coin.atl.toLocaleString()} (${coin.atl_change_percentage.toFixed(2)}% from ATL)</p>
                        <p>ATL Date: ${new Date(coin.atl_date).toLocaleDateString()}</p>
                        <p>ROI: ${coin.roi ? `${coin.roi.times} (${coin.roi.currency})` : 'N/A'}</p>
                    `;
                    container.appendChild(card);
                });
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Initial fetch
fetchData();

// Add event listener for search input
document.getElementById('search').addEventListener('input', fetchData);