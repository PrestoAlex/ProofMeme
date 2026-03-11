# 🏗️ SatsMeme Architecture

## Overview

SatsMeme - це Bitcoin-native платформа для створення та торгівлі мем NFT на Bitcoin Layer 1 через OP_NET smart contracts.

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │MemeFeed  │  │ Creator  │  │  Vault   │  │Rankings │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              OP_NET SDK Integration Layer                │
│  ┌──────────────────────────────────────────────────┐   │
│  │  useOPNetWallet  │  useMemeContract  │  useTips  │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│           Bitcoin L1 (OP_NET Smart Contracts)            │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │  MemeNFT   │  │  Tipping   │  │  Ranking   │        │
│  │ Contract   │  │ Contract   │  │ Contract   │        │
│  └────────────┘  └────────────┘  └────────────┘        │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  Bitcoin Blockchain                      │
└─────────────────────────────────────────────────────────┘
```

## Smart Contracts

### 1. MemeNFTContract

**Призначення:** Керування створенням та власністю мем NFT

**Основні функції:**
- `mintMeme(imageHash, title)` - створення нового мему як NFT
- `transfer(tokenId, to)` - передача власності
- `addTip(tokenId)` - додавання чайових
- `getOwner(tokenId)` - отримання власника
- `getCreator(tokenId)` - отримання автора
- `getTips(tokenId)` - отримання суми чайових
- `getCollectorCount(tokenId)` - кількість колекціонерів

**Структура даних:**
```typescript
{
  tokenId: u256,
  owner: Address,
  creator: Address,
  imageHash: string,  // IPFS hash
  title: string,
  timestamp: u256,
  totalTips: u256,
  collectorCount: u256
}
```

### 2. TippingContract

**Призначення:** Управління системою чайових та виплат

**Основні функції:**
- `tipMeme(tokenId, amount)` - надіслати чайові
- `recordEarnings(creator)` - записати заробіток
- `withdrawEarnings()` - вивести заробіток
- `getCreatorEarnings(creator)` - отримати заробіток автора
- `getMemeTips(tokenId)` - отримати чайові мему

**Механіка:**
- Прямі виплати в sats авторам
- Прозоре відстеження on-chain
- Інтеграція з рейтингами

### 3. RankingContract

**Призначення:** Відстеження рейтингів та статистики

**Основні функції:**
- `incrementMemeCount(creator)` - збільшити лічильник мемів
- `addCreatorTips(creator, amount)` - додати чайові автору
- `calculateViralScore(tokenId, tips, collectors)` - розрахувати viral score
- `getCreatorMemeCount(creator)` - кількість мемів автора
- `getCreatorTotalTips(creator)` - загальні чайові автора
- `getMemeViralScore(tokenId)` - viral score мему

**Формула Viral Score:**
```
viralScore = (tips × 2) + (collectors × 3)
```

## Frontend Architecture

### Component Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # Навігація + wallet
│   │   └── Footer.tsx          # Footer
│   ├── feed/
│   │   ├── MemeFeed.tsx        # Головний feed
│   │   └── MemeCard.tsx        # Картка мему
│   ├── creator/
│   │   ├── MemeCreator.tsx     # Форма створення
│   │   └── ImageUpload.tsx     # Завантаження зображення
│   ├── vault/
│   │   ├── MemeVault.tsx       # Персональна колекція
│   │   └── VaultCard.tsx       # Картка в колекції
│   └── leaderboard/
│       ├── Leaderboard.tsx     # Рейтинги
│       ├── CreatorRank.tsx     # Рейтинг авторів
│       └── MemeRank.tsx        # Рейтинг мемів
├── hooks/
│   ├── useOPNetWallet.ts       # Wallet integration
│   ├── useMemeContract.ts      # MemeNFT взаємодія
│   ├── useTipping.ts           # Tipping логіка
│   └── useRanking.ts           # Ranking дані
├── services/
│   ├── memeService.ts          # Meme операції
│   ├── tippingService.ts       # Tipping операції
│   ├── rankingService.ts       # Ranking операції
│   └── ipfsService.ts          # IPFS інтеграція
└── types/
    ├── meme.ts                 # Meme типи
    └── contract.ts             # Contract типи
```

### State Management

**Local State (useState):**
- UI стан (модалки, форми)
- Тимчасові дані

