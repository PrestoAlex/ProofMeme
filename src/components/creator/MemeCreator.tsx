import { useState, useRef } from 'react'
import { Upload, Image as ImageIcon, Type, Sparkles, Coins, CheckCircle } from 'lucide-react'
import { useMemeMinter } from '../../hooks/useMemeMinter'

interface MemeCreatorProps {
  walletAddress: string | null
}

export function MemeCreator({ walletAddress }: MemeCreatorProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [caption, setCaption] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [mintResult, setMintResult] = useState<{ success: boolean; memeId?: number; txid?: string; error?: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { mintMeme, loading: contractLoading, memeCount } = useMemeMinter(walletAddress)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePublish = async () => {
    if (!walletAddress) {
      alert('Please connect your wallet first!')
      return
    }

    if (!imagePreview) {
      alert('Please upload an image!')
      return
    }

    setIsUploading(true)
    setMintResult(null)
    
    try {
      const result = await mintMeme()
      setMintResult(result)
      
      if (result.success) {
        // Clear form on success
        setImagePreview(null)
        setCaption('')
      }
    } catch (error) {
      setMintResult({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to mint meme'
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-card border border-border rounded-xl p-8 text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
          Create Your Meme
        </h2>
        <p className="text-muted-foreground">
          Upload your meme and share it with the Bitcoin community
        </p>
        {walletAddress && (
          <div className="flex items-center justify-center gap-2 text-sm text-purple-500">
            <Coins className="h-4 w-4" />
            <span>Total memes minted: {memeCount}</span>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-purple-500" />
              Upload Image
            </h3>

            {/* Image Upload Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative aspect-square border-2 border-dashed border-border rounded-lg hover:border-purple-500 transition-colors cursor-pointer overflow-hidden group"
            >
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white font-medium">Click to change</p>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-muted-foreground">
                  <Upload className="h-12 w-12" />
                  <div className="text-center">
                    <p className="font-medium">Click to upload</p>
                    <p className="text-sm">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* Caption Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Type className="h-4 w-4 text-purple-500" />
                Caption (optional)
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a witty caption..."
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-purple-500 focus:outline-none resize-none"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                {caption.length}/280 characters
              </p>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Preview & Mint
            </h3>

            {/* Meme Preview Card */}
            <div className="bg-background border border-border rounded-xl overflow-hidden">
              {/* Preview Image */}
              <div className="relative aspect-square bg-muted">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    <ImageIcon className="h-16 w-16" />
                  </div>
                )}
              </div>

              {/* Preview Info */}
              <div className="p-4 space-y-3">
                {caption && (
                  <p className="text-sm text-foreground">{caption}</p>
                )}

                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">You</p>
                    <p className="text-xs text-muted-foreground truncate font-mono">
                      {walletAddress ? `${walletAddress.slice(0, 12)}...` : 'Not connected'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Meme #{memeCount + 1}</span>
                  <span>•</span>
                  <span>Just now</span>
                </div>
              </div>
            </div>

            {/* Mint Button */}
            <button
              onClick={handlePublish}
              disabled={!imagePreview || isUploading || contractLoading || !walletAddress}
              className="w-full px-6 py-3 rounded-lg bg-purple-500 hover:bg-purple-600 disabled:bg-muted disabled:text-muted-foreground text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isUploading || contractLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Minting...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Mint Meme
                </>
              )}
            </button>

            {!walletAddress && (
              <p className="text-xs text-center text-muted-foreground">
                Connect your wallet to mint memes
              </p>
            )}

            {/* Result Message */}
            {mintResult && (
              <div className={`p-4 rounded-lg border ${
                mintResult.success 
                  ? 'bg-green-500/10 border-green-500/20 text-green-500' 
                  : 'bg-red-500/10 border-red-500/20 text-red-500'
              }`}>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {mintResult.success ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Successfully minted meme #{mintResult.memeId}! 🎉
                        </span>
                      </>
                    ) : (
                      <span className="text-sm font-medium">
                        Error: {mintResult.error}
                      </span>
                    )}
                  </div>
                  
                  {mintResult.success && mintResult.txid && (
                    <div className="text-xs space-y-1">
                      <p>Transaction ID: {mintResult.txid}</p>
                      <a 
                        href={`https://opscan.org/transactions/${mintResult.txid}?network=op_testnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-400 underline"
                      >
                        View on Explorer →
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 space-y-2">
            <h4 className="font-semibold text-purple-500 text-sm">💡 Pro Tips</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Use high-quality images for better engagement</li>
              <li>• Add witty captions to make your meme viral</li>
              <li>• Memes are stored on IPFS and minted on Bitcoin L1</li>
              <li>• You'll earn sats when people tip your meme</li>
              <li>• Each meme gets a unique ID on the blockchain</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
