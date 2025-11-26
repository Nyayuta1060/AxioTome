import { useState, useEffect } from "react";
import { Book } from "./types";
import { getBooks, addBook, deleteBook } from "./api";

interface LibraryProps {
  onSelectBook: (book: Book) => void;
}

function Library({ onSelectBook }: LibraryProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

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
    // TODO: ファイル選択ダイアログの実装
    // 現在はテストデータを追加
    try {
      await addBook("サンプル技術書", "著者名", "/path/to/sample.pdf", 300);
      await loadBooks();
    } catch (error) {
      console.error("書籍の追加エラー:", error);
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
        <button onClick={handleAddBook}>書籍を追加</button>
      </div>

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
