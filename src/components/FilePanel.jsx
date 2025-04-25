import { useState } from 'react';

export default function FilePanel({ text, setText, style, setStyle, setFileName, currentUser }) {
  const [fileName, setFileNameInput] = useState('');
  
  // Get initial file list
  const getInitialFileList = () => {
    if (!currentUser) return [];
    const prefix = `user:${currentUser}:file:`;
    const keys = Object.keys(localStorage).filter(key => key.startsWith(prefix));
    return keys.map(key => key.slice(prefix.length));
  };
  
  const [fileList, setFileList] = useState(getInitialFileList());
  
  // Get user file prefix
  const getUserFilePrefix = () => {
    return `user:${currentUser}:file:`;
  };

  // Refresh file list
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
      refreshFileList();
      
      // ניקוי הקובץ הנוכחי אם זה הקובץ שנמחק
      if (fileName === name) {
        setFileNameInput('');
        setFileName('');
      }
    }
  };

  return (
    <div className="file-panel">
      <input
        type="text"
        placeholder="הכנס שם קובץ"
        value={fileName}
        onChange={e => setFileNameInput(e.target.value)}
        style={{ padding: '8px', marginRight: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
      />
      <button 
        onClick={saveFile}
        style={{
          padding: '8px 15px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        💾 שמור
      </button>

      <div style={{ marginTop: '15px' }}>
        <label>📂 פתח קובץ:</label>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
          <select
            onClick={refreshFileList}
            onChange={e => loadFile(e.target.value)}
            defaultValue=""
            style={{ 
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              flexGrow: 1,
              marginRight: '10px'
            }}
          >
            <option value="" disabled>בחר קובץ</option>
            {fileList.map((name, i) => (
              <option key={i} value={name}>{name}</option>
            ))}
          </select>
          <button
            onClick={refreshFileList}
            style={{
              padding: '8px',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '5px'
            }}
          >
            🔄
          </button>
        </div>
      </div>

      {fileList.length > 0 && (
        <div style={{ marginTop: '15px' }}>
          <h4>הקבצים שלך:</h4>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            maxHeight: '200px',
            overflowY: 'auto',
            border: '1px solid #eee',
            borderRadius: '4px'
          }}>
            {fileList.map((name, i) => (
              <li key={i} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '8px 12px',
                borderBottom: i < fileList.length - 1 ? '1px solid #eee' : 'none',
                backgroundColor: fileName === name ? '#f0f8ff' : 'transparent'
              }}>
                <span>{name}</span>
                <div>
                  <button 
                    onClick={() => loadFile(name)}
                    style={{
                      marginRight: '5px',
                      padding: '3px 8px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    פתח
                  </button>
                  <button 
                    onClick={() => deleteFile(name)}
                    style={{
                      padding: '3px 8px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    מחק
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}