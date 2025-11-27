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
    <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#0d1117" }}>
      {/* ナビゲーションバー */}
      <nav
        style={{
          display: "flex",
          gap: "4px",
          padding: "8px 16px",
          backgroundColor: "#161b22",
          borderBottom: "1px solid #30363d",
          alignItems: "center",
        }}
      >
        <div style={{ 
          marginRight: "24px", 
          fontSize: "1.1em", 
          fontWeight: 700,
          color: "#58a6ff",
          letterSpacing: "-0.5px",
        }}>
          AxioTome
        </div>
        <button
          onClick={() => setViewMode("library")}
          style={{
            padding: "6px 16px",
            backgroundColor: viewMode === "library" ? "#21262d" : "transparent",
            border: "1px solid",
            borderColor: viewMode === "library" ? "#30363d" : "transparent",
            color: viewMode === "library" ? "#c9d1d9" : "#8b949e",
            fontSize: "0.875em",
            fontWeight: 500,
            cursor: "pointer",
            borderRadius: "6px",
          }}
        >
          Library
        </button>
        <button
          onClick={() => setViewMode("ai")}
          style={{
            padding: "6px 16px",
            backgroundColor: viewMode === "ai" ? "#21262d" : "transparent",
            border: "1px solid",
            borderColor: viewMode === "ai" ? "#30363d" : "transparent",
            color: viewMode === "ai" ? "#c9d1d9" : "#8b949e",
            fontSize: "0.875em",
            fontWeight: 500,
            cursor: "pointer",
            borderRadius: "6px",
          }}
        >
          AI Mode
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
