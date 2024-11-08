import { backend } from "declarations/backend";

const generateBtn = document.getElementById('generateBtn');
const cryptoList = document.getElementById('cryptoList');
const loading = document.getElementById('loading');

async function generateCryptos() {
    try {
        loading.style.display = 'block';
        cryptoList.innerHTML = '';
        
        const cryptos = await backend.getRandomCryptos();
        
        cryptos.forEach(crypto => {
            const li = document.createElement('li');
            li.textContent = crypto;
            cryptoList.appendChild(li);
        });
    } catch (error) {
        console.error('Error:', error);
        cryptoList.innerHTML = '<li>Error generating cryptocurrencies. Please try again.</li>';
    } finally {
        loading.style.display = 'none';
    }
}

generateBtn.addEventListener('click', generateCryptos);
