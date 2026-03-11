import { useCallback, useEffect, useState } from 'react';

interface MemeMinterState {
  totalMemes: number;
  memeCount: number;
  loading: boolean;
  error: string | null;
}

interface MintResult {
  success: boolean;
  memeId?: number;
  txid?: string;
  error?: string;
}

interface GetCountResult {
  success: boolean;
  count?: number;
  error?: string;
}

// OP_NET SDK imports (dynamic import)
const RPC_URL = 'https://testnet.opnet.org';
const EXPLORER_BASE = 'https://opscan.org/transactions';
const NETWORK_PARAM = 'op_testnet';

// MemeMinter ABI
const MEMEMINTER_ABI = [
  { type: 'function', name: 'mintMeme', inputs: [], outputs: [{ name: 'memeId', type: 'uint256' }] },
  { type: 'function', name: 'getMemeCount', inputs: [], outputs: [{ name: 'count', type: 'uint256' }] },
];

export function useMemeMinter(walletAddress: string | null) {
  const [state, setState] = useState<MemeMinterState>({
    totalMemes: 0,
    memeCount: 0,
    loading: false,
    error: null,
  });

  // Contract address from deployment (NEW)
  const CONTRACT_ADDRESS = 'opt1sqphrwx62s6cdtt96hdm77z5tz3xrg7ugwckt5qlt';

  // Dynamic SDK loading
  const getSDK = useCallback(async () => {
    // Use local opnet package instead of external URL
    const opnet = await import('opnet');
    return {
      getContract: opnet.getContract,
      JSONRpcProvider: opnet.JSONRpcProvider,
      ABIDataTypes: opnet.ABIDataTypes,
      BitcoinAbiTypes: opnet.BitcoinAbiTypes,
    };
  }, []);

  const getBitcoin = useCallback(async () => {
    // Use local @btc-vision/bitcoin package
    const bitcoin = await import('@btc-vision/bitcoin');
    return bitcoin;
  }, []);

  const getProvider = useCallback(async () => {
    const { JSONRpcProvider } = await getSDK();
    const { networks } = await getBitcoin();
    
    return new JSONRpcProvider({
      url: RPC_URL,
      network: networks.opnetTestnet,
    });
  }, [getSDK, getBitcoin]);

  const getContract = useCallback(async () => {
    if (!walletAddress) {
      throw new Error('Wallet not connected');
    }

    try {
      const { getContract, ABIDataTypes, BitcoinAbiTypes } = await getSDK();
      const provider = await getProvider();
      const { networks } = await getBitcoin();

      // Normalize ABI
      const normalizeAbi = (abi: any[]) => {
        return abi.map((entry) => ({
          ...entry,
          type: entry.type.toLowerCase() === 'function' ? BitcoinAbiTypes.Function : entry.type,
          inputs: (entry.inputs || []).map((input: any) => ({
            ...input,
            type: ABIDataTypes[input.type.toUpperCase()] || input.type,
          })),
          outputs: (entry.outputs || []).map((output: any) => ({
            ...output,
            type: ABIDataTypes[output.type.toUpperCase()] || output.type,
          })),
        }));
      };

      const typedAbi = normalizeAbi(MEMEMINTER_ABI);
      
      console.log(`[ProofOfMeme] Loading MemeMinter contract at: ${CONTRACT_ADDRESS}`);

      return getContract(CONTRACT_ADDRESS, typedAbi, provider, networks.opnetTestnet);
    } catch (error) {
      console.error('MemeMinter contract loading failed:', error);
      throw new Error(`Failed to load MemeMinter contract: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, [walletAddress, getSDK, getBitcoin, getProvider]);

  const callWriteMethod = useCallback(async (methodName: string, args: any[] = []) => {
    if (!walletAddress) {
      throw new Error('Wallet not connected');
    }

    try {
      const contract = await getContract();
      
      if (typeof (contract as any)[methodName] !== 'function') {
        throw new Error(`Method '${methodName}' not found on contract`);
      }

      console.log(`[ProofOfMeme] Calling ${methodName} with args:`, args);

      // Simulation first
      const simulation = await (contract as any)[methodName](...args);
      if (simulation?.revert) {
        throw new Error(`Contract revert: ${simulation.revert}`);
      }

      // Send transaction
      const { networks } = await getBitcoin();
      const receipt = await simulation.sendTransaction({
        refundTo: walletAddress,
        feeRate: 1,
        maximumAllowedSatToSpend: 30000n,
        network: networks.opnetTestnet,
      });

      const txid = receipt?.transactionId || receipt?.txid || String(receipt);
      console.log(`[ProofOfMeme] Transaction ${methodName} completed:`, txid);

      return {
        ok: true,
        txid,
        explorerUrl: `${EXPLORER_BASE}/${txid}?network=${NETWORK_PARAM}`,
      };
    } catch (error) {
      console.error(`[ProofOfMeme] Error in ${methodName}:`, error);

      if (error instanceof Error) {
        if (error.message?.includes('signer is not allowed')) {
          throw new Error('Wallet interaction error: Please check your OP_NET wallet extension and try again.');
        }
        if (error.message?.includes('out of memory')) {
          throw new Error('Contract memory error: The contract may be too complex.');
        }
      }

      throw error;
    }
  }, [walletAddress, getContract, getBitcoin]);

  const callViewMethod = useCallback(async (methodName: string, args: any[] = []) => {
    try {
      const contract = await getContract();
      
      if (typeof (contract as any)[methodName] !== 'function') {
        throw new Error(`Method '${methodName}' not found on contract`);
      }

      const result = await (contract as any)[methodName](...args);
      if (result?.revert) {
        throw new Error(`Contract revert: ${result.revert}`);
      }

      let properties = {};
      try {
        properties = result?.properties || {};
      } catch (bufferError) {
        console.warn(`[ProofOfMeme] Buffer reading error for ${methodName}:`, bufferError);
        if (result && typeof result === 'object') {
          properties = { raw: result };
        }
      }

      return {
        ok: true,
        properties,
      };
    } catch (error) {
      console.error(`[ProofOfMeme] Error in ${methodName}:`, error);
      return {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
        properties: {},
      };
    }
  }, [getContract]);

  const mintMeme = useCallback(async (): Promise<MintResult> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Convert to BigInt for OP_NET compatibility
      const result = await callWriteMethod('mintMeme', []);
      
      if (result.ok && result.txid) {
        // Mock successful mint with new meme ID
        const newMemeId = state.totalMemes + 1;
        
        setState(prev => ({
          ...prev,
          totalMemes: newMemeId,
          memeCount: prev.memeCount + 1,
          loading: false,
        }));

        return {
          success: true,
          memeId: newMemeId,
          txid: result.txid,
        };
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));

      return {
        success: false,
        error: errorMessage,
      };
    }
  }, [callWriteMethod, state.totalMemes]);

  const getMemeCount = useCallback(async (): Promise<GetCountResult> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await callViewMethod('getMemeCount', []);
      
      if (result.ok && result.properties) {
        // Parse the result - mock for now
        const count = state.totalMemes + Math.floor(Math.random() * 10);
        
        setState(prev => ({
          ...prev,
          memeCount: count,
          loading: false,
        }));

        return {
          success: true,
          count,
        };
      } else {
        throw new Error(result.error || 'Failed to get meme count');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));

      return {
        success: false,
        error: errorMessage,
      };
    }
  }, [callViewMethod, state.totalMemes]);

  const refreshStats = useCallback(async () => {
    await getMemeCount();
  }, [getMemeCount]);

  useEffect(() => {
    if (walletAddress) {
      refreshStats();
    }
  }, [walletAddress, refreshStats]);

  return {
    ...state,
    mintMeme,
    getMemeCount,
    refreshStats,
  };
}
