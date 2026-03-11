// Debug utility to check OP_NET wallet API
export function debugOPNetAPI() {
  if (!window.opnet) {
    console.log('❌ window.opnet not found');
    return;
  }

  console.log('✅ window.opnet found:', window.opnet);
  
  // Check all available methods
  const methods = Object.getOwnPropertyNames(window.opnet);
  console.log('📋 Available methods:', methods);
  
  // Check specific methods we need
  const requiredMethods = [
    'request',
    'request_accounts',
    'get_accounts',
    'get_balance',
    'sendTransaction',
    'signTransaction',
    'callContract',
    'disconnect'
  ];
  
  console.log('🔍 Method availability:');
  requiredMethods.forEach(method => {
    const available = typeof (window.opnet as any)[method] === 'function';
    console.log(`${available ? '✅' : '❌'} ${method}: ${available ? 'available' : 'not available'}`);
  });

  // Log the actual opnet object structure
  console.log('🏗️ OP_NET structure:', window.opnet);
}

// Auto-debug on load
if (typeof window !== 'undefined') {
  setTimeout(() => {
    console.log('🔧 Debugging OP_NET API...');
    debugOPNetAPI();
  }, 1000);
}
