@echo off
npx tsc --noEmit
npx eslint . --ext .ts,.tsx
pause 