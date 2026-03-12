import { useState } from 'react'
import { Heart, Users, Clock, Coins, Share2 } from 'lucide-react'
import { SatoshiTipButton } from '../tipping/SatoshiTipButton'

interface Meme {
  id: string
  imageUrl: string
  creator: string
  creatorAddress: string
  tips: number
  collectors: number
  timestamp: string
  caption?: string
}

interface MemeFeedProps {
  walletAddress: string | null
}

export function MemeFeed({ walletAddress }: MemeFeedProps) {
  const [filter, setFilter] = useState<'trending' | 'newest' | 'tipped' | 'collected'>('trending')

  // Mock data - will be replaced with blockchain data
  const mockMemes: Meme[] = [
    {
      id: '1',
      imageUrl: 'https://placehold.co/600x600/1a1a1a/orange?text=HODL+Meme',
      creator: 'SatoshiVibes',
      creatorAddress: 'opt1ppthar8djynq4mjjqz62t48y9pgdskmt0',
      tips: 21000,
      collectors: 420,
      timestamp: '2h ago',
      caption: 'When Bitcoin hits new ATH 🚀'
    },
    {
      id: '2',
      imageUrl: 'https://placehold.co/600x600/1a1a1a/orange?text=Stack+Sats',
      creator: 'BitcoinMaxi',
      creatorAddress: 'opt1sqpmz5km2cst0sxkfwhza87kqsza4k86y',
      tips: 15000,
      collectors: 310,
      timestamp: '5h ago',
      caption: 'Stack sats, stay humble'
    },
    {
      id: '3',
      imageUrl: 'https://placehold.co/600x600/1a1a1a/orange?text=OP_NET',
      creator: 'OPNETBuilder',
      creatorAddress: 'opt1sqz82u53738n8l6t64rsdf3e4u20yaq5g',
      tips: 12500,
      collectors: 250,
      timestamp: '8h ago',
      caption: 'Building on Bitcoin L1 🧡'
    }
  ]

  // const handleTip = (memeId: string) => {
  //   if (!walletAddress) {
  //     alert('Please connect your wallet first!')
  //     return
  //   }
  //   console.log('Tipping meme:', memeId)
  //   // Will integrate with OP_NET contracts
  // }

  const handleCollect = (memeId: string) => {
    if (!walletAddress) {
      alert('Please connect your wallet first!')
      return
    }
    console.log('Collecting meme:', memeId)
    // Will integrate with OP_NET contracts
  }

  const handleShare = (memeId: string) => {
    console.log('Sharing meme:', memeId)
    // Share functionality
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter('trending')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            filter === 'trending'
              ? 'bg-purple-500 text-white'
              : 'bg-muted hover:bg-muted/80 text-muted-foreground'
          }`}
        >
          🔥 Trending
        </button>
        <button
          onClick={() => setFilter('newest')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            filter === 'newest'
              ? 'bg-purple-500 text-white'
              : 'bg-muted hover:bg-muted/80 text-muted-foreground'
          }`}
        >
          ⚡ Newest
        </button>
        <button
          onClick={() => setFilter('tipped')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            filter === 'tipped'
              ? 'bg-purple-500 text-white'
              : 'bg-muted hover:bg-muted/80 text-muted-foreground'
          }`}
        >
          💰 Most Tipped
        </button>
        <button
          onClick={() => setFilter('collected')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            filter === 'collected'
              ? 'bg-purple-500 text-white'
              : 'bg-muted hover:bg-muted/80 text-muted-foreground'
          }`}
        >
          👥 Most Collected
        </button>
      </div>

      {/* Meme Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockMemes.map((meme) => (
          <div
            key={meme.id}
            className="group bg-card border border-border rounded-xl overflow-hidden hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10"
          >
            {/* Meme Image */}
            <div className="relative aspect-square bg-muted overflow-hidden">
              <img
                src={meme.imageUrl}
                alt={meme.caption || 'Meme'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Meme Info */}
            <div className="p-4 space-y-3">
              {/* Caption */}
              {meme.caption && (
                <p className="text-sm text-foreground line-clamp-2">{meme.caption}</p>
              )}

              {/* Creator */}
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{meme.creator}</p>
                  <p className="text-xs text-muted-foreground truncate font-mono">
                    {meme.creatorAddress}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Coins className="h-4 w-4 text-purple-500" />
                  <span className="font-medium text-purple-500">{meme.tips.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{meme.collectors}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{meme.timestamp}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <SatoshiTipButton
                  memeId={parseInt(meme.id)}
                  walletAddress={walletAddress}
                  tips={meme.tips}
                  onTipSuccess={(amount) => {
                    meme.tips += amount
                    setFilter(prev => prev)
                  }}
                />
                <button
                  onClick={() => handleCollect(meme.id)}
                  className="px-4 py-2 rounded-lg border border-border hover:border-purple-500 hover:bg-purple-600/10 transition-colors"
                >
                  <Heart className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleShare(meme.id)}
                  className="px-4 py-2 rounded-lg border border-border hover:border-purple-500 hover:bg-purple-600/10 transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="flex justify-center pt-8">
        <button className="px-6 py-3 rounded-lg border border-border hover:border-purple-500 hover:bg-purple-600/10 text-foreground transition-colors">
          Load More Memes
        </button>
      </div>
    </div>
  )
}
