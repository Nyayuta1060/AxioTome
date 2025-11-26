import { useState } from "react";
import Library from "./Library";
import PDFViewer from "./PDFViewer";
import { Book } from "./types";

function App() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  return (
    <div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
      {selectedBook ? (
        <PDFViewer book={selectedBook} onClose={() => setSelectedBook(null)} />
      ) : (
        <Library onSelectBook={setSelectedBook} />
      )}
    </div>
  );
}

export default App;
