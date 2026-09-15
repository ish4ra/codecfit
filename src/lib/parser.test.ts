import { describe, expect, it } from 'vitest'
import { parseRelease } from './parser'

describe('parseRelease', () => {
  it('parses common 4K web release tags', () => {
    const result = parseRelease('Movie.Name.2026.2160p.WEB-DL.DV.HDR10.DDP5.1.Atmos.H.265-GROUP')
    expect(result.resolution).toBe('2160p')
    expect(result.source).toBe('WEB-DL')
    expect(result.videoCodec).toBe('HEVC')
    expect(result.hdr).toContain('Dolby Vision')
    expect(result.hdr).toContain('HDR10')
    expect(result.audioCodec).toBe('E-AC-3')
    expect(result.atmos).toBe(true)
    expect(result.channels).toBe('5.1')
  })

  it('parses remux and DTS-HD MA', () => {
    const result = parseRelease('Movie.2024.1080p.BluRay.REMUX.AVC.DTS-HD.MA.5.1-GROUP')
    expect(result.source).toBe('REMUX')
    expect(result.videoCodec).toBe('AVC')
    expect(result.audioCodec).toBe('DTS-HD MA')
  })
})
