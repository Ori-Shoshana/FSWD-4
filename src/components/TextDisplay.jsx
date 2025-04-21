export default function TextDisplay({ text, style, fileName }) {
  return (
    <div>
      <div style={{ fontSize: '0.9em', color: '#555', marginBottom: '4px' }}>
        {fileName || 'Untitled'}
      </div>
      <div className="text-display" style={style}>
        {text || <span className="placeholder">Start typing below...</span>}
      </div>
    </div>
  );
}
