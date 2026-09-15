import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, ReactNode } from 'react'
import {
  AlertTriangle,
  BadgeCheck,
  ChevronDown,
  FileText,
  Film,
  Gauge,
  HardDrive,
  Info,
  MonitorPlay,
  Network,
  Play,
  RotateCcw,
  Sparkles,
  Upload,
  WandSparkles,
} from 'lucide-react'
import { defaultProfile, deviceProfiles } from './data/devices'
import { parseMediaInfo } from './lib/mediainfo'
import { parseReleaseList } from './lib/parser'
import { scoreReleaseList } from './lib/scoring'
import { loadSetup, saveSetup } from './lib/storage'
import type { AudioCodec, CapabilitySet, HdrFormat, Resolution, UserSetup, VideoCodec } from './types'

const SAMPLE = `Dune.Part.Two.2024.2160p.WEB-DL.DV.HDR10.DDP5.1.Atmos.H.265-GROUP\nDune.Part.Two.2024.1080p.BluRay.REMUX.AVC.DTS-HD.MA.5.1-GROUP\nDune.Part.Two.2024.2160p.WEB-DL.HDR10+.AV1.EAC3.5.1-GROUP`

const MEDIAINFO_SAMPLE = `General
Complete name                            : /media/Dune.Part.Two.2024.2160p.mkv
File size                                : 24.5 GiB
Overall bit rate                         : 31.2 Mb/s

Video
Format                                   : HEVC
HDR format                               : Dolby Vision, Version 1.0, dvhe.08.06, BL+RPU / SMPTE ST 2086, HDR10 compatible
Width                                    : 3 840 pixels
Height                                   : 2 160 pixels
Bit rate                                 : 28.8 Mb/s

Audio
Format                                   : E-AC-3 JOC
Commercial name                          : Dolby Digital Plus with Dolby Atmos
Channel(s)                               : 6 channels`

const resolutions: Resolution[] = ['2160p', '1080p', '720p', '576p', '480p']
const videoCodecs: VideoCodec[] = ['AVC', 'HEVC', 'AV1', 'VP9', 'MPEG-2']
const hdrFormats: HdrFormat[] = ['Dolby Vision', 'HDR10+', 'HDR10', 'HLG']
const audioCodecs: AudioCodec[] = ['AAC', 'AC-3', 'E-AC-3', 'TrueHD', 'DTS', 'DTS-HD MA', 'DTS:X', 'FLAC', 'PCM']

type InputMode = 'release' | 'mediainfo'

function cloneCapabilities(capabilities: CapabilitySet): CapabilitySet {
  return {
    maxResolution: capabilities.maxResolution,
    videoCodecs: [...capabilities.videoCodecs],
    hdrFormats: [...capabilities.hdrFormats],
    audioCodecs: [...capabilities.audioCodecs],
    atmos: capabilities.atmos,
  }
}

const initialSetup: UserSetup = {
  profileId: defaultProfile.id,
  capabilities: cloneCapabilities(defaultProfile.capabilities),
  bandwidthMbps: 100,
  qualityBias: 65,
}

function scoreTone(score: number) {
  if (score >= 85) return 'great'
  if (score >= 70) return 'good'
  if (score >= 55) return 'warn'
  return 'bad'
}

