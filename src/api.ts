const BASE_URL = `https://api.coinpaprika.com/v1`;
const NICO_API = `https://ohlcv-api.nomadcoders.workers.dev?coinId=`;

export function fetchCoins() {
    return fetch(`${BASE_URL}/coins`).then((response) => response.json());
}

export function fetchCoinInfo(coinId?: string) {
    return fetch(`${BASE_URL}/coins/${coinId}`).then((response) =>
        response.json()
    );
}

export function fetchCoinTickers(coinId?: string) {
    return fetch(`${BASE_URL}/tickers/${coinId}`).then((response) =>
        response.json()
    );
}

export function fetchCoinHistory(coinId?: string) {
    return fetch(`${NICO_API}${coinId}`).then((response) => response.json());
}