**Custom Hooks:**
- Wallet connection
- Contract interactions
- Data fetching

### Data Flow

1. **Створення мему:**
   ```
   User → Upload Image → IPFS → Get Hash → 
   MemeNFTContract.mintMeme() → NFT Created → 
   Update Feed
   ```

2. **Tipping:**
   ```
   User → Click Tip → TippingContract.tipMeme() →
   Update Tips → Update Rankings → Refresh UI
   ```

3. **Collecting:**
   ```
   User → Collect Meme → MemeNFTContract.transfer() →
   Update Owner → Update Collector Count → 
   Add to Vault
   ```

## Integration with OP_NET

### SDK Usage

```typescript
import { getContract, JSONRpcProvider } from 'opnet';
import { Address } from '@btc-vision/transaction';

// Initialize provider
const provider = new JSONRpcProvider({
  url: 'https://testnet.opnet.org',
  network: btcNetwork
});

// Get contract instance
const contract = getContract(
  contractAddress,
  abi,
  provider,
  network,
  senderAddress
);

// Call method
const simulation = await contract.mintMeme(imageHash, title);
const receipt = await simulation.sendTransaction({
  refundTo: senderAddress,
  feeRate: 1,
  maximumAllowedSatToSpend: 30000n,
  network: btcNetwork
});
```

### Address Format

**ВАЖЛИВО:** Завжди використовуйте `opt1...` адреси для контрактів:

```typescript
// ✅ Правильно
const contractAddress = 'opt1sqq9atq0ayd333h2mvexv5dg5gryru5u4nckyzdwk';

// ❌ Неправильно
const contractAddress = '0x67726c23bf306d582abcbcea09c39bd33002e22c...';
```

### Public Keys

```typescript
const publicKeyInfo = await provider.getPublicKeysInfoRaw(address);
const addressData = publicKeyInfo[address];

const senderAddressObj = Address.fromString(
  addressData.mldsaHashedPublicKey,
  '02' + addressData.tweakedPubkey  // Префікс '02' обов'язковий!
);
```

## IPFS Integration

### Storage Strategy

1. **Meme Images:** Зберігаються в IPFS через Pinata
2. **Metadata:** Hash зберігається on-chain
3. **Retrieval:** Через IPFS gateway

### Upload Flow

```typescript
// 1. Upload to IPFS
const hash = await uploadToIPFS(imageFile);

// 2. Mint NFT with hash
const tokenId = await mintMeme(hash, title);

// 3. Display from IPFS
const imageUrl = `${IPFS_GATEWAY}${hash}`;
```

## Security Considerations

1. **Wallet Security:**
   - Ніколи не зберігати приватні ключі
   - Використовувати OP_NET wallet extension

2. **Contract Security:**
   - Перевірка власності перед transfer
   - Валідація вхідних даних
   - Захист від overflow

3. **IPFS:**
   - Pinning для постійності
   - Backup через multiple gateways

## Performance Optimization

1. **Frontend:**
   - Lazy loading компонентів
   - Image optimization
   - Pagination для feed

2. **Blockchain:**
   - Batch operations де можливо
   - Оптимізація gas fees
   - Caching contract calls

3. **IPFS:**
   - CDN для gateway
   - Image compression
   - Progressive loading

## Deployment Strategy

1. **Contracts:**
   ```bash
   cd contracts
   npm run build:all
   npm run deploy:meme
   npm run deploy:tipping
   npm run deploy:ranking
   ```

2. **Frontend:**
   ```bash
   npm run build
   npm run preview
   ```

3. **Environment:**
   - Testnet для розробки
   - Mainnet для production

## Monitoring & Analytics

1. **On-chain Metrics:**
   - Total memes minted
   - Total tips distributed
   - Active creators

2. **User Metrics:**
   - Daily active users
   - Memes created per day
   - Average tips per meme

3. **Performance:**
   - Transaction success rate
   - Average confirmation time
   - Gas costs

## Future Enhancements

1. **Smart Contract:**
   - Royalties на secondary sales
   - Meme collections/series
   - Collaborative memes

2. **Frontend:**
   - AI meme generator
   - Social sharing integration
   - Mobile app

3. **Features:**
   - Meme battles/competitions
   - DAO governance
   - Token rewards

---

**Версія:** 1.0.0  
**Дата:** 2025  
**Статус:** Development
