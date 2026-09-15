import type { DeviceProfile } from '../types'

export const deviceProfiles: DeviceProfile[] = [
  {
    id: 'fire-tv-4k-max-2',
    name: 'Fire TV Stick 4K Max (2nd Gen) — conservative',
    summary: 'Official-spec-based 4K profile for Amazon’s 2nd-gen 4K Max stick.',
    capabilities: {
      maxResolution: '2160p',
      videoCodecs: ['AVC', 'HEVC', 'AV1', 'VP9', 'MPEG-2'],
      hdrFormats: ['Dolby Vision', 'HDR10+', 'HDR10', 'HLG'],
      audioCodecs: ['AAC', 'AC-3', 'E-AC-3', 'DTS', 'DTS-HD MA', 'FLAC', 'PCM'],
      atmos: true,
    },
    note: 'Based on Amazon device specs for Fire TV Stick 4K Max (2nd Gen). App/player behavior, Dolby Vision profile support and passthrough can still vary. DTS-HD is listed by Amazon as Basic Profile passthrough.',
  },
  {
    id: 'apple-tv-4k',
    name: 'Apple TV 4K — conservative',
    summary: 'A conservative profile based on Apple’s current Apple TV 4K format specifications.',
    capabilities: {
      maxResolution: '2160p',
      videoCodecs: ['AVC', 'HEVC'],
      hdrFormats: ['Dolby Vision', 'HDR10+', 'HDR10', 'HLG'],
      audioCodecs: ['AAC', 'AC-3', 'E-AC-3', 'FLAC', 'PCM'],
      atmos: true,
    },
    note: 'Apple lists Dolby Vision Profile 5 plus HDR10+/HDR10/HLG and Dolby Atmos. Third-party players can change local-file behavior, so edit this profile for your actual app and audio chain.',
  },
  {
    id: 'shield-tv-pro-2019',
    name: 'NVIDIA Shield TV Pro (2019) — conservative',
    summary: 'Broad local-media profile with strong lossless-audio passthrough support.',
    capabilities: {
      maxResolution: '2160p',
      videoCodecs: ['AVC', 'HEVC', 'VP9', 'MPEG-2'],
      hdrFormats: ['Dolby Vision', 'HDR10'],
      audioCodecs: ['AAC', 'AC-3', 'E-AC-3', 'TrueHD', 'DTS', 'DTS-HD MA', 'DTS:X', 'FLAC', 'PCM'],
      atmos: true,
    },
    note: 'Based on NVIDIA’s Shield TV Pro specs. NVIDIA lists Dolby Vision/HDR10, TrueHD passthrough, DTS-HD and DTS:X passthrough. Exact playback still depends on the app, display and AVR/soundbar.',
  },
  {
    id: 'balanced-4k',
    name: 'Modern 4K setup — balanced example',
    summary: 'A conservative starter profile for a recent 4K TV or streaming device.',
    capabilities: {
      maxResolution: '2160p',
      videoCodecs: ['AVC', 'HEVC', 'AV1', 'VP9'],
      hdrFormats: ['HDR10'],
      audioCodecs: ['AAC', 'AC-3', 'E-AC-3'],
      atmos: true,
    },
    note: 'Example profile only. Dolby Vision, HDR10+, lossless audio and passthrough vary by exact TV, player, OS and receiver.',
  },
  {
    id: 'dolby-4k',
    name: '4K + Dolby Vision — example',
    summary: 'For a setup that you know supports HEVC, Dolby Vision and E-AC-3/Atmos.',
    capabilities: {
      maxResolution: '2160p',
      videoCodecs: ['AVC', 'HEVC', 'AV1', 'VP9'],
      hdrFormats: ['Dolby Vision', 'HDR10', 'HDR10+'],
      audioCodecs: ['AAC', 'AC-3', 'E-AC-3', 'TrueHD'],
      atmos: true,
    },
    note: 'Dolby Vision profiles and TrueHD passthrough are device-chain specific. Refine the toggles below for your real setup.',
  },
  {
    id: 'compat-1080',
    name: '1080p compatibility-first — example',
    summary: 'A safe baseline for older TVs, laptops or simple playback chains.',
    capabilities: {
      maxResolution: '1080p',
      videoCodecs: ['AVC'],
      hdrFormats: [],
      audioCodecs: ['AAC', 'AC-3'],
      atmos: false,
    },
  },
  {
    id: 'desktop-player',
    name: 'Desktop software player — example',
    summary: 'Broad codec support for a modern desktop using software such as mpv or VLC.',
    capabilities: {
      maxResolution: '2160p',
      videoCodecs: ['AVC', 'HEVC', 'AV1', 'VP9', 'MPEG-2'],
      hdrFormats: ['HDR10', 'HDR10+', 'HLG'],
      audioCodecs: ['AAC', 'AC-3', 'E-AC-3', 'TrueHD', 'DTS', 'DTS-HD MA', 'DTS:X', 'FLAC', 'PCM'],
      atmos: true,
    },
    note: 'Actual HDR output and bitstream passthrough still depend on the OS, display, GPU, player configuration and audio hardware.',
  },
]

export const defaultProfile = deviceProfiles[0]
