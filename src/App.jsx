import { useState } from 'react';
import TextDisplay from './components/TextDisplay';
import TextEditor from './components/TextEditor';
import FilePanel from './components/FilePanel';
import './styles.css';

export default function App() {
  const [text, setText] = useState('');
  const [style, setStyle] = useState({
    fontFamily: 'Arial',
    fontSize: '20px',
    color: 'black'
  });

  return (
    <div className="app">
      <TextDisplay text={text} style={style} />
      <FilePanel text={text} setText={setText} style={style} setStyle={setStyle} />
      <TextEditor text={text} setText={setText} style={style} setStyle={setStyle} />
    </div>
  );
}
