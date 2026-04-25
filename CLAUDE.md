# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## あなたの役割

- コードの「整理・提案・下書き」を担当します
- 最終的な採否は人間（開発者）が判断します
- 要件が曖昧なときは、実装に入る前に必ず確認してください
- スコープ外のファイル変更は行いません

## プロジェクト概要

**habicat** — 習慣トラッキングアプリ。毎日のスタンプ（チェックイン）で継続日数（streak）を管理する。

- フロントエンド: React Native (Expo) + TypeScript
- バックエンド: FastAPI (Python) + MySQL (Docker)

## コマンド

### フロントエンド（`habicat/` ディレクトリ）

```bash
cd habicat
npm ci          # 依存パッケージのインストール
npx expo start  # 開発サーバー起動
```

起動後：`i` キーで iOS シミュレータ、`a` キーで Android エミュレータを起動。

### バックエンド（`habicat/backend/` ディレクトリ）

```bash
cd habicat/backend
docker-compose up -d    # MySQL + FastAPI コンテナ起動
docker-compose down     # コンテナ停止
docker-compose logs -f  # ログ確認
```

- Swagger UI: http://localhost:8000/docs
- OpenAPI JSON: http://localhost:8000/openapi.json

### MySQL に直接接続

```bash
docker exec -it mysql_db mysql -u appuser -papppass appdb
```

## アーキテクチャ

### バックエンド構成

```
habicat/backend/
├── main.py          # FastAPI エンドポイント定義
├── db/
│   ├── database.py  # SQLAlchemy エンジン・セッション設定（DATABASE_URL 環境変数必須）
│   ├── models.py    # ORM モデル定義
│   └── init.sql     # MySQL 初期化 SQL（コンテナ初回起動時のみ実行）
├── Dockerfile
└── docker-compose.yml
```

`DATABASE_URL` は `docker-compose.yml` で `mysql+pymysql://appuser:apppass@db:3306/appdb` として注入される。`main.py` の `startup` イベントで MySQL の起動待ちリトライ（3 秒 ×10 回）を行ってからテーブルを自動生成する。

### データモデル

- **menus**: トレーニングメニュー（mode: `"light"` / `"normal"` / `"hard"`）
- **users**: ユーザー。`streak_days`（継続日数）と `last_stamped_date`（最終スタンプ日）を持ち、`menu_id` で menus に紐づく
- **reports**: 日別トレーニング記録（`is_submit` フラグで提出済みかを管理）

### フロントエンド構成

現在 `App.tsx` のみのシンプルな状態。エントリーポイントは `index.ts` → `App.tsx`。
