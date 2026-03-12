import { useState, useEffect, useRef } from 'react'
import { 
  User, 
  Edit2, 
  Save, 
  X, 
  Camera, 
  ExternalLink, 
  Trophy, 
  Bitcoin,
  Check,
  Copy,
  Flame,
  Clock
} from 'lucide-react'
import { useOPNetWallet } from '../../hooks/useOPNetWallet'
import { SatoshiTipButton } from '../tipping/SatoshiTipButton'

interface Meme {
  id: number
  imageUrl: string
  caption?: string
  timestamp: string
  tips: number
  collectors: number
  txid?: string
}

interface ProfileProps {
  walletAddress: string | null
}

export function Profile({ walletAddress }: ProfileProps) {
  const { wallet } = useOPNetWallet()
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [userMemes, setUserMemes] = useState<Meme[]>([])
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  // Load profile data from localStorage on initial render
  const getInitialProfileData = () => {
    try {
      const savedProfile = localStorage.getItem('proofOfMeme_profile')
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile)
        return {
          profileData: parsed.profileData || {
            username: 'Bitcoin Meme Creator',
            bio: 'Creating viral memes on Bitcoin L1 🚀',
            website: '',
            twitter: '',
            location: 'Cyberspace'
          },
          profileImage: parsed.profileImage || null
        }
      }
    } catch (error) {
      console.error('Error loading profile from localStorage:', error)
    }
    return {
      profileData: {
        username: 'Bitcoin Meme Creator',
        bio: 'Creating viral memes on Bitcoin L1 🚀',
        website: '',
        twitter: '',
        location: 'Cyberspace'
      },
      profileImage: null
    }
  }

  const initialData = getInitialProfileData()
  const [profileData, setProfileData] = useState(initialData.profileData)
  const [tempProfileData, setTempProfileData] = useState(initialData.profileData)
  const [profileImage, setProfileImage] = useState<string | null>(initialData.profileImage)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Save profile data to localStorage whenever it changes
  useEffect(() => {
    const profileToSave = {
      profileData,
      profileImage
    }
    localStorage.setItem('proofOfMeme_profile', JSON.stringify(profileToSave))
  }, [profileData, profileImage])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEdit = () => {
    setTempProfileData(profileData)
    setIsEditing(true)
  }

  const handleSave = () => {
    setProfileData(tempProfileData)
    setIsEditing(false)
    // Data is automatically saved to localStorage via useEffect
  }

  const handleCancel = () => {
    setTempProfileData(profileData)
    // Don't reset profileImage on cancel, keep current image
    setIsEditing(false)
  }

  // Mock user memes - will be replaced with blockchain data
  const mockUserMemes: Meme[] = [
    {
      id: 1,
      imageUrl: 'https://placehold.co/400x400/1a1a1a/orange?text=My+Meme+1',
      caption: 'When Bitcoin hits new ATH 🚀',
      timestamp: '2h ago',
      tips: 21000,
      collectors: 420,
      txid: '41030756e1d4d8dd6d63dfdc95451d317bacab7193c6a35a9605715e8ad5b4fb'
    },
    {
      id: 2,
      imageUrl: 'https://placehold.co/400x400/1a1a1a/orange?text=My+Meme+2',
      caption: 'Stack sats everyday 💪',
      timestamp: '5h ago',
      tips: 15000,
      collectors: 320
    },
    {
      id: 3,
      imageUrl: 'https://placehold.co/400x400/1a1a1a/orange?text=My+Meme+3',
      caption: 'HODL to the moon 🌙',
      timestamp: '1d ago',
      tips: 8500,
      collectors: 180
    }
  ]

  useEffect(() => {
    if (walletAddress) {
      setLoading(true)
      // Simulate loading user memes
      setTimeout(() => {
        setUserMemes(mockUserMemes)
        setLoading(false)
      }, 1000)
    }
  }, [walletAddress])

  const copyAddress = async () => {
    if (walletAddress) {
      await navigator.clipboard.writeText(walletAddress)
      setCopiedAddress(true)
      setTimeout(() => setCopiedAddress(false), 2000)
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

  const totalTips = userMemes.reduce((sum, meme) => sum + meme.tips, 0)
  const totalCollectors = userMemes.reduce((sum, meme) => sum + meme.collectors, 0)

  if (!walletAddress) {
    return (
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="bg-card border border-border rounded-xl p-12 space-y-4">
          <Bitcoin className="h-16 w-16 text-purple-500 mx-auto" />
          <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
          <p className="text-muted-foreground">
            Connect your OP_NET wallet to view your profile, memes, and earnings.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        {/* User Info */}
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center overflow-hidden">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-white" />
              )}
            </div>
            {isEditing && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-purple-500 hover:bg-purple-600 text-white flex items-center justify-center transition-colors"
                title="Change profile photo"
              >
                <Camera className="h-4 w-4" />
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              {isEditing ? (
                <input
                  type="text"
                  value={tempProfileData.username}
                  onChange={(e) => setTempProfileData({...tempProfileData, username: e.target.value})}
                  className="text-2xl font-bold bg-transparent border-b border-purple-500 focus:outline-none text-card-foreground"
                  placeholder="Username"
                />
              ) : (
                <h2 className="text-2xl font-bold text-card-foreground">{profileData.username}</h2>
              )}
              
              <div className="flex items-center gap-2">
                {!isEditing && (
                  <button
                    onClick={handleEdit}
                    className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors text-purple-500"
                    title="Edit Profile"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                )}
                {isEditing && (
                  <>
                    <button
                      onClick={handleSave}
                      className="p-2 hover:bg-green-500/10 rounded-lg transition-colors text-green-500"
                      title="Save"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-500"
                      title="Cancel"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="font-mono text-sm">{formatAddress(walletAddress)}</span>
              <button
                onClick={copyAddress}
                className="p-1 hover:bg-muted rounded transition-colors"
              >
                {copiedAddress ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            </div>
            
            {isEditing ? (
              <textarea
                value={tempProfileData.bio}
                onChange={(e) => setTempProfileData({...tempProfileData, bio: e.target.value})}
                className="w-full bg-background border border-border rounded-lg p-2 focus:border-purple-500 focus:outline-none text-card-foreground resize-none"
                placeholder="Tell us about yourself..."
                rows={2}
              />
            ) : (
              <p className="text-muted-foreground">{profileData.bio}</p>
            )}
            
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">Joined March 2026</span>
              <span className="text-purple-500 font-medium">
                {formatBalance(wallet.balance)} sats
              </span>
              {isEditing && (
                <input
                  type="text"
                  value={tempProfileData.location}
                  onChange={(e) => setTempProfileData({...tempProfileData, location: e.target.value})}
                  className="bg-transparent border-b border-purple-500 focus:outline-none text-muted-foreground"
                  placeholder="Location"
                />
              )}
              {!isEditing && profileData.location && (
                <span className="text-muted-foreground">📍 {profileData.location}</span>
              )}
            </div>
            
            {/* Additional fields in editing mode */}
            {isEditing && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-muted-foreground w-20">Website:</label>
                  <input
                    type="text"
                    value={tempProfileData.website}
                    onChange={(e) => setTempProfileData({...tempProfileData, website: e.target.value})}
                    className="flex-1 bg-background border border-border rounded-lg p-2 focus:border-purple-500 focus:outline-none text-card-foreground"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-muted-foreground w-20">Twitter:</label>
                  <input
                    type="text"
                    value={tempProfileData.twitter}
                    onChange={(e) => setTempProfileData({...tempProfileData, twitter: e.target.value})}
                    className="flex-1 bg-background border border-border rounded-lg p-2 focus:border-purple-500 focus:outline-none text-card-foreground"
                    placeholder="@username"
                  />
                </div>
              </div>
            )}
            
            {/* Display additional fields when not editing */}
            {!isEditing && (profileData.website || profileData.twitter) && (
              <div className="flex items-center gap-4 text-sm">
                {profileData.website && (
                  <a
                    href={profileData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-500 hover:text-purple-400 transition-colors flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Website
                  </a>
                )}
                {profileData.twitter && (
                  <a
                    href={`https://twitter.com/${profileData.twitter.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-500 hover:text-purple-400 transition-colors flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    {profileData.twitter}
                  </a>
                )}
              </div>
            )}\n          </div>\n        </div>\n\n        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[hsl(30_45%_55%)] border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">{userMemes.length}</div>
            <div className="text-sm text-muted-foreground">Memes Created</div>
          </div>
          <div className="bg-[hsl(30_45%_55%)] border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">{formatBalance(totalTips)}</div>
            <div className="text-sm text-muted-foreground">Total Tips</div>
          </div>
          <div className="bg-[hsl(30_45%_55%)] border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">{totalCollectors}</div>
            <div className="text-sm text-muted-foreground">Collectors</div>
          </div>
          <div className="bg-[hsl(30_45%_55%)] border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">🔥</div>
            <div className="text-sm text-muted-foreground">Trending</div>
          </div>
        </div>
      </div>

      {/* User's Memes */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Trophy className="h-5 w-5 text-purple-500" />
          Your Memes
        </h3>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-muted" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : userMemes.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-8 text-center space-y-4">
            <Flame className="h-12 w-12 text-muted-foreground mx-auto" />
            <h4 className="text-lg font-semibold">No memes yet</h4>
            <p className="text-muted-foreground">
              Start creating memes to see them here!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userMemes.map((meme) => (
              <div key={meme.id} className="bg-card border border-border rounded-xl overflow-hidden hover:border-purple-500/50 transition-colors">
                {/* Image */}
                <div className="relative aspect-square bg-muted">
                  <img
                    src={meme.imageUrl}
                    alt={`Meme #${meme.id}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-white text-xs">
                    #{meme.id}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  {meme.caption && (
                    <p className="text-sm text-foreground line-clamp-2">{meme.caption}</p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Bitcoin className="h-3 w-3" />
                      <span>{formatBalance(meme.tips)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="h-3 w-3" />
                      <span>{meme.collectors}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{meme.timestamp}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <SatoshiTipButton
                      memeId={meme.id}
                      walletAddress={walletAddress}
                      tips={meme.tips}
                      onTipSuccess={(amount) => {
                        meme.tips += amount
                        setUserMemes(prev => [...prev])
                      }}
                    />
                    {meme.txid && (
                      <a
                        href={`https://opscan.org/transactions/${meme.txid}?network=op_testnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-400 transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Achievement Badges */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Trophy className="h-5 w-5 text-purple-500" />
          Achievements
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center space-y-2">
            <div className="text-3xl">🎨</div>
            <div className="text-xs font-medium">Creator</div>
            <div className="text-xs text-muted-foreground">First meme created</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl">🔥</div>
            <div className="text-xs font-medium">Trending</div>
            <div className="text-xs text-muted-foreground">100+ collectors</div>
          </div>
          <div className="text-center space-y-2 opacity-50">
            <div className="text-3xl">💎</div>
            <div className="text-xs font-medium">Diamond</div>
            <div className="text-xs text-muted-foreground">1000+ tips</div>
          </div>
          <div className="text-center space-y-2 opacity-50">
            <div className="text-3xl">👑</div>
            <div className="text-xs font-medium">Legend</div>
            <div className="text-xs text-muted-foreground">50+ memes</div>
          </div>
        </div>
      </div>
    </div>
  )
}
