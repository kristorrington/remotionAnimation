@echo off
REM TikTok app-review DEMO — choreographed terminal for the screen recording.
REM Launch from repo root:  scripts\social\demo.cmd
REM Runs: auth (masked token) -> queue list -> real inbox dispatch -> status.
cd /d "%~dp0..\.."
title TikTok Content Posting API - integration demo
echo =============================================================
echo  TikTok Content Posting API demo - Kris Torrington Publisher
echo =============================================================
echo.
echo [1/4] Authorize my own TikTok account (Login Kit, desktop PKCE)
echo   $ node scripts/social/auth-tiktok.mjs
echo.
node scripts\social\auth-tiktok.mjs --mask
echo.
%SystemRoot%System32	imeout.exe /t 4 /nobreak >nul
echo [2/4] The publishing queue (my own rendered videos + captions)
echo   $ node scripts/social/social.mjs list
echo.
node scripts\social\social.mjs list
echo.
%SystemRoot%System32	imeout.exe /t 6 /nobreak >nul
echo [3/4] Upload one video to MY OWN account's inbox (video.upload)
echo   $ node scripts/social/social.mjs dispatch --platform tiktok --id Short-DeepSeekCost --go
echo.
node scripts\social\social.mjs dispatch --platform tiktok --id Short-DeepSeekCost --go
echo.
%SystemRoot%System32	imeout.exe /t 4 /nobreak >nul
echo [4/4] Publish status straight from the TikTok API
echo   $ node scripts/social/tiktok-status.mjs
echo.
node scripts\social\tiktok-status.mjs
echo.
echo Demo complete - the video is now in my TikTok app inbox to review + post.
pause
