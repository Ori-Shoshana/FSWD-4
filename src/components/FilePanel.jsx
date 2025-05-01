import { useState } from 'react';

export default function FilePanel({ text, setText, style, setStyle, setFileName, currentUser, activeEntry }) {
  const [fileName, setFileNameInput] = useState('');

  // Fetches initial file list from localStorage for the current user
  const getInitialFileList = () => {
    if (!currentUser) return [];
    const prefix = `user:${currentUser}:file:`;
    const keys = Object.keys(localStorage).filter(key => key.startsWith(prefix));
    return keys.map(key => key.slice(prefix.length));
  };

  const [fileList, setFileList] = useState(getInitialFileList());

  // Returns the user-specific localStorage prefix for files
  const getUserFilePrefix = () => {
    return `user:${currentUser}:file:`;
  };

  // Updates the file list by scanning localStorage for the current user's files
  const refreshFileList = () => {
    const prefix = getUserFilePrefix();
    const keys = Object.keys(localStorage).filter(key => key.startsWith(prefix));
    setFileList(keys.map(key => key.slice(prefix.length)));
  };

  // Saves the current text and style information to localStorage
  const saveFile = () => {
    if (!fileName.trim()) {
      alert('נא להזין שם קובץ');
      return;
    }

    // Save the full data including segments from the active entry
    const data = {
      text,
      style,
      segments: activeEntry.segments
    };
    
    const fileKey = getUserFilePrefix() + fileName;

    localStorage.setItem(fileKey, JSON.stringify(data));

    if (!fileList.includes(fileName)) {
      setFileList(prev => [...prev, fileName]);
    }

    setFileName(fileName);
    alert('הקובץ נשמר בהצלחה!');
  };

  // Loads a file from localStorage and updates the text editor with its content
  const loadFile = (name) => {
    const fileKey = getUserFilePrefix() + name;
    const raw = localStorage.getItem(fileKey);

    if (!raw) {
      alert('הקובץ לא נמצא');
      return;
    }

    try {
      const data = JSON.parse(raw);
      const { text, style, segments } = data;
      
      // If we have segments, use those (new format)
      if (segments && Array.isArray(segments)) {
        // Pass the segments to updateText using a custom segments parameter
        setText(text, text.length, false, segments);
      } else {
        // If no segments (old format), just use the text and style
        setText(text);
        const parsedStyle = typeof style === 'string' ? JSON.parse(style) : style;
        setStyle(parsedStyle);
      }
      
      setFileName(name);
      setFileNameInput(name);
    } catch (err) {
      alert("שגיאה בטעינת הקובץ");
      console.error(err);
    }
  };

  // Deletes a file from localStorage after confirmation
  const deleteFile = (name) => {
    if (confirm(`האם אתה בטוח שברצונך למחוק את הקובץ "${name}"?`)) {
      const fileKey = getUserFilePrefix() + name;
      localStorage.removeItem(fileKey);
      
      // עדכון ממוקד של הרשימה במקום refreshFileList מלא
      setFileList(prev => prev.filter(file => file !== name));

      // אם הקובץ שנמחק הוא זה שמוצג כרגע, ננקה את התצוגה
      if (fileName === name) {
        setFileNameInput('');
        setFileName('');
        // ניקוי התוכן מאזור התצוגה
        setText('');
        // איפוס הסגנון לברירת מחדל
        setStyle({ fontFamily: 'Arial', fontSize: '20px', color: 'black' });
      }
    }
  };

  return (
    <div className="file-panel">
      <div className="file-save-area">
        <input
          type="text"
          placeholder="הכנס שם קובץ"
          value={fileName}
          onChange={e => setFileNameInput(e.target.value)}
          className="file-input"
        />
        <button 
          onClick={saveFile}
          className="save-button"
        >
          💾 שמור קובץ
        </button>
      </div>
      
      {fileList.length > 0 ? (
        <ul className="file-list">
          {fileList.map((name, i) => (
            <li 
              key={i} 
              className={`file-item ${fileName === name ? 'selected' : ''}`}
            >
              <span>{name}</span>
              <div>
                <button 
                  onClick={() => loadFile(name)}
                  className="open-button"
                >
                  📂 פתח
                </button>
                <button 
                  onClick={() => deleteFile(name)}
                  className="delete-button"
                >
                  🗑️ מחק
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-message">
          אין קבצים קיימים 😕
        </div>
      )}
    </div>
  );  
}