import { useState, useEffect, useRef } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

export function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.3)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // Set initial volume
    audio.volume = volume

    // Auto-play when component mounts (if browser allows)
    const attemptAutoplay = async () => {
      try {
        await audio.play()
        setIsPlaying(true)
      } catch (error) {
        console.log('Autoplay prevented by browser, waiting for user interaction')
        setIsPlaying(false)
      }
    }

    attemptAutoplay()

    // Handle audio events
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => {
      // Loop the music
      audio.currentTime = 0
      audio.play()
    }

    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return

    try {
      if (isPlaying) {
        audio.pause()
      } else {
        await audio.play()
      }
    } catch (error) {
      console.error('Error toggling playback:', error)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/background-music.mp3"
        loop
        preload="auto"
      />
      
      {/* Music Controls */}
      <div className="fixed bottom-4 right-4 z-50 bg-black/80 backdrop-blur-sm border border-purple-500/30 rounded-lg p-3 flex items-center gap-3">
        <button
          onClick={togglePlay}
          className="text-purple-400 hover:text-purple-300 transition-colors p-2 rounded hover:bg-white/10"
          title={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>
        
        <div className="flex items-center gap-2">
          <span className="text-purple-400 text-xs">🎵</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 h-1 bg-purple-500/30 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${volume * 100}%, rgba(168, 85, 247, 0.3) ${volume * 100}%, rgba(168, 85, 247, 0.3) 100%)`
            }}
          />
        </div>
      </div>

      {/* Custom styles for range input */}
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          background: #fb923c;
          cursor: pointer;
          border-radius: 50%;
          border: 2px solid #000;
        }
        
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: #fb923c;
          cursor: pointer;
          border-radius: 50%;
          border: 2px solid #000;
        }
      `}</style>
    </>
  )
}
