@echo off
set /p version=Enter version:
dotnet pack ..\src\SvgIconPropertyEditor\SvgIconPropertyEditor.csproj --configuration Release /p:Version=%version% --output ..\releases\nuget\
dotnet pack ..\src\SvgIconPropertyEditor.Core\SvgIconPropertyEditor.Core.csproj --configuration Release /p:Version=%version% --output ..\releases\nuget\