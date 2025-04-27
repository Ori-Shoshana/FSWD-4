import { useState } from 'react';

export default function VirtualKeyboard({ 
  onKeyPress, 
  onDeleteChar, 
  onDeleteWord 
}) {
  const [language, setLanguage] = useState('english');
  const [isUppercase, setIsUppercase] = useState(true);

  const getKeysByLanguage = () => {
    const numberRow = [...'1234567890'];

    switch (language) {
      case 'english': {
        const english = [
          [...'QWERTYUIOP'],
          [...'ASDFGHJKL'],
          [...'ZXCVBNM'],
          ['Space']
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
          [...'זסבהנמצתץ'],
          ['Space']
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

  const handleKeyPress = (key) => {
    onKeyPress(key === 'Space' ? ' ' : key);
  };

  return (
    <div>
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
              <button key={keyIndex} onClick={() => handleKeyPress(key)}>
                {key === 'Space' ? '␣' : key}
              </button>
            ))}
          </div>
        ))}

        <div className="keyboard-actions">
          <button onClick={onDeleteChar} className="keyboard-action-button">⌫ Delete</button>
          <button onClick={onDeleteWord} className="keyboard-action-button">⌦ Delete Word</button>
        </div>
      </div>
    </div>
  );
}