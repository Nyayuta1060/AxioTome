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
          gap: "10px",
          padding: "10px 20px",
          backgroundColor: "#2a2a2a",
          borderBottom: "1px solid #444",
        }}
      >
        <button
          onClick={() => setViewMode("library")}
          style={{
            backgroundColor: viewMode === "library" ? "#646cff" : "#1a1a1a",
          }}
        >
          📚 ライブラリ
        </button>
        <button
          onClick={() => setViewMode("ai")}
          style={{
            backgroundColor: viewMode === "ai" ? "#646cff" : "#1a1a1a",
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
