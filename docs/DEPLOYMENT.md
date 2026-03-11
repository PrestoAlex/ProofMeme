# 🚀 SatsMeme Deployment Guide

## Prerequisites

- Node.js v18+
- npm or yarn
- OP_NET wallet with testnet BTC
- Pinata account (для IPFS)

## Step 1: Clone & Install

```bash
# Clone repository
git clone <repository-url>
cd ProofOfMeme

# Install root dependencies
npm install

# Install contract dependencies
cd contracts
npm install
cd ..
```

## Step 2: Configure Environment

### Contracts Environment

```bash
cd contracts
cp .env.example .env
```

Заповніть `.env`:

```env
# Your 12-word mnemonic for deployment
MNEMONIC=your twelve word mnemonic phrase goes here

# Network settings
RPC_URL=https://testnet.opnet.org
NETWORK=testnet

# Deployment settings
FEE_RATE=5
PRIORITY_FEE=0
GAS_SAT_FEE=500000
```

### Frontend Environment

```bash
cd ..
cp .env.example .env
```

Заповніть `.env` (після deployment контрактів):

```env
VITE_MEME_CONTRACT_ADDRESS=opt1...
VITE_TIPPING_CONTRACT_ADDRESS=opt1...
VITE_RANKING_CONTRACT_ADDRESS=opt1...
VITE_RPC_URL=https://testnet.opnet.org
VITE_NETWORK=testnet
VITE_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
```

## Step 3: Deploy Smart Contracts

### Build Contracts

```bash
cd contracts

# Build all contracts
npm run build:all

# Or build individually
npm run build:meme
npm run build:tipping
npm run build:ranking
```

Це створить `.wasm` файли в `contracts/build/`:
- `MemeNFT.wasm`
- `Tipping.wasm`
- `Ranking.wasm`

### Deploy Contracts

**Важливо:** Переконайтесь що у вас є testnet BTC на адресі з вашого mnemonic!

```bash
# Deploy MemeNFT Contract
npm run deploy:meme
```

Збережіть адресу контракту з виводу:
```
Contract address: opt1sqq9atq0ayd333h2mvexv5dg5gryru5u4nckyzdwk
```

```bash
# Deploy Tipping Contract
npm run deploy:tipping
```

```bash
# Deploy Ranking Contract
npm run deploy:ranking
```

### Verify Deployment

Перевірте контракти на OP_NET Explorer:
```
https://opscan.org/address/<contract-address>
```

## Step 4: Update Frontend Config

Оновіть `.env` з адресами контрактів:

```env
VITE_MEME_CONTRACT_ADDRESS=opt1sqq9atq0ayd333h2mvexv5dg5gryru5u4nckyzdwk
VITE_TIPPING_CONTRACT_ADDRESS=opt1...
VITE_RANKING_CONTRACT_ADDRESS=opt1...
```

## Step 5: Setup IPFS (Pinata)

1. Створіть акаунт на [Pinata](https://pinata.cloud)
2. Отримайте API ключі
3. Додайте в `contracts/.env`:

```env
PINATA_API_KEY=your_api_key
PINATA_SECRET_KEY=your_secret_key
```

## Step 6: Run Frontend

### Development

```bash
npm run dev
```

Відкрийте http://localhost:3000

### Production Build

```bash
npm run build
npm run preview
```

## Step 7: Testing

### Test Contract Interaction

```bash
cd contracts
npm run interact
```

### Manual Testing Checklist

- [ ] Connect OP_NET wallet
- [ ] Create a meme
- [ ] Verify meme appears in feed
- [ ] Tip a meme
- [ ] Collect a meme
- [ ] Check vault
- [ ] View leaderboard

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Wallet funded with testnet BTC
- [ ] IPFS configured
- [ ] Contract code reviewed

### Contract Deployment

- [ ] MemeNFT contract deployed
- [ ] Tipping contract deployed
- [ ] Ranking contract deployed
- [ ] All contracts verified on explorer
- [ ] Contract addresses saved

### Frontend Deployment

- [ ] Environment variables updated
- [ ] Build successful
- [ ] All features tested
- [ ] Performance optimized
- [ ] SEO configured

### Post-Deployment

- [ ] Monitor contract transactions
- [ ] Check IPFS uploads
- [ ] Test all user flows
- [ ] Monitor gas costs
- [ ] Collect user feedback

## Common Issues

### Issue: "No UTXOs found"

**Причина:** Недостатньо BTC на адресі

**Рішення:**
1. Перевірте адресу: `npm run check-address`
2. Отримайте testnet BTC з faucet
3. Почекайте підтвердження

### Issue: "Method not found"

**Причина:** Контракт не розгорнутий або неправильний ABI

**Рішення:**
1. Перевірте адресу контракту
2. Перебудуйте контракт: `npm run build`
3. Перевірте ABI файли

### Issue: "Invalid address format"

**Причина:** Використання HEX адреси замість opt1...

**Рішення:**
Використовуйте тільки `opt1...` формат адрес

### Issue: IPFS upload fails

**Причина:** Неправильні Pinata ключі

**Рішення:**
1. Перевірте API ключі
2. Перевірте квоту Pinata
3. Спробуйте інший IPFS сервіс

## Network Information

### Testnet

- **RPC:** https://testnet.opnet.org
- **Explorer:** https://opscan.org
- **Faucet:** [Request in Discord]
- **Network:** op_testnet

### Mainnet (Coming Soon)

- **RPC:** https://mainnet.opnet.org
- **Explorer:** https://opscan.org
- **Network:** op_mainnet

## Gas Optimization

### Recommended Settings

```env
FEE_RATE=5              # sat/vB
PRIORITY_FEE=0          # Additional fee
GAS_SAT_FEE=500000      # Max gas in sats
```

### Cost Estimates (Testnet)

- Mint Meme: ~10,000 sats
- Tip Meme: ~5,000 sats
- Transfer: ~8,000 sats
- Update Ranking: ~6,000 sats

## Monitoring

### Contract Monitoring

```bash
# Check contract state
npm run check-contract

# View recent transactions
npm run view-txs
```

### Frontend Monitoring

- Google Analytics
- Sentry for errors
- Custom analytics dashboard

## Backup & Recovery

### Contract Addresses

Зберігайте адреси контрактів у безпечному місці:
```
MemeNFT: opt1...
Tipping: opt1...
Ranking: opt1...
```

### Mnemonic

**НІКОЛИ** не діліться mnemonic!
Зберігайте в безпечному місці offline.

### IPFS Hashes

Регулярно робіть backup списку IPFS хешів.

## Support

- **Documentation:** `/docs`
- **Issues:** GitHub Issues
- **Discord:** [Community Link]
- **Email:** support@satsmeme.com

---

**Успішного деплою! 🚀**
