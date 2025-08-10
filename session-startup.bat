@echo off
echo 🚀 Starting new automation session...
echo.

echo 📋 Checking current branch...
git branch --show-current

echo.
echo 🔄 Ensuring we're on feature/automation branch...
git checkout feature/automation

echo.
echo ✅ Current branch: 
git branch --show-current

echo.
echo 🛡️ Safety check - main branch is protected
echo 📁 Working directory: %CD%
echo 🔧 Ready for automation!

echo.
echo 💡 Remember: All changes are on feature/automation branch
echo 💡 Remember: main branch is protected
echo 💡 Remember: Safe to run commands here
