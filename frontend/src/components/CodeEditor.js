// Monaco Editor

import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

const CodeEditor = () => {
  const [code, setCode] = useState("// Write your code here...");
  const [analysis, setAnalysis] = useState("");

  const handleAnalyze = async () => {
    const response = await axios.post("http://127.0.0.1:8000/analyze", { code });
    setAnalysis(response.data);
  };

  return (
    <div>
      <Editor
        height="300px"
        language="python"
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value)}
      />
      <button onClick={handleAnalyze}>Analyze Code</button>
      <div>
        <h3>Analysis:</h3>
        <p>{analysis}</p>
      </div>
    </div>
  );
};

export default CodeEditor;
