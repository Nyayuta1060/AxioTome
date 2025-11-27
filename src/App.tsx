import { useState } from "react";
import Library from "./Library";
import PDFViewer from "./PDFViewer";
import AIAssistant from "./AIAssistant";
import { Book } from "./types";

type ViewMode = "library" | "pdf" | "ai";

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>("library");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  function handleSelectBook(book: Book) {
    setSelectedBook(book);
    setViewMode("pdf");
  }

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* ナビゲーションバー */}
      <nav
        style={{
          display: "flex",
          gap: "0",
          padding: "0",
          backgroundColor: "#0f0f0f",
          borderBottom: "1px solid #2a2a2a",
        }}
      >
        <button
          onClick={() => setViewMode("library")}
          style={{
            padding: "16px 32px",
            backgroundColor: "transparent",
            border: "none",
            borderBottom: viewMode === "library" ? "2px solid #3b82f6" : "2px solid transparent",
            color: viewMode === "library" ? "#3b82f6" : "#888",
            fontSize: "0.95em",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (viewMode !== "library") e.currentTarget.style.color = "#aaa";
          }}
          onMouseLeave={(e) => {
            if (viewMode !== "library") e.currentTarget.style.color = "#888";
          }}
        >
          📚 ライブラリ
        </button>
        <button
          onClick={() => setViewMode("ai")}
          style={{
            padding: "16px 32px",
            backgroundColor: "transparent",
            border: "none",
            borderBottom: viewMode === "ai" ? "2px solid #3b82f6" : "2px solid transparent",
            color: viewMode === "ai" ? "#3b82f6" : "#888",
            fontSize: "0.95em",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (viewMode !== "ai") e.currentTarget.style.color = "#aaa";
          }}
          onMouseLeave={(e) => {
            if (viewMode !== "ai") e.currentTarget.style.color = "#888";
          }}
        >
          🤖 AIアシスタント
        </button>
      </nav>

      {/* メインコンテンツ */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        {viewMode === "library" && <Library onSelectBook={handleSelectBook} />}
        {viewMode === "pdf" && selectedBook && (
          <PDFViewer book={selectedBook} onClose={() => setViewMode("library")} />
        )}
        {viewMode === "ai" && <AIAssistant />}
      </div>
    </div>
  );
}

export default App;
