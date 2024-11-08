import Blob "mo:base/Blob";
import Func "mo:base/Func";
import List "mo:base/List";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

import Random "mo:base/Random";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Time "mo:base/Time";
import Debug "mo:base/Debug";
import Nat8 "mo:base/Nat8";

actor {
    // List of available cryptocurrency IDs from CoinGecko
    let cryptoList = [
        "bitcoin", "ethereum", "ripple", "cardano", "solana",
        "polkadot", "dogecoin", "avalanche-2", "chainlink",
        "polygon", "stellar", "vechain", "tron", "cosmos",
        "uniswap", "litecoin", "algorand", "bitcoin-cash",
        "monero", "filecoin"
    ];

    // Function to get random number between 0 and max-1
    private func randomNumber(seed: Blob, max: Nat): Nat {
        let randomByte = Random.byteFrom(seed);
        let byte = randomByte;
        Nat8.toNat(byte) % max;
    };

    // Public query to get 10 random cryptocurrencies
    public func getRandomCryptos() : async [Text] {
        let seed = await Random.blob();
        var available = Array.thaw<Text>(cryptoList);
        var result = Array.init<Text>(10, "");
        var resultIndex = 0;
        
        // Select 10 random cryptocurrencies
        while (resultIndex < 10 and (cryptoList.size() - resultIndex) > 0) {
            let remainingLength = cryptoList.size() - resultIndex;
            let randomIndex = randomNumber(seed, remainingLength);
            result[resultIndex] := available[randomIndex];
            
            // Move last element to selected position and decrease array size
            available[randomIndex] := available[remainingLength - 1];
            resultIndex += 1;
        };

        Array.freeze(result)
    };
}
