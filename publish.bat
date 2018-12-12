@echo off
echo %~dp0
cd %~dp0
node publish.js
npm publish