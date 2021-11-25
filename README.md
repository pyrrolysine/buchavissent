
### Buchavissent: Mint, auction, and trade NFTs on buildings in Bucharest

Mintable tokens correspond to averaged building positions:

OSM -> features -> buildings -> location -> map

NFT states:
- owned
- open for trade (swap / auction / direct sell)

#### Roadmap

Interface:
- [x] Display tokens on map
- [x] List tokens and their status by owner

Features:
- [x] Request minting for a token (through `sc-mint`)
- [x] Emit NFTs for minted metadata.
- [x] Allow owners to send their tokens to others (directly from their wallet)
- [ ] Implement bids (in any ESDT)
- [ ] Implement swaps (for any ESDT quantity, including other NFTs)

Statistics and other information:
- [x] Top minters
- [ ] List all NFTs and owners
- [ ] List auctioned NFTs -> allow bid/buy/trade
- [ ] List all bidders/bids


#### TODOs

Direct sell:
1. set price
1. NFT is bought **or** owner retracts offer

Swap:
1. add NFT to swap contract
1. contract gathers swap counteroffers
1. owner cancels swap **or** chooses to swap with a counteroffer

Auctions:
1. set time limit, bid NFT, set minimum price
1. gather bids
1. owner closes bid (all bidders are refunded) **or** owner finalizes the auction
(highest bidder receives the NFT, all other bidders are refunded, NFT owner receives bid amount)

#### Remarks

Fees are gathered by the sell/swap/bid smart contracts.
Swap fees to be described later.

A smart contract's owner can request any fraction of its balance at any time.


