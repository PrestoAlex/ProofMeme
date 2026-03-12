import { useMemo, useState } from 'react'
import { Bitcoin, CheckCircle, ExternalLink, Heart, Send } from 'lucide-react'
import { useSatoshiTipping } from '../../hooks/useSatoshiTipping'

interface SatoshiTipButtonProps {
  memeId: number
  walletAddress: string | null
  tips: number
  onTipSuccess?: (amount: number) => void
}

export function SatoshiTipButton({ memeId, walletAddress, tips, onTipSuccess }: SatoshiTipButtonProps) {
  const [amount, setAmount] = useState<number>(100)
  const [showTipModal, setShowTipModal] = useState(false)
  const [tipResult, setTipResult] = useState<{ success: boolean; txid?: string; error?: string } | null>(null)
  const { tipMeme, loading, contractAddress, explorerBase, networkParam } = useSatoshiTipping(walletAddress)

  const disabledReason = useMemo(() => {
    if (!walletAddress) return 'Connect your wallet first'
    if (!contractAddress || contractAddress === 'pending_rebuild') return 'Tipping contract is not deployed yet'
    return null
  }, [contractAddress, walletAddress])

  const formatAmount = (sats: number) => {
    if (sats >= 1000000) {
      return `${(sats / 1000000).toFixed(1)}M`
    }
    if (sats >= 1000) {
      return `${(sats / 1000).toFixed(1)}K`
    }
    return sats.toString()
  }

  const handleTip = async () => {
    if (disabledReason) {
      setTipResult({ success: false, error: disabledReason })
      return
    }

    if (amount <= 0) {
      setTipResult({ success: false, error: 'Please enter a valid tip amount' })
      return
    }

    setTipResult(null)
    const result = await tipMeme(memeId, amount)

    if (result.success) {
      setTipResult({ success: true, txid: result.txid })
      onTipSuccess?.(amount)
      setTimeout(() => {
        setShowTipModal(false)
        setTipResult(null)
      }, 2500)
      return
    }

    setTipResult({ success: false, error: result.error || 'Failed to send tip' })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowTipModal(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-medium transition-colors"
      >
        <Heart className="h-4 w-4" />
        <span>Tip</span>
        <span className="text-purple-200">{formatAmount(tips)} sats</span>
      </button>

      {showTipModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl p-6 max-w-md w-full space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Heart className="h-5 w-5 text-purple-500" />
                Tip Meme #{memeId}
              </h3>
              <button
                type="button"
                onClick={() => setShowTipModal(false)}
                className="p-1 hover:bg-muted rounded-lg transition-colors"
              >
                ×
              </button>
            </div>

            <div className="bg-background border border-border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Current tips:</span>
                <span className="font-medium text-purple-500">{formatAmount(tips)} sats</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Contract:</span>
                <span className="font-mono text-xs">{contractAddress === 'pending_rebuild' ? 'pending rebuild' : `${contractAddress.slice(0, 10)}...${contractAddress.slice(-6)}`}</span>
              </div>
            </div>

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
              <div className="flex gap-2 flex-wrap">
                {[100, 500, 1000, 5000].map((quickAmount) => (
                  <button
                    key={quickAmount}
                    type="button"
                    onClick={() => setAmount(quickAmount)}
                    className="px-3 py-1 rounded-lg bg-muted hover:bg-muted/80 text-sm transition-colors"
                  >
                    {quickAmount >= 1000 ? `${quickAmount / 1000}K` : quickAmount}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleTip}
              disabled={loading || !!disabledReason || amount <= 0}
              className="w-full px-4 py-3 rounded-lg bg-purple-500 hover:bg-purple-600 disabled:bg-muted disabled:text-muted-foreground text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending tip...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send {formatAmount(amount)} sats
                </>
              )}
            </button>

            {disabledReason && (
              <div className="text-xs text-amber-500 text-center">{disabledReason}</div>
            )}

            {tipResult && (
              <div className={`p-4 rounded-lg border ${tipResult.success ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {tipResult.success ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Successfully tipped {formatAmount(amount)} sats</span>
                      </>
                    ) : (
                      <span className="text-sm font-medium">Error: {tipResult.error}</span>
                    )}
                  </div>
                  {tipResult.success && tipResult.txid && (
                    <a
                      href={`${explorerBase}/${tipResult.txid}?network=${networkParam}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-400 underline flex items-center gap-1 text-xs"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View on Explorer
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
