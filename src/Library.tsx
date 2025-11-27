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
    <div style={{ height: "100vh", overflow: "auto", backgroundColor: "#0f0f0f" }}>
      <div
        style={{
          padding: "30px 40px",
          borderBottom: "1px solid #2a2a2a",
          background: "linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: "1.8em", fontWeight: 600, letterSpacing: "-0.02em" }}>📚 ライブラリ</h2>
          <button 
            onClick={() => setShowAddDialog(true)}
            style={{
              padding: "12px 24px",
              fontSize: "0.95em",
              fontWeight: 500,
              backgroundColor: "#3b82f6",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#2563eb";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#3b82f6";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(59, 130, 246, 0.3)";
            }}
          >
            + 書籍を追加
          </button>
        </div>
      </div>
      <div style={{ padding: "30px 40px" }}>

      {/* 書籍追加ダイアログ */}
      {showAddDialog && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowAddDialog(false)}
        >
          <div
            style={{
              backgroundColor: "#2a2a2a",
              padding: "30px",
              borderRadius: "8px",
              minWidth: "400px",
              maxWidth: "500px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: "20px" }}>書籍を追加</h3>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                タイトル *
              </label>
              <input
                type="text"
                value={newBook.title}
                onChange={(e) =>
                  setNewBook({ ...newBook, title: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #444",
                  borderRadius: "4px",
                  color: "#fff",
                }}
                placeholder="例: Rustプログラミング入門"
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                著者
              </label>
              <input
                type="text"
                value={newBook.author}
                onChange={(e) =>
                  setNewBook({ ...newBook, author: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #444",
                  borderRadius: "4px",
                  color: "#fff",
                }}
                placeholder="例: 山田太郎"
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
          padding: "60px 20px",
          color: "#666",
        }}>
          <div style={{ fontSize: "3em", marginBottom: "20px", opacity: 0.5 }}>📖</div>
          <p style={{ fontSize: "1.1em", marginBottom: "8px" }}>書籍がまだありません</p>
          <p style={{ fontSize: "0.9em", color: "#555" }}>「+ 書籍を追加」ボタンから追加してください</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {books.map((book) => (
            <div
              key={book.id}
              style={{
                background: "linear-gradient(135deg, #1a1a1a 0%, #161616 100%)",
                border: "1px solid #2a2a2a",
                borderRadius: "12px",
                padding: "20px",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                overflow: "hidden",
              }}
              onClick={() => onSelectBook(book)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "#3b82f6";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "#2a2a2a";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "100px",
                height: "100px",
                background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
                pointerEvents: "none",
              }} />
              <h3 style={{ 
                fontSize: "1.2em", 
                marginBottom: "12px",
                fontWeight: 600,
                lineHeight: 1.3,
                color: "#e5e5e5",
              }}>
                {book.title}
              </h3>
              {book.author && (
                <p style={{ 
                  color: "#888", 
                  fontSize: "0.9em",
                  marginBottom: "8px",
                }}>
                  👤 {book.author}
                </p>
              )}
              <p style={{ 
                color: "#666", 
                fontSize: "0.85em", 
                marginTop: "8px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}>
                📄 {book.total_pages > 0 ? `${book.total_pages}ページ` : "ページ数不明"}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteBook(book.id!);
                }}
                style={{
                  marginTop: "16px",
                  padding: "8px 16px",
                  backgroundColor: "transparent",
                  border: "1px solid #ef4444",
                  color: "#ef4444",
                  fontSize: "0.85em",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  width: "100%",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#ef4444";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#ef4444";
                }}
              >
                🗑️ 削除
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
