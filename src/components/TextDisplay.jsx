export default function TextDisplay({ text, style }) {
  return (
    <div className="text-display" style={style}>
      {text || <span className="placeholder">Start typing below...</span>}
    </div>
  );
}
