import type { DeviceProfile } from '../types'

export const deviceProfiles: DeviceProfile[] = [
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
