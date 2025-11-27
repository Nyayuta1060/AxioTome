# AxioTome

AI 搭載技術書 PDF ライブラリ・読書支援デスクトップアプリケーション

## 概要

AxioTome は、技術書の PDF を管理し、AI 技術を活用した読書支援機能を提供するデスクトップアプリケーションです。

## 主な機能

### ✅ 実装済み

- **📚 書籍ライブラリ管理**

  - PDF ファイルの登録・一覧表示・削除
  - メタデータ管理（タイトル、著者、ページ数等）
  - DuckDB による高速なデータベース管理

- **📖 PDF ビューア**

  - シンプルな PDF 閲覧インターフェース
  - ページナビゲーション機能
  - 読書進捗の保存

- **🤖 AI アシスタント（基本機能）**
  - 複数の書籍から横断検索
  - AI による質問応答（基礎実装）

### 🚧 開発予定

- **PDF 表示の完全実装**

  - 実際の PDF レンダリング
  - テキスト選択・コピー機能
  - しおり・ハイライト機能

- **高度な AI 機能（Candle 統合）**
  - ベクトル検索による意味的検索
  - 大規模言語モデルによる高度な質問応答
  - 読書ノートの自動生成
  - 要約生成機能

## 技術スタック

### フロントエンド

- **Tauri 2.0**: デスクトップアプリケーションフレームワーク
- **React 18**: UI フレームワーク
- **TypeScript**: 型安全な開発
- **Vite**: 高速なビルドツール

### バックエンド (Rust)

- **DuckDB**: 高速な組み込みデータベース
- **Candle**: Rust 製機械学習フレームワーク（統合予定）
- **pdf-extract**: PDF テキスト抽出

## セットアップ

### 前提条件

- Node.js 18 以上
- Rust 1.70 以上
- npm または pnpm

### Linux 環境でのセットアップ

```bash
# システム依存ライブラリのインストール (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install -y libwebkit2gtk-4.1-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run tauri:dev

# リリースビルド
npm run tauri:build
```

### Windows 環境でのセットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run tauri:dev
```

## プロジェクト構造

```
AxioTome/
├── src/                    # Reactフロントエンド
│   ├── App.tsx            # メインアプリケーション
│   ├── Library.tsx        # 書籍ライブラリUI
│   ├── PDFViewer.tsx      # PDFビューア
│   ├── AIAssistant.tsx    # AIアシスタントUI
│   ├── api.ts             # Tauri APIラッパー
│   └── types.ts           # TypeScript型定義
├── src-tauri/             # Rustバックエンド
│   ├── src/
│   │   ├── main.rs        # エントリーポイント
│   │   ├── database.rs    # DuckDB管理
│   │   ├── commands.rs    # Tauriコマンド
│   │   └── ai_engine.rs   # AI機能
│   └── Cargo.toml         # Rust依存関係
└── package.json           # Node.js依存関係
```

## 使い方

1. **アプリケーションを起動**: `npm run tauri:dev`
2. **書籍を追加**: ライブラリ画面で「書籍を追加」ボタンをクリック
3. **PDF 閲覧**: 追加した書籍をクリックして閲覧
4. **AI 検索**: AI アシスタントタブで横断検索や質問を実行

## 開発ロードマップ

1. ✅ プロジェクト基盤構築
2. ✅ 基本 UI 実装
3. ✅ データベース統合 (DuckDB)
4. ✅ AI 機能の骨組み
5. 🔄 PDF レンダリングの完全実装
6. 🔄 Candle による高度な AI 機能
7. ⏳ ベクトル検索・埋め込み機能
8. ⏳ ユーザー設定・カスタマイズ

## トラブルシューティング

### ビルドエラー: GTK 関連のライブラリが見つからない

Linux 環境でビルドする場合、以下のパッケージが必要です:

```bash
sudo apt-get install libwebkit2gtk-4.1-dev libgtk-3-dev \
    libayatana-appindicator3-dev librsvg2-dev
```

### データベースファイルの場所

アプリケーションデータは以下に保存されます:

- Linux: `~/.local/share/com.axiotome.app/`
- Windows: `%APPDATA%\com.axiotome.app\`

## ライセンス

MIT

## 貢献

プルリクエスト、Issue 報告を歓迎します。
