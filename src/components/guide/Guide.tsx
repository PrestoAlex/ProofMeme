import { useState } from 'react'
import { 
  Bitcoin, 
  Trophy, 
  CheckCircle,
  Sparkles,
  Heart,
  Coins,
  Users,
  Globe,
  Zap,
  Shield,
  TrendingUp
} from 'lucide-react'

interface GuideProps {
  walletAddress: string | null
}

export function Guide({ walletAddress }: GuideProps) {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', label: 'Overview', icon: Globe },
    { id: 'how-it-works', label: 'How It Works', icon: Zap },
    { id: 'features', label: 'Features', icon: Sparkles },
    { id: 'tutorial', label: 'Tutorial', icon: Trophy },
    { id: 'benefits', label: 'Benefits', icon: Heart }
  ]

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection />
      case 'how-it-works':
        return <HowItWorksSection />
      case 'features':
        return <FeaturesSection />
      case 'tutorial':
        return <TutorialSection walletAddress={walletAddress} />
      case 'benefits':
        return <BenefitsSection />
      default:
        return <OverviewSection />
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
          ProofOfMeme Guide
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Discover how ProofOfMeme is revolutionizing the meme economy on Bitcoin with decentralized, 
          permanent, and monetizable meme NFTs.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-2 justify-center">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeSection === section.id
                  ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-card hover:bg-card/80 text-card-foreground border border-border'
              }`}
            >
              <Icon className="h-4 w-4" />
              {section.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="bg-card border border-border rounded-xl p-8">
        {renderContent()}
      </div>
    </div>
  )
}

function OverviewSection() {
  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-card-foreground">What is ProofOfMeme?</h2>
          <p className="text-card-foreground leading-relaxed">
            ProofOfMeme is a groundbreaking platform that combines the viral power of memes with 
            the security and permanence of Bitcoin. We enable creators to mint their memes as 
            unique NFTs on the Bitcoin blockchain, creating a new economy where creativity meets 
            cryptocurrency.
          </p>
          <p className="text-card-foreground leading-relaxed">
            Built on OP_NET, our platform leverages Bitcoin's security while providing the 
            functionality needed for modern digital collectibles. Every meme is stored on IPFS 
            for permanence and minted as an NFT that can be collected, traded, and tipped.
          </p>
        </div>
        
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-card-foreground">Key Innovations</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Bitcoin className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-card-foreground">Bitcoin Native</h4>
                <p className="text-muted-foreground">Built directly on Bitcoin L1 for maximum security and decentralization</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-card-foreground">IPFS Storage</h4>
                <p className="text-muted-foreground">Permanent, decentralized storage ensures memes never disappear</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Coins className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-card-foreground">Micro-tipping</h4>
                <p className="text-muted-foreground">Earn sats directly from people who love your memes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6">
        <h3 className="text-lg font-bold text-purple-500 mb-3">🚀 Why ProofOfMeme Matters</h3>
        <p className="text-card-foreground">
          In a world where memes shape culture and drive conversations, creators deserve to be 
          rewarded for their creativity. ProofOfMeme creates a sustainable ecosystem where 
          memes become valuable digital assets that can be owned, collected, and monetized 
          forever on the most secure blockchain in existence.
        </p>
      </div>
    </div>
  )
}

function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: "Create Your Meme",
      description: "Upload your image and add a witty caption to create your masterpiece",
      icon: Sparkles
    },
    {
      number: 2,
      title: "Mint as NFT",
      description: "Your meme is stored on IPFS and minted as a unique NFT on Bitcoin",
      icon: Bitcoin
    },
    {
      number: 3,
      title: "Share & Collect",
      description: "Others can collect your meme and tip you in sats for your creativity",
      icon: Users
    },
    {
      number: 4,
      title: "Earn & Trade",
      description: "Earn from tips and trade your meme NFTs in the marketplace",
      icon: Coins
    }
  ]

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-card-foreground">How ProofOfMeme Works</h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <div key={step.number} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-border -translate-x-1/2" />
              )}
              <div className="bg-card border border-border rounded-xl p-6 space-y-4 relative">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <span className="text-purple-500 font-bold text-lg">{step.number}</span>
                  </div>
                  <Icon className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="font-bold text-card-foreground">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-bold text-card-foreground mb-4">Technical Architecture</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Bitcoin className="h-8 w-8 text-orange-500" />
            </div>
            <h4 className="font-semibold text-card-foreground">Bitcoin L1</h4>
            <p className="text-muted-foreground text-sm">All NFTs are secured by Bitcoin's hashpower</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Globe className="h-8 w-8 text-purple-500" />
            </div>
            <h4 className="font-semibold text-card-foreground">OP_NET</h4>
            <p className="text-muted-foreground text-sm">Smart contract platform for Bitcoin</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-lg flex items-center justify-center">
              <Shield className="h-8 w-8 text-green-500" />
            </div>
            <h4 className="font-semibold text-card-foreground">IPFS</h4>
            <p className="text-muted-foreground text-sm">Decentralized storage for meme images</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeaturesSection() {
  const features = [
    {
      title: "Decentralized Storage",
      description: "Every meme is stored on IPFS, ensuring they can never be deleted or censored",
      icon: Shield,
      color: "text-green-500"
    },
    {
      title: "Bitcoin Security",
      description: "Built on Bitcoin L1, the most secure blockchain in existence",
      icon: Bitcoin,
      color: "text-orange-500"
    },
    {
      title: "Micro-tipping",
      description: "Receive tips in sats from anyone who appreciates your memes",
      icon: Coins,
      color: "text-yellow-500"
    },
    {
      title: "True Ownership",
      description: "Actually own your memes as NFTs, not just likes on social media",
      icon: Trophy,
      color: "text-purple-500"
    },
    {
      title: "Creator Economy",
      description: "Build a sustainable income from your creativity",
      icon: TrendingUp,
      color: "text-blue-500"
    },
    {
      title: "Community Driven",
      description: "Decentralized platform governed by the community",
      icon: Users,
      color: "text-pink-500"
    }
  ]

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-card-foreground">Platform Features</h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <div key={index} className="bg-card border border-border rounded-xl p-6 space-y-4 hover:border-purple-500/50 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="font-bold text-card-foreground">{feature.title}</h3>
              </div>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          )
        })}
      </div>

      <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-6">
        <h3 className="text-lg font-bold text-purple-500 mb-3">🎯 What Makes Us Different</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-card-foreground mb-2">Traditional Social Media</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Content can be deleted or censored</li>
              <li>• No true ownership of your creations</li>
              <li>• Revenue goes to corporations, not creators</li>
              <li>• Algorithm decides what people see</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-card-foreground mb-2">ProofOfMeme</h4>
            <ul className="space-y-1 text-card-foreground">
              <li>• Permanent, uncensorable storage</li>
              <li>• True NFT ownership on Bitcoin</li>
              <li>• Direct earnings from your audience</li>
              <li>• Community-driven discovery</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function TutorialSection({ walletAddress }: { walletAddress: string | null }) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-card-foreground">Getting Started Tutorial</h2>
      
      <div className="space-y-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold flex-shrink-0">
              1
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-card-foreground">Connect Your Wallet</h3>
              <p className="text-muted-foreground">
                First, you need an OP_NET compatible wallet. Click the "Connect Wallet" button in the top right corner.
              </p>
              {!walletAddress ? (
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                  <p className="text-purple-500 font-medium">
                    💡 Click the "Connect Wallet" button above to get started!
                  </p>
                </div>
              ) : (
                <div className="bg-green-500 border border-green-500 rounded-lg p-4">
                  <p className="text-black font-medium">
                    ✅ Wallet connected! You're ready to create memes.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold flex-shrink-0">
              2
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-card-foreground">Create Your First Meme</h3>
              <p className="text-muted-foreground">
                Navigate to the "Create" tab and upload your meme image. Add a catchy caption to make it stand out!
              </p>
              <div className="bg-card border border-border rounded-lg p-4">
                <h4 className="font-semibold text-card-foreground mb-2">Pro Tips:</h4>
                <ul className="space-y-1 text-muted-foreground text-sm">
                  <li>• Use high-quality images for better engagement</li>
                  <li>• Keep captions witty and relatable</li>
                  <li>• Follow current trends for viral potential</li>
                  <li>• Be original - creativity gets rewarded!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold flex-shrink-0">
              3
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-card-foreground">Mint Your NFT</h3>
              <p className="text-muted-foreground">
                Click the "Mint Meme" button to permanently store your creation on Bitcoin. This costs a small fee in sats.
              </p>
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                <p className="text-orange-500 font-medium">
                  ⚡ Your meme will be stored on IPFS and minted as a unique NFT on Bitcoin!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold flex-shrink-0">
              4
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-card-foreground">Share & Earn</h3>
              <p className="text-muted-foreground">
                Once minted, share your meme with the world! People can tip you in sats and collect your NFT.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-card border border-border rounded-lg p-4">
                  <h4 className="font-semibold text-card-foreground mb-2">How to Earn:</h4>
                  <ul className="space-y-1 text-muted-foreground text-sm">
                    <li>• Receive tips from appreciators</li>
                    <li>• Sell NFTs in marketplace</li>
                    <li>• Build your collector base</li>
                    <li>• Create trending content</li>
                  </ul>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <h4 className="font-semibold text-card-foreground mb-2">Growth Strategy:</h4>
                  <ul className="space-y-1 text-muted-foreground text-sm">
                    <li>• Engage with the community</li>
                    <li>• Tip other creators' memes</li>
                    <li>• Build your reputation</li>
                    <li>• Stay consistent</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function BenefitsSection() {
  const benefits = [
    {
      title: "For Creators",
      items: [
        "Earn real money (sats) from your creativity",
        "True ownership of your digital art",
        "Build a sustainable creator business",
        "Join a decentralized creator economy",
        "No more relying on brand deals"
      ],
      icon: Sparkles,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "For Collectors",
      items: [
        "Own unique pieces of internet culture",
        "Support creators directly",
        "Build valuable digital collections",
        "Trade rare meme NFTs",
        "Be part of meme history"
      ],
      icon: Trophy,
      color: "from-orange-500 to-yellow-500"
    },
    {
      title: "For the Community",
      items: [
        "Decentralized social platform",
        "Censorship-resistant content",
        "Community-driven governance",
        "Fair creator rewards",
        "Preserving internet culture"
      ],
      icon: Users,
      color: "from-green-500 to-emerald-500"
    }
  ]

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-card-foreground">Why Join ProofOfMeme?</h2>
      
      <div className="space-y-6">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon
          return (
            <div key={index} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className={`bg-gradient-to-r ${benefit.color} p-6`}>
                <div className="flex items-center gap-3">
                  <Icon className="h-6 w-6 text-white" />
                  <h3 className="text-xl font-bold text-white">{benefit.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {benefit.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-card-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold text-purple-500 mb-4">🚀 Join the Meme Revolution</h3>
        <p className="text-card-foreground mb-6 max-w-2xl mx-auto">
          ProofOfMeme is more than just a platform - it's a movement to reclaim digital creativity 
          and build a fair economy for creators. By joining us, you're becoming part of the future 
          of internet culture on Bitcoin.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-medium transition-colors flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4" />
            Create Your First Meme
          </button>
          <button className="px-8 py-3 rounded-lg border border-purple-500 hover:bg-purple-500/10 text-purple-500 font-medium transition-colors flex items-center justify-center gap-2">
            <Trophy className="h-4 w-4" />
            Explore Top Memes
          </button>
        </div>
      </div>
    </div>
  )
}
