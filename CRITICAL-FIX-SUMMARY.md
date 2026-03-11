# CRITICAL FIX - Method Not Found Issue

## 🎯 Root Cause Found in opnet-bible.md

### ❌ The Problem:
**getContract() requires 5 parameters, not 4!**

From `/8Agent/buidl-opnet-plugin/knowledge/opnet-bible.md`:

```typescript
// CORRECT — all 5 params
const contract = getContract<IOP20Contract>(
    contractAddress,   // 1: address (op1... or 0x...)
    OP_20_ABI,         // 2: ABI
    provider,          // 3: provider
    networks.bitcoin,  // 4: network
    senderAddress,     // 5: sender address — REQUIRED
);

// WRONG — missing params
const contract = getContract(address, abi, provider, networks.bitcoin); // 4 params: missing sender
```

### ❌ Our Code Was Wrong:
```typescript
// WRONG - only 4 params
return getContract(CONTRACT_ADDRESS, typedAbi, provider, networks.opnetTestnet);
```

### ✅ Fixed Code:
```typescript
// CORRECT - all 5 params
const { Address } = await getSDK();
const senderAddress = Address.fromString(walletAddress);
return getContract(CONTRACT_ADDRESS, typedAbi, provider, networks.opnetTestnet, senderAddress);
```

## 📝 Changes Made:

### 1. useMemeTipper.ts
- ✅ Added `Address` to SDK imports
- ✅ Created `senderAddress = Address.fromString(walletAddress)`
- ✅ Pass 5 params to `getContract()`

### 2. useMemeMinter.ts
- ✅ Added `Address` to SDK imports
- ✅ Created `senderAddress = Address.fromString(walletAddress)`
- ✅ Pass 5 params to `getContract()`

### 3. MemeTipper Contract
- ✅ Fixed BytesWriter length (was 1, now U256_BYTE_LENGTH)
- ✅ Returns actual tipCount instead of hardcoded 1

## 🔗 Contract Addresses:

- **MemeMinter:** `opt1sqphrwx62s6cdtt96hdm77z5tz3xrg7ugwckt5qlt` ✅
- **MemeTipper:** `opt1sqqd7casq2t5nvddngn56zk96zpyq3pcsdczstx2q` ✅

## 🎯 Expected Result:

**Both contracts should now work with real transactions!**

The missing 5th parameter (senderAddress) was preventing the contract from finding methods, causing the "Method not found: 3006033502" error.

## 📚 Source:

Knowledge from: `C:\Users\saha7\CascadeProjects\8Agent\buidl-opnet-plugin\knowledge\opnet-bible.md`

Line 957-983: "getContract — Full 5-Param Pattern"
