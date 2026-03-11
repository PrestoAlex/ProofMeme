import { useState } from 'react'
import { Trophy, TrendingUp, Coins, Users, Flame } from 'lucide-react'

export function Leaderboard() {
  const [activeTab, setActiveTab] = useState<'creators' | 'memes'>('creators')

  // Mock data - will be replaced with blockchain data
  const topCreators = [
    {
      rank: 1,
      name: 'SatoshiVibes',
      address: 'opt1ppthar8djynq4mjjqz62t48y9pgdskmt0',
      memesCreated: 156,
      totalEarned: 2100000,
      followers: 12400
    },
    {
      rank: 2,
      name: 'BitcoinMaxi',
      address: 'opt1sqpmz5km2cst0sxkfwhza87kqsza4k86y',
      memesCreated: 98,
      totalEarned: 1850000,
      followers: 9800
    },
    {
      rank: 3,
      name: 'OPNETBuilder',
      address: 'opt1sqz82u53738n8l6t64rsdf3e4u20yaq5g',
      memesCreated: 124,
      totalEarned: 1620000,
      followers: 8500
    }
  ]

  const topMemes = [
    {
      rank: 1,
      imageUrl: 'https://placehold.co/200x200/1a1a1a/orange?text=Top+1',
      creator: 'SatoshiVibes',
      tips: 450000,
      collectors: 2400
    },
    {
      rank: 2,
      imageUrl: 'https://placehold.co/200x200/1a1a1a/orange?text=Top+2',
      creator: 'BitcoinMaxi',
      tips: 380000,
      collectors: 1900
    },
    {
      rank: 3,
      imageUrl: 'https://placehold.co/200x200/1a1a1a/orange?text=Top+3',
      creator: 'OPNETBuilder',
      tips: 320000,
      collectors: 1600
    }
  ]

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-500'
    if (rank === 2) return 'text-gray-400'
    if (rank === 3) return 'text-purple-600'
    return 'text-muted-foreground'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Trophy className="h-8 w-8 text-purple-500" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
            Leaderboard
          </h2>
        </div>
        <p className="text-muted-foreground">
          Top creators and viral memes in the Bitcoin meme economy
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('creators')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'creators'
              ? 'bg-purple-500 text-white'
              : 'bg-muted hover:bg-muted/80 text-muted-foreground'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          Top Creators
        </button>
        <button
          onClick={() => setActiveTab('memes')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'memes'
              ? 'bg-purple-500 text-white'
              : 'bg-muted hover:bg-muted/80 text-muted-foreground'
          }`}
        >
          <Flame className="h-4 w-4" />
          Viral Memes
        </button>
      </div>

      {/* Content */}
      {activeTab === 'creators' ? (
        <div className="space-y-4">
          {topCreators.map((creator) => (
            <div
              key={creator.rank}
              className="bg-card border border-border rounded-xl p-6 hover:border-purple-500/50 transition-all"
            >
              <div className="flex items-center gap-6">
                {/* Rank */}
                <div className={`text-4xl font-bold ${getRankColor(creator.rank)} min-w-[60px] text-center`}>
                  {getRankIcon(creator.rank)}
                </div>

                {/* Avatar */}
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex-shrink-0" />

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{creator.name}</h3>
                    <p className="text-sm text-muted-foreground font-mono truncate">
                      {creator.address}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{creator.memesCreated} memes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{creator.followers.toLocaleString()} followers</span>
                    </div>
                  </div>
                </div>

                {/* Earnings */}
                <div className="text-right">
                  <div className="flex items-center gap-2 text-purple-500">
                    <Coins className="h-5 w-5" />
                    <span className="text-2xl font-bold">{creator.totalEarned.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">sats earned</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topMemes.map((meme) => (
            <div
              key={meme.rank}
              className="bg-card border border-border rounded-xl overflow-hidden hover:border-purple-500/50 transition-all group"
            >
              {/* Rank Badge */}
              <div className="relative">
                <div className="absolute top-4 left-4 z-10">
                  <div className={`text-3xl font-bold ${getRankColor(meme.rank)} bg-background/90 backdrop-blur rounded-full h-12 w-12 flex items-center justify-center border-2 ${
                    meme.rank === 1 ? 'border-yellow-500' : meme.rank === 2 ? 'border-gray-400' : 'border-purple-600'
                  }`}>
                    {getRankIcon(meme.rank)}
                  </div>
                </div>

                {/* Meme Image */}
                <div className="relative aspect-square bg-muted">
                  <img
                    src={meme.imageUrl}
                    alt="Top meme"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600" />
                  <p className="text-sm font-medium text-foreground">{meme.creator}</p>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-purple-500">
                    <Coins className="h-4 w-4" />
                    <span className="font-bold">{meme.tips.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{meme.collectors.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View More */}
      <div className="flex justify-center pt-4">
        <button className="px-6 py-3 rounded-lg border border-border hover:border-purple-500 hover:bg-purple-500/10 text-foreground transition-colors">
          View Full Leaderboard
        </button>
      </div>
    </div>
  )
}
