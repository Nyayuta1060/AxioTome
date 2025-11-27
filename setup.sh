#!/bin/bash
# AxioTome セットアップスクリプト (Linux)

echo "🚀 AxioTome セットアップを開始します..."

# システム依存ライブラリのチェックとインストール
echo "📦 システムライブラリを確認中..."

if command -v apt-get &> /dev/null; then
    echo "✓ apt-get が見つかりました"
    
    # 必要なパッケージのチェック
    PACKAGES=(
        "libwebkit2gtk-4.1-dev"
        "libgtk-3-dev"
        "libayatana-appindicator3-dev"
        "librsvg2-dev"
    )
    
    MISSING_PACKAGES=()
    for pkg in "${PACKAGES[@]}"; do
        if ! dpkg -l | grep -q "^ii.*$pkg"; then
            MISSING_PACKAGES+=("$pkg")
        fi
    done
    
    if [ ${#MISSING_PACKAGES[@]} -gt 0 ]; then
        echo "⚠️  以下のパッケージが不足しています: ${MISSING_PACKAGES[*]}"
        echo "インストールを実行しますか? (y/n)"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            sudo apt-get update
            sudo apt-get install -y "${MISSING_PACKAGES[@]}"
        else
            echo "❌ 必要なパッケージがインストールされていません。手動でインストールしてください。"
            exit 1
        fi
    else
        echo "✓ 全てのシステムライブラリがインストールされています"
    fi
else
    echo "⚠️  このスクリプトは Ubuntu/Debian 系ディストリビューション用です"
    echo "他のディストリビューションでは手動でライブラリをインストールしてください"
fi

# Node.js 依存関係のインストール
echo ""
echo "📦 Node.js 依存関係をインストール中..."
npm install

# Rust 依存関係の確認
echo ""
echo "🦀 Rust 環境を確認中..."
if command -v cargo &> /dev/null; then
    echo "✓ Rust がインストールされています"
    cd src-tauri && cargo check && cd ..
else
    echo "❌ Rust がインストールされていません"
    echo "https://rustup.rs/ からインストールしてください"
    exit 1
fi

echo ""
echo "✅ セットアップが完了しました!"
echo ""
echo "次のステップ:"
echo "  開発サーバーを起動: npm run tauri:dev"
echo "  リリースビルド: npm run tauri:build"
