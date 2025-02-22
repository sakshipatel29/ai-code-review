import React, { useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import axios from 'axios';

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
    <div>
      <h1>AI-Powered Code Analyzer</h1>
      <MonacoEditor
        height="400px"
        language="javascript"
        value={code}
        onChange={(value) => setCode(value)}
      />
      <button onClick={handleAnalyze}>Analyze Code</button>
      <div>
        <h2>AI Suggestions:</h2>
        <p>{analysis}</p>
      </div>
    </div>
  );
}

export default App;
