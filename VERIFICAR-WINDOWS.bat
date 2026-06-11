@echo off
cd /d "%~dp0"
echo ============================================
echo   VERIFICANDO REPUESTOHOY - espera...
echo ============================================
call npm install --silent
call npm run build
if %errorlevel%==0 (
  echo.
  echo   TODO BIEN - seguro para subir a GitHub
) else (
  echo.
  echo   HAY UN ERROR - NO subas todavia.
  echo   Toma foto del error y enviasela a Claude.
)
pause
