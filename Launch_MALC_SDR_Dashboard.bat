@echo off
title MALC Single-Dose Rifampicin (SDR) Workshop Dashboard Launcher
echo =========================================================================
echo    MARIE ADELAIDE LEPROSY CENTRE (MALC)
echo    SDR-PEP Acceptability & Implementation Intelligence Dashboard
echo    From Challenges to Solutions: Sindh Workshop
echo =========================================================================
echo.
echo Launching Interactive Dashboard in your default browser...
start "" "%~dp0index.html"
echo Dashboard launched successfully!
timeout /t 3 >nul
exit

