import { useCallback, useEffect, useState } from 'react';

interface SatoshiTippingState {
  totalTips: number;
  globalTipCount: number;
  loading: boolean;
  error: string | null;
}

interface TipResult {
  success: boolean;
  txid?: string;
  memeTips?: number;
  memeTipCount?: number;
  error?: string;
}

interface ReadResult {
  success: boolean;
  value?: number;
  values?: number[];
  error?: string;
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

function bigintToU256Bytes(value: bigint): Uint8Array {
  const bytes = new Uint8Array(32);
  let remaining = value;

  for (let i = 31; i >= 0; i -= 1) {
    bytes[i] = Number(remaining & 0xffn);
    remaining >>= 8n;
  }

  return bytes;
}

function concatBytes(...parts: Uint8Array[]): Uint8Array {
  const totalLength = parts.reduce((sum, part) => sum + part.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const part of parts) {
    result.set(part, offset);
    offset += part.length;
  }

  return result;
}

const RPC_URL = 'https://testnet.opnet.org';
const EXPLORER_BASE = 'https://opscan.org/transactions';
const NETWORK_PARAM = 'op_testnet';

const SATOSHI_TIPPER_ABI = [
  {
    type: 'function',
    name: 'tipMeme',
    inputs: [],
    outputs: [],
    payable: true,
  },
  { type: 'function', name: 'getTotalTips', inputs: [], outputs: [{ name: 'totalTips', type: 'uint256' }] },
  { type: 'function', name: 'getGlobalTipCount', inputs: [], outputs: [{ name: 'globalTipCount', type: 'uint256' }] },
];

export function useSatoshiTipping(walletAddress: string | null) {
  const [state, setState] = useState<SatoshiTippingState>({
    totalTips: 0,
    globalTipCount: 0,
    loading: false,
    error: null,
  });

  const contractAddress = ((import.meta as any)?.env?.VITE_TIPPING_CONTRACT_ADDRESS as string | undefined) || 'opt1sqrzr4un3n8yqa8sc2cavxnlrtjspg6cwtypc3nep';

  const getSDK = useCallback(async () => {
    const opnet = await import('opnet');
    return {
      getContract: opnet.getContract,
      JSONRpcProvider: opnet.JSONRpcProvider,
      ABIDataTypes: opnet.ABIDataTypes,
      BitcoinAbiTypes: opnet.BitcoinAbiTypes,
    };
  }, []);

  const getBitcoin = useCallback(async () => {
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
  }, [getBitcoin, getSDK]);

  const getContract = useCallback(async () => {
    if (!walletAddress) {
      throw new Error('Wallet not connected');
    }

    if (!contractAddress || contractAddress === 'pending_rebuild') {
      throw new Error('Tipping contract is not deployed yet');
    }

    const { getContract, ABIDataTypes, BitcoinAbiTypes } = await getSDK();
    const provider = await getProvider();
    const { networks } = await getBitcoin();

    const typedAbi = SATOSHI_TIPPER_ABI.map((entry) => ({
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

    return getContract(contractAddress, typedAbi as any, provider, networks.opnetTestnet);
  }, [contractAddress, getBitcoin, getProvider, getSDK, walletAddress]);

  const parseNumericValues = (properties: any): number[] => {
    if (Array.isArray(properties)) {
      return properties.map((value) => Number(value ?? 0));
    }

    if (properties && typeof properties === 'object') {
      return Object.values(properties).map((value) => Number(value ?? 0));
    }

    return [];
  };

  const callViewMethod = useCallback(async (methodName: string, args: any[] = []): Promise<ReadResult> => {
    try {
      const contract = await getContract();
      if (typeof (contract as any)[methodName] !== 'function') {
        throw new Error(`Method '${methodName}' not found on contract`);
      }

      const result = await (contract as any)[methodName](...args);
      if (result?.revert) {
        throw new Error(`Contract revert: ${result.revert}`);
      }

      const values = parseNumericValues(result?.properties || {});
      return {
        success: true,
        value: values[0] ?? 0,
        values,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }, [getContract]);

  const tipMeme = useCallback(async (memeId: number, amount: number): Promise<TipResult> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      if (!walletAddress) {
        throw new Error('Wallet not connected');
      }

      if (amount <= 0) {
        throw new Error('Tip amount must be greater than zero');
      }

      console.log('[ProofOfMeme] Preparing tipMeme call:', {
        contractAddress,
        memeId,
        amount,
        walletAddress,
      });

      const contract = await getContract();
      if (typeof (contract as any).tipMeme !== 'function') {
        throw new Error("Method 'tipMeme' not found on contract");
      }

      const { networks } = await getBitcoin();
      const selectorOnly: Uint8Array = (contract as any).encodeCalldata('tipMeme', []);
      const rawCalldata = concatBytes(
        selectorOnly,
        bigintToU256Bytes(BigInt(memeId)),
        bigintToU256Bytes(BigInt(amount)),
      );

      console.log('[ProofOfMeme] Setting transaction details for tipMeme');
      (contract as any).setTransactionDetails({
        refundTo: walletAddress,
        feeRate: 1,
        maximumAllowedSatToSpend: BigInt(amount) + 30000n,
        network: networks.opnetTestnet,
        value: BigInt(amount),
        inputs: [],
        outputs: [],
      });
      console.log('[ProofOfMeme] Transaction details set for tipMeme');

      console.log('[ProofOfMeme] Simulating tipMeme');
      const provider = await getProvider();
      const address = await (contract as any).contractAddress;
      const simulation: any = await withTimeout(
        (provider as any).call(
          contractAddress,
          rawCalldata,
          (contract as any).from,
          undefined,
          {
            refundTo: walletAddress,
            feeRate: 1,
            maximumAllowedSatToSpend: BigInt(amount) + 30000n,
            network: networks.opnetTestnet,
            value: BigInt(amount),
            inputs: [],
            outputs: [],
          } as any,
          undefined,
        ),
        15000,
        'tipMeme simulation',
      );
      simulation.setTo((contract as any).p2op, address);
      simulation.setFromAddress((contract as any).from);
      simulation.setCalldata(rawCalldata);
      simulation.payable = true;
      simulation.constant = false;
      if (simulation?.revert) {
        throw new Error(`Contract revert: ${simulation.revert}`);
      }
      console.log('[ProofOfMeme] tipMeme simulation ok');

      console.log('[ProofOfMeme] Sending tipMeme transaction');
      const receipt = await simulation.sendTransaction({
        refundTo: walletAddress,
        feeRate: 1,
        maximumAllowedSatToSpend: BigInt(amount) + 30000n,
        network: networks.opnetTestnet,
        extraOutputs: [
          {
            address: walletAddress,
            value: BigInt(amount),
          },
        ],
      });
      console.log('[ProofOfMeme] tipMeme transaction sent', receipt);

      const txid = receipt?.transactionId || receipt?.txid || String(receipt);
      const readBackTotalTips = await callViewMethod('getTotalTips', []);
      const readBackGlobalCount = await callViewMethod('getGlobalTipCount', []);

      setState((prev) => ({
        ...prev,
        totalTips: readBackTotalTips.value ?? prev.totalTips,
        globalTipCount: readBackGlobalCount.value ?? prev.globalTipCount,
        loading: false,
      }));

      return {
        success: true,
        txid,
        memeTips: amount,
        memeTipCount: (readBackGlobalCount.value ?? 0) > 0 ? readBackGlobalCount.value : undefined,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return {
        success: false,
        error: errorMessage,
      };
    }
  }, [callViewMethod, getBitcoin, getContract, walletAddress]);

  const getTotalTips = useCallback(async (): Promise<ReadResult> => {
    const result = await callViewMethod('getTotalTips', []);
    if (result.success) {
      setState((prev) => ({ ...prev, totalTips: result.value ?? prev.totalTips }));
    }
    return result;
  }, [callViewMethod]);

  const getGlobalTipCount = useCallback(async (): Promise<ReadResult> => {
    const result = await callViewMethod('getGlobalTipCount', []);
    if (result.success) {
      setState((prev) => ({ ...prev, globalTipCount: result.value ?? prev.globalTipCount }));
    }
    return result;
  }, [callViewMethod]);

  const getMemeTips = useCallback(async (_memeId: number): Promise<ReadResult> => {
    return {
      success: false,
      error: 'Per-meme tip totals are not available from the deployed contract ABI',
    };
  }, []);

  const getMemeTipCount = useCallback(async (_memeId: number): Promise<ReadResult> => {
    return {
      success: false,
      error: 'Per-meme tip counts are not available from the deployed contract ABI',
    };
  }, []);

  const refreshStats = useCallback(async () => {
    await Promise.all([getTotalTips(), getGlobalTipCount()]);
  }, [getGlobalTipCount, getTotalTips]);

  useEffect(() => {
    if (walletAddress && contractAddress !== 'pending_rebuild') {
      refreshStats();
    }
  }, [contractAddress, refreshStats, walletAddress]);

  return {
    ...state,
    contractAddress,
    tipMeme,
    getTotalTips,
    getGlobalTipCount,
    getMemeTips,
    getMemeTipCount,
    refreshStats,
    explorerBase: EXPLORER_BASE,
    networkParam: NETWORK_PARAM,
  };
}
