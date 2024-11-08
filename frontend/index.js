import { backend } from "declarations/backend";

const REFRESH_INTERVAL = 600000; // 10 minutes
let countdown = REFRESH_INTERVAL / 1000;
let timer;

async function fetchCryptoData() {
    try {
        const loading = document.getElementById('loading');
        loading.classList.remove('d-none');

        // Get random crypto IDs from backend
        const cryptoIds = await backend.getRandomCryptos();
        
        // Fetch data from CoinGecko API
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${cryptoIds.join(',')}&order=market_cap_desc&sparkline=false`);
        const data = await response.json();

        const tbody = document.getElementById('cryptoData');
        tbody.innerHTML = '';

        data.forEach((crypto, index) => {
            const row = document.createElement('tr');
            const priceChange = crypto.price_change_percentage_24h || 0;
            const changeClass = priceChange >= 0 ? 'positive-change' : 'negative-change';

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${crypto.symbol.toUpperCase()}</td>
                <td>${crypto.name}</td>
                <td>$${crypto.current_price.toLocaleString()}</td>
                <td class="${changeClass}">${priceChange.toFixed(2)}%</td>
                <td>$${crypto.market_cap.toLocaleString()}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching crypto data:', error);
    } finally {
        const loading = document.getElementById('loading');
        loading.classList.add('d-none');
    }
}

function updateTimer() {
    const timerElement = document.getElementById('timer');
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    timerElement.textContent = `Next update in: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    countdown--;

    if (countdown < 0) {
        countdown = REFRESH_INTERVAL / 1000;
        fetchCryptoData();
    }
}

// Initial fetch
fetchCryptoData();

// Start timer
timer = setInterval(updateTimer, 1000);

// Cleanup
window.addEventListener('beforeunload', () => {
    clearInterval(timer);
});
