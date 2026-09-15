import type { ParsedRelease, Resolution, ScoredRelease, UserSetup } from '../types'

const resolutionRank: Record<Resolution, number> = {
  unknown: 0,
  '480p': 1,
  '576p': 2,
  '720p': 3,
  '1080p': 4,
  '2160p': 5,
}

const sourceQuality: Record<ParsedRelease['source'], number> = {
  REMUX: 100,
  BluRay: 84,
  'WEB-DL': 78,
  WEBRip: 62,
  HDTV: 50,
  DVD: 35,
  unknown: 45,
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value))
}

export function estimateBitrate(release: ParsedRelease): number {
  if (release.bitrateMbps) return release.bitrateMbps

  const table: Record<string, number> = {
    '2160p:REMUX': 70,
    '2160p:BluRay': 38,
    '2160p:WEB-DL': 24,
    '2160p:WEBRip': 18,
    '1080p:REMUX': 34,
    '1080p:BluRay': 16,
    '1080p:WEB-DL': 9,
    '1080p:WEBRip': 7,
    '720p:WEB-DL': 5,
    '720p:WEBRip': 4,
  }

  return table[`${release.resolution}:${release.source}`] ?? (release.resolution === '2160p' ? 22 : release.resolution === '1080p' ? 9 : 5)
}

function qualityScore(release: ParsedRelease): number {
  const resolutionScore = {
    unknown: 35,
    '480p': 20,
    '576p': 28,
    '720p': 48,
    '1080p': 76,
    '2160p': 100,
  }[release.resolution]

  const hdrBonus = release.hdr.length > 0 ? 7 : 0
  return clamp(resolutionScore * 0.58 + sourceQuality[release.source] * 0.42 + hdrBonus)
}

export function scoreRelease(release: ParsedRelease, setup: UserSetup): ScoredRelease {
  const reasons: string[] = []
  const warnings: string[] = []
  let compatibility = 100

  const maxRank = resolutionRank[setup.capabilities.maxResolution]
  const releaseRank = resolutionRank[release.resolution]
  if (releaseRank > maxRank && maxRank > 0) {
    compatibility -= 48
    warnings.push(`${release.resolution} exceeds the selected setup's ${setup.capabilities.maxResolution} ceiling.`)
  } else if (release.resolution !== 'unknown') {
    reasons.push(`${release.resolution} fits the selected resolution limit.`)
  }

  if (release.videoCodec !== 'unknown') {
    if (!setup.capabilities.videoCodecs.includes(release.videoCodec)) {
      compatibility -= 52
      warnings.push(`${release.videoCodec} is not marked as supported by this setup.`)
    } else {
      reasons.push(`${release.videoCodec} video is marked as supported.`)
    }
  } else {
    compatibility -= 8
    warnings.push('Video codec could not be identified from the release name.')
  }

  if (release.hdr.length > 0) {
    const unsupported = release.hdr.filter((format) => !setup.capabilities.hdrFormats.includes(format))
    if (unsupported.length) {
      compatibility -= Math.min(30, unsupported.length * 18)
      warnings.push(`${unsupported.join(', ')} is not marked as supported; fallback behavior depends on the file and player.`)
    } else {
      reasons.push(`${release.hdr.join(' + ')} matches the selected HDR capabilities.`)
    }
  }

  if (release.audioCodec !== 'unknown') {
    if (!setup.capabilities.audioCodecs.includes(release.audioCodec)) {
      compatibility -= 22
      warnings.push(`${release.audioCodec} is not marked as supported; transcoding, decoding or fallback may be required.`)
    } else {
      reasons.push(`${release.audioCodec} audio is marked as supported.`)
    }
  }

  if (release.atmos && !setup.capabilities.atmos) {
    compatibility -= 8
    warnings.push('Atmos is present but the selected setup is not marked Atmos-capable.')
  } else if (release.atmos) {
    reasons.push('Atmos is present and the selected setup is marked Atmos-capable.')
  }

  compatibility = clamp(compatibility)

  const estimatedBitrateMbps = estimateBitrate(release)
  const safeBandwidth = setup.bandwidthMbps * 0.72
  let bandwidth = 100
  if (estimatedBitrateMbps > setup.bandwidthMbps) {
    bandwidth = 20
    warnings.push(`Estimated ${estimatedBitrateMbps} Mbps exceeds the entered connection speed.`)
  } else if (estimatedBitrateMbps > safeBandwidth) {
    bandwidth = 62
    warnings.push(`Estimated ${estimatedBitrateMbps} Mbps leaves little bandwidth headroom.`)
  } else {
    const headroom = setup.bandwidthMbps / Math.max(estimatedBitrateMbps, 1)
    bandwidth = clamp(70 + headroom * 8)
    reasons.push(`Estimated ~${estimatedBitrateMbps} Mbps fits within the entered bandwidth.`)
  }

  const quality = qualityScore(release)
  if (release.source !== 'unknown') reasons.push(`${release.source} contributes to the quality score.`)

  const qualityWeight = 0.12 + (setup.qualityBias / 100) * 0.18
  const bandwidthWeight = 0.25 - (setup.qualityBias / 100) * 0.12
  const compatibilityWeight = 1 - qualityWeight - bandwidthWeight

  let overall = compatibility * compatibilityWeight + quality * qualityWeight + bandwidth * bandwidthWeight

  if (release.videoCodec !== 'unknown' && !setup.capabilities.videoCodecs.includes(release.videoCodec)) overall = Math.min(overall, 58)
  if (releaseRank > maxRank && maxRank > 0) overall = Math.min(overall, 55)

  return {
    release,
    scores: {
      compatibility: Math.round(compatibility),
      quality: Math.round(quality),
      bandwidth: Math.round(bandwidth),
      overall: Math.round(clamp(overall)),
    },
    reasons,
    warnings,
    estimatedBitrateMbps,
  }
}

export function scoreReleaseList(releases: ParsedRelease[], setup: UserSetup): ScoredRelease[] {
  return releases
    .map((release) => scoreRelease(release, setup))
    .sort((a, b) => b.scores.overall - a.scores.overall)
}
