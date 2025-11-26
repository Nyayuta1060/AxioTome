// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod database;
mod commands;

use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            // データベース初期化
            let app_handle = app.handle();
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
        ])
        .run(tauri::generate_context!())
        .expect("Tauriアプリケーション起動エラー");
}
