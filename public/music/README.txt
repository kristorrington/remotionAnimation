Background music for the videos.

Drop your (royalty-free / licensed) tracks in this folder, e.g.:
  public/music/calm.mp3
  public/music/tension.mp3
  public/music/outro.mp3

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
