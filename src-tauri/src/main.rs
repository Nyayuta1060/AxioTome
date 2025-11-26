// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod database;
mod commands;
mod ai_engine;

use tauri::Manager;
use ai_engine::{AIEngine, AIState};

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        // .plugin(tauri_plugin_dialog::init())  // 一旦コメントアウト
        .setup(|app| {
            // AI エンジン初期化
            let ai_engine = AIEngine::new();
            app.manage(AIState {
                engine: std::sync::Mutex::new(ai_engine),
            });
            
            // データベース初期化
            let app_handle = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                if let Err(e) = database::init_database(&app_handle).await {
                    eprintln!("データベース初期化エラー: {:?}", e);
                }
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::add_book,
            commands::get_books,
            commands::delete_book,
            commands::select_pdf_file,
            commands::get_pdf_page_count,
            commands::search_books,
            commands::ask_ai,
        ])
        .run(tauri::generate_context!())
        .expect("Tauriアプリケーション起動エラー");
}
