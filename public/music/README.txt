Background music for the videos.

Find royalty free music for the specific scene/atmosphere you want.

CURRENT BEDS (Mixkit Free License — royalty-free, commercial + YouTube OK,
NO attribution required; NOT for TV/radio broadcast, CDs/DVDs or video games).
Source: https://mixkit.co/license/ · downloaded 2026-08-25, normalised to -16 LUFS.
  tension.MP3  = "Kodama Night Town" (Electronic, 3:05)  — MAIN / hero bed
                 https://mixkit.co/free-stock-music/  id 114
  calm.MP3     = "Focus on Yourself" (Electronica, 4:46) — CAVEAT / underscore
                 id 568
  outro.MP3    = "Voxscape" (Ambient, 5:00)              — resolve/outro
                 id 571
  Shortlisted alternates (swap in if you want a different feel): Moon Walk (609),
  Deep Techno Ambience (134), Minimal Emotion (160), Feedback Dreams (588),
  Sonor #2 (570), Opalescent (593) — all Mixkit, same licence.

mp3, wav, m4a all work. Keep them local (here) so Studio + render work offline.

To use one, reference it with staticFile() and the MusicBed component:

  import { staticFile } from "remotion";
  import { MusicBed } from "./components/MusicBed";

  <MusicBed
    src={staticFile("music/calm.mp3")}
    from={0}                 // start frame
    durationInFrames={7026}  // how long this bed plays
    volume={0.13}            // soft, sits under narration
    fadeInFrames={30}
    fadeOutFrames={60}
    loop                     // repeat a short track to fill the section
  />

A paste-ready 3-bed setup for Fable5Video is in src/Fable5Video.tsx
(commented "BACKGROUND MUSIC" block) — just add the files and uncomment.
