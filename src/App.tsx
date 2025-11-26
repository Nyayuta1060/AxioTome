import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>AxioTome - AI搭載PDFライブラリ</h1>
      <p>技術書の管理と読書支援を行うデスクトップアプリケーション</p>
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => setCount((count) => count + 1)}>
          カウント: {count}
        </button>
      </div>
    </div>
  );
}

export default App;
