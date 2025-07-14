# PowerShell script to set environment variables
Write-Host "Setting environment variables..." -ForegroundColor Green

# Set Twilio Message Service SID
$env:TWILIO_MESSAGE_SERVICE_SID = "MG832b97d7aabfa91543e7e9f7fa6a9ca0"
$env:medo_TWILIO_MESSAGE_SERVICE_SID = "MG832b97d7aabfa91543e7e9f7fa6a9ca0"

Write-Host "✅ TWILIO_MESSAGE_SERVICE_SID set to: $env:TWILIO_MESSAGE_SERVICE_SID" -ForegroundColor Green
Write-Host "✅ medo_TWILIO_MESSAGE_SERVICE_SID set to: $env:medo_TWILIO_MESSAGE_SERVICE_SID" -ForegroundColor Green

Write-Host "Environment variables set successfully!" -ForegroundColor Green 