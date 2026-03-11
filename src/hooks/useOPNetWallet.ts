import { useCallback, useEffect, useState } from 'react';

interface WalletState {
  connected: boolean;
  address: string | null;
  balance: number;
}

interface WalletResult {
  ok: boolean;
  wallet?: WalletState;
  error?: string;
}

const WalletState: WalletState = {
  connected: false,
  address: null,
  balance: 0,
};

function getProvider() {
  if (typeof window === 'undefined' || !window.opnet) {
    return null;
  }
  return window.opnet;
}

async function callProvider(methods: string[], params: any[] = []) {
  const provider = getProvider();
  if (!provider) {
    throw new Error('OP_NET Wallet extension not detected');
  }

  if (typeof provider.request === 'function') {
    for (const method of methods) {
      try {
        return await provider.request({ method, params });
      } catch {
        // try next
      }
    }
  }

  for (const method of methods) {
    if (typeof provider[method] === 'function') {
      try {
        return await (provider as any)[method](...params);
      } catch {
        // try next
      }
    }
  }

  throw new Error('No compatible OP_NET wallet API method found');
}

async function connectWallet(): Promise<WalletResult> {
  try {
    const accounts = await callProvider(['request_accounts', 'requestAccounts'], []);
    if (!accounts || !accounts.length) {
      throw new Error('No wallet accounts returned');
    }

    // const provider = getProvider();
    WalletState.connected = true;
    WalletState.address = accounts[0];

    try {
      const bal = await callProvider(['get_balance', 'getBalance'], []);
      WalletState.balance = Number(bal?.total ?? bal?.confirmed ?? bal ?? 0);
    } catch {
      WalletState.balance = 0;
    }

    return { ok: true, wallet: { ...WalletState } };
  } catch (error) {
    return { 
      ok: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

async function disconnectWallet(): Promise<WalletResult> {
  try {
    const provider = getProvider();
    if (provider && typeof (provider as any).disconnect === 'function') {
      try {
        await (provider as any).disconnect();
      } catch {
        // local cleanup still happens
      }
    }

    WalletState.connected = false;
    WalletState.address = null;
    WalletState.balance = 0;

    return { ok: true, wallet: { ...WalletState } };
  } catch (error) {
    return { 
      ok: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

async function refreshWallet(): Promise<WalletState> {
  const provider = getProvider();
  if (!provider) {
    return { ...WalletState, connected: false };
  }

  try {
    const accounts = await callProvider(['get_accounts', 'getAccounts'], []);
    if (accounts && accounts.length) {
      WalletState.connected = true;
      WalletState.address = accounts[0];
      try {
        const bal = await callProvider(['get_balance', 'getBalance'], []);
        WalletState.balance = Number(bal?.total ?? bal?.confirmed ?? bal ?? 0);
      } catch {
        WalletState.balance = 0;
      }
    } else {
      WalletState.connected = false;
      WalletState.address = null;
      WalletState.balance = 0;
    }
  } catch {
    WalletState.connected = false;
    WalletState.address = null;
    WalletState.balance = 0;
  }

  return { ...WalletState };
}

export function useOPNetWallet() {
  const [wallet, setWallet] = useState<WalletState>(WalletState);
  const [loading, setLoading] = useState(false);

  const sync = useCallback(async () => {
    const state = await refreshWallet();
    setWallet(state);
  }, []);

  const connect = useCallback(async (): Promise<WalletResult> => {
    setLoading(true);
    try {
      const result = await connectWallet();
      if (result.ok && result.wallet) {
        setWallet(result.wallet);
      }
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnect = useCallback(async (): Promise<WalletResult> => {
    setLoading(true);
    try {
      const result = await disconnectWallet();
      if (result.ok && result.wallet) {
        setWallet(result.wallet);
      }
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Don't auto-connect, just check if already connected
    sync();
  }, [sync]);

  return {
    wallet,
    loading,
    connect,
    disconnect,
    sync,
  };
}

// Type declarations for window.opnet
declare global {
  interface Window {
    opnet?: {
      request?: (params: { method: string; params?: any[] }) => Promise<any>;
      request_accounts?: () => Promise<string[]>;
      requestAccounts?: () => Promise<string[]>;
      get_accounts?: () => Promise<string[]>;
      getAccounts?: () => Promise<string[]>;
      get_balance?: () => Promise<any>;
      getBalance?: () => Promise<any>;
      disconnect?: () => Promise<void>;
      [key: string]: any;
    };
  }
}
