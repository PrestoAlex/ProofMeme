# 🎭 SatsMeme - Bitcoin Meme Economy

**Bitcoin-native social platform where every meme becomes a digital asset**

## 🌟 Core Concept

SatsMeme transforms memes into valuable Bitcoin NFTs, creating a decentralized meme economy on Bitcoin Layer 1 using OP_NET smart contracts.

### Philosophy

> Memes are the language of the internet.  
> But today they have no ownership.  
> SatsMeme gives memes: **ownership**, **scarcity**, **value**.

Each meme becomes:
- 🎨 A collectible
- 💎 A social asset  
- 🏛️ A cultural artifact

## 🚀 Key Features

### 1. **Meme Creation & Minting**
- Upload or generate memes
- Automatic NFT minting on Bitcoin L1
- Metadata: creator wallet, timestamp, tips, collectors

### 2. **Social Feed**
- Trending memes
- Newest memes
- Most tipped memes
- Rare collectibles

### 3. **Tipping Economy**
- Tip sats directly to creators
- Creator-driven economy
- Instant Bitcoin payments

### 4. **Meme Collecting**
- Collect favorite memes
- Personal Meme Vault
- Become part of meme history

### 5. **Rankings & Leaderboards**
- Top creators
- Most tipped memes
- Most collected memes
- Viral tracking

## 🏗️ Architecture

### Smart Contracts (OP_NET)
```
contracts/
├── MemeNFTContract.ts      # Core NFT minting & ownership
├── TippingContract.ts       # Tipping & rewards system
├── RankingContract.ts       # Leaderboards & stats
└── CollectionContract.ts    # User collections & vault
```

### Frontend (React + TailwindCSS)
```
src/
├── components/
│   ├── MemeCreator/        # Upload & create memes
│   ├── MemeFeed/           # Social feed
│   ├── MemeCard/           # Individual meme display
│   ├── MemeVault/          # Personal collection
│   └── Leaderboard/        # Rankings
├── hooks/
│   ├── useOPNetWallet.ts   # Wallet integration
│   ├── useMemeContract.ts  # Contract interactions
│   └── useTipping.ts       # Tipping system
└── services/
    ├── memeService.ts      # Meme operations
    ├── tippingService.ts   # Tipping logic
    └── ipfsService.ts      # Decentralized storage
```

## 🎨 Design Style

**Playful but Premium**

- Dark background with soft neon accents
- Minimal, modern UI
- Inspired by: Web3 collectibles + social media
- Color palette: Dark mode with Bitcoin orange & purple accents

## 🔄 User Flow

1. **Connect** → User connects OP_NET wallet
2. **Create** → Upload/generate meme
3. **Mint** → Meme automatically minted as NFT
4. **Share** → Community discovers & tips
5. **Collect** → Memes become valuable collectibles
6. **Trade** → Secondary market for rare memes

## 🌊 Viral Mechanics

- Native sharing to Twitter, Telegram, Reddit
- Each share drives traffic back to platform
- Ownership + tips + scarcity = viral growth
- Creators incentivized to promote their memes

## 🛠️ Tech Stack

### Blockchain
- **OP_NET** - Bitcoin L1 smart contracts
- **AssemblyScript** - Contract language
- **@btc-vision/btc-runtime** - Runtime library

### Frontend
- **React** + **TypeScript**
- **TailwindCSS** - Styling
- **shadcn/ui** - Component library
- **Lucide** - Icons
- **Vite** - Build tool

### Storage
- **IPFS** - Decentralized meme storage
- **Pinata** - IPFS pinning service

### Integration
- **opnet SDK** - Contract interactions
- **@btc-vision/transaction** - Bitcoin transactions

## 📊 NFT Structure

```typescript
interface MemeNFT {
  tokenId: u256;
  creator: Address;
  imageHash: string;      // IPFS hash
  timestamp: u64;
  totalTips: u256;
  collectors: Address[];
  metadata: {
    title: string;
    description: string;
    tags: string[];
  }
}
```

## 💰 Tipping System

- Direct sats to creator
- Transparent on-chain tracking
- Leaderboard integration
- Creator royalties on secondary sales

## 🏆 Ranking Mechanics

### Creator Rankings
- Total tips received
- Number of collectors
- Meme count
- Viral score

### Meme Rankings
- Tips received
- Collection count
- Share count
- Time-weighted trending

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Setup contracts
cd contracts
npm install
cp .env.example .env
# Add your MNEMONIC

# Build contracts
npm run build

# Deploy contracts
npm run deploy

# Start frontend
cd ..
npm run dev
```

## 📝 Environment Variables

```env
# Contracts
MNEMONIC=your_mnemonic_here
RPC_URL=https://testnet.opnet.org
NETWORK=testnet

# Frontend
VITE_CONTRACT_ADDRESS=opt1...
VITE_IPFS_API_KEY=your_pinata_key
```

## 🌐 Network

- **Testnet**: https://testnet.opnet.org
- **Explorer**: https://opscan.org
- **Network**: op_testnet

## 📖 Documentation

- [Smart Contract Architecture](./docs/CONTRACTS.md)
- [Frontend Guide](./docs/FRONTEND.md)
- [API Reference](./docs/API.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## 🤝 Contributing

SatsMeme is building the future of meme ownership on Bitcoin. Contributions welcome!

## 📜 License

MIT

---

**Built with 🧡 on Bitcoin**
