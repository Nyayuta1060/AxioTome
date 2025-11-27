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
        backgroundColor: "#0d1117",
      }}
    >
      {/* ヘッダー */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 24px",
          backgroundColor: "#161b22",
          borderBottom: "1px solid #30363d",
        }}
      >
        <button 
          onClick={onClose}
          style={{
            padding: "6px 12px",
            fontSize: "0.875em",
            backgroundColor: "#21262d",
            border: "1px solid #30363d",
            color: "#c9d1d9",
            borderRadius: "6px",
          }}
        >
          ← Library
        </button>
        <h2 style={{ margin: 0, fontSize: "1.1em", color: "#c9d1d9", fontWeight: 600 }}>{book.title}</h2>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            style={{
              padding: "6px 12px",
              fontSize: "0.875em",
              backgroundColor: currentPage <= 1 ? "#21262d" : "#238636",
              border: "1px solid #30363d",
              color: currentPage <= 1 ? "#8b949e" : "#ffffff",
              borderRadius: "6px",
              cursor: currentPage <= 1 ? "not-allowed" : "pointer",
            }}
          >
            Prev
          </button>
          <span style={{ color: "#8b949e", fontSize: "0.875em", fontFamily: "'JetBrains Mono', monospace" }}>
            {currentPage} / {book.total_pages}
          </span>
          <button
            onClick={() =>
              setCurrentPage(Math.min(book.total_pages, currentPage + 1))
            }
            disabled={currentPage >= book.total_pages}
            style={{
              padding: "6px 12px",
              fontSize: "0.875em",
              backgroundColor: currentPage >= book.total_pages ? "#21262d" : "#238636",
              border: "1px solid #30363d",
              color: currentPage >= book.total_pages ? "#8b949e" : "#ffffff",
              borderRadius: "6px",
              cursor: currentPage >= book.total_pages ? "not-allowed" : "pointer",
            }}
          >
            Next
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
          padding: "24px",
          overflow: "auto",
        }}
      >
        <div
          style={{
            backgroundColor: "#161b22",
            border: "1px solid #30363d",
            minHeight: "600px",
            minWidth: "500px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#c9d1d9",
            borderRadius: "6px",
          }}
        >
          <div style={{ textAlign: "center", padding: "40px" }}>
            <div style={{ fontSize: "2.5em", marginBottom: "20px", opacity: 0.3 }}>•••</div>
            <p style={{ fontSize: "1em", marginBottom: "16px", color: "#c9d1d9" }}>
              PDF Renderer (in development)
            </p>
            <p style={{ color: "#8b949e", fontSize: "0.85em" }}>
              File: <code style={{ backgroundColor: "#0d1117", padding: "3px 8px", borderRadius: "4px", fontFamily: "'JetBrains Mono', monospace" }}>{book.file_path}</code>
              <br />
              Page: {currentPage}
            </p>
            <p
              style={{
                color: "#6e7681",
                fontSize: "0.8em",
                marginTop: "20px",
              }}
            >
              PDF rendering will be implemented in future releases
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PDFViewer;
