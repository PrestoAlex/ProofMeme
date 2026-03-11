import { Bitcoin, Flame, Trophy, Wallet, Plus, Loader2, User, Book } from 'lucide-react'
import { useOPNetWallet } from '../../hooks/useOPNetWallet'

type Tab = 'feed' | 'create' | 'vault' | 'leaderboard' | 'profile' | 'guide'

interface HeaderProps {
  walletAddress: string | null
  onWalletConnect: (address: string) => void
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

export function Header({ onWalletConnect, activeTab, onTabChange }: HeaderProps) {
  const { wallet, loading, connect, disconnect } = useOPNetWallet()

  const handleConnect = async () => {
    const result = await connect()
    if (result.ok && result.wallet?.address) {
      onWalletConnect(result.wallet.address)
    } else {
      alert(result.error || 'Failed to connect wallet')
    }
  }

  const handleDisconnect = async () => {
    const result = await disconnect()
    if (result.ok) {
      onWalletConnect('')
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`
  }

  const formatBalance = (balance: number) => {
    if (balance >= 1000000) {
      return `${(balance / 1000000).toFixed(1)}M`
    } else if (balance >= 1000) {
      return `${(balance / 1000).toFixed(1)}K`
    }
    return balance.toString()
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.location.reload()}
              className="hover:opacity-80 transition-opacity cursor-pointer"
              style={{ marginTop: '12.8px' }}
            >
              <img 
                src="/images/logo.png" 
                alt="ProofOfMeme Logo" 
                className="h-32 w-auto animate-pulse"
                style={{ 
                  animation: 'logoPulse 3s ease-in-out infinite',
                  cursor: 'pointer'
                }}
                onError={(e) => {
                  // Fallback to Bitcoin icon if logo not found
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <Bitcoin className="h-32 w-32 text-purple-500" style={{ display: 'none', marginTop: '12.8px' }} />
            </button>
                      </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onTabChange('feed')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'feed'
                  ? 'bg-purple-500/10 text-purple-500'
                  : 'hover:bg-muted text-muted-foreground'
              }`}
            >
              <Flame className="h-4 w-4" />
              Feed
            </button>
            <button
              onClick={() => onTabChange('create')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'create'
                  ? 'bg-purple-500/10 text-purple-500'
                  : 'hover:bg-muted text-muted-foreground'
              }`}
            >
              <Plus className="h-4 w-4" />
              Create
            </button>
            <button
              onClick={() => onTabChange('vault')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'vault'
                  ? 'bg-purple-500/10 text-purple-500'
                  : 'hover:bg-muted text-muted-foreground'
              }`}
            >
              <Trophy className="h-4 w-4" />
              Vault
            </button>
            <button
              onClick={() => onTabChange('leaderboard')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'leaderboard'
                  ? 'bg-purple-500/10 text-purple-500'
                  : 'hover:bg-muted text-muted-foreground'
              }`}
            >
              <Wallet className="h-4 w-4" />
              Leaders
            </button>
            <button
              onClick={() => onTabChange('guide')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'guide'
                  ? 'bg-purple-500/10 text-purple-500'
                  : 'hover:bg-muted text-muted-foreground'
              }`}
            >
              <Book className="h-4 w-4" />
              Guide
            </button>
            {wallet.connected && (
              <button
                onClick={() => onTabChange('profile')}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  activeTab === 'profile'
                    ? 'bg-purple-500/10 text-purple-500'
                    : 'hover:bg-muted text-muted-foreground'
                }`}
              >
                <User className="h-4 w-4" />
                Profile
              </button>
            )}
          </nav>

          {/* Wallet Connect */}
          <div>
            {wallet.connected && wallet.address ? (
              <div className="flex items-center gap-3">
                {/* Balance */}
                <div className="hidden sm:flex items-center gap-1 text-sm">
                  <span className="text-muted-foreground">Balance:</span>
                  <span className="font-medium text-purple-500">
                    {formatBalance(wallet.balance)} sats
                  </span>
                </div>
                
                {/* Wallet Info */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <Bitcoin className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-mono text-purple-500">
                    {formatAddress(wallet.address)}
                  </span>
                </div>

                {/* Disconnect Button */}
                <button
                  onClick={handleDisconnect}
                  className="px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground text-sm transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnect}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 disabled:bg-muted text-white font-medium transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="h-4 w-4" />
                    Connect Wallet
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
