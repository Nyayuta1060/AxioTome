import { useState } from "react";
import { Book } from "./types";

interface PDFViewerProps {
  book: Book;
  onClose: () => void;
}

function PDFViewer({ book, onClose }: PDFViewerProps) {
  const [currentPage, setCurrentPage] = useState(book.current_page || 1);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#1a1a1a",
      }}
    >
      {/* ヘッダー */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          backgroundColor: "#2a2a2a",
          borderBottom: "1px solid #444",
        }}
      >
        <button onClick={onClose}>← ライブラリに戻る</button>
        <h2 style={{ margin: 0, fontSize: "1.2em" }}>{book.title}</h2>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
          >
            前へ
          </button>
          <span>
            {currentPage} / {book.total_pages}
          </span>
          <button
            onClick={() =>
              setCurrentPage(Math.min(book.total_pages, currentPage + 1))
            }
            disabled={currentPage >= book.total_pages}
          >
            次へ
          </button>
        </div>
      </div>

      {/* PDFビューア領域 */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          overflow: "auto",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            minHeight: "600px",
            minWidth: "400px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#000",
            borderRadius: "4px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
          }}
        >
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p style={{ fontSize: "1.2em", marginBottom: "20px" }}>
              PDF表示エリア
            </p>
            <p style={{ color: "#666" }}>
              ファイル: {book.file_path}
              <br />
              ページ: {currentPage}
            </p>
            <p
              style={{
                color: "#999",
                fontSize: "0.9em",
                marginTop: "20px",
              }}
            >
              ※実際のPDF表示機能は今後実装予定
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PDFViewer;
