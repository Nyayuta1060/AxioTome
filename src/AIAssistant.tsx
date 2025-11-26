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
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "20px" }}>🤖 AI読書アシスタント</h2>

      {/* 検索セクション */}
      <div style={{ marginBottom: "30px" }}>
        <h3 style={{ fontSize: "1.1em", marginBottom: "10px" }}>
          📚 書籍横断検索
        </h3>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            placeholder="検索キーワードを入力..."
            style={{
              flex: 1,
              padding: "10px",
              backgroundColor: "#2a2a2a",
              border: "1px solid #444",
              borderRadius: "4px",
              color: "#fff",
            }}
          />
          <button onClick={handleSearch} disabled={loading}>
            {loading ? "検索中..." : "検索"}
          </button>
        </div>

        {searchResults.length > 0 && (
          <div
            style={{
              marginTop: "15px",
              maxHeight: "200px",
              overflowY: "auto",
              backgroundColor: "#1a1a1a",
              border: "1px solid #444",
              borderRadius: "4px",
              padding: "10px",
            }}
          >
            <p style={{ marginBottom: "10px", color: "#aaa" }}>
              {searchResults.length}件の結果が見つかりました
            </p>
            {searchResults.map((result, idx) => (
              <div
                key={idx}
                style={{
                  padding: "8px",
                  marginBottom: "8px",
                  backgroundColor: "#2a2a2a",
                  borderRadius: "4px",
                  fontSize: "0.9em",
                }}
              >
                <span style={{ color: "#888" }}>
                  書籍 {result.book_index + 1} / 行 {result.line_number + 1}
                </span>
                <p style={{ marginTop: "5px" }}>{result.context}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI質問セクション */}
      <div>
        <h3 style={{ fontSize: "1.1em", marginBottom: "10px" }}>
          💬 AIに質問する
        </h3>
        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAskAI()}
            placeholder="質問を入力..."
            style={{
              flex: 1,
              padding: "10px",
              backgroundColor: "#2a2a2a",
              border: "1px solid #444",
              borderRadius: "4px",
              color: "#fff",
            }}
          />
          <button onClick={handleAskAI} disabled={loading}>
            {loading ? "処理中..." : "質問"}
          </button>
        </div>

        {aiAnswer && (
          <div
            style={{
              padding: "15px",
              backgroundColor: "#1a1a1a",
              border: "1px solid #444",
              borderRadius: "4px",
            }}
          >
            <p style={{ color: "#aaa", fontSize: "0.9em", marginBottom: "8px" }}>
              AIの回答:
            </p>
            <p style={{ whiteSpace: "pre-wrap" }}>{aiAnswer}</p>
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: "30px",
          padding: "15px",
          backgroundColor: "#2a2a2a",
          borderRadius: "4px",
          fontSize: "0.9em",
          color: "#888",
        }}
      >
        <p>
          ℹ️ <strong>AI機能について</strong>
        </p>
        <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
          <li>複数の技術書から関連情報を横断検索</li>
          <li>AIによる質問応答（今後、Candleによる高度な推論機能を追加予定）</li>
          <li>読書ノートの自動生成（開発中）</li>
        </ul>
      </div>
    </div>
  );
}

export default AIAssistant;
