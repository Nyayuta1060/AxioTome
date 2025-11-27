import { useState, useEffect } from "react";
import { Book } from "./types";
import { getBooks, addBook, deleteBook } from "./api";

interface LibraryProps {
  onSelectBook: (book: Book) => void;
}

function Library({ onSelectBook }: LibraryProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    filePath: "",
    totalPages: 0,
  });

  useEffect(() => {
    loadBooks();
  }, []);

  async function loadBooks() {
    try {
      console.log("書籍一覧を読み込み中...");
      const result = await getBooks();
      console.log("取得した書籍:", result);
      setBooks(result);
      console.log("状態を更新しました。書籍数:", result.length);
    } catch (error) {
      console.error("書籍の読み込みエラー:", error);
      alert("書籍の読み込みに失敗しました: " + error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddBook() {
    if (!newBook.title || !newBook.filePath) {
      alert("タイトルとファイルパスを入力してください");
      return;
    }

    try {
      const id = await addBook(
        newBook.title,
        newBook.author || null,
        newBook.filePath,
        newBook.totalPages > 0 ? newBook.totalPages : undefined
      );
      console.log("書籍を追加しました。ID:", id);
      
      setShowAddDialog(false);
      setNewBook({ title: "", author: "", filePath: "", totalPages: 0 });
      
      // 少し待ってからリロード
      setTimeout(async () => {
        await loadBooks();
        console.log("書籍一覧を再読み込みしました");
      }, 100);
    } catch (error) {
      console.error("書籍の追加エラー:", error);
      alert("書籍の追加に失敗しました: " + error);
    }
  }

  async function handleDeleteBook(id: number) {
    if (confirm("この本を削除しますか?")) {
      try {
        await deleteBook(id);
        await loadBooks();
      } catch (error) {
        console.error("書籍の削除エラー:", error);
      }
    }
  }

  if (loading) {
    return <div style={{ padding: "20px" }}>読み込み中...</div>;
  }

  return (
    <div style={{ height: "100vh", overflow: "auto", backgroundColor: "#0d1117" }}>
      <div
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid #21262d",
          backgroundColor: "#0d1117",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ 
            margin: 0, 
            fontSize: "1.25em", 
            fontWeight: 600, 
            color: "#c9d1d9",
            letterSpacing: "-0.3px",
          }}>
            Books
          </h2>
          <button 
            onClick={() => setShowAddDialog(true)}
            style={{
              padding: "8px 16px",
              fontSize: "0.875em",
              fontWeight: 500,
              backgroundColor: "#238636",
              color: "#ffffff",
              border: "1px solid rgba(240, 246, 252, 0.1)",
              borderRadius: "6px",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#2ea043";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#238636";
            }}
          >
            New Book
          </button>
        </div>
      </div>
      <div style={{ padding: "24px" }}>

      {/* 書籍追加ダイアログ */}
      {showAddDialog && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(3px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowAddDialog(false)}
        >
          <div
            style={{
              backgroundColor: "#161b22",
              border: "1px solid #30363d",
              padding: "24px",
              borderRadius: "6px",
              minWidth: "400px",
              maxWidth: "480px",
              boxShadow: "0 16px 32px rgba(0, 0, 0, 0.7)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: "20px", fontSize: "1.1em", fontWeight: 600, color: "#c9d1d9" }}>Add New Book</h3>

            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "0.85em", color: "#8b949e" }}>
                Title *
              </label>
              <input
                type="text"
                value={newBook.title}
                onChange={(e) =>
                  setNewBook({ ...newBook, title: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  backgroundColor: "#0d1117",
                  border: "1px solid #30363d",
                  borderRadius: "6px",
                  color: "#c9d1d9",
                  fontSize: "0.9em",
                }}
                placeholder="Enter book title"
              />
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "0.85em", color: "#8b949e" }}>
                Author
              </label>
              <input
                type="text"
                value={newBook.author}
                onChange={(e) =>
                  setNewBook({ ...newBook, author: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  backgroundColor: "#0d1117",
                  border: "1px solid #30363d",
                  borderRadius: "6px",
                  color: "#c9d1d9",
                  fontSize: "0.9em",
                }}
                placeholder="Optional"
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                ファイルパス *
              </label>
              <input
                type="text"
                value={newBook.filePath}
                onChange={(e) =>
                  setNewBook({ ...newBook, filePath: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #444",
                  borderRadius: "4px",
                  color: "#fff",
                }}
                placeholder="例: /home/user/books/rust.pdf"
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                総ページ数 (任意)
              </label>
              <input
                type="number"
                value={newBook.totalPages || ""}
                onChange={(e) =>
                  setNewBook({
                    ...newBook,
                    totalPages: parseInt(e.target.value) || 0,
                  })
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #444",
                  borderRadius: "4px",
                  color: "#fff",
                }}
                placeholder="不明な場合は空欄"
              />
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowAddDialog(false)}
                style={{ backgroundColor: "#444" }}
              >
                キャンセル
              </button>
              <button onClick={handleAddBook} style={{ backgroundColor: "#646cff" }}>
                追加
              </button>
            </div>
          </div>
        </div>
      )}

      {books.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "80px 20px",
          color: "#8b949e",
        }}>
          <div style={{ fontSize: "2.5em", marginBottom: "16px", opacity: 0.4 }}>•••</div>
          <p style={{ fontSize: "0.95em", marginBottom: "6px", color: "#c9d1d9" }}>No books yet</p>
          <p style={{ fontSize: "0.85em", color: "#8b949e" }}>Click "New Book" to add your first book</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "16px",
          }}
        >
          {books.map((book) => (
            <div
              key={book.id}
              style={{
                backgroundColor: "#161b22",
                border: "1px solid #30363d",
                borderRadius: "6px",
                padding: "16px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onClick={() => onSelectBook(book)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#1c2128";
                e.currentTarget.style.borderColor = "#58a6ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#161b22";
                e.currentTarget.style.borderColor = "#30363d";
              }}
            >
              <h3 style={{ 
                fontSize: "1em", 
                marginBottom: "8px",
                fontWeight: 600,
                color: "#c9d1d9",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}>
                {book.title}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "12px" }}>
                {book.author && (
                  <p style={{ 
                    color: "#8b949e", 
                    fontSize: "0.85em",
                  }}>
                    by {book.author}
                  </p>
                )}
                <p style={{ 
                  color: "#8b949e", 
                  fontSize: "0.8em",
                }}>
                  {book.total_pages > 0 ? `${book.total_pages} pages` : "Unknown pages"}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteBook(book.id!);
                }}
                style={{
                  padding: "5px 12px",
                  backgroundColor: "transparent",
                  border: "1px solid #f85149",
                  color: "#f85149",
                  fontSize: "0.8em",
                  borderRadius: "6px",
                  cursor: "pointer",
                  width: "100%",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#da3633";
                  e.currentTarget.style.borderColor = "#da3633";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.borderColor = "#f85149";
                  e.currentTarget.style.color = "#f85149";
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

export default Library;
