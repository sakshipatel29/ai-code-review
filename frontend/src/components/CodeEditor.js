import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import "./CodeEditor.css"; // Import the CSS file

const CodeEditor = () => {
  const [code, setCode] = useState("// Write your code here...");
  const [analysis, setAnalysis] = useState("");

  const handleAnalyze = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/analyze", { code });
      setAnalysis(response.data);
    } catch (error) {
      setAnalysis("Error: Unable to analyze the code.");
      console.error("Analysis error:", error);
    }
  };

  return (
    <div className="editor-container">
      {/* Code Editor Section */}
      <div className="editor-wrapper">
        <Editor
          height="300px"
          language="python"
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value)}
        />
        <button onClick={handleAnalyze}>Analyze Code</button>
      </div>

      {/* Analysis Section */}
      <div className="analysis-container">
        <h3>Analysis:</h3>
        <p>{analysis}</p>
      </div>
    </div>
  );
};

export default CodeEditor;
