import { useEffect, useState } from "react";

function Practice() {
  const [pyodide, setPyodide] = useState(null);
  const [code, setCode] = useState(`for i in range(5):
    print(i)`);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPyodide = async () => {
      const pyodideScript = document.createElement("script");
      pyodideScript.src =
        "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js";
      pyodideScript.onload = async () => {
        const py = await window.loadPyodide();
        setPyodide(py);
        setLoading(false);
      };
      document.body.appendChild(pyodideScript);
    };

    loadPyodide();
  }, []);

  const runCode = async () => {
    if (!pyodide) return;

    try {
      pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
`);

      pyodide.runPython(code);

      const result = pyodide.runPython("sys.stdout.getvalue()");
      setOutput(result || "No output");
    } catch (err) {
      setOutput(err.toString());
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🐍 Online Python Compiler</h2>

      {loading ? (
        <p>Loading Python environment...</p>
      ) : (
        <>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={20}
            style={{
              width: "100%",
              fontFamily: "monospace",
              fontSize: "14px",
              padding: "10px",
              backgroundColor:"#111827",
              color:"yellow"
            }}
          />

          <br />
          <button
            onClick={runCode}
            style={{
              marginTop: "10px",
              padding: "8px 16px",
              background: "#FFA700",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            ▶ Run Code
          </button>

          <h3>Output</h3>
          <pre
            style={{
              background: "#7a6e6eff",
              color: "rgba(0, 0, 0, 1)",
              padding: "10px",
              minHeight: "100px",
            }}
          >
            {output}
          </pre>
        </>
      )}
    </div>
  );
}

export default Practice;
