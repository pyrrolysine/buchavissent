
### Buchavissent: Mint, auction, and trade NFTs on buildings in Bucharest

Mintable tokens correspond to averaged building positions:
OSM -> features -> buildings -> location -> map

NFT states:
- owned
- open for trade (swap / auction / direct sell)

Auctions:
1. set time limit, bid NFT, set minimum price
1. gather bids
1. owner closes bid (all bidders are refunded) **or** owner finalizes the auction
(highest bidder receives the NFT, all other bidders are refunded, NFT owner receives bid amount)

#### TODOs

Emit NFTs for minted metadata.

Page:
- list highest bidders and highest bids
- list auctioned NFTs -> allow visitor to bid/buy/trade
- list all NFTs and owners
- list all bidders/bids

Direct sell:
1. set price
1. NFT is bought **or** owner retracts offer

Swap:
1. add NFT to swap contract
1. contract gathers swap counteroffers
1. owner cancels swap **or** chooses to swap with a counteroffer

Fees are gathered by the sell/swap/bid smart contracts.
Swap fees to be described later.

Smart contract owner(s) can request any fraction of its balance at any time.


