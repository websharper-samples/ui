# restores NuGet packages
rm -r packages -errorAction ignore
set-alias nuget tools/NuGet/NuGet.exe
nuget sources add -name premium -source http://premium.websharper.com/nuget -userName appveyor@intellifactory.com -password $env:NG_TOKEN -configFile NuGet.config -nonInteractive
nuget restore -configFile NuGet.config -nonInteractive
