// Contract debugging utility
export function checkContractAddresses() {
  console.log('🔍 Contract Address Verification:');
  console.log('=====================================');
  
  // Known addresses from deployment
  const contracts = {
    memeMinter: 'opt1sqrkrkhs8860x2f2mmg73sunmg8tuc5yqzqd57quz',
    memeTipper: 'opt1sqzvtvv4axx09mvfyweul7vgegfxs4m53ksjtdhzm',
    memeRanker: 'opt1sqrkrkhs8860x2f2mmg73sunmg8tuc5yqzqd57quz', // Same as MemeMinter?
    memeCounter: 'opt1sqzvtvv4axx09mvfyweul7vgegfxs4m53ksjtdhzm' // Same as MemeTipper?
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
  
  console.log('\n⚠️  Issues Found:');
  console.log('- MemeRanker and MemeMinter have same address');
  console.log('- MemeCounter and MemeTipper have same address');
  console.log('- This suggests deployment may have failed or addresses are incorrect');
  
  return contracts;
}

// Auto-run on load
if (typeof window !== 'undefined') {
  setTimeout(() => {
    console.log('🔧 Checking contract addresses...');
    checkContractAddresses();
  }, 1000);
}