function App() {
  const [inputMode, setInputMode] = useState<InputMode>('release')
  const [input, setInput] = useState(SAMPLE)
  const [mediaInfoInput, setMediaInfoInput] = useState(MEDIAINFO_SAMPLE)
  const [importedFileName, setImportedFileName] = useState<string>()
  const [setup, setSetup] = useState<UserSetup>(() => loadSetup() ?? initialSetup)
  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => saveSetup(setup), [setup])

  const releases = useMemo(() => {
    if (inputMode === 'release') return parseReleaseList(input)
    return mediaInfoInput.trim() ? [parseMediaInfo(mediaInfoInput)] : []
  }, [inputMode, input, mediaInfoInput])
  const results = useMemo(() => scoreReleaseList(releases, setup), [releases, setup])
  const profile = deviceProfiles.find((item) => item.id === setup.profileId)

  const chooseProfile = (profileId: string) => {
    const next = deviceProfiles.find((item) => item.id === profileId)
    if (!next) return
    setSetup((current) => ({
      ...current,
      profileId,
      capabilities: cloneCapabilities(next.capabilities),
    }))
  }

  const toggleArray = <T extends string,>(key: 'videoCodecs' | 'hdrFormats' | 'audioCodecs', value: T) => {
    setSetup((current) => {
      const list = current.capabilities[key] as T[]
      const next = list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
      return {
        ...current,
        profileId: 'custom',
        capabilities: { ...current.capabilities, [key]: next },
      }
    })
  }

  const importMediaInfo = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const text = await file.text()
    setMediaInfoInput(text)
    setImportedFileName(file.name)
    setInputMode('mediainfo')
    event.target.value = ''
  }

  const useSample = () => {
    if (inputMode === 'release') setInput(SAMPLE)
    else {
      setMediaInfoInput(MEDIAINFO_SAMPLE)
      setImportedFileName(undefined)
    }
  }

  const reset = () => {
    setInputMode('release')
    setInput(SAMPLE)
    setMediaInfoInput(MEDIAINFO_SAMPLE)
    setImportedFileName(undefined)
    setSetup(initialSetup)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="CodecFit home">
          <span className="brand-mark"><Play size={15} fill="currentColor" /></span>
          <span>CodecFit</span>
        </a>
        <a className="github-link" href="https://github.com/ish4ra/codecfit" target="_blank" rel="noreferrer">GitHub ↗</a>
      </header>

      <main id="top">
        <section className="hero">
          <div className="eyebrow"><Sparkles size={15} /> device-aware media analysis</div>
          <h1>Know what will play<br /><span>before you press play.</span></h1>
          <p>Paste release names or MediaInfo text. CodecFit decodes the technical details, checks them against your playback setup, and explains which option fits best.</p>
          <div className="hero-pills">
            <span>Runs locally</span><span>No media uploads</span><span>No account</span><span>Open source</span>
          </div>
        </section>

        <section className="workspace">
          <div className="panel input-panel">
            <div className="panel-heading">
              <div><span className="step">01</span><h2>Analyze media</h2></div>
              <button className="text-button" onClick={useSample}>Use sample</button>
            </div>

            <div className="input-tabs" role="tablist" aria-label="Input type">
              <button className={inputMode === 'release' ? 'input-tab active' : 'input-tab'} onClick={() => setInputMode('release')}><Film size={15} /> Release names</button>
              <button className={inputMode === 'mediainfo' ? 'input-tab active' : 'input-tab'} onClick={() => setInputMode('mediainfo')}><FileText size={15} /> MediaInfo</button>
            </div>

            {inputMode === 'release' ? (
              <>
                <p className="panel-copy">One release name per line. Up to 20 releases are compared at once.</p>
                <textarea value={input} onChange={(event) => setInput(event.target.value)} spellCheck={false} aria-label="Release names" />
                <div className="parse-summary"><WandSparkles size={16} /> {releases.length} release{releases.length === 1 ? '' : 's'} detected</div>
              </>
            ) : (
              <>
                <p className="panel-copy">Paste MediaInfo text output or import a saved `.txt` / `.nfo` report. CodecFit uses the first video and audio tracks for V2 analysis.</p>
                <textarea className="mediainfo-textarea" value={mediaInfoInput} onChange={(event) => { setMediaInfoInput(event.target.value); setImportedFileName(undefined) }} spellCheck={false} aria-label="MediaInfo text" />
                <div className="file-row">
                  <label className="file-button"><Upload size={14} /> Import report<input type="file" accept=".txt,.nfo,text/plain" onChange={importMediaInfo} /></label>
                  <span className="file-name">{importedFileName ?? 'Text stays in your browser'}</span>
                </div>
                <div className="parse-summary"><WandSparkles size={16} /> {releases.length ? 'MediaInfo parsed' : 'Paste a MediaInfo report to begin'}</div>
              </>
            )}
          </div>

          <div className="panel setup-panel">
            <div className="panel-heading"><div><span className="step">02</span><h2>Your playback setup</h2></div></div>
            <p className="panel-copy">Official-spec profiles are conservative starting points, not playback certifications. Refine them for your actual player, display and audio chain.</p>

            <label className="field-label" htmlFor="profile">Starting profile</label>
            <select id="profile" value={setup.profileId === 'custom' ? '' : setup.profileId} onChange={(event) => chooseProfile(event.target.value)}>
              <option value="" disabled>Customised profile</option>
              {deviceProfiles.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
            {profile?.note && <div className="notice"><Info size={15} />{profile.note}</div>}

            <div className="two-fields">
              <label>
                <span className="field-label"><Network size={14} /> Internet / LAN Mbps</span>
                <input type="number" min="1" max="10000" value={setup.bandwidthMbps} onChange={(event) => setSetup((current) => ({ ...current, bandwidthMbps: Math.max(1, Number(event.target.value) || 1) }))} />
              </label>
              <label>
                <span className="field-label"><Gauge size={14} /> Quality priority: {setup.qualityBias}%</span>
                <input type="range" min="0" max="100" value={setup.qualityBias} onChange={(event) => setSetup((current) => ({ ...current, qualityBias: Number(event.target.value) }))} />
              </label>
            </div>

            <button className="advanced-toggle" onClick={() => setShowAdvanced((value) => !value)}>
              <span>Advanced compatibility</span><ChevronDown className={showAdvanced ? 'rotated' : ''} size={18} />
            </button>

            {showAdvanced && (
              <div className="advanced-grid">
                <div>
                  <span className="field-label">Maximum resolution</span>
                  <div className="chip-grid">
                    {resolutions.map((resolution) => <button key={resolution} className={setup.capabilities.maxResolution === resolution ? 'chip active' : 'chip'} onClick={() => setSetup((current) => ({ ...current, profileId: 'custom', capabilities: { ...current.capabilities, maxResolution: resolution } }))}>{resolution}</button>)}
                  </div>
                </div>
                <CapabilityChips title="Video codecs" values={videoCodecs} active={setup.capabilities.videoCodecs} onToggle={(value) => toggleArray('videoCodecs', value)} />
                <CapabilityChips title="HDR formats" values={hdrFormats} active={setup.capabilities.hdrFormats} onToggle={(value) => toggleArray('hdrFormats', value)} />
                <CapabilityChips title="Audio codecs" values={audioCodecs} active={setup.capabilities.audioCodecs} onToggle={(value) => toggleArray('audioCodecs', value)} />
                <label className="switch-row">
                  <input type="checkbox" checked={setup.capabilities.atmos} onChange={(event) => setSetup((current) => ({ ...current, profileId: 'custom', capabilities: { ...current.capabilities, atmos: event.target.checked } }))} />
                  <span>Atmos-capable playback chain</span>
                </label>
              </div>
            )}
          </div>
        </section>

        <section className="results-section">
          <div className="results-heading">
            <div><span className="step">03</span><h2>{inputMode === 'release' ? 'Best fit' : 'Compatibility result'}</h2><p>{inputMode === 'release' ? 'Ranked by compatibility, quality and bandwidth headroom.' : 'MediaInfo gives CodecFit more precise metadata than a release name alone.'}</p></div>
            <button className="reset-button" onClick={reset}><RotateCcw size={15} /> Reset</button>
          </div>

          {results.length === 0 ? (
            <div className="empty-state"><Film size={30} /><h3>Add media metadata to begin</h3><p>CodecFit analyzes text metadata locally. It never uploads or fetches the media itself.</p></div>
          ) : (
            <div className="results-list">
              {results.map((result, index) => (
                <article className={index === 0 ? 'result-card winner' : 'result-card'} key={`${result.release.raw}-${index}`}>
                  <div className="rank-col">
                    <span className="rank">#{index + 1}</span>
                    <div className={`score-ring ${scoreTone(result.scores.overall)}`}><strong>{result.scores.overall}</strong><span>fit</span></div>
                  </div>
                  <div className="result-main">
                    <div className="result-topline">
                      <div>
                        {index === 0 && <span className="best-badge"><BadgeCheck size={14} /> {inputMode === 'release' ? 'Best match' : 'Analyzed file'}</span>}
                        <h3>{result.release.title}{result.release.year ? ` (${result.release.year})` : ''}</h3>
                      </div>
                      <span className="bitrate">~{result.estimatedBitrateMbps} Mbps {result.release.bitrateMbps ? 'reported' : 'est.'}</span>
                    </div>
                    <div className="tag-row">
                      {[result.release.resolution, result.release.source !== 'unknown' ? result.release.source : undefined, result.release.videoCodec, ...result.release.hdr, result.release.audioCodec, result.release.channels, result.release.atmos ? 'Atmos' : undefined]
                        .filter(Boolean)
                        .map((tag) => <span className="media-tag" key={String(tag)}>{tag}</span>)}
                    </div>
                    <code className="raw-name">{result.release.raw}</code>
                    <div className="metric-row">
                      <Metric icon={<MonitorPlay size={15} />} label="Compatibility" value={result.scores.compatibility} />
                      <Metric icon={<Sparkles size={15} />} label="Quality" value={result.scores.quality} />
                      <Metric icon={<Network size={15} />} label="Bandwidth" value={result.scores.bandwidth} />
                    </div>
                    <div className="explanations">
                      <div>
                        <h4><BadgeCheck size={15} /> Why it fits</h4>
                        <ul>{result.reasons.slice(0, 5).map((reason) => <li key={reason}>{reason}</li>)}</ul>
                      </div>
                      {result.warnings.length > 0 && <div className="warnings"><h4><AlertTriangle size={15} /> Watch out</h4><ul>{result.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul></div>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="how-it-works">
          <div><MonitorPlay /><h3>Parse</h3><p>Release tags or MediaInfo fields become normalized video, HDR, audio and bitrate metadata.</p></div>
          <div><HardDrive /><h3>Match</h3><p>Your selected capabilities are compared against every detected technical property.</p></div>
          <div><Gauge /><h3>Rank</h3><p>A transparent heuristic balances compatibility, quality and bandwidth.</p></div>
        </section>

        <section className="disclaimer">
          <Info size={18} />
          <div><strong>Compatibility is a prediction, not a certification.</strong><br />MediaInfo improves accuracy, but real playback can still depend on codec profiles/levels, containers, subtitle formats, Dolby Vision profiles, firmware, player choice, HDMI/eARC, passthrough and fallback behavior. Exact device documentation and real playback testing remain the source of truth.</div>
        </section>
      </main>

      <footer><span>CodecFit · open source media compatibility helper</span><a href="https://github.com/ish4ra/codecfit" target="_blank" rel="noreferrer">Source on GitHub ↗</a></footer>
    </div>
  )
}

function CapabilityChips<T extends string>({ title, values, active, onToggle }: { title: string; values: T[]; active: T[]; onToggle: (value: T) => void }) {
  return <div><span className="field-label">{title}</span><div className="chip-grid">{values.map((value) => <button key={value} className={active.includes(value) ? 'chip active' : 'chip'} onClick={() => onToggle(value)}>{value}</button>)}</div></div>
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return <div className="metric"><span>{icon}{label}</span><strong>{value}</strong><div className="bar"><i style={{ width: `${value}%` }} /></div></div>
}

export default App
