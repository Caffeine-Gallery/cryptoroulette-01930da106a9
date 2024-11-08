import { backend } from "declarations/backend";

const generateBtn = document.getElementById('generateBtn');
const portfolioContainer = document.getElementById('portfolioContainer');
const spinner = generateBtn.querySelector('.spinner-border');

async function fetchCryptoData(id) {
    try {
        const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&include_24hr_change=true`
        );
        const data = await response.json();
        return data[id];
    } catch (error) {
        console.error('Error fetching price:', error);
        return null;
    }
}

function createCryptoCard(crypto, index, priceData) {
    const price = priceData?.usd || 'N/A';
    const change = priceData?.usd_24h_change || 0;
    const changeClass = change >= 0 ? 'positive' : 'negative';
    const changeText = change ? `${change.toFixed(2)}%` : 'N/A';

    const card = document.createElement('div');
    card.className = 'col-md-6 col-lg-4';
    card.style.setProperty('--animation-order', index);
    
    card.innerHTML = `
        <div class="crypto-card card text-light h-100">
            <div class="card-body d-flex flex-column">
                <img src="https://cryptologos.cc/logos/${crypto}-logo.png" 
                     alt="${crypto}" 
                     class="crypto-icon align-self-center"
                     onerror="this.src='https://via.placeholder.com/48'">
                <h5 class="card-title text-center mb-3 text-capitalize">${crypto.replace('-', ' ')}</h5>
                <div class="mt-auto">
                    <p class="card-text text-center mb-2">
                        <span class="fs-4">$${typeof price === 'number' ? price.toLocaleString() : price}</span>
                    </p>
                    <p class="card-text text-center price-change ${changeClass}">
                        24h: ${changeText}
                    </p>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

async function generatePortfolio() {
    try {
        generateBtn.classList.add('loading');
        spinner.classList.remove('d-none');
        portfolioContainer.innerHTML = '';

        const cryptos = await backend.getRandomCryptos();
        
        for (let i = 0; i < cryptos.length; i++) {
            const priceData = await fetchCryptoData(cryptos[i]);
            const card = createCryptoCard(cryptos[i], i, priceData);
            portfolioContainer.appendChild(card);
        }
    } catch (error) {
        console.error('Error generating portfolio:', error);
        portfolioContainer.innerHTML = `
            <div class="col-12 text-center text-light">
                <p>Error generating portfolio. Please try again.</p>
            </div>
        `;
    } finally {
        generateBtn.classList.remove('loading');
        spinner.classList.add('d-none');
    }
}

generateBtn.addEventListener('click', generatePortfolio);
