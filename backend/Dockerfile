FROM python:3.12-slim

WORKDIR /app

# 依存パッケージをインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# アプリコードをコピー
COPY . .

# データディレクトリを確保
RUN mkdir -p /app/data

EXPOSE 8000

# 本番起動コマンド
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
