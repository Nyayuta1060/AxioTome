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
    totalPages: 100,
  });

  useEffect(() => {
    loadBooks();
  }, []);

  async function loadBooks() {
    try {
      const result = await getBooks();
      setBooks(result);
    } catch (error) {
      console.error("書籍の読み込みエラー:", error);
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
      await addBook(
        newBook.title,
        newBook.author || null,
        newBook.filePath,
        newBook.totalPages
      );
      await loadBooks();
      setShowAddDialog(false);
      setNewBook({ title: "", author: "", filePath: "", totalPages: 100 });
      alert("書籍を追加しました!");
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
    <div style={{ padding: "20px", height: "100vh", overflow: "auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>ライブラリ</h2>
        <button onClick={() => setShowAddDialog(true)}>書籍を追加</button>
      </div>

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
                総ページ数
              </label>
              <input
                type="number"
                value={newBook.totalPages}
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
        <p style={{ color: "#888" }}>書籍がありません。追加してください。</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "20px",
          }}
        >
          {books.map((book) => (
            <div
              key={book.id}
              style={{
                border: "1px solid #444",
                borderRadius: "8px",
                padding: "15px",
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
              onClick={() => onSelectBook(book)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <h3 style={{ fontSize: "1.1em", marginBottom: "10px" }}>
                {book.title}
              </h3>
              {book.author && (
                <p style={{ color: "#aaa", fontSize: "0.9em" }}>
                  著者: {book.author}
                </p>
              )}
              <p style={{ color: "#888", fontSize: "0.85em", marginTop: "5px" }}>
                {book.total_pages}ページ
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteBook(book.id!);
                }}
                style={{
                  marginTop: "10px",
                  backgroundColor: "#d44",
                  fontSize: "0.85em",
                }}
              >
                削除
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Library;
