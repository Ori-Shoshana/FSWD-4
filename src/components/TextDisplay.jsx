export default function TextDisplay({ segments, fileName }) {
  // Renders text segments with their respective styles and shows filename
  return (
    <div>
      <div style={{ fontSize: '0.9em', color: '#555', marginBottom: '4px' }}>
        {fileName || 'Untitled'}
      </div>
      <div className="text-display">
        {segments && segments.length > 0 ? (
          segments.map((segment, index) => (
            <span key={index} style={segment.style}>
              {segment.text}
            </span>
          ))
        ) : (
          <span className="placeholder">Start typing below...</span>
        )}
      </div>
    </div>
  );
}