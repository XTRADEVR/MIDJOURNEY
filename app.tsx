import { useState } from 'react'

type ImageItem = {
  id: string
  prompt: string
  url: string
  style: string
  aspect: string
  seed: number
}

const STYLES = [
  { id: 'anime', label: 'Anime', prompt: 'anime style, studio ghibli, detailed' },
  { id: 'realistic', label: 'Realistic', prompt: 'photorealistic, ultra detailed, 8k' },
  { id: 'cyberpunk', label: 'Cyberpunk', prompt: 'cyberpunk, neon lights, futuristic city, blade runner' },
  { id: 'lofi', label: 'Lofi', prompt: 'lofi anime, cozy bedroom, warm lights, rainy window' },
  { id: 'ghibli', label: 'Ghibli', prompt: 'ghibli style, miyazaki, soft pastel' },
]

const RATIOS = [
  { id: '1:1', label: '1:1', w: 1024, h: 1024 },
  { id: '16:9', label: '16:9', w: 1280, h: 720 },
  { id: '9:16', label: '9:16', w: 720, h: 1280 },
  { id: '4:3', label: '4:3', w: 1024, h: 768 },
]

export default function App() {
  const [prompt, setPrompt] = useState('anime lofi girl in neon purple bedroom, rainy window, cozy lights, ultra detailed')
  const [activeStyle, setActiveStyle] = useState('lofi')
  const [activeRatio, setActiveRatio] = useState('16:9')
  const [loading, setLoading] = useState(false)
  const [gallery, setGallery] = useState<ImageItem[]>([])
  const [selected, setSelected] = useState<ImageItem | null>(null)

  const generate = async (customPrompt?: string) => {
    const finalPrompt = customPrompt || prompt
    if (!finalPrompt.trim()) return
    setLoading(true)
    const styleObj = STYLES.find(s => s.id === activeStyle)
    const ratioObj = RATIOS.find(r => r.id === activeRatio) || RATIOS[1]
    const fullPrompt = `${finalPrompt}, ${styleObj?.prompt}, high quality, masterpiece`
    const seed = Math.floor(Math.random() * 1000000)
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=${ratioObj.w}&height=${ratioObj.h}&seed=${seed}&nologo=true&enhance=true`
    
    const img = new Image()
    img.onload = () => {
      const newItem: ImageItem = {
        id: Date.now().toString(),
        prompt: finalPrompt,
        url: url,
        style: activeStyle,
        aspect: activeRatio,
        seed: seed,
      }
      setGallery(prev => [newItem, ...prev])
      setSelected(newItem)
      setLoading(false)
    }
    img.onerror = () => {
      setLoading(false)
      alert('Generate failed, coba lagi KING!')
    }
    img.src = url
  }

  const currentRatio = RATIOS.find(r => r.id === activeRatio)!

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans selection:bg-purple-500/30">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-purple-700/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-fuchsia-600/20 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row h-screen">
        <div className="w-full lg:w-[380px] border-r border-white/10 bg-black/40 backdrop-blur-xl p-5 flex flex-col gap-6 overflow-y-auto">
          <div>
            <h1 className="text-2xl font-black tracking-tight">
              <span className="text-white">NEON</span><span className="text-purple-400">VISION</span>
              <span className="ml-2 text-[10px] font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">MIDJOURNEY v2</span>
            </h1>
            <p className="text-[11px] text-white/40 mt-1 font-mono">AI Image Generator • Real-Time Visual Intelligence</p>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-bold tracking-widest text-white/50 uppercase">Imagine</label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              className="w-full h-[110px] bg-white/[0.05] border border-white/10 rounded-xl p-3 text-[13px] leading-5 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.08] resize-none placeholder:text-white/20"
              placeholder="anime lofi girl, neon city, rainy window --ar 16:9"
            />
            <div className="flex gap-2">
              <button
                onClick={() => generate()}
                disabled={loading}
                className="flex-1 h-11 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 disabled:opacity-50 rounded-xl text-[13px] font-bold tracking-wide transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating...
                  </>
                ) : (
                  <>✦ Generate</>
                )}
              </button>
              <button onClick={() => setPrompt('')} className="w-11 h-11 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10">✕</button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-bold tracking-widest text-white/50 uppercase">Style</label>
            <div className="flex flex-wrap gap-2">
              {STYLES.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveStyle(s.id)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all ${activeStyle === s.id ? 'bg-purple-500 text-white border-purple-400' : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-bold tracking-widest text-white/50 uppercase">Aspect Ratio</label>
            <div className="flex gap-2">
              {RATIOS.map(r => (
                <button
                  key={r.id}
                  onClick={() => setActiveRatio(r.id)}
                  className={`flex-1 py-2 rounded-lg text-[11px] font-mono border transition-all ${activeRatio === r.id ? 'bg-white text-black border-white' : 'bg-white/5 text-white/50 border-white/10'}`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {selected && (
            <div className="space-y-3 pt-4 border-t border-white/10">
              <label className="text-[11px] font-bold tracking-widest text-white/50 uppercase">Metadata</label>
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 space-y-2 text-[11px] font-mono">
                <div className="flex justify-between"><span className="text-white/40">Prompt</span><button onClick={() => navigator.clipboard.writeText(selected.prompt)} className="text-purple-400 hover:text-purple-300">Copy</button></div>
                <p className="text-white/80 leading-4">{selected.prompt}</p>
                <div className="flex justify-between"><span className="text-white/40">Style</span><span className="text-white">{selected.style}</span></div>
                <div className="flex justify-between"><span className="text-white/40">Aspect</span><span className="text-white">{selected.aspect} ({currentRatio.w}x{currentRatio.h})</span></div>
                <div className="flex justify-between"><span className="text-white/40">Seed</span><span className="text-white">{selected.seed}</span></div>
                <div className="flex gap-2 pt-2">
                  <a href={selected.url} target="_blank" rel="noreferrer" download className="flex-1 text-center py-2 bg-white/5 rounded-lg hover:bg-white/10">Download</a>
                  <button onClick={() => generate(selected.prompt)} className="flex-1 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30">Variation</button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col bg-[#0f0f14]">
          <div className="h-14 border-b border-white/10 flex items-center justify-between px-5">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-[12px] font-mono text-white/60">Visual Input & Bounding Overlays • <span className="text-purple-400">Boxes On</span></span>
            </div>
            <span className="text-[11px] text-white/30 font-mono">{gallery.length} generated</span>
          </div>

          <div className="flex-1 p-6 flex items-center justify-center bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.08),transparent_70%)]">
            {loading ? (
              <div className="w-[320px] h-[180px] lg:w-[640px] lg:h-[360px] bg-white/[0.03] border border-purple-500/20 rounded-2xl flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-400 rounded-full animate-spin" />
                <p className="text-[12px] font-mono text-purple-300 animate-pulse">Gemini 3.8 Flash analyzing visual elements...</p>
                <p className="text-[11px] text-white/30">{prompt.slice(0, 60)}...</p>
              </div>
            ) : selected ? (
              <div className="relative group">
                <img src={selected.url} alt={selected.prompt} className="max-w-full max-h-[70vh] rounded-2xl border border-white/10 shadow-[0_0_80px_rgba(168,85,247,0.3)]" />
                <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur border border-purple-500/30 rounded-full text-[10px] font-mono text-purple-300">
                  {activeStyle} • {activeRatio} • seed {selected.seed}
                </div>
              </div>
            ) : (
              <div className="w-full max-w-2xl">
                <div className="border border-dashed border-white/10 rounded-2xl p-12 text-center bg-white/[0.02]">
                  <div className="text-4xl mb-3">✦</div>
                  <h3 className="text-[14px] font-bold text-white/80">Upload image to start detection</h3>
                  <p className="text-[12px] text-white/30 mt-1">Or type a prompt on the left and click Generate</p>
                  <button onClick={() => generate()} className="mt-6 px-5 py-2.5 bg-white text-black rounded-full text-[12px] font-bold hover:bg-white/90">Generate First Image</button>
                </div>
              </div>
            )}
          </div>

          {gallery.length > 0 && (
            <div className="h-[120px] border-t border-white/10 bg-black/30 backdrop-blur p-3 overflow-x-auto flex gap-3">
              {gallery.map(item => (
                <button
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className={`relative flex-shrink-0 w-[160px] h-[90px] rounded-xl overflow-hidden border-2 transition-all ${selected?.id === item.id ? 'border-purple-500' : 'border-white/10 hover:border-white/20'}`}
                >
                  <img src={item.url} className="w-full h-full object-cover" alt="" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1.5">
                    <p className="text-[9px] text-white/70 truncate">{item.prompt}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
  }
