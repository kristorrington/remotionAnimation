# Registers a Windows Task Scheduler job that runs the social dispatcher every
# hour, so time-due posts (Instagram now; TikTok Direct Post after approval)
# fire automatically with the PC on — no manual dispatch. YouTube doesn't need
# this (native publishAt). Run ONCE from an elevated or normal PowerShell:
#   powershell -ExecutionPolicy Bypass -File scripts\social\setup-dispatch-task.ps1
# Remove with:  Unregister-ScheduledTask -TaskName "SocialDispatch" -Confirm:$false

$repo = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$node = (Get-Command node).Source
$log = Join-Path $repo "out\social-dispatch.log"

$action = New-ScheduledTaskAction -Execute $node `
  -Argument "scripts\social\social.mjs dispatch --go" `
  -WorkingDirectory $repo

$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(2) `
  -RepetitionInterval (New-TimeSpan -Hours 1)

$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable `
  -DontStopOnIdleEnd -ExecutionTimeLimit (New-TimeSpan -Minutes 30)

Register-ScheduledTask -TaskName "SocialDispatch" -Action $action `
  -Trigger $trigger -Settings $settings -Description `
  "Hourly social dispatcher: posts time-due entries from social-queue.json (IG now, TikTok after Direct Post approval). Logs: $log" -Force

Write-Host "Registered task 'SocialDispatch' - runs hourly, starts in 2 minutes."
Write-Host "It executes: node scripts\social\social.mjs dispatch --go (in $repo)"
Write-Host "Only APPROVED, time-due entries fire; YouTube is untouched (native scheduling)."
