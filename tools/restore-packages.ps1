# restores NuGet packages
rm -r packages -errorAction ignore
set-alias nuget tools/NuGet/NuGet.exe
nuget restore -configFile NuGet.config -nonInteractive
