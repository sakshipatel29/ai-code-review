import React, { useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import axios from 'axios';
import './App.css';

function App() {
  const [code, setCode] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [lintingResults, setLintingResults] = useState('');
  const [autoComments, setAutoComments] = useState('');
  const [activeSection, setActiveSection] = useState('analyze'); // State to control which section is visible

  const handleAnalyze = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/analyze", { code });
      setAnalysis(response.data.suggestions);
    } catch (error) {
      console.error("Error analyzing code:", error);
      setAnalysis("Error: Unable to analyze code.");
    }
  };

  const handleLint = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/lint", { code });
      setLintingResults(response.data.linting_results);
    } catch (error) {
      console.error("Error linting code:", error);
      setLintingResults("Error: Unable to lint code.");
    }
  };

  const handleAutoDoc = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/autodoc", { code });
      setAutoComments(response.data.comments);
    } catch (error) {
      console.error("Error auto-generating comments:", error);
      setAutoComments("Error: Unable to generate comments.");
    }
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar">
        <ul>
          <li onClick={() => setActiveSection('analyze')}>Analyze</li>
          <li onClick={() => setActiveSection('lint')}>Lint</li>
          <li onClick={() => setActiveSection('autodoc')}>AutoDoc</li>
        </ul>
      </nav>

      {/* Content Area */}
      <div className="content-container">
        {activeSection === 'analyze' && (
          <div className="section-container">
            <div className="editor-container">
              <h1>AI-Powered Code Analyzer</h1>
              <MonacoEditor
                height="300px"
                language="javascript"
                value={code}
                onChange={(value) => setCode(value)}
                className="monaco-editor"
              />
              <button onClick={handleAnalyze}>Analyze Code</button>
            </div>
            <div className="analysis-container">
              <h2>AI Suggestions:</h2>
              <p>{analysis}</p>
            </div>
          </div>
        )}

        {activeSection === 'lint' && (
          <div className="section-container">
            <div className="editor-container">
              <h1>Lint Your Code</h1>
              <MonacoEditor
                height="300px"
                language="javascript"
                value={code}
                onChange={(value) => setCode(value)}
                className="monaco-editor"
              />
              <button onClick={handleLint}>Lint Code</button>
            </div>
            <div className="linting-container">
              <h2>Linting Results:</h2>
              <pre>{lintingResults}</pre>
            </div>
          </div>
        )}

        {activeSection === 'autodoc' && (
          <div className="section-container">
            <div className="editor-container">
              <h1>Auto-Generate Comments</h1>
              <MonacoEditor
                height="300px"
                language="javascript"
                value={code}
                onChange={(value) => setCode(value)}
                className="monaco-editor"
              />
              <button onClick={handleAutoDoc}>Auto-Generate Comments</button>
            </div>
            <div className="auto-doc-container">
              <h2>Auto Generated Comments:</h2>
              <pre>{autoComments}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
