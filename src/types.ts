export type Resolution = '2160p' | '1080p' | '720p' | '576p' | '480p' | 'unknown'
export type VideoCodec = 'AV1' | 'HEVC' | 'AVC' | 'VP9' | 'MPEG-2' | 'unknown'
export type HdrFormat = 'Dolby Vision' | 'HDR10+' | 'HDR10' | 'HLG'
export type AudioCodec = 'TrueHD' | 'DTS-HD MA' | 'DTS:X' | 'E-AC-3' | 'AC-3' | 'AAC' | 'FLAC' | 'PCM' | 'DTS' | 'unknown'
export type MediaSource = 'REMUX' | 'BluRay' | 'WEB-DL' | 'WEBRip' | 'HDTV' | 'DVD' | 'unknown'

export interface ParsedRelease {
  raw: string
  title: string
  year?: number
  resolution: Resolution
  videoCodec: VideoCodec
  hdr: HdrFormat[]
  audioCodec: AudioCodec
  atmos: boolean
  channels?: string
  source: MediaSource
  group?: string
  sizeGb?: number
  bitrateMbps?: number
}

export interface CapabilitySet {
  maxResolution: Resolution
  videoCodecs: VideoCodec[]
  hdrFormats: HdrFormat[]
  audioCodecs: AudioCodec[]
  atmos: boolean
}

export interface DeviceProfile {
  id: string
  name: string
  summary: string
  capabilities: CapabilitySet
  note?: string
}

export interface UserSetup {
  profileId: string
  capabilities: CapabilitySet
  bandwidthMbps: number
  qualityBias: number
}

export interface ScoreBreakdown {
  compatibility: number
  quality: number
  bandwidth: number
  overall: number
}

export interface ScoredRelease {
  release: ParsedRelease
  scores: ScoreBreakdown
  reasons: string[]
  warnings: string[]
  estimatedBitrateMbps: number
}
