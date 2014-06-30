@echo off
setlocal
set PATH=%PATH%;%ProgramFiles(x86)%\MSBuild\12.0\Bin
powershell tools/restore-packages.ps1
MSBuild.exe /p:Configuration=Release /verbosity:minimal
