/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MEME_CONTRACT_ADDRESS: string
  readonly VITE_TIPPING_CONTRACT_ADDRESS: string
  readonly VITE_RANKING_CONTRACT_ADDRESS: string
  readonly VITE_RPC_URL: string
  readonly VITE_NETWORK: string
  readonly VITE_IPFS_GATEWAY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
