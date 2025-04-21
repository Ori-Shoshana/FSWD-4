import { useState } from 'react';
import TextDisplay from './components/TextDisplay';
import TextEditor from './components/TextEditor';
import FilePanel from './components/FilePanel';

export default function MultiTextApp() {
  const [entries, setEntries] = useState([
    { id: 1, text: '', style: { fontFamily: 'Arial', fontSize: '20px', color: 'black' } }
  ]);
  const [activeId, setActiveId] = useState(1);

  const activeEntry = entries.find(e => e.id === activeId);

  const handleStyleChange = (prop, value) => {
    updateEntry('style', {
      ...activeEntry.style,
      [prop]: value
    });
  };

  const updateEntry = (field, value) => {
    setEntries(prev =>
      prev.map(e => e.id === activeId ? { ...e, [field]: value } : e)
    );
  };

  const setStyle = (newStyle) => {
    updateEntry('style', newStyle);
  };

  const setFileNameToEntry = (name) => {
    updateEntry('fileName', name);
  };

  const addEntry = () => {
    const newId = Date.now();
    setEntries(prev => [...prev, {
      id: newId,
      text: '',
      style: { fontFamily: 'Arial', fontSize: '20px', color: 'black' }
    }]);
    setActiveId(newId);
  };

  const closeEntry = (id) => {
    const entry = entries.find(e => e.id === id);
    const key = 'file:' + (entry.fileName || `entry-${id}`);

    let needsSave = true;

    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const savedData = JSON.parse(saved);
        needsSave = JSON.stringify(savedData.text) !== JSON.stringify(entry.text)
          || JSON.stringify(savedData.style) !== JSON.stringify(entry.style);
      } catch {
        needsSave = true;
      }
    }

    if (needsSave) {
      const confirmSave = window.confirm("This entry has unsaved changes. Save before closing?");
      if (confirmSave) {
        localStorage.setItem(key, JSON.stringify({ text: entry.text, style: entry.style }));
      }
    }

    const remaining = entries.filter(e => e.id !== id);
    setEntries(remaining);

    if (remaining.length === 0) {
      const newId = Date.now();
      const newEntry = {
        id: newId,
        text: '',
        style: { fontFamily: 'Arial', fontSize: '20px', color: 'black' }
      };
      setEntries([newEntry]);
      setActiveId(newId);
    } else if (id === activeId) {
      setActiveId(remaining[0].id);
    }
  };

  return (
    <div className="app">
      <div className="text-display-multi">
        {entries.map(entry => (
          <div
            key={entry.id}
            className={`text-display-wrapper ${entry.id === activeId ? 'active' : ''}`}
            onClick={() => setActiveId(entry.id)}
          >
            <TextDisplay text={entry.text} style={entry.style} fileName={entry.fileName} />
            <button onClick={(e) => { e.stopPropagation(); closeEntry(entry.id); }}>🗙</button>
          </div>
        ))}
        <button onClick={addEntry}>➕ New</button>
      </div>

      <FilePanel
        text={activeEntry.text}
        setText={val => updateEntry('text', val)}
        style={activeEntry.style}
        setStyle={setStyle}
        setFileName={setFileNameToEntry}
      />

      <TextEditor
        text={activeEntry.text}
        setText={val => updateEntry('text', val)}
        style={activeEntry.style}
        setStyleProp={handleStyleChange}
      />
    </div>
  );
}
