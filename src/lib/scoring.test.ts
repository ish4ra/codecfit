import { describe, expect, it } from 'vitest'
import { defaultProfile } from '../data/devices'
import { parseRelease } from './parser'
import { scoreRelease } from './scoring'

const setup = {
  profileId: defaultProfile.id,
  capabilities: defaultProfile.capabilities,
  bandwidthMbps: 100,
  qualityBias: 65,
}

describe('scoreRelease', () => {
  it('penalizes unsupported video codecs strongly', () => {
    const supported = scoreRelease(parseRelease('Movie.1080p.WEB-DL.H264.AAC-GROUP'), setup)
    const unsupported = scoreRelease(parseRelease('Movie.1080p.WEB-DL.MPEG-2.AAC-GROUP'), setup)
    expect(supported.scores.overall).toBeGreaterThan(unsupported.scores.overall)
    expect(unsupported.scores.overall).toBeLessThanOrEqual(58)
  })
})
