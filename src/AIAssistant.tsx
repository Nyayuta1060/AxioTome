import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

interface SearchResult {
  book_index: number;
  line_number: number;
  context: string;
  relevance_score: number;
}

function AIAssistant() {
  const [query, setQuery] = useState("");
  const [question, setQuestion] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [aiAnswer, setAiAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const results = await invoke<SearchResult[]>("search_books", { query });
      setSearchResults(results);
    } catch (error) {
      console.error("検索エラー:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAskAI() {
    if (!question.trim()) return;
    
    setLoading(true);
    try {
      const answer = await invoke<string>("ask_ai", {
        question,
        context: searchResults.map(r => r.context).join("\n"),
      });
      setAiAnswer(answer);
    } catch (error) {
      console.error("AI質問エラー:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#0d1117" }}>
      <div style={{ padding: "20px 24px", borderBottom: "1px solid #21262d" }}>
        <h2 style={{ margin: 0, fontSize: "1.25em", fontWeight: 600, color: "#c9d1d9", letterSpacing: "-0.3px" }}>AI Assistant</h2>
        <p style={{ marginTop: "4px", color: "#8b949e", fontSize: "0.85em" }}>Search and analyze your book collection</p>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          {/* 検索セクション */}
          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ fontSize: "1em", marginBottom: "12px", color: "#c9d1d9", fontWeight: 600 }}>
              Search Books
            </h3>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Type keyword..."
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  backgroundColor: "#0d1117",
                  border: "1px solid #30363d",
                  borderRadius: "6px",
                  color: "#c9d1d9",
                  fontSize: "0.9em",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              />
              <button 
                onClick={handleSearch} 
                disabled={loading}
                style={{
                  padding: "8px 16px",
                  fontSize: "0.875em",
                  fontWeight: 500,
                  backgroundColor: "#1f6feb",
                  color: "#ffffff",
                  border: "1px solid rgba(240, 246, 252, 0.1)",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>

            {searchResults.length > 0 && (
              <div
                style={{
                  marginTop: "12px",
                  maxHeight: "250px",
                  overflowY: "auto",
                  backgroundColor: "#161b22",
                  border: "1px solid #30363d",
                  borderRadius: "6px",
                  padding: "12px",
                }}
              >
                <p style={{ marginBottom: "10px", color: "#8b949e", fontSize: "0.85em" }}>
                  {searchResults.length} results found
                </p>
                {searchResults.map((result, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "10px",
                      marginBottom: "8px",
                      backgroundColor: "#0d1117",
                      border: "1px solid #21262d",
                      borderRadius: "6px",
                      fontSize: "0.85em",
                    }}
                  >
                    <span style={{ color: "#8b949e", fontFamily: "'JetBrains Mono', monospace" }}>
                      Book {result.book_index + 1} / Line {result.line_number + 1}
                    </span>
                    <p style={{ marginTop: "6px", color: "#c9d1d9" }}>{result.context}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI質問セクション */}
          <div>
            <h3 style={{ fontSize: "1em", marginBottom: "12px", color: "#c9d1d9", fontWeight: 600 }}>
              Ask AI
            </h3>
            <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAskAI()}
                placeholder="Type your question..."
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  backgroundColor: "#0d1117",
                  border: "1px solid #30363d",
                  borderRadius: "6px",
                  color: "#c9d1d9",
                  fontSize: "0.9em",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              />
              <button 
                onClick={handleAskAI} 
                disabled={loading}
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
              >
                {loading ? "Processing..." : "Ask"}
              </button>
            </div>

            {aiAnswer && (
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#161b22",
                  border: "1px solid #30363d",
                  borderRadius: "6px",
                }}
              >
                <p style={{ color: "#8b949e", fontSize: "0.85em", marginBottom: "8px", fontFamily: "'JetBrains Mono', monospace" }}>
                  $ AI Response:
                </p>
                <p style={{ whiteSpace: "pre-wrap", color: "#c9d1d9", fontSize: "0.9em" }}>{aiAnswer}</p>
              </div>
            )}
          </div>

          <div
            style={{
              marginTop: "30px",
              padding: "12px",
              backgroundColor: "#161b22",
              border: "1px solid #30363d",
              borderRadius: "6px",
              fontSize: "0.85em",
              color: "#8b949e",
            }}
          >
            <p style={{ marginBottom: "8px", color: "#c9d1d9" }}>
              <strong>Features</strong>
            </p>
            <ul style={{ marginTop: "8px", paddingLeft: "20px", lineHeight: 1.6 }}>
              <li>Cross-book semantic search</li>
              <li>AI-powered Q&A (Candle integration planned)</li>
              <li>Automatic note generation (in development)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIAssistant;
