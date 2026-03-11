import { useState } from 'react'
import { Wallet, TrendingUp, Users, Coins } from 'lucide-react'

interface MemeVaultProps {
  walletAddress: string | null
}

export function MemeVault({ walletAddress }: MemeVaultProps) {
  const [activeTab, setActiveTab] = useState<'created' | 'collected'>('created')

  // Mock data - will be replaced with blockchain data
  const stats = {
    memesCreated: 12,
    memesCollected: 47,
    totalEarned: 156000,
    totalSpent: 89000
  }

  const createdMemes = [
    {
      id: '1',
      imageUrl: 'https://placehold.co/400x400/1a1a1a/orange?text=My+Meme+1',
      tips: 21000,
      collectors: 420
    },
    {
      id: '2',
      imageUrl: 'https://placehold.co/400x400/1a1a1a/orange?text=My+Meme+2',
      tips: 15000,
      collectors: 310
    }
  ]

  const collectedMemes = [
    {
      id: '3',
      imageUrl: 'https://placehold.co/400x400/1a1a1a/orange?text=Collected+1',
      creator: 'SatoshiVibes',
      tips: 45000
    },
    {
      id: '4',
      imageUrl: 'https://placehold.co/400x400/1a1a1a/orange?text=Collected+2',
      creator: 'BitcoinMaxi',
      tips: 32000
    }
  ]

  if (!walletAddress) {
    return (
      <div className="bg-card border border-border rounded-xl p-12 text-center space-y-4 max-w-md mx-auto">
        <Wallet className="h-16 w-16 text-muted-foreground mx-auto" />
        <h3 className="text-xl font-semibold text-foreground">Connect Your Wallet</h3>
        <p className="text-muted-foreground">
          Connect your wallet to view your meme vault and see your collection
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-6 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Memes Created</p>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.memesCreated}</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Memes Collected</p>
            <Users className="h-4 w-4 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.memesCollected}</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Earned</p>
            <Coins className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-500">{stats.totalEarned.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">sats</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Spent</p>
            <Coins className="h-4 w-4 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-purple-500">{stats.totalSpent.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">sats</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('created')}
          className={`px-6 py-3 font-medium transition-colors relative ${
            activeTab === 'created'
              ? 'text-purple-500'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Created
          {activeTab === 'created' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('collected')}
          className={`px-6 py-3 font-medium transition-colors relative ${
            activeTab === 'collected'
              ? 'text-purple-500'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Collected
          {activeTab === 'collected' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
          )}
        </button>
      </div>

      {/* Meme Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {activeTab === 'created' ? (
          createdMemes.map((meme) => (
            <div
              key={meme.id}
              className="group bg-card border border-border rounded-xl overflow-hidden hover:border-purple-500/50 transition-all cursor-pointer"
            >
              <div className="relative aspect-square bg-muted">
                <img
                  src={meme.imageUrl}
                  alt="Meme"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-purple-500">
                    <Coins className="h-3 w-3" />
                    <span className="font-medium">{meme.tips.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>{meme.collectors}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          collectedMemes.map((meme) => (
            <div
              key={meme.id}
              className="group bg-card border border-border rounded-xl overflow-hidden hover:border-purple-500/50 transition-all cursor-pointer"
            >
              <div className="relative aspect-square bg-muted">
                <img
                  src={meme.imageUrl}
                  alt="Meme"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-3 space-y-2">
                <p className="text-xs text-muted-foreground truncate">by {meme.creator}</p>
                <div className="flex items-center gap-1 text-sm text-purple-500">
                  <Coins className="h-3 w-3" />
                  <span className="font-medium">{meme.tips.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Empty State */}
      {((activeTab === 'created' && createdMemes.length === 0) ||
        (activeTab === 'collected' && collectedMemes.length === 0)) && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            {activeTab === 'created' ? (
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            ) : (
              <Users className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <h3 className="text-xl font-semibold text-foreground">
            {activeTab === 'created' ? 'No Memes Created Yet' : 'No Memes Collected Yet'}
          </h3>
          <p className="text-muted-foreground text-center max-w-md">
            {activeTab === 'created'
              ? 'Start creating memes and share them with the community'
              : 'Explore the feed and collect your favorite memes'}
          </p>
        </div>
      )}
    </div>
  )
}
