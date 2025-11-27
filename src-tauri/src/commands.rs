use serde::{Deserialize, Serialize};
use tauri::State;
use crate::database::DatabaseState;

#[derive(Debug, Serialize, Deserialize)]
pub struct Book {
    pub id: Option<i64>,
    pub title: String,
    pub author: Option<String>,
    pub file_path: String,
    pub added_date: Option<String>,
    pub last_read: Option<String>,
    pub current_page: i32,
    pub total_pages: i32,
}

#[tauri::command]
pub fn add_book(
    title: String,
    author: Option<String>,
    file_path: String,
    total_pages: Option<i32>,
    state: State<DatabaseState>,
) -> Result<i64, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    
    let pages = total_pages.unwrap_or(0);
    
    // 秒単位のタイムスタンプベースのIDを生成（INT32の範囲内）
    let id = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs() as i64;
    
    // IDを含めてINSERT
    use duckdb::params;
    conn.execute(
        "INSERT INTO books (id, title, author, file_path, total_pages) VALUES (?, ?, ?, ?, ?)",
        params![id, title, author.unwrap_or_default(), file_path, pages],
    )
    .map_err(|e| format!("書籍追加エラー: {}", e))?;
    
    println!("書籍を追加しました: id={}, title={}", id, title);
    
    Ok(id)
}

#[tauri::command]
pub fn get_books(state: State<DatabaseState>) -> Result<Vec<Book>, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    
    let mut stmt = conn
        .prepare("SELECT id, title, author, file_path, added_date, last_read, current_page, total_pages FROM books ORDER BY added_date DESC")
        .map_err(|e| e.to_string())?;
    
    let books = stmt
        .query_map([], |row| {
            Ok(Book {
                id: row.get(0)?,
                title: row.get(1)?,
                author: row.get(2)?,
                file_path: row.get(3)?,
                added_date: row.get(4)?,
                last_read: row.get(5)?,
                current_page: row.get(6)?,
                total_pages: row.get(7)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;
    
    Ok(books)
}

#[tauri::command]
pub fn delete_book(id: i64, state: State<DatabaseState>) -> Result<(), String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    
    use duckdb::params;
    conn.execute("DELETE FROM books WHERE id = ?", params![id])
        .map_err(|e| e.to_string())?;
    
    Ok(())
}

#[tauri::command]
pub async fn select_pdf_file() -> Result<Option<String>, String> {
    // ファイル選択ダイアログを表示（後で実装）
    Ok(None)
}

#[tauri::command]
pub fn get_pdf_page_count(_file_path: String) -> Result<i32, String> {
    // PDF解析してページ数を取得(後で実装)
    // 簡略化のため固定値を返す
    Ok(100)
}

#[tauri::command]
pub fn search_books(
    query: String,
    ai_state: State<crate::ai_engine::AIState>,
) -> Result<Vec<crate::ai_engine::SearchResult>, String> {
    let ai = ai_state.engine.lock().map_err(|e| e.to_string())?;
    
    // テストデータ（実際にはデータベースからPDFのテキストを取得）
    let books_content = vec![
        "Rustは安全性とパフォーマンスを両立したシステムプログラミング言語です。".to_string(),
        "所有権システムによりメモリ安全性を保証します。".to_string(),
    ];
    
    ai.search_in_books(&query, books_content)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn ask_ai(
    question: String,
    context: String,
    ai_state: State<crate::ai_engine::AIState>,
) -> Result<String, String> {
    let ai = ai_state.engine.lock().map_err(|e| e.to_string())?;
    
    ai.answer_question(&question, &context)
        .map_err(|e| e.to_string())
}
