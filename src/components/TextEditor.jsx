import { useState } from 'react';
import VirtualKeyboard from './VirtualKeyboard';

export default function TextEditor({ segments, forwardMode, currentStyle, updateText, setStyleProp, setForwardMode }) {
  const [history, setHistory] = useState([]);

  const fullText = segments.map(segment => segment.text).join('');

  const addToHistory = () => {
    setHistory(prev => [...prev, {
      segments: JSON.parse(JSON.stringify(segments)),
      fullText
    }]);
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    addToHistory();
    if (newText.length < fullText.length) {
      updateText(newText, newText.length, false);
    } else {
      updateText(newText, newText.length, true);
    }
  };

  const insertAtCursor = (char) => {
    addToHistory();
    const newText = fullText + char;
    updateText(newText, newText.length, true);
  };

  const deleteChar = () => {
    if (fullText.length === 0) return;
    addToHistory();
    const newText = fullText.slice(0, -1);
    updateText(newText, newText.length, false);
  };

  const deleteWord = () => {
    if (fullText.length === 0) return;
    addToHistory();
    let i = fullText.length - 1;
    while (i >= 0 && fullText[i] === ' ') i--;
    while (i >= 0 && fullText[i] !== ' ') i--;
    const newText = fullText.slice(0, i + 1);
    updateText(newText, newText.length, false);
  };

  const clearText = () => {
    addToHistory();
    updateText('', 0, false);
  };

  const handleFindAndReplace = () => {
    const find = prompt('Enter character to find:');
    if (!find) return;
    const replace = prompt(`Replace '${find}' with:`);
    if (replace === null) return;
    addToHistory();
    const newText = fullText.split(find).join(replace);
    updateText(newText, newText.length, false);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    updateText(previous.fullText, previous.fullText.length, false, previous.segments);
    setHistory(prev => prev.slice(0, -1));
  };

  const handleStyleChange = (prop, value) => {
    const applyMode = forwardMode ? 'forward' : 'all';
    setStyleProp(prop, value, applyMode);
  };

  const toggleForwardMode = () => {
    setForwardMode(!forwardMode);
  };

  const renderStyledSegments = () => {
    return segments.map((segment, index) => (
      <span key={index} style={segment.style}>
        {segment.text}
      </span>
    ));
  };

  return (
    <div className="text-editor">
      <div className="editor-container">
        <div className="editor-display">
          {renderStyledSegments()}
        </div>
        <textarea
          className="editor-textarea"
          value={fullText}
          onChange={handleTextChange}
          placeholder="Type here..."
        />
      </div>

      <div className="style-controls">
        <div className="edit-mode-toggle">
          <button
            onClick={toggleForwardMode}
            className={`mode-button ${forwardMode ? 'active' : ''}`}
          >
            סגנון: {forwardMode ? 'מעכשיו והלאה' : 'כל הטקסט'}
          </button>
        </div>

        <label>
          Font:
          <select value={currentStyle.fontFamily} onChange={e => handleStyleChange('fontFamily', e.target.value)}>
            <option value="Arial">Arial</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Tahoma">Tahoma</option>
            <option value="Verdana">Verdana</option>
          </select>
        </label>
        <label>
          Size:
          <select value={currentStyle.fontSize} onChange={e => handleStyleChange('fontSize', e.target.value)}>
            <option value="16px">16px</option>
            <option value="20px">20px</option>
            <option value="24px">24px</option>
            <option value="32px">32px</option>
          </select>
        </label>
        <label>
          Color:
          <input
            type="color"
            value={currentStyle.color}
            onChange={e => handleStyleChange('color', e.target.value)}
          />
        </label>
      </div>

      <div className="edit-actions">
        <button onClick={deleteChar}>Delete Character</button>
        <button onClick={deleteWord}>Delete Word</button>
        <button onClick={clearText}>Clear All</button>
        <button onClick={handleFindAndReplace}>Find & Replace</button>
        <button onClick={handleUndo}>Undo</button>
      </div>

      {/* Virtual Keyboard component */}
      <VirtualKeyboard 
        onKeyPress={insertAtCursor} 
        onDeleteChar={deleteChar}
        onDeleteWord={deleteWord}
      />

      {forwardMode && (
        <div className="current-style-preview">
          <p>טקסט חדש יוצג בסגנון הבא:</p>
          <div style={currentStyle}>דוגמה לטקסט בסגנון הנבחר</div>
        </div>
      )}
    </div>
  );
}