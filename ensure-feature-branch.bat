@echo off
echo Checking current branch...
git branch --show-current

echo.
echo Current branch: 
git branch --show-current

if "%1"=="check" goto :check
if "%1"=="switch" goto :switch

:check
echo.
echo Ensuring we're on feature/automation branch...
git checkout feature/automation
echo ✓ Switched to feature/automation branch
goto :end

:switch
echo.
echo Switching to feature/automation branch...
git checkout feature/automation
echo ✓ Now on feature/automation branch
goto :end

:end
echo.
echo Current branch: 
git branch --show-current
echo.
echo Safe for automation! 🚀
