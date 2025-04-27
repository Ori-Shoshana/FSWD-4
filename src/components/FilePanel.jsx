import { useState } from 'react';

export default function FilePanel({ text, setText, style, setStyle, setFileName, currentUser }) {
  const [fileName, setFileNameInput] = useState('');

  const getInitialFileList = () => {
    if (!currentUser) return [];
    const prefix = `user:${currentUser}:file:`;
    const keys = Object.keys(localStorage).filter(key => key.startsWith(prefix));
    return keys.map(key => key.slice(prefix.length));
  };

  const [fileList, setFileList] = useState(getInitialFileList());

  const getUserFilePrefix = () => {
    return `user:${currentUser}:file:`;
  };

  const refreshFileList = () => {
    const prefix = getUserFilePrefix();
    const keys = Object.keys(localStorage).filter(key => key.startsWith(prefix));
    setFileList(keys.map(key => key.slice(prefix.length)));
  };

  const saveFile = () => {
    if (!fileName.trim()) {
      alert('נא להזין שם קובץ');
      return;
    }

    const data = { text, style };
    const fileKey = getUserFilePrefix() + fileName;

    localStorage.setItem(fileKey, JSON.stringify(data));

    if (!fileList.includes(fileName)) {
      setFileList(prev => [...prev, fileName]);
    }

    setFileName(fileName);
    alert('הקובץ נשמר בהצלחה!');
  };

  const loadFile = (name) => {
    const fileKey = getUserFilePrefix() + name;
    const raw = localStorage.getItem(fileKey);

    if (!raw) {
      alert('הקובץ לא נמצא');
      return;
    }

    try {
      const { text, style } = JSON.parse(raw);
      const parsedStyle = typeof style === 'string' ? JSON.parse(style) : style;

      setText(text);
      setStyle(parsedStyle);
      setFileName(name);
      setFileNameInput(name);
    } catch (err) {
      alert("שגיאה בטעינת הקובץ");
      console.error(err);
    }
  };

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
      
      {/* Remove the redundant file selector dropdown */}
  
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