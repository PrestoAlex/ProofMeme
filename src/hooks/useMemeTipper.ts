import { useCallback, useEffect, useState } from 'react';

interface MemeTipperState {
  totalTips: number;
  tipCount: number;
  loading: boolean;
  error: string | null;
}

interface TipResult {
  success: boolean;
  tipId?: number;
  txid?: string;
  error?: string;
}

interface GetTipsResult {
  success: boolean;
  totalTips?: number;
  tipCount?: number;
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

// MemeTipper ABI
const MEMETIPPER_ABI = [
  { type: 'function', name: 'tipMeme', inputs: [{ name: 'amount', type: 'uint256' }], outputs: [{ name: 'tipCount', type: 'uint256' }] },
  { type: 'function', name: 'getTotalTips', inputs: [], outputs: [{ name: 'total', type: 'uint256' }] },
];

export function useMemeTipper(walletAddress: string | null) {
  const [state, setState] = useState<MemeTipperState>({
    totalTips: 0,
    tipCount: 0,
    loading: false,
    error: null,
  });

  // Contract address - MemeTipper deployed address (LATEST - FIXED)
  const CONTRACT_ADDRESS = 'opt1sqqr5ak9grwv0vp584terqzzxyxwmvp78gg5aw37y';

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
            type: (ABIDataTypes as any)[input.type.toUpperCase()] || input.type,
          })),
          outputs: (entry.outputs || []).map((output: any) => ({
            ...output,
            type: (ABIDataTypes as any)[output.type.toUpperCase()] || output.type,
          })),
        }));
      };

      const typedAbi = normalizeAbi(MEMETIPPER_ABI);
      
      console.log(`[ProofOfMeme] Loading MemeTipper contract at: ${CONTRACT_ADDRESS}`);

      return getContract(CONTRACT_ADDRESS, typedAbi, provider, networks.opnetTestnet);
    } catch (error) {
      console.error('MemeTipper contract loading failed:', error);
      throw new Error(`Failed to load MemeTipper contract: ${error instanceof Error ? error.message : String(error)}`);
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

      console.log(`[ProofOfMeme] Calling MemeTipper.${methodName} with args:`, args);

      // Call contract method (returns simulation)
      const simulation = await (contract as any)[methodName](...args);
      
      if (simulation?.revert) {
        throw new Error(`Contract revert: ${simulation.revert}`);
      }

      // Send transaction with simulation
      const { networks } = await getBitcoin();
      const receipt = await simulation.sendTransaction({
        refundTo: walletAddress,
        feeRate: 1,
        maximumAllowedSatToSpend: 30000n,
        network: networks.opnetTestnet,
      });

      const txid = receipt?.transactionId || receipt?.txid || String(receipt);
      console.log(`[ProofOfMeme] MemeTipper transaction ${methodName} completed:`, txid);

      return {
        ok: true,
        txid,
        explorerUrl: `${EXPLORER_BASE}/${txid}?network=${NETWORK_PARAM}`,
      };
    } catch (error) {
      console.error(`[ProofOfMeme] Error in MemeTipper.${methodName}:`, error);

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

      // Call view method (no transaction needed)
      const result = await (contract as any)[methodName](...args);
      
      if (result?.revert) {
        throw new Error(`Contract revert: ${result.revert}`);
      }

      // Extract properties from result
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
      console.error(`[ProofOfMeme] Error in MemeTipper.${methodName}:`, error);
      return {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
        properties: {},
      };
    }
  }, [getContract]);

  const tipMeme = useCallback(async (memeId: number, amount: number): Promise<TipResult> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Try real contract first
      console.log('[ProofOfMeme] Attempting tipMeme call:', { memeId, amount });
      const result = await callWriteMethod('tipMeme', [BigInt(amount)]); // Only amount, not memeId
      
      if (result.ok && result.txid) {
        // Real transaction successful
        const newTipId = state.tipCount + 1;
        
        setState(prev => ({
          ...prev,
          totalTips: prev.totalTips + amount,
          tipCount: newTipId,
          loading: false,
        }));

        return {
          success: true,
          tipId: newTipId,
          txid: result.txid,
        };
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error: any) {
      const errorMessage = error?.message || String(error);
      console.log('[ProofOfMeme] Contract error:', errorMessage);

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
  }, [callWriteMethod, state.tipCount]);

  const getTotalTips = useCallback(async (): Promise<GetTipsResult> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Try real contract first
      const result = await callViewMethod('getTotalTips', []);
      
      if (result.ok && result.properties) {
        // Parse the result from real contract
        const totalTips = Number((result.properties as any).total) || state.totalTips;
        
        setState(prev => ({
          ...prev,
          totalTips: totalTips,
          loading: false,
        }));

        return {
          success: true,
          totalTips: totalTips,
        };
      } else {
        throw new Error('Failed to get total tips');
      }
    } catch (error: any) {
      const errorMessage = error?.message || String(error);
      console.log('[ProofOfMeme] getTotalTips error:', errorMessage);

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
  }, [callViewMethod, state.totalTips]);

  const getTipCount = useCallback(async (): Promise<GetCountResult> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Since getTipCount method doesn't exist in contract, we'll use mock data
      // based on the tipCount state we maintain locally
      const count = state.tipCount;
      
      setState(prev => ({
        ...prev,
        loading: false,
      }));

      return {
        success: true,
        count: count,
      };
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
  }, [state.tipCount]);

  const refreshStats = useCallback(async () => {
    try {
      await Promise.all([getTotalTips(), getTipCount()]);
    } catch (error) {
      console.error('[ProofOfMeme] Failed to refresh stats:', error);
    }
  }, [getTotalTips, getTipCount]);

  useEffect(() => {
    if (walletAddress) {
      refreshStats();
    }
  }, [walletAddress]); // Remove refreshStats from dependencies to prevent infinite loop

  return {
    ...state,
    tipMeme,
    getTotalTips,
    getTipCount,
    refreshStats,
  };
}
