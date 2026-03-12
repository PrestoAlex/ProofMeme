import { useState } from 'react'
import { Header } from './components/layout/Header'
import { MemeFeed } from './components/feed/MemeFeed'
import { MemeCreator } from './components/creator/MemeCreator'
import { MemeVault } from './components/vault/MemeVault'
import { Leaderboard } from './components/leaderboard/Leaderboard'
import { Profile } from './components/profile/Profile'
import { Guide } from './components/guide/Guide'
import { BackgroundMusic } from './components/layout/BackgroundMusic'
import './utils/contractDebug' // Debug contract addresses

type Tab = 'feed' | 'create' | 'vault' | 'leaderboard' | 'profile' | 'guide'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('feed')
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  const renderContent = () => {
    switch (activeTab) {
      case 'feed':
        return <MemeFeed walletAddress={walletAddress} />
      case 'create':
        return <MemeCreator walletAddress={walletAddress} />
      case 'vault':
        return <MemeVault walletAddress={walletAddress} />
      case 'leaderboard':
        return <Leaderboard />
      case 'profile':
        return <Profile walletAddress={walletAddress} />
      case 'guide':
        return <Guide walletAddress={walletAddress} />
      default:
        return <MemeFeed walletAddress={walletAddress} />
    }
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0 animate-pulse"
        style={{ 
          backgroundImage: 'url(/images/background.png)',
          animation: 'slowUp 20s ease-in-out infinite'
        }}
      />
      
      
      {/* Content */}
      <div className="relative z-20 min-h-screen">
        <Header
          walletAddress={walletAddress}
          onWalletConnect={setWalletAddress}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <main className="container mx-auto px-4 py-8">
          {renderContent()}
        </main>

              </div>

      {/* Background Music */}
      <BackgroundMusic />
    </div>
  )
}

export default App
