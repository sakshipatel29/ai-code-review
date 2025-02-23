import React, { useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import axios from 'axios';
import './App.css';

function App() {
  const [code, setCode] = useState('');
  const [analysis, setAnalysis] = useState('');

  const handleAnalyze = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/analyze", { code });
      setAnalysis(response.data.suggestions);
    } catch (error) {
      console.error("Error analyzing code:", error);
      setAnalysis("Error: Unable to analyze code.");
    }
  };

  return (
    <div className="container">
      {/* Left Side - Code Editor */}
      <div className="editor-container">
        <h1>AI-Powered Code Analyzer</h1>
        <MonacoEditor
          height="100%"
          language="javascript"
          value={code}
          onChange={(value) => setCode(value)}
          className="monaco-editor"
        />
        <button onClick={handleAnalyze}>Analyze Code</button>
      </div>

      {/* Right Side - AI Suggestions */}
      <div className="analysis-container">
        <h2>AI Suggestions:</h2>
        <p>{analysis}</p>
      </div>
    </div>
  );
}

export default App;
