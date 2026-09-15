import { describe, expect, it } from 'vitest'
import { parseMediaInfo } from './mediainfo'

const SAMPLE = `General
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

describe('parseMediaInfo', () => {
  it('extracts practical playback metadata from MediaInfo text', () => {
    const result = parseMediaInfo(SAMPLE)
    expect(result.title).toBe('Dune Part Two')
    expect(result.year).toBe(2024)
    expect(result.resolution).toBe('2160p')
    expect(result.videoCodec).toBe('HEVC')
    expect(result.hdr).toContain('Dolby Vision')
    expect(result.hdr).toContain('HDR10')
    expect(result.audioCodec).toBe('E-AC-3')
    expect(result.atmos).toBe(true)
    expect(result.channels).toBe('5.1')
    expect(result.bitrateMbps).toBe(28.8)
    expect(result.sizeGb).toBe(24.5)
  })
})
