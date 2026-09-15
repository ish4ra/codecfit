import type { AudioCodec, HdrFormat, MediaSource, ParsedRelease, Resolution, VideoCodec } from '../types'

const resolutionPatterns: Array<[Resolution, RegExp]> = [
  ['2160p', /\b(?:2160p|4k|uhd)\b/i],
  ['1080p', /\b1080[pi]\b/i],
  ['720p', /\b720p\b/i],
  ['576p', /\b576p\b/i],
  ['480p', /\b480p\b/i],
]

const sourcePatterns: Array<[MediaSource, RegExp]> = [
  ['REMUX', /\bremux\b/i],
  ['BluRay', /\b(?:blu[ ._-]?ray|bdrip|brrip)\b/i],
  ['WEB-DL', /\b(?:web[ ._-]?dl|webdl)\b/i],
  ['WEBRip', /\bweb[ ._-]?rip\b/i],
  ['HDTV', /\bhdtv\b/i],
  ['DVD', /\b(?:dvd|dvdrip)\b/i],
]

const codecPatterns: Array<[VideoCodec, RegExp]> = [
  ['AV1', /\bav1\b/i],
  ['HEVC', /\b(?:hevc|h[ ._-]?265|x265)\b/i],
  ['AVC', /\b(?:avc|h[ ._-]?264|x264)\b/i],
  ['VP9', /\bvp9\b/i],
  ['MPEG-2', /\bmpeg[ ._-]?2\b/i],
]

const audioPatterns: Array<[AudioCodec, RegExp]> = [
  ['DTS:X', /\bdts[ ._-]?x\b/i],
  ['DTS-HD MA', /\bdts[ ._-]?(?:hd[ ._-]?ma|hdma)\b/i],
  ['TrueHD', /\btrue[ ._-]?hd\b/i],
  ['E-AC-3', /\b(?:e[ ._-]?ac[ ._-]?3|eac3|ddp(?:\d(?:\.\d)?)?|dd\+)\b/i],
  ['AC-3', /\b(?:ac[ ._-]?3|dd5?\.?1?)\b/i],
  ['AAC', /\baac\b/i],
  ['FLAC', /\bflac\b/i],
  ['PCM', /\b(?:lpcm|pcm)\b/i],
  ['DTS', /\bdts\b/i],
]

function detect<T extends string>(raw: string, patterns: Array<[T, RegExp]>, fallback: T): T {
  return patterns.find(([, pattern]) => pattern.test(raw))?.[0] ?? fallback
}

function detectHdr(raw: string): HdrFormat[] {
  const result: HdrFormat[] = []
  if (/\b(?:dolby[ ._-]?vision|dovi|dv)\b/i.test(raw)) result.push('Dolby Vision')
  if (/\b(?:hdr10\+|hdr10plus)\b/i.test(raw)) result.push('HDR10+')
  if (/\bhdr10\b/i.test(raw) || (/\bhdr\b/i.test(raw) && !result.includes('HDR10+'))) result.push('HDR10')
  if (/\bhlg\b/i.test(raw)) result.push('HLG')
  return [...new Set(result)]
}

function cleanTitle(raw: string): { title: string; year?: number } {
  const yearMatch = raw.match(/\b(19\d{2}|20\d{2})\b/)
  const year = yearMatch ? Number(yearMatch[1]) : undefined
  const stop = yearMatch?.index ?? raw.search(/\b(?:2160p|1080[pi]|720p|576p|480p|4k|uhd|web[ ._-]?dl|remux|blu[ ._-]?ray)\b/i)
  const slice = raw.slice(0, stop > 0 ? stop : raw.length)
  const title = slice
    .replace(/[._]+/g, ' ')
    .replace(/\s+-\s*$/, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
  return { title: title || 'Untitled release', year }
}

function parseNumber(raw: string, pattern: RegExp): number | undefined {
  const match = raw.match(pattern)
  if (!match) return undefined
  const value = Number(match[1])
  return Number.isFinite(value) ? value : undefined
}

export function parseRelease(rawInput: string): ParsedRelease {
  const raw = rawInput.trim()
  const { title, year } = cleanTitle(raw)
  const channels = raw.match(/(7\.1(?:\.\d)?|5\.1(?:\.\d)?|2\.0|2\.1|1\.0)/i)?.[1]
  const groupMatch = raw.match(/-([A-Za-z0-9][A-Za-z0-9._-]{1,30})$/)

  return {
    raw,
    title,
    year,
    resolution: detect(raw, resolutionPatterns, 'unknown'),
    videoCodec: detect(raw, codecPatterns, 'unknown'),
    hdr: detectHdr(raw),
    audioCodec: detect(raw, audioPatterns, 'unknown'),
    atmos: /\batmos\b/i.test(raw),
    channels,
    source: detect(raw, sourcePatterns, 'unknown'),
    group: groupMatch?.[1],
    sizeGb: parseNumber(raw, /\b(\d+(?:\.\d+)?)\s*(?:Gi?B|GB)\b/i),
    bitrateMbps: parseNumber(raw, /\b(\d+(?:\.\d+)?)\s*(?:Mbps|Mb\/s|Mbit\/s)\b/i),
  }
}

export function parseReleaseList(input: string): ParsedRelease[] {
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 20)
    .map(parseRelease)
}
