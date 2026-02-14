@echo off
echo ====================================
echo  配当管理アプリ 起動スクリプト
echo ====================================
echo.
echo [1] バックエンド (FastAPI) を起動中...
start "FastAPI Backend" cmd /k "cd /d %~dp0backend && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

echo [2] フロントエンド (Next.js) を起動中...
timeout /t 2 /nobreak > nul
start "Next.js Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ====================================
echo  起動完了！
echo  フロントエンド: http://localhost:3000
echo  バックエンドAPI: http://localhost:8000
echo  API ドキュメント: http://localhost:8000/docs
echo ====================================
echo.
pause
