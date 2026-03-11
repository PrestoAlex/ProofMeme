import { useState } from 'react'
import { Bitcoin, Heart, Send, ExternalLink, CheckCircle } from 'lucide-react'
import { useMemeTipper } from '../../hooks/useMemeTipper'

interface MemeTipperProps {
  memeId: number
  creatorAddress?: string
  tips: number
  collectors: number
  onTipSuccess?: (tipId: number, amount: number) => void
}

export function MemeTipper({ memeId, creatorAddress, tips, collectors, onTipSuccess }: MemeTipperProps) {
  const [amount, setAmount] = useState<number>(100) // Default 100 sats
  const [showTipModal, setShowTipModal] = useState(false)
  const [tipResult, setTipResult] = useState<{ success: boolean; tipId?: number; txid?: string; error?: string } | null>(null)
  
  const { tipMeme, loading } = useMemeTipper(creatorAddress || null)

  const handleTip = async () => {
    if (!creatorAddress) {
      alert('Creator address not available')
      return
    }

    if (amount <= 0) {
      alert('Please enter a valid tip amount')
      return
    }

    setTipResult(null)
    
    try {
      const result = await tipMeme(memeId, amount)
      setTipResult(result)
      
      if (result.success && onTipSuccess) {
        onTipSuccess(result.tipId || 0, amount)
      }
      
      // Close modal after successful tip
      if (result.success) {
        setTimeout(() => {
          setShowTipModal(false)
          setTipResult(null)
        }, 3000)
      }
    } catch (error) {
      setTipResult({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to tip meme'
      })
    }
  }

  const formatAmount = (sats: number) => {
    if (sats >= 1000000) {
      return `${(sats / 1000000).toFixed(1)}M`
    } else if (sats >= 1000) {
      return `${(sats / 1000).toFixed(1)}K`
    }
    return sats.toString()
  }

  return (
    <>
      {/* Tip Button */}
      <button
        onClick={() => setShowTipModal(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-medium transition-colors"
      >
        <Heart className="h-4 w-4" />
        <span>Tip</span>
        <span className="text-purple-200">{formatAmount(tips)} sats</span>
      </button>

      {/* Tip Modal */}
      {showTipModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl p-6 max-w-md w-full space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Heart className="h-5 w-5 text-purple-500" />
                Tip Meme #{memeId}
              </h3>
              <button
                onClick={() => setShowTipModal(false)}
                className="p-1 hover:bg-muted rounded-lg transition-colors"
              >
                ×
              </button>
            </div>

            {/* Meme Info */}
            <div className="bg-background border border-border rounded-lg p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Current tips:</span>
                <span className="font-medium text-purple-500">{formatAmount(tips)} sats</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-muted-foreground">Collectors:</span>
                <span className="font-medium">{collectors}</span>
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tip Amount (sats)</label>
              <div className="flex items-center gap-2">
                <Bitcoin className="h-4 w-4 text-purple-500" />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 0))}
                  className="flex-1 px-3 py-2 rounded-lg bg-background border border-border focus:border-purple-500 focus:outline-none"
                  min="1"
                  step="1"
                />
              </div>
              
              {/* Quick Amount Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setAmount(100)}
                  className="px-3 py-1 rounded-lg bg-muted hover:bg-muted/80 text-sm transition-colors"
                >
                  100
                </button>
                <button
                  onClick={() => setAmount(500)}
                  className="px-3 py-1 rounded-lg bg-muted hover:bg-muted/80 text-sm transition-colors"
                >
                  500
                </button>
                <button
                  onClick={() => setAmount(1000)}
                  className="px-3 py-1 rounded-lg bg-muted hover:bg-muted/80 text-sm transition-colors"
                >
                  1K
                </button>
                <button
                  onClick={() => setAmount(5000)}
                  className="px-3 py-1 rounded-lg bg-muted hover:bg-muted/80 text-sm transition-colors"
                >
                  5K
                </button>
              </div>
            </div>

            {/* Tip Button */}
            <button
              onClick={handleTip}
              disabled={loading || amount <= 0}
              className="w-full px-4 py-3 rounded-lg bg-purple-500 hover:bg-purple-600 disabled:bg-muted disabled:text-muted-foreground text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Tipping...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send {formatAmount(amount)} sats
                </>
              )}
            </button>

            {/* Result Message */}
            {tipResult && (
              <div className={`p-4 rounded-lg border ${
                tipResult.success 
                  ? 'bg-green-500/10 border-green-500/20 text-green-500' 
                  : 'bg-red-500/10 border-red-500/20 text-red-500'
              }`}>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {tipResult.success ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Successfully tipped {formatAmount(amount)} sats! 🎉
                        </span>
                      </>
                    ) : (
                      <span className="text-sm font-medium">
                        Error: {tipResult.error}
                      </span>
                    )}
                  </div>
                  
                  {tipResult.success && tipResult.txid && (
                    <div className="text-xs space-y-1">
                      <p>Transaction ID: {tipResult.txid}</p>
                      <a 
                        href={`https://opscan.org/transactions/${tipResult.txid}?network=op_testnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-400 underline flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View on Explorer
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Creator Info */}
            {creatorAddress && (
              <div className="text-xs text-muted-foreground text-center">
                Tips will go to creator: {creatorAddress.slice(0, 8)}...{creatorAddress.slice(-6)}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
