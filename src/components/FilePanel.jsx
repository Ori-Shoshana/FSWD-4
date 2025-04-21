import { useState, useEffect } from 'react';

export default function FilePanel({ text, setText, style, setStyle, setFileName }) {
  const [fileName, setFileNameInput] = useState('');
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('file:'));
    setFileList(keys.map(key => key.slice(5))); // הסרת prefix
  }, []);

  const saveFile = () => {
    if (!fileName.trim()) {
      alert('Please enter a file name');
      return;
    }
    const data = { text, style };
    localStorage.setItem('file:' + fileName, JSON.stringify(data));
    if (!fileList.includes(fileName)) {
      setFileList([...fileList, fileName]);
    }
    setFileName(fileName); // ← מעדכן את ה־entry עם שם הקובץ
    alert('File saved!');
  };

  const loadFile = (name) => {
    const raw = localStorage.getItem('file:' + name);
    if (!raw) return alert('File not found');
    try {
      const { text, style } = JSON.parse(raw);
      const parsedStyle = typeof style === 'string' ? JSON.parse(style) : style;
      setText(text);
      setStyle(parsedStyle);
      setFileName(name); // ← חשוב! מעדכן את entry הפעיל
      setFileNameInput(name);
    } catch (err) {
      alert("Error loading file");
      console.error(err);
    }
  };

  return (
    <div className="file-panel">
      <input
        type="text"
        placeholder="Enter file name"
        value={fileName}
        onChange={e => setFileNameInput(e.target.value)}
      />
      <button onClick={saveFile}>💾 Save</button>

      <div>
        <label>📂 Open file:</label>
        <select onChange={e => loadFile(e.target.value)} defaultValue="">
          <option value="" disabled>Choose a file</option>
          {fileList.map((name, i) => (
            <option key={i} value={name}>{name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
