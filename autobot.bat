@echo off 
git pull
git add .
set /p "cm=Enter Commit Message: "
git commit -m "%cm%"
git push