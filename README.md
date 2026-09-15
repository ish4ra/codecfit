<div align="center">

# ▶ CodecFit

### Know what will play before you press play.

**CodecFit is a device-aware media compatibility analyzer.** Paste release names or a MediaInfo report, choose your playback setup, and CodecFit explains what should play, what may fail, and which release best fits your hardware and bandwidth.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-open%20CodecFit-55d99a?style=for-the-badge&logo=githubpages&logoColor=111)](https://isharalakshan.xyz/codecfit/)
![React](https://img.shields.io/badge/React-TypeScript-61dafb?style=for-the-badge&logo=react&logoColor=111)
![Vite](https://img.shields.io/badge/Vite-client--side-646cff?style=for-the-badge&logo=vite&logoColor=white)
![Privacy](https://img.shields.io/badge/privacy-local%20analysis-55d99a?style=for-the-badge)
![Status](https://img.shields.io/badge/status-V2%20beta-8b9cff?style=for-the-badge)
![CI](https://github.com/ish4ra/codecfit/actions/workflows/ci.yml/badge.svg)

**Release names → parse → match device → score → explain**

**Live:** https://isharalakshan.xyz/codecfit/

</div>

---

## ✨ Why CodecFit exists

Media filenames contain a surprising amount of useful information:

```text
Dune.Part.Two.2024.2160p.WEB-DL.DV.HDR10.DDP5.1.Atmos.H.265-GROUP
```

But a technically “better” release is not always the better choice for **your** setup.

- Can your player decode AV1?
- Does your display actually support Dolby Vision?
- Is TrueHD useful on your current audio path?
- Will a large remux overwhelm your network?
- Is a 4K file worth choosing over a more compatible 1080p release?

CodecFit turns that metadata into a **setup-specific answer** instead of blindly ranking everything by resolution or file size.

---

## 🚀 Two ways to analyze media

<table>
<tr>
<td width="50%" valign="top">

### 🎬 Release names

Paste up to **20 release names** and compare them side by side.

CodecFit detects:

- resolution and source;
- video codec;
- HDR formats;
- audio codec / Atmos / channels;
- bitrate and size hints;
- release-group hints.

Best when you are choosing between several releases.

</td>
<td width="50%" valign="top">

### 📋 MediaInfo

Paste a **MediaInfo text report** or import a saved `.txt` / `.nfo` report.

CodecFit reads the first video and audio tracks and extracts more reliable technical metadata than a filename alone, including reported bitrate, dimensions, HDR, codecs and channel count.

The report is read **locally in your browser**.

</td>
</tr>
</table>

---

## 🧠 What CodecFit scores

Every result gets separate scores instead of one unexplained magic number.

| Score | What it means |
|---|---|
| **Compatibility** | Resolution, video codec, HDR and audio support against your selected profile |
| **Quality** | Resolution, source quality and HDR signal |
| **Bandwidth** | Reported or estimated bitrate vs your available network headroom |
| **Fit** | Final setup-aware recommendation using compatibility + quality + bandwidth + your quality preference |

Hard compatibility mismatches can cap the final score even when the source itself is excellent.

```text
release / MediaInfo
        │
        ▼
 normalize metadata
        │
        ▼
 device capabilities ─── bandwidth ─── quality preference
        │                    │                │
        └──────────────┬─────┴────────────────┘
                       ▼
                 CodecFit score
                       │
             reasons + warnings
```

---

## 📺 Device profiles

CodecFit includes editable generic profiles plus several **conservative named-device starting points**:

| Profile | Useful signals included |
|---|---|
| **Fire TV Stick 4K Max (2nd Gen)** | 4K, HEVC, AV1, VP9, Dolby Vision, HDR10+, HDR10, HLG, common Dolby/DTS audio paths |
| **Apple TV 4K** | AVC/HEVC, 4K60, Dolby Vision, HDR10+, HDR10, HLG, AC-3/E-AC-3/Atmos |
| **NVIDIA Shield TV Pro (2019)** | HEVC/AVC/VP9, Dolby Vision/HDR10, TrueHD/DTS-HD/DTS:X passthrough-oriented profile |
| **Modern 4K setup** | Generic balanced starter profile |
| **1080p compatibility-first** | Conservative older/simple playback chain |
| **Desktop software player** | Broad software-decoding baseline |

> **A preset is not a certification.** Player apps, firmware, containers, Dolby Vision profiles, HDMI/eARC, receivers/soundbars and passthrough settings can change real playback behavior. Every profile can be edited in the Advanced compatibility panel.

### Profile sources

The named presets are intentionally conservative and based on manufacturer documentation:

- [Amazon Fire TV device specifications](https://developer.amazon.com/docs/device-specs/device-specifications-fire-tv-streaming-media-player.html)
- [Apple TV 4K technical specifications](https://www.apple.com/apple-tv-4k/specs/)
- [NVIDIA Shield TV Pro specifications](https://www.nvidia.com/shield/shield-tv-pro/)

---

## 🏷 Supported release metadata

| Area | Examples |
|---|---|
| Resolution | `2160p`, `1080p`, `720p`, `4K`, `UHD` |
| Source | `REMUX`, `BluRay`, `WEB-DL`, `WEBRip`, `HDTV`, `DVD` |
| Video | `AV1`, `HEVC/H.265/x265`, `AVC/H.264/x264`, `VP9`, `MPEG-2` |
| HDR | `Dolby Vision / DV / DoVi`, `HDR10+`, `HDR10`, `HLG` |
| Audio | `TrueHD`, `DTS-HD MA`, `DTS:X`, `E-AC-3/DDP`, `AC-3`, `AAC`, `FLAC`, `PCM`, `DTS` |
| Extras | Atmos, `5.1` / `7.1`, file-size and bitrate hints |

MediaInfo mode additionally reads values such as `Width`, `Height`, `Bit rate`, `File size`, `Format`, `HDR format`, `Commercial name` and `Channel(s)`.

---

## 🔐 Privacy by design

CodecFit does not need an account or backend.

```text
Release names ─┐
               ├──> your browser ──> local parser/scoring engine
MediaInfo text ┘
```

- no media files are uploaded;
- imported MediaInfo text is read with the browser File API;
- no torrent/debrid account is accessed;
- no stream or copyrighted file is fetched;
- your selected setup is stored locally in browser storage.

That also makes CodecFit useful outside piracy-oriented release naming: Jellyfin/Plex libraries, personal Blu-ray backups, local media collections and general playback troubleshooting all use the same technical metadata.

---

## ⚠️ What CodecFit cannot know yet

Even MediaInfo does not make compatibility perfectly predictable. Real playback may also depend on:

- codec profile and level;
- container support;
- Dolby Vision profile / enhancement layer / fallback behavior;
- subtitle format and subtitle-triggered transcoding;
- player-specific decoders;
- firmware and OS versions;
- HDMI/eARC capabilities;
- audio passthrough configuration;
- server-side transcoding.

CodecFit is a **decision helper**, not a hardware certification database.

---

## 🛠 Run locally

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

Every push to `main` is checked by GitHub Actions with parser tests and a production TypeScript/Vite build.

---

## 🗂 Project structure

```text
src/
├─ data/
│  └─ devices.ts          # generic + named capability profiles
├─ lib/
│  ├─ parser.ts           # release-name parser
│  ├─ mediainfo.ts        # MediaInfo text parser
│  ├─ scoring.ts          # compatibility / quality / bandwidth engine
│  └─ storage.ts          # local browser preferences
├─ App.tsx                # analyzer UI + profile editor + ranked results
├─ styles.css             # base responsive dark interface
├─ v2.css                 # MediaInfo / V2 controls
└─ types.ts               # shared domain types
```

---

## 🗺 Roadmap

- [x] Release-name parser
- [x] Multiple-release comparison
- [x] Compatibility / quality / bandwidth scores
- [x] Editable playback capability profiles
- [x] Responsive client-side UI
- [x] Local preference persistence
- [x] Parser/scoring CI tests
- [x] MediaInfo paste + text-report import
- [x] Conservative named-device presets
- [x] GitHub Pages live deployment
- [ ] Container compatibility
- [ ] Subtitle compatibility
- [ ] Multiple MediaInfo audio/video track selection
- [ ] Shareable comparison links
- [ ] Community-maintained sourced device profiles
- [ ] PWA / installable app
- [ ] Jellyfin helper mode
- [ ] Stremio-oriented export/integration experiments

---

## 🤝 Contributing

Useful contributions include:

- weird release-name fixtures;
- MediaInfo reports that expose parser edge cases;
- sourced device-profile corrections;
- better transparent scoring rules;
- accessibility/mobile improvements;
- container/subtitle compatibility research.

When changing a named device profile, link to reliable manufacturer documentation and keep the capability set conservative rather than inferring support from marketing wording.

---

<div align="center">

### Useful?

⭐ Star the repo and help test the strange release names that break parsers.

**CodecFit is a real media utility — not another static guide.**

</div>
