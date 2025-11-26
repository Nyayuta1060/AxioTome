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
    total_pages: i32,
    state: State<DatabaseState>,
) -> Result<i64, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    
    conn.execute(
        "INSERT INTO books (title, author, file_path, total_pages) VALUES (?, ?, ?, ?)",
        &[&title, &author.unwrap_or_default(), &file_path, &total_pages.to_string()],
    )
    .map_err(|e| e.to_string())?;
    
    let id = conn.last_insert_rowid();
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
    
    conn.execute("DELETE FROM books WHERE id = ?", &[&id.to_string()])
        .map_err(|e| e.to_string())?;
    
    Ok(())
}
