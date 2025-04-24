import { useState } from 'react';

export default function TextEditor({ segments, forwardMode, currentStyle, updateText, setStyleProp, setForwardMode }) {
  const [language, setLanguage] = useState('english');
  const [isUppercase, setIsUppercase] = useState(true);
  const [history, setHistory] = useState([]);
  
  // Full text for the textarea
  const fullText = segments.map(segment => segment.text).join('');

  // Save current state to history
  const addToHistory = () => {
    setHistory(prev => [...prev, {
      segments: JSON.parse(JSON.stringify(segments)),
      fullText
    }]);
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    
    // Add to history before updating
    addToHistory();
    
    // We need to handle deletions specially
    if (newText.length < fullText.length) {
      // This is a deletion operation
      // Pass false to indicate we're deleting (not adding text)
      updateText(newText, newText.length, false);
    } else {
      // Normal text addition
      updateText(newText, newText.length, true);
    }
  };

  // Handle keyboard key insertions
  const insertAtCursor = (char) => {
    // Add to history
    addToHistory();
    
    const newText = fullText + char;
    updateText(newText, newText.length, true);
  };

  const deleteChar = () => {
    if (fullText.length === 0) return;
    
    // Add to history
    addToHistory();
    
    const newText = fullText.slice(0, -1);
    // Pass false to indicate we're deleting (not adding text)
    updateText(newText, newText.length, false);
  };

  const deleteWord = () => {
    if (fullText.length === 0) return;
    
    // Add to history
    addToHistory();
    
    let i = fullText.length - 1;
    while (i >= 0 && fullText[i] === ' ') i--;
    while (i >= 0 && fullText[i] !== ' ') i--;
    
    const newText = fullText.slice(0, i + 1);
    // Pass false to indicate we're deleting (not adding text)
    updateText(newText, newText.length, false);
  };

  const clearText = () => {
    // Add to history
    addToHistory();
    
    // Pass false to indicate we're deleting (not adding text)
    updateText('', 0, false);
  };

  const handleFindAndReplace = () => {
    const find = prompt('Enter character to find:');
    if (!find) return;
    const replace = prompt(`Replace '${find}' with:`);
    if (replace === null) return;
    
    // Add to history
    addToHistory();
    
    const newText = fullText.split(find).join(replace);
    // This is a mixed operation, but we'll treat it as not adding new text
    updateText(newText, newText.length, false);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    
    const previous = history[history.length - 1];
    // When restoring from history, preserve segments
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

  // Render styled segments
  const renderStyledSegments = () => {
    return segments.map((segment, index) => (
      <span key={index} style={segment.style}>
        {segment.text}
      </span>
    ));
  };

  const getKeysByLanguage = () => {
    const numberRow = [...'1234567890'];

    switch (language) {
      case 'english': {
        const english = [
          [...'QWERTYUIOP'],
          [...'ASDFGHJKL'],
          [...'ZXCVBNM']
        ];
        const withCase = isUppercase
          ? english
          : english.map(row => row.map(c => c.toLowerCase()));
        return [numberRow, ...withCase];
      }

      case 'hebrew': {
        const hebrew = [
          [...'קראטוןםפ'],
          [...'שדגכעיחלך'],
          [...'זסבהנמצתץ']
        ];
        return [numberRow, ...hebrew];
      }

      case 'emoji': {
        return [
          ['😀', '😃', '😄', '😁', '😆', '🤣', '😂', '🙂', '🙃', '😉'],
          ['😍', '🥰', '😘', '😗', '😚', '😋', '😜', '🤪', '😎', '🤩'],
          ['👍', '👎', '👏', '🙏', '🤝', '🙌', '💪', '🧠', '🦾', '🫶'],
          ['🔥', '❤️', '💔', '💯', '✨', '🎉', '🌟', '⚡', '❄️', '☀️']
        ];
      }

      case 'symbols': {
        return [
          numberRow,
          ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'],
          ['-', '_', '=', '+', '[', ']', '{', '}', ';', ':'],
          ["'", '"', ',', '.', '<', '>', '/', '?', '\\', '|'],
          ['`', '~']
        ];
      }

      default:
        return [numberRow];
    }
  };

  const keyboardKeys = getKeysByLanguage();

  return (
    <div className="text-editor">
      <style>
        {`
          .editor-container {
            position: relative;
            margin-bottom: 15px;
          }
          
          .editor-textarea {
            width: 100%;
            min-height: 150px;
            padding: 10px;
            border: 1px solid #ccc;
            resize: vertical;
            font-family: Arial;
            font-size: 16px;
            line-height: 1.5;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 2;
            background-color: transparent;
            color: transparent;
            caret-color: black;
          }
          
          .editor-textarea::selection {
            background-color: rgba(0, 0, 255, 0.3);
          }
          
          .editor-display {
            width: 100%;
            min-height: 150px;
            padding: 10px;
            border: 1px solid transparent;
            white-space: pre-wrap;
            overflow-wrap: break-word;
            font-family: Arial;
            font-size: 16px;
            line-height: 1.5;
            pointer-events: none;
            position: relative;
            z-index: 1;
          }
        `}
      </style>
      
      {/* Editor container with overlay approach */}
      <div className="editor-container">
        {/* Styled display underneath */}
        <div className="editor-display">
          {renderStyledSegments()}
        </div>
        
        {/* Transparent textarea on top for input */}
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
            style={{
              backgroundColor: forwardMode ? '#4caf50' : '#f0f0f0',
              color: forwardMode ? 'white' : 'black',
              fontWeight: 'bold',
              padding: '8px 12px',
              margin: '0 8px 8px 0',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
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

      <div className="language-toggle">
        <button onClick={() => setLanguage('english')}>English</button>
        <button onClick={() => setLanguage('hebrew')}>עברית</button>
        <button onClick={() => setLanguage('emoji')}>Emoji</button>
        <button onClick={() => setLanguage('symbols')}>Symbols</button>
        {language === 'english' && (
          <button onClick={() => setIsUppercase(!isUppercase)}>
            {isUppercase ? 'Lowercase' : 'Uppercase'}
          </button>
        )}
      </div>

      <div className="virtual-keyboard">
        {keyboardKeys.map((row, rowIndex) => (
          <div className="keyboard-row" key={rowIndex}>
            {row.map((key, keyIndex) => (
              <button key={keyIndex} onClick={() => insertAtCursor(key)}>
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>
      
      {forwardMode && (
        <div className="current-style-preview" style={{ 
          margin: '10px 0', 
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          backgroundColor: '#f9f9f9'
        }}>
          <p>טקסט חדש יוצג בסגנון הבא:</p>
          <div style={currentStyle}>דוגמה לטקסט בסגנון הנבחר</div>
        </div>
      )}
    </div>
  );
}