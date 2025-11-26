use anyhow::Result;
use duckdb::{Connection, params};
use std::sync::Mutex;
use tauri::{AppHandle, Manager};

pub struct DatabaseState {
    pub conn: Mutex<Connection>,
}

pub async fn init_database(app_handle: &AppHandle) -> Result<()> {
    let app_dir = app_handle
        .path()
        .app_data_dir()
        .expect("アプリケーションデータディレクトリの取得失敗");
    
    std::fs::create_dir_all(&app_dir)?;
    let db_path = app_dir.join("axiotome.db");
    
    let conn = Connection::open(&db_path)?;
    
    // 書籍テーブル作成
    conn.execute(
        "CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY,
            title TEXT NOT NULL,
            author TEXT,
            file_path TEXT NOT NULL,
            added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_read TIMESTAMP,
            current_page INTEGER DEFAULT 0,
            total_pages INTEGER DEFAULT 0
        )",
        [],
    )?;
    
    app_handle.manage(DatabaseState {
        conn: Mutex::new(conn),
    });
    
    Ok(())
}
