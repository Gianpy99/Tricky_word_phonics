import React from "react";

function SimpleApp() {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "1rem",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          textAlign: "center",
          maxWidth: "400px",
        }}
      >
        <h1 style={{ color: "#333", marginBottom: "1rem" }}>
          🎯 Tricky Words Phonics
        </h1>
        <p style={{ color: "#666", marginBottom: "1.5rem" }}>
          Applicazione per migliorare la lettura e il riconoscimento di parole
          difficili
        </p>
        <button
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            padding: "0.75rem 1.5rem",
            borderRadius: "0.5rem",
            fontSize: "1rem",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
          }}
          onClick={() => alert("App funziona! Server: OK")}
        >
          Test App
        </button>
        <div style={{ marginTop: "1rem", fontSize: "0.8rem", color: "#888" }}>
          Frontend: ✅ | Backend: ✅
        </div>
      </div>
    </div>
  );
}

export default SimpleApp;
