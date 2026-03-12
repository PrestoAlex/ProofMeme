// Contract debugging utility
export function checkContractAddresses() {
  console.log('🔍 Contract Address Verification:');
  console.log('=====================================');
  
  // Known addresses from deployment
  const contracts = {
    memeMinter: 'opt1sqzas5sfwvqly6py209ueu62ynewyat8ca5a3p90l',
    memeTipper: 'opt1sqrzr4un3n8yqa8sc2cavxnlrtjspg6cwtypc3nep',
    memeRanker: 'opt1sqztnyjgly5gj6zyclmc2vwjdrrjzsyahsq50tjuq',
    memeCounter: 'opt1sqqg0472jx3cgufe2ud49gd0qfyqc6ntvxyq27msm'
  };
  
  console.log('📋 Contract Addresses:');
  console.log(`MemeMinter: ${contracts.memeMinter}`);
  console.log(`MemeTipper: ${contracts.memeTipper}`);
  console.log(`MemeRanker: ${contracts.memeRanker}`);
  console.log(`MemeCounter: ${contracts.memeCounter}`);
  
  console.log('\n🔗 OPScan Links:');
  Object.entries(contracts).forEach(([name, address]) => {
    console.log(`${name}: https://opscan.org/address/${address}?network=op_testnet`);
  });
  
  console.log('\n✅ Contracts Status:');
  console.log('- MemeMinter: Enhanced version deployed ✅');
  console.log('- MemeTipper: Rebuilt tipping contract deployed ✅');
  console.log('- MemeRanker: Original version (needs Enhanced deployment)');
  console.log('- MemeCounter: Original version (needs Enhanced deployment)');
  
  return contracts;
}

// Auto-run on load
if (typeof window !== 'undefined') {
  setTimeout(() => {
    console.log('🔧 Checking contract addresses...');
    checkContractAddresses();
  }, 1000);
}
