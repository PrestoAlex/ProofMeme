import { Heart } from 'lucide-react'

interface MemeTipperProps {
  memeId: number
  creatorAddress?: string
  tips: number
  collectors: number
  onTipSuccess?: (tipId: number, amount: number) => void
}

export function MemeTipper({ memeId, tips }: MemeTipperProps) {
  const formatAmount = (sats: number) => {
    if (sats >= 1000000) {
      return `${(sats / 1000000).toFixed(1)}M`
    } else if (sats >= 1000) {
      return `${(sats / 1000).toFixed(1)}K`
    }
    return sats.toString()
  }

  return (
    <button
      type="button"
      disabled
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-muted-foreground font-medium cursor-not-allowed"
      title={`Tipping is being rebuilt for Meme #${memeId}`}
    >
      <Heart className="h-4 w-4" />
      <span>Tip Soon</span>
      <span>{formatAmount(tips)} sats</span>
    </button>
  )
}
