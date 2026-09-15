import type { AudioCodec, HdrFormat, ParsedRelease, Resolution, VideoCodec } from '../types'

const SECTION_HEADERS = ['General', 'Video', 'Audio', 'Text', 'Menu', 'Image', 'Other']

function section(raw: string, name: string): string {
  const lines = raw.replace(/\r/g, '').split('\n')
  const start = lines.findIndex((line) => line.trim().toLowerCase() === name.toLowerCase())
  if (start < 0) return ''
  const out: string[] = []
  for (let i = start + 1; i < lines.length; i += 1) {
    const trimmed = lines[i].trim()
    if (SECTION_HEADERS.some((header) => header.toLowerCase() === trimmed.toLowerCase())) break
    out.push(lines[i])
  }
  return out.join('\n')
}

function field(block: string, name: string): string | undefined {
  const match = block.match(new RegExp(`^\\s*${name.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}\\s*:\\s*(.+)$`, 'im'))
  return match?.[1]?.trim()
}

function cleanNumber(value?: string): number | undefined {
  if (!value) return undefined
  const match = value.replace(/,/g, '').match(/([\d.]+)/)
  if (!match) return undefined
  const number = Number(match[1])
  return Number.isFinite(number) ? number : undefined
}

function parseBitrate(value?: string): number | undefined {
  if (!value) return undefined
  const number = cleanNumber(value)
  if (number === undefined) return undefined
  if (/\bGb\/s\b/i.test(value)) return number * 1000
  if (/\bkb\/s\b/i.test(value)) return number / 1000
  if (/\bb\/s\b/i.test(value) && !/\b[MGk]b\/s\b/i.test(value)) return number / 1_000_000
  return number
}

function parseSizeGb(value?: string): number | undefined {
  if (!value) return undefined
  const number = cleanNumber(value)
  if (number === undefined) return undefined
  if (/\bTiB\b/i.test(value)) return number * 1024
  if (/\bMiB\b/i.test(value)) return number / 1024
  if (/\bKiB\b/i.test(value)) return number / (1024 * 1024)
  if (/\bTB\b/i.test(value)) return number * 1000
  if (/\bMB\b/i.test(value)) return number / 1000
  return number
}

function resolutionFrom(video: string): Resolution {
  const height = cleanNumber(field(video, 'Height'))
  const width = cleanNumber(field(video, 'Width'))
  const pixels = Math.max(height ?? 0, width ? width * 9 / 16 : 0)
  if (pixels >= 2000) return '2160p'
  if (pixels >= 1000) return '1080p'
  if (pixels >= 700) return '720p'
  if (pixels >= 550) return '576p'
  if (pixels > 0) return '480p'
  return 'unknown'
}

function videoCodecFrom(video: string): VideoCodec {
  const value = `${field(video, 'Format') ?? ''} ${field(video, 'Codec ID') ?? ''}`
  if (/\bAV1\b/i.test(value)) return 'AV1'
  if (/\b(?:HEVC|H\.265|H265)\b/i.test(value)) return 'HEVC'
  if (/\b(?:AVC|H\.264|H264)\b/i.test(value)) return 'AVC'
  if (/\bVP9\b/i.test(value)) return 'VP9'
  if (/MPEG[- ]?2/i.test(value)) return 'MPEG-2'
  return 'unknown'
}

function audioCodecFrom(audio: string): AudioCodec {
  const value = `${field(audio, 'Format') ?? ''} ${field(audio, 'Commercial name') ?? ''} ${field(audio, 'Format profile') ?? ''}`
  if (/DTS[- ]?X|DTS XLL X/i.test(value)) return 'DTS:X'
  if (/DTS[- ]?HD.*Master|DTS XLL/i.test(value)) return 'DTS-HD MA'
  if (/TrueHD|MLP FBA/i.test(value)) return 'TrueHD'
  if (/E-AC-3|EAC3|Dolby Digital Plus/i.test(value)) return 'E-AC-3'
  if (/\bAC-3\b|Dolby Digital(?! Plus)/i.test(value)) return 'AC-3'
  if (/\bAAC\b/i.test(value)) return 'AAC'
  if (/\bFLAC\b/i.test(value)) return 'FLAC'
  if (/\bPCM\b/i.test(value)) return 'PCM'
  if (/\bDTS\b/i.test(value)) return 'DTS'
  return 'unknown'
}

function hdrFrom(video: string): HdrFormat[] {
  const value = `${field(video, 'HDR format') ?? ''} ${field(video, 'HDR format compatibility') ?? ''} ${video}`
  const result: HdrFormat[] = []
  if (/Dolby Vision|\bDoVi\b|\bdvhe\b/i.test(value)) result.push('Dolby Vision')
  if (/HDR10\+|HDR10 Plus/i.test(value)) result.push('HDR10+')
  if (/HDR10|SMPTE ST 2086/i.test(value)) result.push('HDR10')
  if (/\bHLG\b|Hybrid Log/i.test(value)) result.push('HLG')
  return [...new Set(result)]
}

function channelsFrom(audio: string): string | undefined {
  const value = field(audio, 'Channel(s)') ?? field(audio, 'Channels')
  const direct = value?.match(/\b(7\.1(?:\.\d)?|5\.1(?:\.\d)?|2\.1|2\.0|1\.0)\b/)?.[1]
  if (direct) return direct
  const count = cleanNumber(value)
  if (count === 8) return '7.1'
  if (count === 6) return '5.1'
  if (count === 3) return '2.1'
  if (count === 2) return '2.0'
  if (count === 1) return '1.0'
  return undefined
}

function titleFromPath(path?: string): { title: string; year?: number } {
  if (!path) return { title: 'MediaInfo file' }
  const file = path.split(/[\\/]/).pop() ?? path
  const withoutExt = file.replace(/\.[A-Za-z0-9]{2,5}$/, '')
  const yearMatch = withoutExt.match(/\b(19\d{2}|20\d{2})\b/)
  const year = yearMatch ? Number(yearMatch[1]) : undefined
  const title = withoutExt
    .slice(0, yearMatch?.index ?? withoutExt.length)
    .replace(/[._]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
  return { title: title || withoutExt.replace(/[._]+/g, ' '), year }
}

export function parseMediaInfo(rawInput: string): ParsedRelease {
  const raw = rawInput.trim()
  const general = section(raw, 'General')
  const video = section(raw, 'Video')
  const audio = section(raw, 'Audio')
  const completeName = field(general, 'Complete name') ?? field(general, 'File name')
  const { title, year } = titleFromPath(completeName)
  const videoBitrate = parseBitrate(field(video, 'Bit rate'))
  const overallBitrate = parseBitrate(field(general, 'Overall bit rate'))
  const audioText = `${audio} ${field(audio, 'Commercial name') ?? ''}`

  return {
    raw: completeName ? `MediaInfo · ${completeName.split(/[\\/]/).pop()}` : 'MediaInfo paste',
    title,
    year,
    resolution: resolutionFrom(video),
    videoCodec: videoCodecFrom(video),
    hdr: hdrFrom(video),
    audioCodec: audioCodecFrom(audio),
    atmos: /Dolby Atmos|\bAtmos\b|\bJOC\b/i.test(audioText),
    channels: channelsFrom(audio),
    source: 'unknown',
    sizeGb: parseSizeGb(field(general, 'File size')),
    bitrateMbps: videoBitrate ?? overallBitrate,
  }
}
