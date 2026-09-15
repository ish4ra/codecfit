<div align="center">

# ▶ CodecFit

### Know what will play before you press play.

**CodecFit is a device-aware media release analyzer.** Paste release names, describe your playback setup, and it ranks the releases by compatibility, quality, and bandwidth while explaining the trade-offs.

![React](https://img.shields.io/badge/React-TypeScript-61dafb?style=for-the-badge&logo=react&logoColor=111)
![Vite](https://img.shields.io/badge/Vite-client--side-646cff?style=for-the-badge&logo=vite&logoColor=white)
![Privacy](https://img.shields.io/badge/privacy-no%20uploads-55d99a?style=for-the-badge)
![Status](https://img.shields.io/badge/status-V1%20MVP-8b9cff?style=for-the-badge)

</div>

---

## Why CodecFit exists

Release names contain useful technical information, but they are not friendly:

```text
Movie.Name.2026.2160p.WEB-DL.DV.HDR10.DDP5.1.Atmos.H.265-GROUP
```

Is that better for your setup than a `1080p BluRay REMUX`? Will AV1 play? Does Dolby Vision help on your display? Is TrueHD useful when you are using TV speakers? Is the bitrate sensible for your connection?

CodecFit turns those tags into a **setup-specific comparison** instead of giving every user the same generic quality ranking.

---

## What V1 does

- parses up to 20 release names at once;
- detects resolution, source, video codec, HDR formats, audio codec, Atmos, channel layout, size/bitrate hints and release group;
- compares each release against a configurable playback profile;
- scores **compatibility**, **quality**, and **bandwidth headroom** separately;
- ranks releases by an overall fit score;
- explains both the reasons and the warnings behind the score;
- includes editable example profiles instead of pretending generic presets are device certifications;
- saves your setup locally in the browser;
- performs all analysis client-side — no account, media upload, API key or backend required.

## Supported release tags

| Area | Examples |
|---|---|
| Resolution | `2160p`, `1080p`, `720p`, `4K`, `UHD` |
| Source | `REMUX`, `BluRay`, `WEB-DL`, `WEBRip`, `HDTV`, `DVD` |
| Video | `AV1`, `HEVC/H.265/x265`, `AVC/H.264/x264`, `VP9`, `MPEG-2` |
| HDR | `Dolby Vision / DV / DoVi`, `HDR10+`, `HDR10`, `HLG` |
| Audio | `TrueHD`, `DTS-HD MA`, `DTS:X`, `E-AC-3/DDP`, `AC-3`, `AAC`, `FLAC`, `PCM`, `DTS` |
| Extras | Atmos, channels such as `5.1` / `7.1`, file-size and bitrate hints |

---

## Scoring philosophy

CodecFit deliberately avoids a fake “this file will definitely work” promise.

The overall score is a heuristic built from:

```text
compatibility  → resolution + video + HDR + audio capabilities
quality        → resolution + source + HDR signal
bandwidth      → estimated/declared bitrate vs available headroom
preference     → user-controlled quality priority
```

Hard mismatches such as an unsupported video codec or resolution cap the final recommendation even when the source quality is high.

### Important limitation

A filename cannot reveal everything. Real playback can also depend on:

- codec profile/level;
- container details;
- Dolby Vision profile and fallback layers;
- subtitle format;
- firmware and player behavior;
- HDMI/eARC and audio passthrough;
- server transcoding capabilities.

For certainty, inspect the file with **MediaInfo** and verify the exact device/player documentation. CodecFit is a decision helper, not a hardware certification database.

---

## Run locally

```bash
git clone https://github.com/ish4ra/codecfit.git
cd codecfit
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

Tests:

```bash
npm test
```

---

## Project structure

```text
src/
├─ data/
│  └─ devices.ts        # editable example capability profiles
├─ lib/
│  ├─ parser.ts         # release-name parser
│  ├─ scoring.ts        # compatibility/quality/bandwidth engine
│  └─ storage.ts        # local browser preferences
├─ App.tsx              # UI + setup editor + ranked results
├─ styles.css           # responsive dark interface
└─ types.ts             # shared domain types
```

---

## Roadmap

- [x] Release-name parser
- [x] Multiple-release comparison
- [x] Compatibility / quality / bandwidth scores
- [x] Editable playback capability profiles
- [x] Responsive client-side UI
- [x] Local preference persistence
- [x] Parser/scoring tests
- [ ] MediaInfo paste/import
- [ ] Container and subtitle compatibility
- [ ] Shareable comparison links
- [ ] Community-maintained device profiles with sources
- [ ] PWA / installable app
- [ ] Jellyfin helper mode
- [ ] Stremio-oriented export/integration experiments

---

## Privacy and scope

CodecFit analyzes **text metadata only**. It does not search torrents, fetch copyrighted media, provide streams, access debrid accounts, or upload files. The same tool is useful for legal Blu-ray backups, Jellyfin/Plex libraries, local files, and any other media workflow where release-style filenames are used.

---

## Contributing

Good contributions include:

- release-name edge cases;
- parser fixtures;
- better transparent scoring rules;
- documented device capability profiles;
- accessibility/mobile UI improvements;
- MediaInfo parsing.

When adding a device profile, prefer a conservative capability set and include a source in the PR rather than guessing from marketing names.

---

<div align="center">

**Useful? Star the repo and help test weird release names.**

Built as a practical media compatibility tool, not another static guide.

</div>
