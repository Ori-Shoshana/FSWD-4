import { useRef, useState } from 'react';

export default function TextEditor({ text, setText, style, setStyle }) {
  const textareaRef = useRef(null);
  const [language, setLanguage] = useState('english');
  const [isUppercase, setIsUppercase] = useState(true);
  const [history, setHistory] = useState([]);

  const updateText = (newText) => {
    setHistory((prev) => [...prev, text]);
    setText(newText);
  };

  const insertAtCursor = (char) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = text.slice(0, start) + char + text.slice(end);

    updateText(newText);

    requestAnimationFrame(() => {
      textarea.selectionStart = textarea.selectionEnd = start + char.length;
      textarea.focus();
    });
  };

  const deleteChar = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    if (start === 0) return;
    const newText = text.slice(0, start - 1) + text.slice(start);
    updateText(newText);
    requestAnimationFrame(() => {
      textarea.selectionStart = textarea.selectionEnd = start - 1;
      textarea.focus();
    });
  };

  const deleteWord = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const before = text.slice(0, start);
    const after = text.slice(start);
    const newBefore = before.replace(/\s*\S+\s*$/, '');
    const newText = newBefore + after;
    updateText(newText);
    requestAnimationFrame(() => {
      textarea.selectionStart = textarea.selectionEnd = newBefore.length;
      textarea.focus();
    });
  };

  const clearText = () => {
    updateText('');
    textareaRef.current?.focus();
  };

  const handleFindAndReplace = () => {
    const find = prompt('Enter character to find:');
    if (!find) return;
    const replace = prompt(`Replace '${find}' with:`);
    if (replace === null) return;
    const newText = text.split(find).join(replace);
    updateText(newText);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setText(previous);
    setHistory((prev) => prev.slice(0, -1));
  };

  const getKeysByLanguage = () => {
    switch (language) {
      case 'english':
        const base = isUppercase ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : 'abcdefghijklmnopqrstuvwxyz';
        return [...base];
      case 'hebrew':
        return [...'אבגדהוזחטיכלמנסעפצקרשתםןףץ'];
      case 'emoji':
        return ['😀', '😁', '😂', '🤣', '😎', '❤️', '🔥', '👍', '👏'];
      case 'symbols':
        return [
          ...'0123456789', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+',
          '[', ']', '{', '}', ';', ':', "'", '"', ',', '.', '<', '>', '/', '?', '\\', '|', '`', '~'
        ];
      default:
        return [];
    }
  };

  const handleStyleChange = (prop, value) => {
    setStyle(prev => ({ ...prev, [prop]: value }));
  };

  const keyboardKeys = getKeysByLanguage();

  return (
    <div className="text-editor">
      <textarea
        ref={textareaRef}
        className="text-area"
        value={text}
        onChange={e => updateText(e.target.value)}
        placeholder="Type here..."
      />

      <div className="style-controls">
        <label>
          Font:
          <select value={style.fontFamily} onChange={e => handleStyleChange('fontFamily', e.target.value)}>
            <option value="Arial">Arial</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Tahoma">Tahoma</option>
            <option value="Verdana">Verdana</option>
          </select>
        </label>
        <label>
          Size:
          <select value={style.fontSize} onChange={e => handleStyleChange('fontSize', e.target.value)}>
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
            value={style.color}
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
        {keyboardKeys.map((key, i) => (
          <button key={i} onClick={() => insertAtCursor(key)}>
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}
